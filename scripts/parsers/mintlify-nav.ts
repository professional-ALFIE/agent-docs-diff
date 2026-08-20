#!/usr/bin/env bun
// Mintlify 문서 사이트의 초기 HTML(stdin)에서 네비게이션 계층을 뽑아 트리로 출력한다.
// 사용법: curl -sL <URL> | ./mintlify-nav.ts [--json]
/** 계층 노드. group 안에 group 이 또 들어갈 수 있다 (펼침 메뉴) */
type 네비노드 = { kind: "page"; title: string; href: string }
             | { kind: "group"; title: string; children: 네비노드[] };

/** self.__next_f.push([1,"..."]) 조각을 전부 이어붙여 원본 flight 문자열을 복원한다 */
function flight복원(html: string): string {
  const 조각들: string[] = [];
  const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try { 조각들.push(JSON.parse('"' + m[1] + '"')); } catch { /* 깨진 조각은 버린다 */ }
  }
  return 조각들.join("");
}

/** pos 위치의 여는 괄호부터 짝이 맞는 닫는 괄호까지 잘라낸다 (문자열 리터럴 인식) */
function 균형잡힌조각(s: string, pos: number): string | null {
  const 열림 = s[pos];
  const 닫힘 = 열림 === "[" ? "]" : "}";
  let 깊이 = 0, 문자열안 = false, 이스케이프 = false;
  for (let i = pos; i < s.length; i++) {
    const c = s[i];
    if (이스케이프) { 이스케이프 = false; continue; }
    if (c === "\\") { 이스케이프 = true; continue; }
    if (c === '"') { 문자열안 = !문자열안; continue; }
    if (문자열안) continue;
    if (c === 열림) 깊이++;
    else if (c === 닫힘) { 깊이--; if (깊이 === 0) return s.slice(pos, i + 1); }
  }
  return null;
}

/** flight 문자열에서 "가장 큰" navigation 객체를 찾는다 (잘린 nav 를 피하기 위해) */
function 네비추출(flight: string): unknown {
  const 후보: unknown[] = [];
  for (const 키 of ['"navigation":', '"tabs":', '"groups":']) {
    let from = 0;
    for (;;) {
      const i = flight.indexOf(키, from);
      if (i < 0) break;
      from = i + 키.length;
      const p = flight.indexOf(키 === '"navigation":' ? "{" : "[", i + 키.length - 1);
      if (p < 0 || p > i + 키.length + 2) continue;
      const 조각 = 균형잡힌조각(flight, p);
      if (!조각) continue;
      try {
        const v = JSON.parse(조각);
        후보.push(키 === '"navigation":' ? v : (키 === '"tabs":' ? { tabs: v } : { groups: v }));
      } catch { /* 무시 */ }
    }
  }
  // 문서 개수가 가장 많은 후보를 채택한다 (hasFullNav:false 인 축약본 배제)
  let 최선: unknown = null, 최다 = -1;
  for (const c of 후보) {
    const n = 잎개수(정규화(c));
    if (n > 최다) { 최다 = n; 최선 = c; }
  }
  return 최선;
}

/** Mintlify 의 tabs/groups/pages/anchors/dropdowns 를 공통 트리로 정규화 */
function 정규화(v: any): 네비노드[] {
  if (!v || typeof v !== "object") return [];
  const out: 네비노드[] = [];
  const 목록 = (키: string, 이름키: string) => {
    if (!Array.isArray(v[키])) return;
    for (const it of v[키]) {
      if (typeof it === "string") { out.push({ kind: "page", title: it.split("/").pop()!, href: "/" + it.replace(/^\//, "") }); continue; }
      const t = it?.[이름키];
      if (typeof t === "string") out.push({ kind: "group", title: t, children: 정규화(it) });
      else out.push(...정규화(it));
    }
  };
  목록("tabs", "tab");
  목록("dropdowns", "dropdown");
  목록("anchors", "anchor");
  목록("groups", "group");
  if (Array.isArray(v.pages)) {
    for (const p of v.pages) {
      if (typeof p === "string") out.push({ kind: "page", title: p.split("/").pop()!, href: "/" + p.replace(/^\//, "") });
      else if (p?.group) out.push({ kind: "group", title: p.group, children: 정규화(p) });
      // 사이드바 표시명은 sidebarTitle 이 있으면 그것, 없으면 title
      else if (p?.title || p?.sidebarTitle) out.push({ kind: "page", title: p.sidebarTitle ?? p.title, href: p.href ?? p.page ?? "" });
      else out.push(...정규화(p));
    }
  }
  if (v.global && typeof v.global === "object") out.push(...정규화(v.global));
  return out;
}

function 잎개수(nodes: 네비노드[]): number {
  return nodes.reduce((a, n) => a + (n.kind === "page" ? 1 : 잎개수(n.children)), 0);
}

function 출력(nodes: 네비노드[], 깊이 = 0, 줄: string[] = []): string[] {
  for (const n of nodes) {
    const 들여 = "  ".repeat(깊이);
    if (n.kind === "group") { 줄.push(`${들여}[${깊이 + 1}] ${n.title}/`); 출력(n.children, 깊이 + 1, 줄); }
    else 줄.push(`${들여}- ${n.title}  ${n.href}`);
  }
  return 줄;
}

const html = await Bun.stdin.text();
const nav = 네비추출(flight복원(html));
if (!nav) { console.error("navigation 을 찾지 못했다"); process.exit(1); }
const 트리 = 정규화(nav);
if (process.argv.includes("--json")) console.log(JSON.stringify(트리, null, 2));
else {
  console.log(출력(트리).join("\n"));
  console.error(`\n[요약] 문서 ${잎개수(트리)}개`);
}
