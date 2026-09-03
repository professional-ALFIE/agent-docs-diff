import type { 계층노드 } from "./types";

export type 문서자리 = { href: string; title: string; 경로: string };

/** 파일시스템 금지 문자는 -, 공백은 _ 로 바꾼다. 표시명 복원은 _ → 공백 치환으로 무손실이다 (원 표시명에 _ 가 0건) */
const 이름정리 = (s: string) => s.replace(/[\/:*?"<>|\\]/g, "-").replace(/\s+$/, "").replace(/\.$/, "").replace(/\s+/g, "_");
/** 형제 안 순번을 고정 폭 간격 번호로. 010 · 020 · 030 */
const 번호 = (i: number, 형제수: number) => String((i + 1) * 10).padStart(형제수 >= 100 ? 4 : 3, "0");
/** href 의 마지막 조각. 형제 이름이 충돌할 때만 덧붙인다 */
const url이름 = (href: string) => href.replace(/\/$/, "").split("/").pop() ?? "";

/** 계층을 제품 폴더 기준 상대 경로로 푼다. 폴더는 번호+이름, 문서는 거기에 .md */
export function 경로계산(트리: 계층노드[]) {
  const 폴더들: string[] = [];
  const 문서들: 문서자리[] = [];
  const 충돌들: string[] = [];
  let 최대형제 = 0;

  function 걷기(노드들: 계층노드[], 부모: string) {
    최대형제 = Math.max(최대형제, 노드들.length);
    const 정리된 = 노드들.map(n => 이름정리(n.title));
    const 겹침 = new Set(정리된.filter((x, i, a) => a.indexOf(x) !== i));
    노드들.forEach((n, i) => {
      let 이름 = 정리된[i];
      if (겹침.has(이름)) {
        const h = n.kind === "page" ? n.href : (n.children.find(c => c.kind === "page") as any)?.href ?? "";
        이름 = `${이름}--${url이름(h)}`;
        충돌들.push(`${부모}${이름}`);
      }
      const 경로 = `${부모}${번호(i, 노드들.length)}_${이름}`;
      if (n.kind === "group") { 폴더들.push(경로); 걷기(n.children, 경로 + "/"); }
      else 문서들.push({ href: n.href, title: n.title, 경로: 경로 + ".md" });
    });
  }
  걷기(트리, "");
  return { 폴더들, 문서들, 충돌들, 최대형제 };
}
