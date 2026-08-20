# agent-docs-diff — 문서 사이트를 메뉴 계층 그대로 받아 diff 로 보는 저장소

공식 문서 사이트를 주기적으로 받아 GitHub 커밋으로 쌓아, 문서가 바뀔 때마다 GitHub
화면에서 빨강·초록 줄 diff 로 볼 수 있게 한다. 핵심 요구는 **공식 사이트의 왼쪽 메뉴
계층을 폴더 구조로 그대로 보존**하는 것이다. 별도 diff 생성기를 만들지 않는다 — 각
시점을 정상 커밋으로 만들면 GitHub 가 diff 를 보여준다.

대상은 문서 사이트 6곳이다: opencode · Claude Code · Exa · Tavily · Vibe Kanban · Codex.
이름이 `agent-docs-diff` 인 것은 여러 제품 문서를 담는 상위 저장소이기 때문이다.

## 폴더 구조

```text
agent-docs-diff/
├── Claude Code Docs (en)/          ← 제품 폴더. 번호를 붙이지 않는다
│   ├── CLAUDE.md                   ← 이 폴더에서 작업할 때 자동 로드. llms-local.txt 를 보라는 한 줄
│   ├── llms.txt                    ← 공식 llms.txt 원문 그대로 (제공하는 사이트만)
│   ├── llms-local.txt              ← llms.txt 의 링크만 이 폴더 기준 경로로 바꾼 것. 검색은 이걸로
│   ├── .manifest.json              ← 제품마다 하나. 직전 회차 상태 — 검사의 비교 기준
│   ├── 010 Getting started/        ← 상단 탭
│   │   ├── 010 Getting started/    ← 사이드바 제목
│   │   │   ├── 010 Overview.md     ← 문서
│   │   │   └── ...
│   │   └── 020 Core concepts/
│   └── 020 Build with Claude Code/
├── scripts/
└── .github/workflows/
```

제품 폴더 8개의 이름은 확정이다 (2026-08-21). 첫 회차를 돌려 문서 본문까지 전부 들어 있다.

```yaml
Claude Code Docs (en) · Claude Code Docs (ko) · Exa Docs · Tavily Docs · Vibe Kanban Docs ·
opencode Docs (en) · opencode Docs (ko) · Codex Docs
llms.txt 가 없는 폴더 3개: Claude Code Docs (ko) (/docs/ko/llms.txt 가 404) · opencode 둘.
                       이 셋의 llms-local.txt 는 메뉴 계층에서 만들어 설명문이 없다
```

이름 규칙은 이렇다.

```yaml
제품 폴더: 번호를 붙이지 않는다
그 안쪽 전부: 고정 폭 간격 번호 010 · 020 · 030 을 붙인다
간격을 두는 이유: 새 항목은 빈 번호 사이에 넣고, 자리가 없을 때만 같은 형제 묶음을
             다시 번호 매긴다. 001·002·003 처럼 붙여 쓰면 중간에 하나 추가될 때 뒤가
             전부 밀려 무관한 파일까지 rename 되고, 그 rename 이 실제 문서 변경 diff 를 덮는다
이름: 공식 표시명을 그대로 쓰되 파일시스템 금지 문자는 - 로 바꾸고,
    같은 이름이 충돌할 때만 --URL이름 을 덧붙인다
깊이: 균일하지 않다. 사이트의 메뉴를 그대로 따라간다 —
    Exa 최대 5단 · Claude Code · Tavily · Codex 최대 4단 · Vibe Kanban 3단 · opencode 2단.
    같은 사이트 안에서도 탭마다 다르다 (Codex 는 6개 탭 중 Security 탭만 4단).
    균일하게 맞추려고 빈 중간 폴더를 끼우지 않는다 — 원래 구조가 왜곡된다
```

## 확정된 결정 (2026-08-20)

같은 문서에 주소가 두 벌인 사이트가 넷이다. 정본을 안 정하면 회차마다 폴더 이름이
흔들리고 그 rename 이 실제 문서 변경 diff 를 덮는다. 아래로 못 박는다.

