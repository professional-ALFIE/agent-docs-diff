#!/usr/bin/env bash
# 바뀐 문서를 하나씩 커밋한다 — 커밋 목록이 곧 변경 로그가 되게.
# 제목: "<제품 폴더>: <문서 제목>" (+ 추가/삭제 표시). 본문: 그 문서의 공식 URL.
# 문서가 아닌 것(.manifest.json · llms.txt · llms-local.txt · CLAUDE.md)은 끝에 한 커밋으로 묶는다.
set -euo pipefail
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

url_of() {  # $1 = 제품 폴더, $2 = 제품 폴더 기준 경로. 새 manifest 에 없으면(삭제된 문서) 직전 커밋의 manifest 에서
  local m="$1/.manifest.json" prev=""
  git show "HEAD:$1/.manifest.json" > /tmp/prev-manifest.json 2>/dev/null && prev=/tmp/prev-manifest.json
  bun -e 'const p = process.argv[3]; for (const f of [process.argv[1], process.argv[2]]) { if (!f) continue;
          const m = await Bun.file(f).json().catch(() => null); if (!m) continue;
          const d = [...m.문서, ...m.제외].find(d => d.경로 === p); if (d) { console.log(d.url); break; } }' \
      "$m" "$prev" "$2" 2>/dev/null || true
}

n=0
# 스테이지를 건드리지 않고 변경 목록을 뽑는다. (git add -A -N 은 삭제를 실제로 스테이지해 첫 커밋에 딸려 들어갔다)
# porcelain -z 한 항목 = "XY<공백>경로\0"
while IFS= read -r -d '' entry; do
  xy="${entry:0:2}"; path="${entry:3}"
  case "$xy" in '??') status=A;; *D*) status=D;; *) status=M;; esac
  case "$path" in *.md) ;; *) continue ;; esac
  base="${path##*/}"
  case "$base" in [0-9][0-9][0-9][\ _]*|[0-9][0-9][0-9][0-9][\ _]*) ;; *) continue ;; esac
  product="${path%%/*}"
  rel="${path#*/}"
  title="${base#*[\ _]}"; title="${title%.md}"
  case "$status" in A) tag=" (추가)";; D) tag=" (삭제)";; *) tag="";; esac
  url="$(url_of "$product" "$rel")"
  git add -A -- "$path"
  if [ -n "$url" ]; then git commit -q -m "${product}: ${title}${tag}" -m "$url"
  else git commit -q -m "${product}: ${title}${tag}"; fi
  n=$((n+1))
done < <(git status --porcelain=v1 -z --untracked-files=all --no-renames)

git add -A
if ! git diff --cached --quiet; then
  sc=/tmp/agent-docs-diff-structure-changes.txt
  if [ -s "$sc" ]; then
    git commit -q -m "sync: manifests (구조변화 수용)" -m "$(cat "$sc")" -m "$(git diff --cached --stat | tail -1)"
  else
    git commit -q -m "sync: manifests" -m "$(git diff --cached --stat | tail -1)"
  fi
  n=$((n+1))
fi
echo "커밋 ${n}개"
