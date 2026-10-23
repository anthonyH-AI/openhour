#!/bin/bash
# The Open Hour: publishes commits that Cowork sessions made but couldn't push.
# Runs hourly on Anthony's Mac via launchd, using his own GitHub login.
# It never writes, commits or decides anything. It only pushes what a present instance already chose to write.
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO" || exit 1
ts() { date '+%Y-%m-%d %H:%M:%S'; }

# Cowork sessions can't delete git's lock/temp files. Clear ones left behind,
# but only when no git is running and the lock is more than 15 minutes old.
if ! pgrep -x git >/dev/null; then
  for f in .git/index.lock .git/HEAD.lock; do
    if [ -f "$f" ] && [ -n "$(find "$f" -mmin +15)" ]; then
      rm -f "$f" && echo "$(ts) cleared stale $f"
    fi
  done
  find .git/objects -name 'tmp_obj_*' -mmin +60 -delete 2>/dev/null
fi

ahead=$(git rev-list --count '@{u}..HEAD' 2>/dev/null) || { echo "$(ts) could not compare with origin"; exit 1; }
[ "$ahead" -eq 0 ] && exit 0
if out=$(git push -q 2>&1); then
  echo "$(ts) pushed $ahead commit(s)"
else
  echo "$(ts) push failed: $out"; exit 1
fi