```yaml
Codex 정본 주소: /docs 로 정규화한다 (원본 HTML 의 /codex/... 를 치환)
  이유: llms.txt 가 /docs 를 쓰므로 교차 검증이 변환 없이 된다. 그리고 learn.chatgpt.com 은
      Codex 전용 사이트가 아니다 — 숨겨진 탭이 Use Cases 와 Resources 인 것을 보면 다른 제품
      문서가 붙을 자리가 있는 구조이고, 그러면 제품 이름이 박힌 /codex 쪽이 먼저 바뀐다
  구현: href.replace(/^\/codex/, '/docs') 한 줄
  검증: 변환 후 주소가 llms.txt 집합에 있는지. 지금 추출 139 · llms.txt(/docs) 139 · 겹침 133
  확인: 깊은 경로까지 완전한 별칭이다 — /codex/security/plugin/scans.md 와
      /docs/security/plugin/scans.md 가 둘 다 200 text/markdown 이고 첫 줄이 같다

opencode 언어 분리: 메뉴 진입은 /docs/en 과 /docs/ko, 본문은 href 끝 슬래시를 떼고 .md 를 붙인다
  이유: .md 는 Accept-Language 협상을 하지 않는다 (실측 - /docs/config.md 에 ko-KR 헤더를
      줘도 영어 26,295 bytes 가 그대로 온다). 그래서 본문에는 언어가 섞일 수 없다.
      메뉴 진입에만 /docs/en 을 쓰는 것은 HTML 페이지가 협상에 흔들리기 때문이다
  주의: 사이드바 href 는 언어 중립인 /docs/... 로 나오지만 .md 를 붙이면 되므로 /en 을
      다시 끼울 필요가 없다. 한국어는 href 가 이미 /docs/ko/... 다
  검증: 영어 트리 첫 문서의 첫 줄이 영어인지. 기준값은
      "You can configure OpenCode using a JSON config file."

빈 탭·빈 그룹: 문서가 0개면 그 탭(그룹)의 진입 href 를 그 탭의 문서로 넣는다
  이유: Tavily Home 탭이 그 경우인데 /welcome.md 가 HTTP 200 · text/markdown 으로 실재한다.
      버리면 실제 문서를 놓친다. llms.txt 에 /welcome 이 없는 것은 llms.txt 쪽이 빠뜨린 것이다.
      빈 폴더로 두는 선택지는 없다 — git 이 빈 폴더를 추적하지 않는다
  범위: Tavily 전용 처리로 두지 않고 일반 규칙으로 넣는다. 다른 사이트에서 같은 모양이
      나오면 똑같이 걸린다
  검증: 문서 0개인 탭이 남아 있으면 실패

Vibe Kanban 주소 표기: JSON href 를 그대로 쓴다. /index 를 떼지 않는다
  이유: 루트 문서는 /index 를 떼면 받을 수 없다. 실측 - /docs.md 는 404 이고 /docs/index.md
      만 200 이다. 게다가 떼면 루트 경로가 빈 문자열이 되어 폴더 이름을 만들 수 없다.
      llms.txt 도 /index 표기를 쓰므로 지금 차이 0개인 상태가 그대로 유지된다
  주의: 4개 중 3개(/workspaces · /cloud · /settings)는 양쪽 다 200 이라 어느 쪽을 써도
      통과한다. 루트 하나만 안 된다
  검증: llms.txt 와의 차이가 0개인지
```

넷 중 실제로 고르는 것은 Codex 하나뿐이다. opencode 는 `.md` 를 쓰면 고를 것이 없어지고,
빈 탭은 규칙 하나를 더하는 것이며, Vibe Kanban 은 JSON 을 그대로 써서 아무것도 하지 않는다.

## 수집기 — scripts/ (2026-08-21 완성 · 첫 회차 실행 완료)

bun TypeScript + Zod. 저장소 루트의 `package.json`·`bun.lock` 과 `node_modules`(zod 하나)를 쓴다.
`bun install` 뒤 `scripts/sync.ts` 한 번이 한 회차다. 첫 회차는 2분 2초에 문서 876개를 받았다.

