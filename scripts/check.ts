import type { 매니페스트, 사이트설정 } from "./types";

/** 조용한 오류를 막는 검사. 실패 사유를 돌려준다 — 비어 있으면 통과.
 *  accept 가 true 면 구조 변화(최상위 수·그룹 수·대량 rename)를 실패로 보지 않는다 (사람이 확인한 뒤 기준을 갱신할 때) */
export function 검사(s: 사이트설정, 이번: 매니페스트, 직전: 매니페스트 | null, accept: boolean): string[] {
  const 실패: string[] = [];
  const 구조 = (msg: string) => { if (!accept) 실패.push(msg); else console.warn(`  (accept) ${msg}`); };

  if (이번.최상위수 !== s.기대최상위) 구조(`최상위 ${이번.최상위수}개, 기대 ${s.기대최상위}개 — 탭이나 사이드바 제목이 바뀌었다. 맞으면 sites.ts 의 기대최상위를 고친다`);
  if (이번.문서.length === 0) 실패.push("받은 문서가 0개");
  if (이번.제외.length * 10 >= 이번.문서.length + 이번.제외.length && 이번.제외.length > 0)
    실패.push(`제외가 ${이번.제외.length}개로 전체의 10% 이상 — 사이트가 .md 를 막았거나 주소 규칙이 바뀌었다`);

  if (직전) {
    const 직전수 = 직전.문서.length;
    if (이번.문서.length < 직전수 * 0.9) 실패.push(`문서 ${직전수} → ${이번.문서.length}개, 10% 넘게 줄었다`);
    if (이번.그룹수 !== 직전.그룹수) 구조(`그룹 ${직전.그룹수} → ${이번.그룹수}개 — 계층 모양이 바뀌었다 (납작해짐 의심)`);
    const 직전경로 = new Map(직전.문서.map(d => [d.href, d.경로]));
    const rename = 이번.문서.filter(d => 직전경로.has(d.href) && 직전경로.get(d.href) !== d.경로).length;
    const 임계 = Math.max(10, Math.floor(이번.문서.length * 0.1));
    if (rename > 임계) 구조(`같은 문서의 경로가 바뀐 것이 ${rename}개 (임계 ${임계}) — 번호 밀림이나 표시명 규칙 변화. 실제 diff 를 덮는다`);
    if (직전.llms && 이번.llms) {
      const 전 = 직전.llms.미노출 + 직전.llms.메뉴에만, 후 = 이번.llms.미노출 + 이번.llms.메뉴에만;
      if (후 > 전 * 2 && 후 - 전 >= 5) 구조(`llms.txt 와 메뉴의 차이가 ${전} → ${후}개로 급증 — 추출이 깨졌을 수 있다`);
    }
  }
  return 실패;
}
