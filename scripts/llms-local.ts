import { 링크줄파싱 } from "./contracts";
import { 문서키 } from "./sites";
import type { 문서자리 } from "./tree";
import type { 사이트설정 } from "./types";

/** 마크다운 링크 안에 공백이 있으므로 <> 로 감싼다 */
const 링크 = (p: string) => `<${p}>`;

/** llms.txt(원문) · llms-local.txt · CLAUDE.md 의 내용을 만든다. 디스크에는 쓰지 않는다 — 호출한 쪽이 검사 뒤에 쓴다.
 *  제외 는 메뉴에 있으나 본문을 받지 못한 문서(경로 → 이유) — 그 줄은 치환하지 않고 이유를 붙인다 */
export async function llmsLocal생성(s: 사이트설정, 문서들: 문서자리[], 제외: Map<string, string> = new Map()) {
  const 파일들 = new Map<string, string>();
  const 경로표 = new Map<string, 문서자리[]>();
  for (const d of 문서들) { const k = 문서키(d.href, s); 경로표.set(k, [...(경로표.get(k) ?? []), d]); }
  /** 정확히 없으면 /index 를 뗀 표기로 한 번 더 찾는다 (Mintlify 가 /x/index 와 /x 를 같은 문서로 본다) */
  const 찾기 = (k: string) => 경로표.get(k) ?? 경로표.get(k.replace(/\/index$/, "") || "/");

  const 통계 = { 치환: 0, 미노출: 0, 외부: 0, 메뉴에만: 0 };
  const 쓴문서 = new Set<string>();
  let 본문: string[];

  if (s.llms) {
    const 응답 = await fetch(s.llms);
    if (!응답.ok) throw new Error(`llms.txt 받기 실패: ${s.llms} → HTTP ${응답.status}`);
    const 원문 = await 응답.text();
    파일들.set("llms.txt", 원문);

    본문 = 원문.split("\n").map(줄 => {
      const L = 링크줄파싱(줄);
      if (!L) return 줄;
      if (!L.url.startsWith(s.base)) { 통계.외부++; return `${줄} (외부 링크)`; }
      const ds = 찾기(문서키(L.url.slice(s.base.length), s));
      if (!ds) { 통계.미노출++; return `${줄} (메뉴 미노출 · 로컬 없음)`; }
      for (const d of ds) 쓴문서.add(d.경로);
      const 받은 = ds.filter(d => !제외.has(d.경로));
      if (!받은.length) { 통계.미노출++; return `${줄} (메뉴에 있으나 받지 않음: ${제외.get(ds[0].경로)})`; }
      통계.치환++;
      const 바뀐줄 = 줄.replace(`(${L.url})`, `(${링크(받은[0].경로)})`);
      return 받은.length === 1 ? 바뀐줄 : `${바뀐줄} (같은 문서가 메뉴 다른 곳에도: ${받은.slice(1).map(d => 링크(d.경로)).join(", ")})`;
    });
    const 메뉴에만 = 문서들.filter(d => !쓴문서.has(d.경로) && !제외.has(d.경로));
    통계.메뉴에만 = 메뉴에만.length;
    if (메뉴에만.length) {
      본문.push("", "## 메뉴에만 있는 문서 (공식 llms.txt 에 없음)", "");
      for (const d of 메뉴에만) 본문.push(`- [${d.title}](${링크(d.경로)})`);
    }
  } else {
    const 받은 = 문서들.filter(d => !제외.has(d.경로));
    통계.메뉴에만 = 받은.length;
    본문 = [`# ${s.제품폴더}`, "", `> 공식 llms.txt 가 없어(${s.진입} 기준 404) 메뉴 계층에서 만든 목록이다. 설명문이 없다.`, "", "## Docs", ""];
    for (const d of 받은) 본문.push(`- [${d.title}](${링크(d.경로)})`);
  }

  const 머리 = s.llms
    ? `> 이 파일은 공식 llms.txt 의 링크를 이 폴더 기준 경로로 바꾼 것이다 (scripts/llms-local.ts 가 생성). 원문은 같은 폴더의 llms.txt.`
    : `> 이 파일은 메뉴 계층에서 만든 문서 목록이다 (scripts/llms-local.ts 가 생성). 이 사이트는 공식 llms.txt 를 제공하지 않는다.`;
  파일들.set("llms-local.txt", [머리, "", ...본문].join("\n").replace(/\n*$/, "\n"));

  const 설명 = s.llms
    ? `문서를 찾을 때는 이 폴더의 \`llms-local.txt\` 를 연다. 공식 \`llms.txt\` 의 제목·설명을 그대로 두고
링크만 이 폴더 기준 경로로 바꾼 목록이라, 줄을 찾으면 그 경로를 바로 Read 할 수 있다. 원문은 \`llms.txt\`.`
    : `문서를 찾을 때는 이 폴더의 \`llms-local.txt\` 를 연다. 이 사이트는 공식 llms.txt 를 제공하지 않아
메뉴 계층에서 만든 목록이며 설명문이 없다. 링크는 이 폴더 기준 경로라 바로 Read 할 수 있다.`;
  파일들.set("CLAUDE.md", `# ${s.제품폴더} — ${s.base} 의 문서를 메뉴 계층대로 받은 폴더

${설명}
폴더와 파일 앞의 번호(010 · 020)는 공식 메뉴의 순서다. 이 폴더의 내용은 \`scripts/sync.ts\` 가 생성한다 — 손으로 고치면 다음 회차에 덮인다.
`);
  return { 통계, 파일들 };
}
