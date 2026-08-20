import type { z } from "zod";
import type { 계층노드 as 계층노드S, 사이트설정 as 사이트설정S, 링크줄 as 링크줄S } from "./contracts";

export type 계층노드 = z.infer<typeof 계층노드S>;
export type 사이트설정 = z.infer<typeof 사이트설정S>;
export type 링크줄 = z.infer<typeof 링크줄S>;
import type { 매니페스트 as 매니페스트S, 매니페스트문서 as 매니페스트문서S, 매니페스트제외 as 매니페스트제외S } from "./contracts";
export type 매니페스트 = z.infer<typeof 매니페스트S>;
export type 매니페스트문서 = z.infer<typeof 매니페스트문서S>;
export type 매니페스트제외 = z.infer<typeof 매니페스트제외S>;
