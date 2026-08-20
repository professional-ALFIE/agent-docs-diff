#!/usr/bin/env bun
// Codex(learn.chatgpt.com) 문서의 전체 계층을 얻는다.
// 한 페이지에는 상단 탭 6개의 이름과 현재 탭의 사이드바만 들어 있으므로,
// 탭 진입 URL 을 따라 탭 수만큼 다시 받아 합친다. 시작 URL 의 탭은 다시 받지 않는다.
// 주소는 원본 HTML 그대로 /codex/... 로 나온다. /docs 로 정규화하는 것은 수집기의 몫이다.
// 사용법: ./codex-full.ts https://learn.chatgpt.com/docs/developers
type 문서 = { kind: "page"; title: string; href: string };
type 펼침 = { kind: "disclosure"; title: string; open: boolean; pages: 문서[] };
type 그룹 = { title: string | null; items: (문서 | 펼침)[] };
type 탭 = { name: string; href: string; current: boolean };
type 한판 = { 탭들: 탭[]; navId: string; 그룹들: 그룹[] };

const 시작 = process.argv[2];
if (!시작) { console.error("사용법: ./codex-full.ts <문서 URL>"); process.exit(1); }
const 오리진 = new URL(시작).origin;
const 파서 = new URL("./codex-nav.ts", import.meta.url).pathname;

async function 계층(url: string): Promise<한판> {
  const html = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const p = Bun.spawn([파서, "--json"], { stdin: new TextEncoder().encode(html), stdout: "pipe", stderr: "ignore" });
  return JSON.parse(await new Response(p.stdout).text());
}

const 첫판 = await 계층(시작);
const 탭들 = 첫판.탭들;
if (!탭들.length) { console.error("상단 탭을 찾지 못했다"); process.exit(1); }

const 판들: { 탭: 탭; 판: 한판 }[] = [];
for (const 탭 of 탭들) {
  // 시작 URL 이 이미 이 탭이면 다시 받지 않는다 (요청 횟수를 탭 수와 같게 유지한다)
  판들.push({ 탭, 판: 탭.current ? 첫판 : await 계층(오리진 + 탭.href) });
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(판들.map(({ 탭, 판 }) => ({ 탭: 탭.name, href: 탭.href, navId: 판.navId, 그룹들: 판.그룹들 })), null, 2));
} else {
  console.log(`[1] 상단 탭 ${탭들.length}개: ` + 탭들.map(t => `${t.name}(${t.href})`).join(" | "));
  for (const { 탭, 판 } of 판들) {
    console.log(`--- 탭 "${탭.name}" (data-left-nav-id="${판.navId}") ---`);
    for (const g of 판.그룹들) {
      const 들여 = g.title ? "    " : "  ";
      if (g.title) console.log(`  [2] ${g.title}/`);
      for (const it of g.items) {
        if (it.kind === "page") console.log(`${들여}- ${it.title}  ${it.href}`);
        else {
          console.log(`${들여}[3] ${it.title}/  (details ${it.open ? "open" : "closed"})`);
          for (const p of it.pages) console.log(`${들여}  - ${p.title}  ${p.href}`);
        }
      }
    }
  }
}

const 세기 = (gs: 그룹[]) => gs.reduce((a, g) => a + g.items.reduce((b, it) =>
  b + (it.kind === "page" ? 1 : it.pages.length), 0), 0);
const 펼침세기 = (gs: 그룹[]) => gs.reduce((a, g) => a + g.items.filter(it => it.kind === "disclosure").length, 0);
const 총문서 = 판들.reduce((a, { 판 }) => a + 세기(판.그룹들), 0);
const 총펼침 = 판들.reduce((a, { 판 }) => a + 펼침세기(판.그룹들), 0);
console.error(`\n[합계] 탭 ${탭들.length}개 · 펼침 메뉴 ${총펼침}개 · 문서 ${총문서}개`);
for (const { 탭, 판 } of 판들) console.error(`  ${탭.name.padEnd(16)} 문서 ${세기(판.그룹들)}개 · 펼침 ${펼침세기(판.그룹들)}개`);
