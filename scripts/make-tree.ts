#!/usr/bin/env bun
// 계층 JSON 을 받아 제품 폴더 아래에 폴더 구조를 만든다. 문서(.md)는 만들지 않는다.
// 사용법: ./make-tree.ts <제품폴더명> <계층 JSON> [--apply] [--root <저장소 루트>]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { 계층읽기 } from "./contracts";
import { 사이트찾기 } from "./sites";
import { 경로계산 } from "./tree";

const 인자 = process.argv.slice(2);
const 실제로만들기 = 인자.includes("--apply");
const rootIdx = 인자.indexOf("--root");
const 루트 = rootIdx >= 0 ? 인자[rootIdx + 1] : join(import.meta.dir, "..");
const [제품폴더명, json경로] = 인자.filter((a, i) => !a.startsWith("--") && 인자[i - 1] !== "--root");
if (!제품폴더명 || !json경로) {
  console.error("사용법: ./make-tree.ts <제품폴더명> <계층 JSON> [--apply] [--root <저장소 루트>]");
  process.exit(1);
}

const 사이트 = 사이트찾기(제품폴더명);
const 제품폴더 = join(루트, 사이트.제품폴더);
const { 폴더들, 문서들, 충돌들, 최대형제 } = 경로계산(await 계층읽기(json경로));

if (실제로만들기) for (const d of 폴더들) await mkdir(join(제품폴더, d), { recursive: true });

console.log(`${사이트.제품폴더}: 폴더 ${폴더들.length}개 · 문서 ${문서들.length}개 · 최대 형제 수 ${최대형제}개 · 이름 충돌 ${충돌들.length}건`);
for (const c of 충돌들) console.log(`  충돌 처리: ${c}`);
if (!실제로만들기) {
  console.log("  (미적용 — --apply 로 실제 생성). 만들 폴더 앞 8개:");
  for (const d of 폴더들.slice(0, 8)) console.log("    " + d);
}