```yaml
실행 파일:
  sync.ts:            한 회차. 사이트마다 계층 → 경로 → 본문(메모리) → 검사 → 통과하면 저장·삭제·.manifest.json·
                      llms-local. 하나라도 실패면 exit 1 — CI 가 커밋하지 않는다.
                      --site "<제품폴더>" 반복 가능 · --dry 쓰지 않음 · --accept 구조 변화 허용
  commit-each.sh:     CI 의 커밋 단계. 바뀐 문서마다 커밋 하나 — 제목 "<제품 폴더>: <문서 제목>" (+ 추가/삭제),
                      본문은 .manifest.json 에서 찾은 공식 URL. 문서 아닌 것은 끝에 "sync: manifests" 한 커밋.
                      변경 목록은 git status --porcelain -z 로 뽑는다 (git add -A -N 은 삭제를 스테이지해 첫 커밋에 섞였다)
  make-tree.ts:       계층 JSON 파일로 폴더만 만든다 (디버그용)
  make-llms-local.ts: 계층 JSON 파일로 llms.txt · llms-local.txt · CLAUDE.md 만 만든다 (디버그용)
모듈:
  contracts.ts:  Zod 스키마 전부 — 계층 노드 · Codex 파서 출력 · 사이트 설정 · llms 링크 줄 · 매니페스트
  types.ts:      z.infer 타입만
  sites.ts:      사이트 설정 8벌(제품폴더 · 진입 · 파서 · base · llms · 기대최상위 · contentType · href정규화)과
                 문서키()/문서URL() — 계층 href 와 llms URL 을 같은 꼴로 맞추고 .md 주소를 만든다
  tree.ts:       경로계산() — 번호 · 금지 문자 · 형제 충돌 규칙으로 제품 폴더 기준 상대 경로를 낸다
  nav.ts:        계층뽑기() — 설정의 파서를 spawn 해 공통 계층으로. 그룹수()/문서수()
  fetch-docs.ts: 본문수집() — 동시 6개로 .md 를 받아 메모리에 둔다. 디스크에 쓰지 않는다
  check.ts:      검사() — 실패 사유 목록을 돌려준다
  llms-local.ts: llmsLocal생성() — 세 파일의 내용을 만들어 돌려준다. 쓰지 않는다
파서 (scripts/parsers/ — 조사 산출물을 옮긴 것):
  mintlify-nav.ts(한 페이지) · mintlify-full.ts(탭 순회) · starlight-nav.ts · codex-nav.ts(한 페이지) · codex-full.ts(탭 순회)
  mintlify-full.ts 에 빈 탭 규칙이 들어 있다 — 재요청한 탭에 문서가 0개면 탭 진입 페이지를 그 탭의 문서로 (Tavily Home → 010 Home.md)
```

"메모리에 받고 검사 뒤에 쓴다"로 만든 이유는, 검사에 걸렸을 때 작업 폴더가 반쯤 바뀐 상태로 남지 않게
하려는 것이다. 검사에 걸린 사이트는 디스크를 전혀 건드리지 않는다.

본문 주소는 `base + 문서키(href) + ".md"` 다. 404 면 `/index.md` 를 한 번 더 본다 (Starlight 가 루트 문서를
`/docs/index.md` 로만 낸다 — opencode Intro 가 이것으로 받아진다). 최종 URL 의 호스트가 바뀌면 외부
리다이렉트로 보고 받지 않는다 (Tavily Help → help.tavily.com).

### llms-local.txt 의 규칙

공식 llms.txt 의 제목·설명·섹션은 한 글자도 바꾸지 않고 **링크 괄호 안의 URL 만** 이 폴더 기준 상대
경로로 바꾼다. 경로에 공백이 있어 `(<010 Getting started/010 Overview.md>)` 꼴로 `<>` 를 감싼다. 절대경로를
쓰지 않는 이유는 GitHub 에 올라가는 파일이라 다른 기기에서 clone 하면 전부 죽기 때문이다.

