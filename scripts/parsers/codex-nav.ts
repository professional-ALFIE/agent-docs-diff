#!/usr/bin/env bun
// learn.chatgpt.com(Codex 문서, Astro 자체 테마)의 초기 HTML(stdin)에서
// 상단 탭 + 현재 탭의 왼쪽 사이드바 계층을 뽑는다.
// 사용법: curl -sL https://learn.chatgpt.com/docs/quickstart | ./codex-nav.ts
const 태그제거 = (x: string) => x.replace(/<[^>]*>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

const html = await Bun.stdin.text();

// 1단: 상단 탭 - nav[aria-label="Docs sections"] 안의 a
const 탭시작 = html.indexOf('<nav aria-label="Docs sections"');
const 탭끝 = html.indexOf("</nav>", 탭시작);
const 탭들: { name: string; href: string; current: boolean }[] = [];
if (탭시작 >= 0) {
  for (const m of html.slice(탭시작, 탭끝).matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)) {
    // 이 사이트(chatgpt-docs)에서 숨기는 항목은 빼다. 브라우저가 hidden 속성을 붙이는 것과 같은 기준이다
    if (/data-site-visibility-exclude="chatgpt-docs"/.test(m[1])) continue;
    탭들.push({ href: m[1].match(/href="([^"]+)"/)?.[1] ?? "", name: 태그제거(m[2]), current: /aria-current="true"/.test(m[1]) });
  }
}

// 2~3단: nav[data-left-nav] 안의 div 블록 = (선택적 h3 제목) + ul>li>a
const 좌시작 = html.indexOf("<nav ");
const 좌 = html.indexOf("data-left-nav ");
const navOpen = 좌 < 0 ? -1 : html.lastIndexOf("<nav", 좌);
const navId = navOpen < 0 ? "" : (html.slice(navOpen, html.indexOf(">", navOpen)).match(/data-left-nav-id="([^"]*)"/)?.[1] ?? "");
const 좌끝 = navOpen < 0 ? -1 : html.indexOf("</nav>", navOpen);
const 사이드바 = navOpen < 0 ? "" : html.slice(navOpen, 좌끝);

/** start 위치의 여는 태그부터 짝이 맞는 닫는 태그까지의 안쪽 내용과 끝 위치를 돌려준다 */
function 태그내부(s: string, 태그: string, start: number): { inner: string; end: number } | null {
  const 열림re = new RegExp(`<${태그}(\\s|>)`, "g");
  const 닫힘re = new RegExp(`</${태그}\\s*>`, "g");
  const 시작닫힘 = s.indexOf(">", start);
  if (시작닫힘 < 0) return null;
  let 깊이 = 1, i = 시작닫힘 + 1;
  while (깊이 > 0) {
    열림re.lastIndex = i; 닫힘re.lastIndex = i;
    const a = 열림re.exec(s), b = 닫힘re.exec(s);
    if (!b) return null;
    if (a && a.index < b.index) { 깊이++; i = a.index + 1; }
    else { 깊이--; i = b.index + b[0].length; if (깊이 === 0) return { inner: s.slice(시작닫힘 + 1, b.index), end: i }; }
  }
  return null;
}

type 문서 = { kind: "page"; title: string; href: string };
type 펼침 = { kind: "disclosure"; title: string; open: boolean; pages: 문서[] };
type 그룹 = { title: string | null; items: (문서 | 펼침)[] };

const 링크뽑기 = (s: string): 문서[] =>
  [...s.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(m => ({ kind: "page" as const, title: 태그제거(m[2]), href: m[1] }));

// 사이드바를 앞에서부터 순차 스캔한다.
// h3 를 만나면 새 그룹, details 를 만나면 펼침 메뉴(한 단 더 깊다), a 를 만나면 문서다.
// div 구조에 의존하지 않는다 - details 안에도 div 가 들어 있기 때문이다.
const 그룹들: 그룹[] = [];
let 현재: 그룹 = { title: null, items: [] };
for (let i = 0; i < 사이드바.length; ) {
  const h3 = 사이드바.indexOf("<h3", i);
  const det = 사이드바.indexOf("<details", i);
  const a = 사이드바.indexOf("<a ", i);
  const 다음 = [h3, det, a].filter(x => x >= 0).sort((x, y) => x - y)[0];
  if (다음 === undefined) break;
  if (다음 === h3) {
    const t = 태그내부(사이드바, "h3", h3);
    if (현재.items.length || 현재.title) 그룹들.push(현재);
    현재 = { title: 태그제거(t?.inner ?? ""), items: [] };
    i = t?.end ?? h3 + 3;
  } else if (다음 === det) {
    const d = 태그내부(사이드바, "details", det);
    const 열림 = /^<details[^>]*\sopen[\s>]/.test(사이드바.slice(det));
    const sm = d ? d.inner.indexOf("<summary") : -1;
    const 제목 = sm >= 0 ? 태그제거(태그내부(d!.inner, "summary", sm)?.inner ?? "") : "";
    const 본문 = d && sm >= 0 ? d.inner.slice(d.inner.indexOf("</summary>") + 10) : (d?.inner ?? "");
    현재.items.push({ kind: "disclosure", title: 제목, open: 열림, pages: 링크뽑기(본문) });
    i = d?.end ?? det + 8;
  } else {
    const t = 태그내부(사이드바, "a", a);
    const href = 사이드바.slice(a, 사이드바.indexOf(">", a)).match(/href="([^"]+)"/)?.[1];
    if (href) 현재.items.push({ kind: "page", title: 태그제거(t?.inner ?? ""), href });
    i = t?.end ?? a + 3;
  }
}
if (현재.items.length || 현재.title) 그룹들.push(현재);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ 탭들, navId, 그룹들 }, null, 2));
} else {
  const 현재탭 = 탭들.find(t => t.current)?.name ?? "(불명)";
  console.log(`[1] 상단 탭 ${탭들.length}개: ` + 탭들.map(t => `${t.name}(${t.href})${t.current ? " *현재" : ""}`).join(" | "));
  console.log(`--- 현재 탭 "${현재탭}" 의 사이드바 (data-left-nav-id="${navId}") ---`);
  let 개수 = 0, 펼침수 = 0;
  for (const g of 그룹들) {
    const 들여 = g.title ? "    " : "  ";
    if (g.title) console.log(`  [2] ${g.title}/`);
    for (const it of g.items) {
      if (it.kind === "page") { console.log(`${들여}- ${it.title}  ${it.href}`); 개수++; }
      else {
        펼침수++;
        console.log(`${들여}[3] ${it.title}/  (details ${it.open ? "open" : "closed"})`);
        for (const p of it.pages) { console.log(`${들여}  - ${p.title}  ${p.href}`); 개수++; }
      }
    }
  }
  console.error(`\n[요약] 탭 ${탭들.length}개 · 현재 탭 그룹 ${그룹들.length}개 · 펼침 메뉴 ${펼침수}개 · 문서 ${개수}개`);
}
