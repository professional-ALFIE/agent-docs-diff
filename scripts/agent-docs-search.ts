#!/usr/bin/env bun
// agent-docs-search — agent-docs-diff 문서 검색·열람. search → fetch 2단계 구조.
// 사용법:
//   agent-docs-search search <단어> --site <제품폴더>
//       본문까지 검색한다. 출력은 문서 경로 + 히트한 헤딩(조상 헤딩 포함 경로)만 — 본문 히트 줄은 보여주지 않는다.
//       --site 는 필수다. 제품폴더: Claude_Code · Claude_Code-kr · opencode · opencode-kr · Codex · Exa · Tavily · Vibe_Kanban
//   agent-docs-search fetch <제품폴더/…/파일.md> [헤딩 텍스트]
//       헤딩 미지정 → 위치 · 원본 URL · 같은 폴더의 형제 · 전체 태그(헤딩) 트리를 보여준다.
//       헤딩 지정   → 조상 헤딩의 직속 본문 + 그 섹션 전체를 보여준다 (부분 일치, # 기호 없이 텍스트만).
const 루트 = new URL("..", import.meta.url).pathname;

const 사용법 = `사용법:
  agent-docs-search search <단어> --site <제품폴더>
  agent-docs-search fetch <제품폴더/…/파일.md> [헤딩 텍스트]`;

const [, , 명령, ...인자들] = process.argv;
if (!명령 || 명령 === "--help" || 명령 === "-h") { console.log(사용법); process.exit(0); }

