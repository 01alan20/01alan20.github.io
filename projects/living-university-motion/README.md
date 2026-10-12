# The Living University: scroll-driven enrollment story

Open `index.html` through the portfolio's local web server. Both portfolio cards open the animated website directly. Native scrolling drives six evidence sections and a closing chapter: degree demand, geographic projections, institutional trajectories, completion, connected support, economic value, and the adaptive university. There is no video player, narration, autoplay, or hosted dependency.

The active website uses `scroll.js` and `scroll.css`, with responsive DOM/SVG charts, sticky visuals, chapter navigation, reading progress, system light/dark themes, and reduced-motion support. `assets/story-data.js` contains the assembled evidence. Legacy player/export files are retained for provenance but are not loaded or linked by the experience.

Degree fields use two observed 2014/2024 endpoints from the existing bachelor-only Degree Economy extract. The annual major-trends CSV pools degree levels and is not used. Institutional lines use all 30 supplied annual observations. State projections are transcribed from WICHE's 2024 executive summary, Figure 3. The original source brief below is preserved for provenance; its video-production instructions do not define the current website delivery.

Verification: `node verify-scroll.mjs <path-to-playwright/index.mjs>` checks the actual featured-card click, changing scroll progress in all six visual chapters, active navigation, 51 state/DC tiles, 30 annual observations, 100 cohort dots, mobile overflow, reduced-motion rendering, and absence of video/audio requests. It saves desktop/mobile screenshots to `output/playwright/living-university/`. Serve the repository at `http://127.0.0.1:8765` before running.

## Original source handoff: Version 3

**27 narrated scenes in seven chapters.** This update replaces the 2016/2025 two-endpoint university comparison with observed fall enrollment in **every year from 2016 through 2025** for Harvard University, UNC Charlotte, and Salem State.

## Files
- `storyboard.md`: full production storyboard, including revised institution scenes S07A–S07E with annual motion cues.
- `script.md`: narration with 27 Explainroo scene IDs and synchronization markers.
- `video.json`: rendering and audio preferences.
- `data_contracts.json`: source declarations and annual data requirements.
- `data/institution_enrollment_2016_2025.json`: 10 observed headcounts, indices and year-over-year changes per institution, provenance, motion metadata.
- `data/institution_enrollment_2016_2025.csv`: wide-form observations for Canvas chart or review.
- `data/institution_enrollment_long.csv`: tidy long-form observations for analysis.

## Important methodological note
This v3 chart is fully annual with 30 observed headcounts, *not* interpolated from two endpoints. Harvard reports university-wide **degree-student** fall headcount; UNC Charlotte and Salem State use broader **fall enrollment headcount**. Within-institution indexed changes are valid descriptive trends, but the underlying populations are not perfectly standardized across institutions. For cross-institution analysis under a single definition, a separate IPEDS EF extract is recommended. Do not present growth/decline as evidence of specific university-policy causal impact.

## Implementation
Use https://github.com/vincentsch/explainroo and its AGENTS.md. The specific annual data package is prepared; custom `scenes.js`, voice synthesis, and MP4 rendering remain to be completed.
