import { 문서URL } from "./sites";
import type { 문서자리 } from "./tree";
import type { 매니페스트문서, 매니페스트제외, 사이트설정 } from "./types";

export type 받은문서 = 매니페스트문서 & { 본문: string };

const UA = { "user-agent": "Mozilla/5.0" };
const sha256 = (s: string) => new Bun.CryptoHasher("sha256").update(s).digest("hex");

async function 하나(s: 사이트설정, d: 문서자리): Promise<받은문서 | 매니페스트제외> {
  const url = 문서URL(d.href, s);
  const 기본 = { 경로: d.경로, href: d.href, url };
  let r: Response;
  try {
    r = await fetch(url, { headers: UA, redirect: "follow" });
    // Starlight 는 루트 문서를 /index.md 로만 낸다 (opencode 의 /docs/index.md). 404 면 한 번 더 본다
    if (r.status === 404 && !/\/index\.md$/.test(url)) r = await fetch(url.replace(/\.md$/, "/index.md"), { headers: UA, redirect: "follow" });
  }
  catch (e) { return { ...기본, 이유: `요청 실패: ${String(e).slice(0, 80)}` }; }
  if (r.status !== 200) return { ...기본, 이유: `HTTP ${r.status}` };
  if (new URL(r.url).host !== new URL(url).host) return { ...기본, 이유: `외부로 리다이렉트: ${r.url}` };
  const ct = (r.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!ct.startsWith(s.contentType)) return { ...기본, 이유: `content-type ${ct || "(없음)"} — 문서가 아니다` };
  const 본문 = await r.text();
  if (!본문.trim()) return { ...기본, 이유: "본문이 비어 있다" };
  if (/^\s*<(!doctype|html)/i.test(본문)) return { ...기본, 이유: "본문이 HTML 이다" };
  // 머리에 원본 URL 을 붙인다 (검사는 원본 기준으로 끝났으므로 이 뒤에). sha256·bytes 는 저장 단위 그대로
  const 머리포함 = `> 원본: ${r.url}\n\n${본문}`;
  return { ...기본, sha256: sha256(머리포함), bytes: Buffer.byteLength(머리포함), contentType: ct, 본문: 머리포함 };
}

/** 문서 전부를 받아 메모리에 둔다. 디스크에는 쓰지 않는다 — 검사를 통과한 뒤 sync 가 쓴다 */
export async function 본문수집(s: 사이트설정, 문서들: 문서자리[], 동시 = 6) {
  const 저장: 받은문서[] = [];
  const 제외: 매니페스트제외[] = [];
  let i = 0;
  await Promise.all(Array.from({ length: 동시 }, async () => {
    while (i < 문서들.length) {
      const r = await 하나(s, 문서들[i++]);
      "본문" in r ? 저장.push(r) : 제외.push(r);
    }
  }));
  const 순서 = new Map(문서들.map((d, i) => [d.경로, i]));
  저장.sort((a, b) => 순서.get(a.경로)! - 순서.get(b.경로)!);
  제외.sort((a, b) => 순서.get(a.경로)! - 순서.get(b.경로)!);
  return { 저장, 제외 };
}
