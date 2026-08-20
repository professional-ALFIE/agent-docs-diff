#!/usr/bin/env bun
// 한 회차: 사이트마다 계층 → 경로 → 본문 → 검사 → (통과하면) 저장 · 삭제 · manifest · llms-local.
// 검사를 하나라도 통과하지 못한 사이트는 디스크를 건드리지 않는다. 끝에 하나라도 실패면 exit 1 — CI 가 커밋하지 않는다.
// 사용법: ./sync.ts [--site "<제품폴더명>"]... [--accept] [--dry]
//   --accept  구조 변화(최상위 수·그룹 수·대량 rename)를 사람이 확인했으니 막지 말라는 뜻
//   --dry     아무것도 쓰지 않고 결과만 보여준다
import { mkdir, readdir, rm, rmdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { 매니페스트 } from "./contracts";
import { 검사 } from "./check";
import { 본문수집 } from "./fetch-docs";
import { llmsLocal생성 } from "./llms-local";
import { 계층뽑기, 그룹수 } from "./nav";
import { 사이트들, 사이트찾기 } from "./sites";
import { 경로계산 } from "./tree";
import type { 매니페스트 as 매니페스트T, 사이트설정 } from "./types";

const 인자 = process.argv.slice(2);
const accept = 인자.includes("--accept");
const dry = 인자.includes("--dry");
const 루트 = join(import.meta.dir, "..");
const 고른사이트 = 인자.flatMap((a, i) => a === "--site" ? [사이트찾기(인자[i + 1])] : []);
const 대상 = 고른사이트.length ? 고른사이트 : 사이트들;

/** 제품 폴더 안에서 번호가 붙은 .md 를 전부 찾는다 (수집기가 만든 문서만 — llms·CLAUDE.md 는 번호가 없다) */
async function 기존문서들(폴더: string, 상대 = ""): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(join(폴더, 상대), { withFileTypes: true }).catch(() => [])) {
    const p = 상대 ? `${상대}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...await 기존문서들(폴더, p));
    else if (/^\d{3,4} .+\.md$/.test(e.name)) out.push(p);
  }
  return out;
}
async function 빈폴더정리(폴더: string) {
  for (const e of await readdir(폴더, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = join(폴더, e.name);
    await 빈폴더정리(p);
    if ((await readdir(p)).length === 0) await rmdir(p);
  }
}

async function 사이트하나(s: 사이트설정): Promise<string[]> {
  const 제품폴더 = join(루트, s.제품폴더);
  const 계층 = await 계층뽑기(s);
  const { 폴더들, 문서들, 충돌들 } = 경로계산(계층);
  const { 저장, 제외 } = await 본문수집(s, 문서들);
  const 제외표 = new Map(제외.map(x => [x.경로, x.이유]));
  const { 통계, 파일들 } = await llmsLocal생성(s, 문서들, 제외표);

  const 이번: 매니페스트T = 매니페스트.parse({
    생성: new Date().toISOString(), 제품폴더: s.제품폴더, 진입: s.진입,
    최상위수: 계층.length, 그룹수: 그룹수(계층),
    문서: 저장.map(({ 본문, ...m }) => m), 제외, llms: 통계,
  });
  const 직전파일 = Bun.file(join(제품폴더, ".manifest.json"));
  const 직전 = (await 직전파일.exists()) ? 매니페스트.parse(await 직전파일.json()) : null;
  const 실패 = 검사(s, 이번, 직전, accept);

  const 기존 = await 기존문서들(제품폴더);
  const 이번경로 = new Set(저장.map(d => d.경로));
  const 삭제 = 기존.filter(p => !이번경로.has(p));
  let 새로 = 0, 바뀜 = 0;
  for (const d of 저장) {
    const f = Bun.file(join(제품폴더, d.경로));
    if (!(await f.exists())) 새로++;
    else if ((await f.text()) !== d.본문) 바뀜++;
  }

  console.log(`${s.제품폴더}: 문서 ${저장.length} (새로 ${새로} · 바뀜 ${바뀜} · 삭제 ${삭제.length}) · 제외 ${제외.length} · 최상위 ${이번.최상위수} · 그룹 ${이번.그룹수}`
    + ` · llms 치환 ${통계.치환} 미노출 ${통계.미노출} 외부 ${통계.외부} 메뉴에만 ${통계.메뉴에만}`);
  for (const c of 충돌들) console.log(`  이름 충돌 처리: ${c}`);
  for (const x of 제외) console.log(`  제외: ${x.경로} ← ${x.이유} (${x.url})`);
  for (const m of 실패) console.log(`  ✗ ${m}`);
  if (실패.length || dry) return 실패;

  for (const d of 폴더들) await mkdir(join(제품폴더, d), { recursive: true });
  for (const d of 저장) {
    const p = join(제품폴더, d.경로);
    const f = Bun.file(p);
    if (!(await f.exists()) || (await f.text()) !== d.본문) { await mkdir(dirname(p), { recursive: true }); await Bun.write(p, d.본문); }
  }
  for (const p of 삭제) { await rm(join(제품폴더, p)); console.log(`  삭제: ${p}`); }
  await 빈폴더정리(제품폴더);
  for (const [이름, 내용] of 파일들) await Bun.write(join(제품폴더, 이름), 내용);
  // 생성 시각 말고 아무것도 안 바뀌었으면 manifest 를 다시 쓰지 않는다 — CI 가 3시간마다 시각만 바뀐 커밋을 만들지 않게
  const 같음 = 직전 && JSON.stringify({ ...이번, 생성: 직전.생성 }) === JSON.stringify(직전);
  if (!같음) await Bun.write(join(제품폴더, ".manifest.json"), JSON.stringify(이번, null, 2) + "\n");
  return [];
}

const 실패한곳: string[] = [];
for (const s of 대상) {
  try { if ((await 사이트하나(s)).length) 실패한곳.push(s.제품폴더); }
  catch (e) { console.log(`${s.제품폴더}: ✗ ${String(e).split("\n")[0]}`); 실패한곳.push(s.제품폴더); }
}if (실패한곳.length) { console.log(`\n실패 ${실패한곳.length}곳: ${실패한곳.join(" · ")} — 커밋하지 않는다`); process.exit(1); }
console.log(dry ? "\n(dry) 아무것도 쓰지 않았다" : "\n전부 통과");