type 헤딩 = { level: number; text: string; line: number };
/** 코드펜스 안의 # 줄은 헤딩이 아니다 */
const 코드밖헤딩 = (본문: string): 헤딩[] => {
  const 헤딩들: 헤딩[] = [];
  let 안 = false;
  본문.split("\n").forEach((줄, i) => {
    if (/^(```|~~~)/.test(줄)) 안 = !안;
    else if (!안) { const m = 줄.match(/^(#{1,6}) (.+)$/); if (m) 헤딩들.push({ level: m[1].length, text: m[2], line: i }); }
  });
  return 헤딩들;
};

/** 제품 폴더 안의 수집 문서 전부(번호_이름.md). 정렬은 경로 사전순 = 메뉴 pre-order */
async function 문서목록(제품폴더: string): Promise<string[]> {
  const out: string[] = [];
  const 걷기 = async (상대: string) => {
    for (const e of await Array.fromAsync(new Bun.Glob("*").scan({ cwd: 루트 + 제품폴더 + "/" + 상대, onlyFiles: false }))) {
      const p = 상대 ? `${상대}/${e}` : e;
      if (!p.includes(".")) await 걷기(p); // 확장자 없음 = 폴더
      else if (/^\d{3,4}[ _].+\.md$/.test(e)) out.push(p);
    }
  };
  await 걷기("");
  return out.sort();
}

/** 헤딩 h 의 조상 포함 경로: "# A / ## B / ### C" */
const 헤딩경로 = (헤딩들: 헤딩[], idx: number) => {
  const 경로: 헤딩[] = [];
  for (let i = idx; i >= 0; i--) {
    const h = 헤딩들[i];
    if (!경로.length || h.level < 경로[0].level) 경로.unshift(h);
    if (h.level === 1) break;
  }
  return 경로.map(h => `${"#".repeat(h.level)} ${h.text}`).join(" / ");
};

/** h 헤딩의 섹션 끝(같거나 얕은 레벨 다음 헤딩 줄) */
const 섹션끝 = (헤딩들: 헤딩[], idx: number, 총줄수: number) => {
  for (let i = idx + 1; i < 헤딩들.length; i++) if (헤딩들[i].level <= 헤딩들[idx].level) return 헤딩들[i].line;
  return 총줄수;
};

if (명령 === "search") {
  const siteIdx = 인자들.indexOf("--site");
  if (siteIdx === -1 || !인자들[siteIdx + 1]) {
    console.error("--site 는 필수다. 제품폴더: Claude_Code · Claude_Code-kr · opencode · opencode-kr · Codex · Exa · Tavily · Vibe_Kanban");
    process.exit(1);
  }
  const site = 인자들[siteIdx + 1];
  const 단어 = 인자들.filter((_, i) => i !== siteIdx && i !== siteIdx + 1).join(" ").toLowerCase();
  if (!단어) { console.error("검색어가 없다."); process.exit(1); }

  const 문서들 = await 문서목록(site);
  if (!문서들.length) { console.error(`제품 폴더가 비었거나 없다: ${site}`); process.exit(1); }
  const 결과: string[] = [];
  for (const p of 문서들) {
    const 본문 = await Bun.file(루트 + site + "/" + p).text();
    const 줄들 = 본문.toLowerCase().split("\n");
    const 헤딩들 = 코드밖헤딩(본문);
    const 히트셋 = new Set<number>();
    줄들.forEach((줄, i) => { if (줄.includes(단어)) 히트셋.add(i); });
    if (!히트셋.size) continue;
    const 섹션들 = new Set<string>();
    for (const i of 히트셋) {
      const idx = 헤딩들.findLastIndex(h => h.line <= i); // 이 줄이 속한(또는 그 자체인) 가장 가까운 헤딩
      if (idx >= 0) 섹션들.add(헤딩경로(헤딩들, idx));
      else 섹션들.add("(서두 — 첫 헤딩 앞)");
    }
    결과.push(`${site}/${p}`);
    for (const 섹션 of 섹션들) 결과.push(`  ${섹션}`);
    결과.push("");
  }
  if (!결과.length) { console.log(`'${단어}' 히트 없음 (${site}, 문서 ${문서들.length}개)`); process.exit(0); }
  console.log(결과.join("\n").trimEnd());
  console.log(`\n(${site} · 문서 ${문서들.length}개에서 히트. 더 보려면: agent-docs-search fetch <경로> [헤딩])`);
}

else if (명령 === "fetch") {
  const [경로인자, ...헤딩조각] = 인자들;
  if (!경로인자) { console.error(사용법); process.exit(1); }
  const 상대 = 경로인자.startsWith("/") ? 경로인자.slice(루트.length) : 경로인자;
  const 파일 = 루트 + 상대;
  if (!await Bun.file(파일).exists()) { console.error(`없다: ${상대}`); process.exit(1); }
  const 본문 = await Bun.file(파일).text();
  const 줄들 = 본문.split("\n");
  const 헤딩들 = 코드밖헤딩(본문);
  const 원본 = 본문.match(/^> 원본: (\S+)$/m)?.[1] ?? "(원본 URL 없음 — 수집기가 머리에 넣는다)";
  const [제품, ...세그] = 상대.split("/");
  const 부모 = 세그.slice(0, -1).join("/");

  const 형제보기 = async () => {
    const 항목들 = await Array.fromAsync(new Bun.Glob("*").scan({ cwd: 루트 + 제품 + "/" + 부모, onlyFiles: false }));
    return 항목들.sort().map(e => (e.includes(".") ? e : e + "/")).join("  ");
  };

  const 헤딩텍스트 = 헤딩조각.join(" ");
  if (!헤딩텍스트) {
    console.log(`위치: ${상대}`);
    console.log(`원본: ${원본}`);
    console.log(`형제: ${await 형제보기()}`);
    console.log(`태그:`);
    const 최상위레벨 = 헤딩들[0]?.level ?? 1;
    for (const h of 헤딩들) console.log(`${"  ".repeat(Math.max(0, h.level - 최상위레벨))}${"#".repeat(h.level)} ${h.text}`);
    console.log(`\n섹션을 보려면: agent-docs-search fetch ${상대} "<헤딩 텍스트>"`);
    process.exit(0);
  }

  const 찾은 = 헤딩들.map((h, i) => ({ h, i })).filter(({ h }) => h.text.toLowerCase().includes(헤딩텍스트.toLowerCase()));
  if (!찾은.length) {
    console.error(`그 헤딩이 없다: "${헤딩텍스트}"\n태그 목록은: agent-docs-search fetch ${상대}`);
    process.exit(1);
  }
  if (찾은.length > 1) {
    console.log("여러 헤딩이 걸린다 — 하나를 정확히 지정하라:");
    for (const { h, i } of 찾은) console.log(`  ${헤딩경로(헤딩들, i)}`);
    process.exit(1);
  }

  const { h, i } = 찾은[0];
  console.log(`위치: ${상대} / ${헤딩경로(헤딩들, i)}`);
  console.log(`원본: ${원본}\n`);
  // 조상 헤딩의 직속 본문(자식 헤딩 앞까지)
  const 조상들: { h: 헤딩; i: number }[] = [];
  for (let j = i - 1; j >= 0; j--) if (헤딩들[j].level < (조상들[0]?.h.level ?? 헤딩들[i].level)) 조상들.unshift({ h: 헤딩들[j], i: j });
  for (const 조상 of [...조상들, { h, i }]) {
    const 끝 = 섹션끝(헤딩들, 조상.i, 줄들.length);
    const 직속 = 줄들.slice(조상.h.line + 1, 끝).filter(l => !/^#{1,6} /.test(l)).join("\n").trim();
    console.log(`--- ${"#".repeat(조상.h.level)} ${조상.h.text}${조상.i === i ? " (요청 섹션 전체)" : " (직속 본문)"}`);
    if (직속) console.log(직속);
    else if (조상.i !== i) console.log("(직속 본문 없음)");
    console.log("");
  }
}

else { console.error(`모르는 명령: ${명령}\n${사용법}`); process.exit(1); }