```yaml
매칭 키: 쿼리(?surface=cli) 제거 → href정규화 → .md 와 끝 슬래시 제거. 정확히 없으면 /index 를 뗀 표기로
       한 번 더 (Claude Code 의 /en/whats-new/index 가 이것으로 붙는다)
치환 안 되는 줄:
  URL 이 base 밖:            줄 끝 "(외부 링크)"
  base 안인데 메뉴에 없음:   줄 끝 "(메뉴 미노출 · 로컬 없음)" — URL 은 그대로
  메뉴에 있으나 못 받음:      줄 끝 "(메뉴에 있으나 받지 않음: <이유>)" — Exa Blog 가 이 줄이 된다
  메뉴에만 있음:             파일 끝 "## 메뉴에만 있는 문서" 절에 설명문 없이
  같은 문서가 메뉴 두 곳:     첫 경로로 치환하고 "(같은 문서가 메뉴 다른 곳에도: <경로>)" (Tavily OpenClaw)
llms.txt 없는 3곳:  Claude Code (ko) · opencode 둘 — 계층에서 만들어 설명문이 없다
Codex 정본:        sites.ts 에서 base 를 https://learn.chatgpt.com/docs 로, href정규화로 /codex 접두사를 떼어
                  표현한다. "/docs 로 정규화" 결정과 같은 효과다
```

## 검사 — check.ts 가 막는 것

```yaml
항상:
  최상위 수 ≠ sites.ts 기대최상위   → 실패 (탭이나 사이드바 제목이 바뀌었다. 맞으면 기대값을 고친다)
  받은 문서 0개                    → 실패
  제외가 전체의 10% 이상           → 실패 (사이트가 .md 를 막았거나 주소 규칙이 바뀌었다)
직전 .manifest.json 이 있을 때:
  문서 수가 10% 넘게 줄었다         → 실패
  그룹 수가 달라졌다               → 실패 (계층이 납작해졌을 때 개수 대조로는 안 잡히므로 이것으로)
  같은 href 의 경로가 바뀐 것 > max(10, 10%) → 실패 (번호 밀림·표시명 규칙 변화가 실제 diff 를 덮는다)
  llms 와 메뉴의 차이가 2배 넘게·5개 이상 늘었다 → 실패 (추출이 깨졌을 수 있다)
--accept:  위에서 "구조"에 속하는 것(최상위 수 · 그룹 수 · rename · llms 급증)을 경고로 낮춘다.
          사이트가 메뉴를 실제로 바꿨을 때 사람이 확인하고 한 번 돌리는 용도. workflow_dispatch 의 accept 입력이 이것이다
```

첫 회차 기준값 (2026-08-21 실측 — .manifest.json 에 그대로 들어 있다):

```yaml
                      메뉴   받음   제외   최상위  그룹   llms 치환/미노출/외부/메뉴에만
Claude Code (en)      183    183    0      8      50     183 / 3 / 0 / 0
Claude Code (ko)      165    163    2      8      47     (llms 없음) 163
Exa                   163    163    1      3      48     163 / 25 / 0 / 0   ← Blog 는 "받지 않음" 줄
Tavily                103    102    1      8      29      97 / 2 / 3 / 4
Vibe Kanban            58     58    0      7       9      58 / 0 / 0 / 0
opencode (en)          36     36    0     10       3     (llms 없음) 36
opencode (ko)          36     34    2     10       3     (llms 없음) 34
Codex                 139    138    2      6      38     140 / 5 / 5 / 2
```

### 받지 않은 문서 7건 — 전부 사이트 쪽 사정이다

```yaml
Exa Blog:                    /reference/blog.md 가 text/html 67,815b — 블로그 랜딩. 설계대로 걸렸다
Tavily Help:                 /documentation/help.md 가 help.tavily.com 으로 리다이렉트 — 외부 도움센터
Claude Code (ko) 변경 로그:   /docs/ko/changelog.md 가 text/html 200 — 한국어 changelog 는 Markdown 이 없다 (영어는 있다)
opencode (ko) Policies·References: /docs/ko/policies.md · references.md 가 404 — 영어 .md 는 200. 한국어 메뉴가 미번역 문서를 싣고 있다
Codex Home:                  /docs.md · /docs/index.md 둘 다 404 — 루트 페이지의 Markdown 이 없다
Codex Changelog:             /docs/changelog.md 404 (HTML 페이지는 1.8MB 로 200) — Markdown 이 없다
```

영어 본문을 한국어 폴더에 대신 넣지 않는다. 그 폴더는 "한국어 사이트의 상태"를 기록하는 곳이다.

