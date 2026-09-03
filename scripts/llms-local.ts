import { 링크줄파싱 } from "./contracts";
import { 문서키 } from "./sites";
import type { 문서자리 } from "./tree";
import type { 사이트설정 } from "./types";

/** llms.txt(원문) · llms-local.txt(트리형) · CLAUDE.md 의 내용을 만든다. 디스크에는 쓰지 않는다 — 호출한 쪽이 검사 뒤에 쓴다.
 *  llms-local.txt 는 폴더 계층을 그대로 들여쓰기 트리로 펴고 문서마다 llms.txt 의 설명을 붙인다 — UI 메뉴가 보여주는
 *  전체 구조가 한눈에 보이는 것이 목적이다.
 *  제외 는 메뉴에 있으나 본문을 받지 못한 문서(경로 → 이유) — 트리에는 포함하되 이유를 붙인다 */
export async function llmsLocal생성(s: 사이트설정, 문서들: 문서자리[], 제외: Map<string, string> = new Map()) {
  const 파일들 = new Map<string, string>();
  const 경로표 = new Map<string, 문서자리[]>();
  for (const d of 문서들) { const k = 문서키(d.href, s); 경로표.set(k, [...(경로표.get(k) ?? []), d]); }
  /** 정확히 없으면 /index 를 뗀 표기로 한 번 더 찾는다 (Mintlify 가 /x/index 와 /x 를 같은 문서로 본다) */
  const 찾기 = (k: string) => 경로표.get(k) ?? 경로표.get(k.replace(/\/index$/, "") || "/");

  const 통계 = { 치환: 0, 미노출: 0, 외부: 0, 메뉴에만: 0 };
  const 설명표 = new Map<string, string>();
  const 쓴문서 = new Set<string>();
  const 외부들: string[] = [];
  const 미노출들: string[] = [];

  if (s.llms) {
    const 응답 = await fetch(s.llms);
    if (!응답.ok) throw new Error(`llms.txt 받기 실패: ${s.llms} → HTTP ${응답.status}`);
    const 원문 = await 응답.text();
    파일들.set("llms.txt", 원문);

    for (const 줄 of 원문.split("\n")) {
      const L = 링크줄파싱(줄);
      if (!L) continue;
      if (!L.url.startsWith(s.base)) { 통계.외부++; 외부들.push(줄); continue; }
      const ds = 찾기(문서키(L.url.slice(s.base.length), s));
      if (!ds) { 통계.미노출++; 미노출들.push(줄); continue; }
      for (const d of ds) 쓴문서.add(d.경로);
      if (!제외.has(ds[0].경로)) {
        통계.치환++;
        if (L.설명 && !설명표.has(ds[0].경로)) 설명표.set(ds[0].경로, L.설명);
      } else 통계.미노출++; // 메뉴에 있으나 받지 못함
    }
    통계.메뉴에만 = 문서들.filter(d => !쓴문서.has(d.경로) && !제외.has(d.경로)).length;
  } else {
    통계.메뉴에만 = 문서들.filter(d => !제외.has(d.경로)).length;
  }

  /** pre-order 문서 경로를 조상 폴더 비교로 트리 줄에 편다. 폴더는 처음 나올 때만 출력 */
  const 트리: string[] = [];
  let 스택: string[] = [];
  for (const d of 문서들) {
    const 세그 = d.경로.split("/");
    const 파일 = 세그.pop()!;
    let 공통 = 0;
    while (공통 < 세그.length && 스택[공통] === 세그[공통]) 공통++;
    for (let i = 공통; i < 세그.length; i++) 트리.push(`${"  ".repeat(i)}${세그[i]}/`);
    스택 = 세그;
    const 설명 = 설명표.get(d.경로);
    const 못받음 = 제외.get(d.경로);
    트리.push(`${"  ".repeat(세그.length)}${파일}${설명 ? ` — ${설명}` : ""}${못받음 ? ` — (받지 않음: ${못받음})` : ""}`);
  }

  const 본문 = [...트리];
  if (외부들.length) 본문.push("", "## llms.txt 외부 링크 (이 폴더 밖)", "", ...외부들.map(줄 => `- ${줄.replace(/^- /, "")}`));
  if (미노출들.length) 본문.push("", "## 메뉴에 없는 llms.txt 문서 (로컬 없음)", "", ...미노출들.map(줄 => `- ${줄.replace(/^- /, "")}`));

  const 머리 = s.llms
    ? `> 이 폴더의 트리다 (scripts/llms-local.ts 가 생성). 들여쓰기가 메뉴 계층이고 문서마다 공식 llms.txt 의 설명이 붙는다.
> 문서 파일의 경로는 조상 폴더들 + 파일명이며, 파일 맨 위에 원본 URL 이 적혀 있다. 원문 목록은 같은 폴더의 llms.txt.`
    : `> 이 폴더의 트리다 (scripts/llms-local.ts 가 생성). 이 사이트는 공식 llms.txt 를 제공하지 않아 설명문이 없다.
> 들여쓰기가 메뉴 계층이고, 문서 파일의 경로는 조상 폴더들 + 파일명이며 파일 맨 위에 원본 URL 이 적혀 있다.`;
  파일들.set("llms-local.txt", [머리, "", ...본문].join("\n").replace(/\n*$/, "\n"));

  파일들.set("CLAUDE.md", `# ${s.제품폴더} — ${s.base} 의 문서를 메뉴 계층대로 받은 폴더

문서를 찾을 때는 이 폴더의 \`llms-local.txt\` 를 연다. 들여쓰기 트리가 공식 사이트 메뉴 계층 그대로고${s.llms ? " 문서마다 공식 llms.txt 의 설명이 붙어 있다" : " 이 사이트는 공식 llms.txt 가 없어 설명이 없다"}.
파일의 경로는 트리에서 조상 폴더들 + 파일명이고, 각 파일 맨 위 \`> 원본:\` 줄에 공식 URL 이 적혀 있다.
이 폴더의 내용은 \`scripts/sync.ts\` 가 생성한다 — 손으로 고치면 다음 회차에 덮인다.
`);
  return { 통계, 파일들 };
}
