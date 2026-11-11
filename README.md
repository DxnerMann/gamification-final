# StudyGarden — Gamification Final

Interactive Apple-style poster / presentation for **StudyGarden**  
(“Grow your knowledge — one seed at a time.”)

## Repo layout

| Folder | Purpose |
|--------|---------|
| [`presentation-slides/`](presentation-slides/) | Interactive talk deck (hero → 13 sections → **full summary poster**) |
| [`demo-app/`](demo-app/) | Placeholder for an optional product demo (empty for now) |

Root [`index.html`](index.html) redirects to the slides (handy for GitHub Pages).

## Open locally

```bash
# Option A — double-click
open presentation-slides/index.html

# Option B — static server
python3 -m http.server 8080
# then http://localhost:8080/presentation-slides/
```

## Present

1. Open the slides.
2. Press **P** (or click **Present**) for full-bleed / fullscreen.
3. Navigate with **← →** or **↑ ↓** (also Prev / Next in the top bar).
4. Last slide is the **full summary poster** (all 13 sections at a glance). Press **End** to jump there.

## Share a link (GitHub Pages)

Yes — this repo is set up as a static site.

1. Push to `main` on GitHub.
2. Repo **Settings → Pages**:
   - Source: **GitHub Actions** (workflow already included), **or**
   - Source: **Deploy from a branch** → `main` / `/ (root)`.
3. After the first deploy, the public URL is:

   `https://dxnermann.github.io/gamification-final/`

   (opens the slides via the root redirect)

If the repo is **private**, enable Pages on your plan (GitHub Pro / education) or make the repo public for free Pages hosting.
