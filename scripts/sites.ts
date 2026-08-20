import { z } from "zod";
import { 사이트설정 } from "./contracts";
import type { 사이트설정 as 사이트설정T } from "./types";

/** 수집 대상 8벌. 제품 폴더 이름이 곧 식별자다 */
export const 사이트들 = z.array(사이트설정).parse([
  { 제품폴더: "Claude Code Docs (en)", 진입: "https://code.claude.com/docs/en/overview", 파서: "mintlify",
    base: "https://code.claude.com/docs", llms: "https://code.claude.com/docs/llms.txt", 기대최상위: 8, contentType: "text/markdown" },
  { 제품폴더: "Claude Code Docs (ko)", 진입: "https://code.claude.com/docs/ko/overview", 파서: "mintlify",
    base: "https://code.claude.com/docs", llms: null, 기대최상위: 8, contentType: "text/markdown" },
  { 제품폴더: "Exa Docs", 진입: "https://exa.ai/docs/reference/search", 파서: "mintlify",
    base: "https://exa.ai/docs", llms: "https://exa.ai/docs/llms.txt", 기대최상위: 3, contentType: "text/markdown" },
  { 제품폴더: "Tavily Docs", 진입: "https://docs.tavily.com/documentation/about", 파서: "mintlify",
    base: "https://docs.tavily.com", llms: "https://docs.tavily.com/llms.txt", 기대최상위: 8, contentType: "text/markdown" },
  { 제품폴더: "Vibe Kanban Docs", 진입: "https://vibekanban.com/docs/workspaces", 파서: "mintlify",
    base: "https://vibekanban.com/docs", llms: "https://vibekanban.com/docs/llms.txt", 기대최상위: 7, contentType: "text/markdown" },
  { 제품폴더: "opencode Docs (en)", 진입: "https://opencode.ai/docs/en", 파서: "starlight",
    base: "https://opencode.ai", llms: null, 기대최상위: 10, contentType: "text/plain" },
  { 제품폴더: "opencode Docs (ko)", 진입: "https://opencode.ai/docs/ko", 파서: "starlight",
    base: "https://opencode.ai", llms: null, 기대최상위: 10, contentType: "text/plain" },
  { 제품폴더: "Codex Docs", 진입: "https://learn.chatgpt.com/docs/developers", 파서: "codex",
    base: "https://learn.chatgpt.com/docs", llms: "https://learn.chatgpt.com/llms.txt", 기대최상위: 6, contentType: "text/markdown",
    href정규화: [["^/codex(?=/|$)", ""]] },
]);

export function 사이트찾기(제품폴더: string) {
  const s = 사이트들.find(s => s.제품폴더 === 제품폴더);
  if (!s) throw new Error(`모르는 제품 폴더: ${제품폴더}\n아는 것: ${사이트들.map(s => s.제품폴더).join(" · ")}`);
  return s;
}

/** 계층 href 와 llms URL 경로를 같은 꼴로 맞춘다: 쿼리 제거 → 정본 치환 → .md 와 끝 슬래시 제거 */
export function 문서키(경로: string, s: 사이트설정T) {
  let k = 경로.replace(/[?#].*$/, "");
  for (const [re, to] of s.href정규화) k = k.replace(new RegExp(re), to);
  return k.replace(/\.md$/, "").replace(/\/$/, "") || "/";
}
/** 문서 원문(.md)을 받을 주소 */
export function 문서URL(href: string, s: 사이트설정T) {
  const k = 문서키(href, s);
  return s.base + (k === "/" ? "" : k) + ".md";
}
