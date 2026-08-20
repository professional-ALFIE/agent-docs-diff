import { join } from "node:path";
import { 계층, Codex계층, Codex를공통으로 } from "./contracts";
import type { 계층노드, 사이트설정 } from "./types";

const 파서폴더 = join(import.meta.dir, "parsers");
const UA = { "user-agent": "Mozilla/5.0" };

async function 실행(명령: string[], stdin?: string) {
  const p = Bun.spawn(명령, { stdin: stdin === undefined ? "ignore" : new TextEncoder().encode(stdin), stdout: "pipe", stderr: "pipe" });
  const [out, err, code] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text(), p.exited]);
  if (code !== 0) throw new Error(`파서 실패 (${명령[0]}): ${err.trim().split("\n").slice(-3).join(" | ")}`);
  return out;
}

/** 사이트 설정대로 파서를 돌려 공통 계층을 돌려준다 */
export async function 계층뽑기(s: 사이트설정): Promise<계층노드[]> {
  if (s.파서 === "starlight") {
    const html = await (await fetch(s.진입, { headers: UA })).text();
    return 계층.parse(JSON.parse(await 실행([join(파서폴더, "starlight-nav.ts"), "--json"], html)));
  }
  if (s.파서 === "mintlify") {
    return 계층.parse(JSON.parse(await 실행([join(파서폴더, "mintlify-full.ts"), s.진입, "--json"])));
  }
  return Codex를공통으로(Codex계층.parse(JSON.parse(await 실행([join(파서폴더, "codex-full.ts"), s.진입, "--json"]))));
}

export const 그룹수 = (ns: 계층노드[]): number =>
  ns.reduce((a, n) => a + (n.kind === "group" ? 1 + 그룹수(n.children) : 0), 0);
export const 문서수 = (ns: 계층노드[]): number =>
  ns.reduce((a, n) => a + (n.kind === "page" ? 1 : 문서수(n.children)), 0);
