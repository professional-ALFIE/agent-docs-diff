import { z } from "zod";

/** 파서가 내는 공통 계층의 문서 노드. href 는 사이트 루트 기준 경로 */
export const 문서노드 = z.object({
  kind: z.literal("page"),
  title: z.string().min(1),
  href: z.string().min(1),
});

/** 공통 계층 노드 — 문서(page) 또는 묶음(group). group 은 상단 탭·사이드바 제목·펼침 메뉴를 구분하지 않는다 */
export const 계층노드 = z.discriminatedUnion("kind", [
  문서노드,
  z.object({
    kind: z.literal("group"),
    title: z.string().min(1),
    get children() { return z.array(계층노드); },
  }),
]);
export const 계층 = z.array(계층노드);

/** codex-full.ts 의 출력 — 탭 배열. 그룹 title 이 null 이면 탭 바로 아래 놓인 문서들이다 */
const Codex펼침 = z.object({
  kind: z.literal("disclosure"),
  title: z.string().min(1),
  open: z.boolean(),
  pages: z.array(문서노드),
});
export const Codex탭 = z.object({
  탭: z.string().min(1),
  href: z.string(),
  navId: z.string(),
  그룹들: z.array(z.object({
    title: z.string().nullable(),
    items: z.array(z.union([문서노드, Codex펼침])),
  })),
});
export const Codex계층 = z.array(Codex탭).min(1);

export function Codex를공통으로(탭들: z.infer<typeof Codex계층>): z.infer<typeof 계층> {
  return 탭들.map(t => ({
    kind: "group" as const,
    title: t.탭,
    children: t.그룹들.flatMap(g => {
      const items = g.items.map(i =>
        i.kind === "page" ? i : { kind: "group" as const, title: i.title, children: i.pages });
      return g.title === null ? items : [{ kind: "group" as const, title: g.title, children: items }];
    }),
  }));
}

/** 계층 JSON 파일을 읽는다. Codex 형식이면 공통 형식으로 바꿔서 돌려준다 */
export async function 계층읽기(경로: string) {
  const raw = await Bun.file(경로).json();
  const c = Codex계층.safeParse(raw);
  return c.success ? Codex를공통으로(c.data) : 계층.parse(raw);
}

/** 사이트 하나의 수집 설정 */
export const 사이트설정 = z.object({
  제품폴더: z.string().min(1),
  진입: z.url(),
  파서: z.enum(["mintlify", "starlight", "codex"]),
  /** llms.txt 의 문서 URL 에서 이 접두사를 떼면 계층의 href 가 된다 */
  base: z.url(),
  /** 없으면(null) 계층만으로 llms-local.txt 를 만든다 */
  llms: z.url().nullable(),
  /** 계층 href 에 적용할 [정규식, 치환] — 정본 주소로 맞추는 용도 */
  href정규화: z.array(z.tuple([z.string(), z.string()])).default([]),
  /** 계층 최상위 노드 수. 탭이 있으면 탭 수, 없으면 사이드바 제목(+그룹 없는 문서) 수. 달라지면 검사가 막는다 */
  기대최상위: z.number().int().positive(),
  /** .md 응답의 content-type 앞부분. 다르면 문서가 아니다 (Exa 의 Blog 는 text/html 이 온다) */
  contentType: z.enum(["text/markdown", "text/plain"]),
});

/** llms.txt 의 링크 줄 "- [제목](URL): 설명". 설명은 없을 수 있다 */
export const 링크줄 = z.object({
  제목: z.string().min(1),
  url: z.url(),
  설명: z.string().optional(),
});
export function 링크줄파싱(줄: string) {
  const m = 줄.match(/^- \[(.+)\]\((\S+?)\)(?::\s*(.*))?$/);
  return m ? 링크줄.parse({ 제목: m[1], url: m[2], 설명: m[3] }) : null;
}

/** 한 회차에 실제로 저장한 문서 하나 */
export const 매니페스트문서 = z.object({
  경로: z.string().min(1),
  href: z.string().min(1),
  url: z.url(),
  sha256: z.string().length(64),
  bytes: z.number().int().nonnegative(),
  contentType: z.string(),
});
/** 메뉴에는 있으나 받지 않은 문서 — .md 가 문서가 아니거나(HTML) 응답이 200 이 아닌 것 */
export const 매니페스트제외 = z.object({
  경로: z.string().min(1),
  href: z.string().min(1),
  url: z.url(),
  이유: z.string().min(1),
});
/** 제품 폴더마다 하나. 다음 회차가 직전 상태와 비교하는 기준이다 */
export const 매니페스트 = z.object({
  생성: z.iso.datetime(),
  제품폴더: z.string().min(1),
  진입: z.url(),
  최상위수: z.number().int().nonnegative(),
  그룹수: z.number().int().nonnegative(),
  문서: z.array(매니페스트문서),
  제외: z.array(매니페스트제외),
  llms: z.object({ 치환: z.number().int(), 미노출: z.number().int(), 외부: z.number().int(), 메뉴에만: z.number().int() }),
});
