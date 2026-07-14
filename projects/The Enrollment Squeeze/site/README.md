# The Enrollment Squeeze

A static, interactive scrollytelling site for GitHub Pages.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder.

No Python server or build process is required. Plotly is bundled locally and the scroll behavior uses the browser IntersectionObserver API, so the site has no JavaScript CDN dependency.

## Local preview

Opening `index.html` directly may block local JSON files in some browsers. Run a small local server instead:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Current analytical status

- Demographic and state/county market layers are operational.
- International indicators use Open Doors 2025 and the Fall 2025 Snapshot.
- Institution enrollment inputs now use annual College Scorecard files through 2024–25. UGDS is undergraduate enrollment and GRADS is graduate enrollment.
- Finance inputs currently use an April 2022 Scorecard-derived snapshot.
- Undergraduate and graduate histories use separate balanced panels. `UGDS_NRA` is used only as undergraduate nonresident-alien exposure in a visible international scenario; it is not total international enrollment.
- The finance view is gross undergraduate tuition sensitivity: projected students changed multiplied by tuition per student. It is not realized net revenue or a full institutional budget forecast.
- The institutional ranking is **modeled exposure**, not a closure probability.

Before final publication, update institution enrollment and finance inputs using the June 10, 2026 College Scorecard release and FY2024 IPEDS finance/enrollment files.

## Project documentation

- `DATA_AUDIT.md` identifies the data already loaded and the fields still required for a defensible closure-risk layer.
- `BUILD_NOTES.md` explains the site architecture and why a custom scrollytelling build was used instead of StoryMapJS.
- `SOURCES.md` lists the public sources used in the current version.
