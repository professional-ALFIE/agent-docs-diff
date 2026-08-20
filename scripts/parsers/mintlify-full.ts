#!/usr/bin/env bun
// Mintlify 사이트의 전체 계층을 얻는다.
// 한 페이지의 RSC 페이로드에는 "모든 탭 이름 + 현재 탭의 하위 계층"만 들어 있으므로,
// 탭 진입 URL 을 따라 탭 수만큼 다시 받아 합친다.
// 사용법: ./mintlify-full.ts https://code.claude.com/docs/en/overview
type 노드 = { kind: "page"; title: string; href: string }
          | { kind: "group"; title: string; children: 노드[] };

const 시작 = process.argv[2];
if (!시작) { console.error("사용법: ./mintlify-full.ts <문서 URL>"); process.exit(1); }
const 베이스 = new URL(시작);
const 파서 = new URL("./mintlify-nav.ts", import.meta.url).pathname;

async function 계층(url: string): Promise<노드[]> {
  const html = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const p = Bun.spawn([파서, "--json"], { stdin: new TextEncoder().encode(html), stdout: "pipe", stderr: "ignore" });
  return JSON.parse(await new Response(p.stdout).text());
}

const 잎개수 = (ns: 노드[]): number => ns.reduce((a, n) => a + (n.kind === "page" ? 1 : 잎개수(n.children)), 0);
/** 스텁 탭 = 자식이 페이지 1개뿐이고 그 제목이 탭 이름과 같은 경우 */
const 스텁인가 = (n: 노드) => n.kind === "group" && n.children.length === 1
  && n.children[0].kind === "page" && n.children[0].title === n.title;

const 첫판 = await 계층(시작);
const 결과: 노드[] = [];
for (const 탭 of 첫판) {
  if (탭.kind !== "group") { 결과.push(탭); continue; }
  if (!스텁인가(탭)) { 결과.push(탭); continue; }
  // 스텁이면 그 탭의 진입 페이지를 다시 받아 그 탭만 꺼내 온다
  const href = (탭.children[0] as any).href as string;
  const 탭url = href.startsWith("http") ? href : new URL(베이스.pathname.split("/").slice(0, -1).join("/") + "/", 베이스).origin
      + (베이스.pathname.startsWith("/docs/") ? "/docs" : "") + href;
  try {
    const 재 = await 계층(탭url);
    const 찾음 = 재.find(x => x.kind === "group" && x.title === 탭.title && !스텁인가(x));
    // 빈 탭 규칙: 탭 안에 문서가 하나도 없으면 탭 진입 페이지를 그 탭의 문서로 삼는다 (Tavily Home → /welcome)
    if (찾음 && 잎개수([찾음]) === 0) { 결과.push({ kind: "page", title: 탭.title, href }); console.error(`  ${탭.title}: ${탭url} -> 문서 0개, 진입 페이지로 대체`); continue; }
    결과.push(찾음 ?? 탭);
    console.error(`  ${탭.title}: ${탭url} -> ${찾음 ? 잎개수([찾음]) + "개" : "확장 실패"}`);
  } catch (e) { 결과.push(탭); console.error(`  ${탭.title}: 실패 ${e}`); }
}

function 출력(ns: 노드[], d = 0, 줄: string[] = []): string[] {
  for (const n of ns) {
    const t = "  ".repeat(d);
    if (n.kind === "group") { 줄.push(`${t}[${d + 1}] ${n.title}/`); 출력(n.children, d + 1, 줄); }
    else 줄.push(`${t}- ${n.title}  ${n.href}`);
  }
  return 줄;
}
if (process.argv.includes("--json")) console.log(JSON.stringify(결과, null, 2));
else console.log(출력(결과).join("\n"));
console.error(`\n[합계] 최상위 노드 ${결과.length}개 · 문서 ${잎개수(결과)}개`);
