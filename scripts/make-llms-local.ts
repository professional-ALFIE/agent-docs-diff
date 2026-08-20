#!/usr/bin/env bun
// 계층 JSON 파일로 llms.txt(원문) · llms-local.txt · CLAUDE.md 를 만든다. 본문 없이 목록만 볼 때 쓴다.
// 사용법: ./make-llms-local.ts <제품폴더명> <계층 JSON> [--root <저장소 루트>]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { 계층읽기 } from "./contracts";
import { llmsLocal생성 } from "./llms-local";
import { 사이트찾기 } from "./sites";
import { 경로계산 } from "./tree";

const 인자 = process.argv.slice(2);
const rootIdx = 인자.indexOf("--root");
const 루트 = rootIdx >= 0 ? 인자[rootIdx + 1] : join(import.meta.dir, "..");
const [제품폴더명, json경로] = 인자.filter((a, i) => !a.startsWith("--") && 인자[i - 1] !== "--root");
if (!제품폴더명 || !json경로) {
  console.error("사용법: ./make-llms-local.ts <제품폴더명> <계층 JSON> [--root <저장소 루트>]");
  process.exit(1);
}
const 사이트 = 사이트찾기(제품폴더명);
const { 문서들 } = 경로계산(await 계층읽기(json경로));
const 제품폴더 = join(루트, 사이트.제품폴더);
const { 통계, 파일들 } = await llmsLocal생성(사이트, 문서들);
await mkdir(제품폴더, { recursive: true });
for (const [이름, 내용] of 파일들) await Bun.write(join(제품폴더, 이름), 내용);
console.log(`${사이트.제품폴더}: 치환 ${통계.치환} · 메뉴 미노출 ${통계.미노출} · 외부 링크 ${통계.외부} · 메뉴에만 ${통계.메뉴에만}`);
