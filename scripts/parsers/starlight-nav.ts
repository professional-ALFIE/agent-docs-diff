#!/usr/bin/env bun
// Astro Starlight 문서 사이트의 초기 HTML(stdin)에서 왼쪽 사이드바 계층을 뽑는다.
// 사용법: curl -sL https://opencode.ai/docs/ | ./starlight-nav.ts
type 노드 = { kind: "page"; title: string; href: string }
          | { kind: "group"; title: string; open: boolean; children: 노드[] };

/** start 위치의 여는 태그부터 짝이 맞는 닫는 태그까지의 안쪽 내용을 돌려준다 */
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

const 태그제거 = (x: string) => x.replace(/<[^>]*>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

/** <ul> 안쪽 문자열을 받아 형제 <li> 들을 노드 배열로 만든다 */
function ul파싱(inner: string): 노드[] {
  const out: 노드[] = [];
  let i = 0;
  for (;;) {
    const li = inner.indexOf("<li", i);
    if (li < 0) break;
    const 본문 = 태그내부(inner, "li", li);
    if (!본문) break;
    i = 본문.end;
    const b = 본문.inner;
    const d = b.indexOf("<details");
    if (d >= 0) {
      const det = 태그내부(b, "details", d);
      const 열림여부 = /^<details[^>]*\sopen[\s>]/.test(b.slice(d));
      if (det) {
        const sm = det.inner.indexOf("<summary");
        const 제목 = sm >= 0 ? 태그제거(태그내부(det.inner, "summary", sm)?.inner ?? "") : "";
        const u = det.inner.indexOf("<ul", sm >= 0 ? det.inner.indexOf("</summary>") : 0);
        const 자식 = u >= 0 ? ul파싱(태그내부(det.inner, "ul", u)?.inner ?? "") : [];
        out.push({ kind: "group", title: 제목, open: 열림여부, children: 자식 });
        continue;
      }
    }
    const a = b.match(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (a) out.push({ kind: "page", title: 태그제거(a[2]), href: a[1] });
  }
  return out;
}

function 출력(nodes: 노드[], 깊이 = 0, 줄: string[] = []): string[] {
  for (const n of nodes) {
    const 들여 = "  ".repeat(깊이);
    if (n.kind === "group") { 줄.push(`${들여}[${깊이 + 1}] ${n.title}/  (details ${n.open ? "open" : "closed"})`); 출력(n.children, 깊이 + 1, 줄); }
    else 줄.push(`${들여}- ${n.title}  ${n.href}`);
  }
  return 줄;
}
const 잎개수 = (ns: 노드[]): number => ns.reduce((a, n) => a + (n.kind === "page" ? 1 : 잎개수(n.children)), 0);

const html = await Bun.stdin.text();
const nav = html.indexOf('<nav class="sidebar');
if (nav < 0) { console.error("Starlight sidebar nav 를 찾지 못했다"); process.exit(1); }
const 최상위 = html.indexOf('<ul class="top-level', nav);
const 트리 = ul파싱(태그내부(html, "ul", 최상위)?.inner ?? "");
if (process.argv.includes("--json")) console.log(JSON.stringify(트리, null, 2));
else { console.log(출력(트리).join("\n")); console.error(`\n[요약] 문서 ${잎개수(트리)}개`); }
