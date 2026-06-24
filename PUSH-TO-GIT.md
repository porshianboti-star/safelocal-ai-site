# Push SafeLocal.ai to your Git repo

The site, the SEO files, and `SafeLocal-Project-Handoff.md` are all ready to commit. The push has to run **from your own Mac** (it has network access + your Git credentials).

> Note: a `.git` folder was created automatically but, due to how the project folder is mounted, it's not clean. The steps below delete it and start fresh — the safest path.

## One-time push (copy–paste into Terminal)

```bash
cd "/Users/motty/Claude/Projects/SafeLocal.ai (1)"

# 1. Start a clean repo
rm -rf .git
git init
git add -A
git commit -m "SafeLocal.ai: bilingual site, vs/ comparison pages, Hebrew funnels, SEO foundation (sitemap/robots/og) + project handoff"

# 2. Point at your repo and push
git branch -M main
git remote add origin https://github.com/porshianboti-star/safelocal-ai-site.git
git push -u origin main
```

Use the SSH form instead if that's how you authenticate:
`git remote add origin git@github.com:porshianboti-star/safelocal-ai-site.git`

## If the remote already has commits

Pushing will be rejected (non-fast-forward). Pick one:

```bash
# Option A — merge the existing history in, then push
git pull origin main --allow-unrelated-histories
git push -u origin main

# Option B — overwrite the remote with this version (destructive)
git push -u origin main --force
```

## After the first push
Future updates are just:
```bash
git add -A && git commit -m "your message" && git push
```

---

Repo: **https://github.com/porshianboti-star/safelocal-ai-site** (already filled into the commands above).

If GitHub asks you to sign in during `git push`, use your GitHub username and a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens), or set up SSH keys.
