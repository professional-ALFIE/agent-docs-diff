#!/usr/bin/env bun
// PreToolUse 안내 훅 — agent-docs-diff 문서 경로에 생 Grep·Read·Glob·Bash 가 닿으면
// agent-docs-search 스킬을 쓰라는 안내를 세션에 주입한다. 차단하지 않고 permissionDecision 도 내지 않는다.
// 이유: 생 grep 은 절 제목과 조상 맥락이 잘린 줄만 돌려줘 부분 오독을 낳는다(2026-09-02 사건).
const 입력 = await new Response(Bun.stdin.stream()).text();
if (!입력.includes("agent-docs-diff")) process.exit(0);
let j: { tool_name?: string; tool_input?: Record<string, unknown> };
try { j = JSON.parse(입력); } catch { process.exit(0); }
const t = j?.tool_input ?? {};
const 경로들 = ["file_path", "path", "pattern", "file_pattern", "notebook_path"].map(k => String(t[k] ?? "")).join(" ");
const 명령 = typeof t.command === "string" ? t.command : "";
// 문서에 실제 닿는 호출만 잡는다 — 제품 폴더 아래 .md (운영 파일·scripts·git 커밋은 제외).
// Read·Edit·Grep·Glob 은 경로 필드로, Bash 는 grep·rg·find 가 문서 폴더를 훑 때
const 문서패턴 = /agent-docs-diff\/[^/]+\/[^\s"']*\.md/;
const 문서접근 = 문서패턴.test(경로들) || (/\b(grep|rg|find)\b/.test(명령) && 문서패턴.test(명령));
if (!문서접근) process.exit(0);
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext:
      "agent-docs-diff 문서를 직접 grep·Read 하지 말고 agent-docs-search 스킬을 쓴다 — " +
      "`agent-docs-search search <단어> --site <제품폴더>` 로 문서 경로와 헤딩을 찾고 " +
      "`agent-docs-search fetch <경로> [헤딩]` 로 조상 맥락과 함께 연다. " +
      "직접 grep 하면 절 제목·주어가 잘린 줄만 보여 오독한다.",
  },
}));