## 이 컴퓨터에서만 필요한 설정 — md 표 필터 끄기

이 컴퓨터의 git 전역 필터 `krtable` 이 `*.md` 의 표를 커밋 시 변환한다. 이 저장소의 `.md` 는 외부 문서의
원문 사본이라 한 글자라도 바뀌면 diff 가 오염되고, 필터가 없는 CI 와 매 회차 충돌한다. 실측 — 필터가 켜진
상태에서 받은 문서를 `git add` 하니 인덱스 내용이 작업 파일과 달랐고, 끄니 같아졌다.

```yaml
조치: .git/info/attributes 에 "*.md -filter" 한 줄 (2026-08-21). 전역 CLAUDE.md 가 허용한 최후 수단이다
주의: .git/info/ 는 커밋되지 않는다. 이 저장소를 다시 clone 하면 같은 줄을 다시 넣어야 한다.
     확인은 git check-attr filter -- "<아무 .md>" 가 "filter: unset" 이면 된다
```

## 수집기가 지키는 조사 결론

세 판의 조사가 실제로 겪은 오류에서 나온 것들이고, 전부 파서나 수집기에 들어가 있다. 근거는 REPORT-3.

```yaml
sidebarTitle 우선:   mintlify-nav.ts — 있으면 그것을, 없으면 title. 화면 표시명과 폴더명이 같아진다
접힘 표현 두 갈래:   Mintlify 는 JSON 중첩, Astro 2곳은 details/summary. 파서가 각각 계층으로 읽는다
Codex 숨김 탭 제거:  codex-nav.ts — data-site-visibility-exclude="chatgpt-docs" 인 a 를 거른다 (8 → 6)
범위 좁히기:        starlight-nav.ts 는 ul.top-level 만 · mintlify-nav.ts 는 global.anchors 를 안 낸다
가짜 문서:          fetch-docs.ts 의 content-type · HTML 본문 · 외부 리다이렉트 검사
요청 횟수:          opencode 언어당 1회 · Exa 1회 · Vibe Kanban 1회 · Claude Code 8회 × 2 · Tavily 8회 · Codex 6회
```

## 조사 보고서 (경위)

경로는 이 저장소 루트 기준이다 — 공개 저장소라 이 컴퓨터의 절대경로(계정명 포함)를 파일에 남기지 않는다.

```yaml
docs-nav-probe/agent-browser/REPORT-3.md
  정본 843줄. 6곳 × 16항목 — 프레임워크 · JSON 키와 셀렉터 · 계층 표현 · 접힘 방식 · 함정
docs-nav-probe/curl-bun/
  REPORT.md(1판) · REPORT-2.md(2판) · compare.ts. 파서 5개는 scripts/parsers/ 로 옮겼다
docs-nav-probe/ 는 .gitignore 로 제외돼 있다 — 보고서에 이 컴퓨터의 경로와 브라우저 실행 파일 위치가 들어 있어서다
```

## 없앤 것 — Claude Code Releases/

2026-07-12 설계의 별도 폴더(GitHub 의 CHANGELOG.md)는 없앴다. 문서 사이트 메뉴의 Changelog 문서
(`Claude Code Docs (en)/010 Getting started/010 Getting started/030 Changelog.md`)가 같은 출처에서 생성되고
(본문에 "generated from the CHANGELOG.md on GitHub"), 버전마다 날짜까지 붙어 있어 상위 집합이다.
한국어 폴더에는 넣지 않는다 — 사이트가 한국어 changelog .md 를 안 준다(text/html). 영어를 대신 넣지 않는 원칙 그대로.

## 남은 것

```yaml
CI:              Sync docs 워크플로가 3시간마다 돈다. 첫 실행(2026-08-20T20:21Z)은 통과했고 바뀐 문서 2개만 커밋했다
과거 이력 재작성: 2026-07-12 설계에 있던 것 — 원본 2,996 커밋에서 문서 변경분만 골라 지금 경로표로 소급.
                 보류. 하면 별도 브랜치에서
.claude/ 폴더:    원본에서 온 빈 껍데기. settings 는 .gitignore 에 있다
```
