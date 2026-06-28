# Perspective Mind AI

Marketing landing page for [Perspective Mind AI](https://perspectivemind.ai) — a static site promoting Two-Factor Knowledge Validation for educational institutions.

## GitHub Pages deployment model

This project does **not** use GitHub Actions or a `/docs` folder. Deployment works like this:

1. **GitHub Pages serves the repository root** of the `main` branch.
2. A **`CNAME`** file at the repo root maps the site to the custom domain `perspectivemind.ai`.
3. **Built site files are committed at the repo root** alongside source files (`index.html`, hashed JS/CSS bundles, `img/`, `videos/`).
4. Pushing to `main` updates the live site.

### Required GitHub repository settings

In **Settings → Pages**:

| Setting | Value |
|---------|-------|
| Source | Deploy from a branch |
| Branch | `main` |
| Folder | `/ (root)` |

The `CNAME` file must remain at the repo root and must not be overwritten by the build.

## Project structure

```
perspectivemind/
├── src/                    # Source files — edit these
│   ├── index.html          # Page markup (Webpack template)
│   ├── css/styles.css      # Site styles
│   ├── js/script.js        # Client-side behavior
│   ├── img/                # Images copied into the build
│   └── videos/             # Videos copied into the build
├── dist/                   # Webpack output (gitignored, intermediate only)
├── index.html              # Built page (committed, served by GitHub Pages)
├── main.[hash].js          # Built JavaScript bundle (committed)
├── styles.[hash].css       # Built CSS bundle (committed)
├── styles.[hash].js        # Empty CSS entry chunk (committed)
├── img/                    # Built/copied images (committed)
├── videos/                 # Built/copied videos (committed)
├── CNAME                   # Custom domain for GitHub Pages
├── webpack.config.js       # Build configuration
├── package.json            # npm scripts and dependencies
└── README.md
```

### Source vs deployed files

| Location | Role |
|----------|------|
| `src/` | **Authoring** — all content and style changes start here |
| `dist/` | **Intermediate** — Webpack output; gitignored; not deployed directly |
| Repo root (`index.html`, `*.js`, `*.css`, `img/`, `videos/`) | **Deployed** — what GitHub Pages actually serves |

Do not edit root-level `index.html` or hashed bundle files by hand. They are regenerated on every build.

## Build pipeline

The build is a two-step process defined in `package.json`:

```
npm run build
  ├── webpack          → writes optimized output to dist/
  └── npm run copy-dist → copies dist/**/* to repo root
```

### Step 1: Webpack (`webpack.config.js`)

Webpack reads from `src/` and writes to `dist/`:

- **Entry points:** `src/js/script.js` and `src/css/styles.css`
- **HTML:** `HtmlWebpackPlugin` processes `src/index.html`, injects hashed bundle references, and minifies the output
- **Assets:** `CopyPlugin` copies `src/img/` → `dist/img/` and `src/videos/` → `dist/videos/`
- **Optimization:** CSS and JS are minified; filenames include content hashes for cache busting (e.g. `main.8a1bc2a0….js`, `styles.96c45c92….css`)
- **Clean output:** `output.clean: true` wipes `dist/` before each build

### Step 2: Copy to root (`copy-dist`)

```bash
copyfiles -u 1 "dist/**/*" .
```

The `-u 1` flag strips the `dist/` prefix, so `dist/index.html` becomes `./index.html`, `dist/img/…` becomes `./img/…`, and so on. This places the deployable site at the repo root where GitHub Pages expects it.

`dist/` itself is listed in `.gitignore` and is never committed.

## npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `webpack serve --open` | Local dev server with hot reload (serves from `dist/`) |
| `npm run watch` | `webpack --watch` | Rebuild to `dist/` on file changes (no copy to root) |
| `npm run build` | `webpack && npm run copy-dist` | Production build + copy to repo root |
| `npm run copy-dist` | `copyfiles -u 1 "dist/**/*" .` | Copy `dist/` contents to root only |

## Local development

```bash
npm install
npm start
```

This starts `webpack-dev-server`, opens the browser, and serves the site from `dist/`. Changes to files in `src/` hot-reload automatically.

To preview exactly what will be deployed (including the copy-to-root step):

```bash
npm run build
npx serve .
```

## Deploying to GitHub Pages

After making changes in `src/`:

```bash
npm run build
git add src/ index.html *.js *.css img/ videos/
git commit -m "Describe your change"
git push origin main
```

GitHub Pages picks up the new root-level files within a minute or two.

### Deployment checklist

1. Edit files under `src/` only (not root `index.html` or hashed bundles).
2. Put new images in `src/img/` and videos in `src/videos/` so Webpack copies them.
3. Run `npm run build`.
4. Commit both source changes (`src/`) and built artifacts (root `index.html`, bundles, `img/`, `videos/`).
5. Push to `main`.
6. Do not delete or modify `CNAME`.

## Important notes and gotchas

### Stale hashed bundles

`copy-dist` **overwrites** files in the repo root but does **not delete** old hashed bundles from previous builds. After a build that changes CSS or JS hashes, remove orphaned files manually before committing, for example:

```bash
# After build, check for old bundles no longer referenced by index.html
git status
```

If `index.html` references `styles.96c45c92….css` but `styles.2a2bcab8….css` still exists at the root, delete the old file.

### Assets must live in `src/`

Only files under `src/img/` and `src/videos/` are copied into each build. If an asset exists only at the repo root (e.g. `img/logo.svg`) but not in `src/img/`, a fresh clone followed by `npm run build` will **not** include it. Keep all referenced assets in `src/`.

### `dist/` is not deployed

The `dist/` folder is a build artifact. GitHub Pages serves the repo root, not `dist/`. Always run the full `npm run build` (which includes `copy-dist`) before pushing.

### No CI/CD

There is no GitHub Actions workflow. Deployment is manual: build locally, commit artifacts, push. Anyone contributing should follow the deploy steps above.

## Tech stack

- Static HTML landing page
- [Bootstrap 5](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/) (CDN)
- [Webpack 5](https://webpack.js.org/) for bundling, minification, and asset copying
- Google Analytics (GA4) and Iubenda cookie consent (embedded in `src/index.html`)

## Live site

- **Production:** https://perspectivemind.ai
- **GitHub repository:** https://github.com/yiyubruceliu/perspectivemind
