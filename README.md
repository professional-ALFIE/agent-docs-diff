# agent-docs-diff

공식 문서 사이트를 3시간마다 받아 커밋으로 쌓는다. 문서가 바뀌면 이 저장소의 커밋 diff 가 곧 변경 내역이다.
**왼쪽 메뉴 계층을 폴더 구조로 그대로 보존**하므로, 폴더를 열면 공식 사이트의 메뉴 순서 그대로 보인다.

| 제품 폴더                            | 출처                               | 문서 수         |
| ────────────────────────────ーーーー | ──────────────────────────────ーー | ─────────ーーー |
| Claude Code Docs (en) · (ko)　　　　 | https://code.claude.com/docs　　   | 183 · 163　　　 |
| Exa Docs　　　　                     | https://exa.ai/docs　　            | 163　　　       |
| Tavily Docs　　　　                  | https://docs.tavily.com　　        | 102　　　       |
| Vibe Kanban Docs　　　　             | https://vibekanban.com/docs　　    | 58　　　        |
| opencode Docs (en) · (ko)　　　　    | https://opencode.ai/docs　　       | 36 · 34　　　   |
| Codex Docs　　　　                   | https://learn.chatgpt.com/docs　　 | 138　　　       |

각 제품 폴더 안의 `llms-local.txt` 가 문서 지도다 — 공식 `llms.txt` 의 제목·설명은 그대로 두고
링크만 그 폴더 기준 경로로 바꾼 것이라, 줄을 찾으면 그 파일을 바로 열 수 있다.

폴더와 파일 앞의 번호(`010`, `020`)는 공식 메뉴의 순서다. 간격을 둔 것은 새 항목이 중간에 끼어도
뒤가 밀려 rename 되지 않게 하려는 것이다. 이름은 공식 표시명 그대로이고, 파일시스템 금지 문자만 `-` 로 바꾼다.

## 돌리는 법

```bash
bun install
scripts/sync.ts                      # 8벌 전부
scripts/sync.ts --site "Exa Docs"    # 한 곳만
scripts/sync.ts --dry                # 쓰지 않고 결과만
```

탭·그룹 수·경로가 크게 바뀐 것(사이트 개편)은 자동으로 받아들이고, 무엇이 바뀌었는지를
`sync: manifests (구조변화 수용)` 커밋 본문에 남긴다.

검사를 하나라도 통과하지 못한 사이트는 디스크를 건드리지 않고, 끝에 하나라도 실패면 exit 1 이라
GitHub Actions 가 커밋하지 않는다. 통과하면 `scripts/commit-each.sh` 가 **바뀐 문서마다 커밋 하나**를 만든다 —
제목은 `<제품 폴더>: <문서 제목>`, 본문은 그 문서의 공식 URL 이라 커밋 목록이 곧 변경 로그다. 무엇을 검사하는지와 왜 그렇게 정했는지는 `CLAUDE.md` 에 있다.

## 어떻게 받는가

브라우저 없이 `curl` 수준의 요청만 쓴다. 계층은 사이트 프레임워크마다 다른 곳에서 읽는다 —
Mintlify 4곳은 HTML 에 박힌 navigation JSON, opencode(Astro Starlight)와 Codex(Astro 자체 테마)는
사이드바 HTML 태그. 본문은 문서 URL 뒤에 `.md` 를 붙여 받고, `content-type` 이 Markdown 이 아니면
문서가 아닌 것으로 보고 뺀다 (`.manifest.json` 의 `제외` 에 이유와 함께 남는다).

## 라이선스

문서 내용의 저작권은 각 사이트 운영사에 있다. 이 저장소의 스크립트는 LICENSE 를 따른다.
