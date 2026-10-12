# THE LIVING UNIVERSITY — MOTION STORYBOARD AND PRODUCTION BRIEF
Version: 3.0 | 11 October 2026 | Target: approximately 6–7 minutes; final running time follows synthesized narration

## 1. Mandate

Produce a polished 16:9 narrated motion explainer titled **The Living University: How Demand, Completion, and Value Are Reshaping Higher Education**. Use JavaScript/HTML Canvas with https://github.com/vincentsch/explainroo. This document is a storyboard and implementation brief, not a claim that video rendering has already occurred.

### Audience
Higher-education executives, enrollment and student-success leaders, analysts, prospective students, and general viewers interested in college outcomes.

### Core argument
Changes in awarded majors and demographic geography create external pressures. Three university trajectories reveal different institutional exposure to those pressures. After matriculation, an appreciable share of learners does not finish within six years. Institutional silos contribute potential friction. Well-designed end-to-end systems connect recruitment, academics, support, affordability, progression, careers, and alumni outcomes. Because financial exposure accumulates before completion, the economic value proposition makes institutional responsibility especially consequential.

### Rules for claim integrity
1. **Measured**: IPEDS awarded degrees and NSC national cohort figures are historical observations. Label period, population, and measure.
2. **Projected**: WICHE 2024 projections are scenarios, never observed 2041 outcomes. Label every projected scene.
3. **Illustrative**: Node diagrams, students encountering hypothetical obstacles, interventions, and trajectory changes demonstrate institutional design; they are not individual-level causal evidence or predicted improvement rates.
4. **BLS comparison**: Median group earnings by educational attainment are descriptive, not the return on college for an individual. Never compare the reported medians as a causal effect or promise.
5. **IPEDS nuance**: Completions are awards conferred, not incoming demand or student preference; a program's award count is a lagging proxy for changes in the field. The title 'What America Studies' is narrative shorthand; on-chart label MUST read 'Bachelor's degrees awarded'.
6. **Double counts**: Completions count awards rather than necessarily unique people. If using awarded majors, label units as awards, not individuals.
7. **Three-university comparison**: Compare Harvard University, UNC Charlotte and Salem State on a common 2016–2025 timeline. The annual series 2016–2025 is observed, with ten values per institution sourced from official institutional reports. Harvard counts degree students whereas UNC Charlotte and Salem State report broader fall headcount; display this scope limitation prominently and prefer IPEDS harmonization when ready. An enrollment trend does not establish why an institution grew or declined. Never imply Salem State's decline was caused by student-support failures without causal evidence.
8. **No invented trend**: 2016–2025 annual observations are now fully sourced. Animate transitions only BETWEEN these actual years. Do not invent additional historical data points, imply monthly updates, or label smooth animation as continuous measurement. 2016–2025 now has 10 actual points per institution.
9. **Time consistency**: historical major chart 2000–2024 in this first production, pending source extraction; do not substitute invented numbers or imply 2025 data if none has been verified.

## 2. Visual and audio system

- Canvas 1920 x 1080; 30 fps; 16:9; midnight theme; predominantly deep navy (#101827).
- Safe area: use `s.safe`, including a reserved caption band at the bottom. Large text at least 40px, titles 80–100px, sources 30–32px at 1080p; sources may be in a separate end-credit plate if too dense.
- Palette: progress/completion teal #2DD4BF; risk amber #E3B55C; interruption coral #F27C82; institutional services blue #6487F5; adaptation violet #B98CF5; neutral #E8EEF7.
- The recurring motif is a 2D circle of 6–9 px radius: demand -> mapped population -> cohorts -> student journeys -> financial ledger -> institutional feedback. Reuse size, color meanings, easing, and transitions.
- Use calm, restrained music, minimal sound effects, narration with captions. No confetti, excessive bouncing, camera shake, or video-game effects. Movement must correspond to data or explanation.
- Prefer persistent spatial composition: important screen titles top-left, source lower-left above captions, phase/timeline top-right, active central visualization, annotation rail on right when needed.
- Intro cards and final frame must be intelligible while paused. Avoid simultaneous text overlays, moving numbers and narration competing for attention.
- Use a subtle screen label (HISTORICAL / INSTITUTION-REPORTED / PROJECTION / ILLUSTRATION) in each major segment.

## 3. Full scene-by-scene storyboard

**Timing convention:** approximate durations include typical narration and short holds. Final duration comes from the generated voice; use `[#marker]` cues in `script.md`, never hardcode every action to an assumed number of seconds. Existing diagrams should persist across adjacent scenes using `at:-1` and a fade or cut, rather than sliding out and rebuilding.

### CHAPTER I: WHAT AMERICA STUDIES — approx. 55 seconds

#### S01 — Opening / The system is moving (~13 s)
- **Screen copy:** 'THE LIVING UNIVERSITY' (large); 'Demand • Completion • Value' (small); final question 'Can universities adapt?'
- **Start frame:** Twelve quiet particles against deep navy. The particles multiply and align into tracks.
- **Animation:** `#fields`: a handful becomes hundreds and condenses into horizontal data bars. `#question`: bars pause; headline draws in; camera gently zooms.
- **Story function:** Establish one continuous visual vocabulary. No statistics yet.
- **Transition:** The vertical bar positions become identical to the rows of S02.

#### S02 — The changing fields of awarded degrees (~17 s)
- **Screen copy:** 'U.S. BACHELOR’S DEGREES AWARDED'; year counter '2000 ... 2024'; 8 top major fields with actual current rankings and values.
- **Canvas:** Custom bar-chart race, no placeholder numerical values. Rank up to 8 with stable category colors; label values as awards and note 'Source: NCES IPEDS Completions'.
- **Animation:** `#race`: bars begin reordering with smooth interpolation between observed annual values; `#year`: year counter advances and chart settles on final year.
- **Implementation:** Precompute years, 2-digit CIP broad groups, counts, and labels in a clean JSON. For faster playback, map 25 data years to approximately 10–12 seconds with easing. Interpolate values and displayed ranks, and keep tick transitions legible. If categories cannot be harmonized accurately, use a shorter defensible period.
- **Transition:** Selected bars stop and their widths become share-of-total tracks in S03.

#### S03 — The difference between rank and share (~14 s)
- **Screen copy:** 'Rank ≠ share'; 'Share of bachelor's awards'; 'Awards measure completions'.
- **Canvas:** Bars transform to 100% share tracks. One or two fields highlighted to make precise changes visible.
- **Animation:** `#share`: convert total counts to share in percentages, using the same year and selected CIP groups. `#lag`: reveal the label 'A lagging measure of field demand'.
- **Evidence constraint:** Do not equate conferred degrees to applications, jobs, enrollments or interest. Call the observed pattern 'composition of awards'.
- **Transition:** Chosen fields contract into simple academic-program tiles.

#### S04 — Academic portfolio consequences (~11 s)
- **Screen copy:** 'Programs', 'Teaching capacity', 'Career pathways', 'Resource allocation'.
- **Canvas:** A stylized program-planning board with four labeled blocks connected to the bar-chart positions.
- **Animation:** `#portfolio`: blocks expand from current awards to an adaptive institutional portfolio. One row reallocates space and staffing with a dotted feedback arrow.
- **Label:** 'Institutional planning illustration'.
- **Transition:** Program tiles shrink to location dots over a U.S. map; this is a conceptual dissolve, NOT literal observed movement of students.

### CHAPTER II: WHERE DEMAND LIVES — approx. 45 seconds plus transition to chapter III

#### S05 — National geography (~14 s)
- **Screen copy:** 'THE GEOGRAPHY OF FUTURE DEMAND'; 'High-school graduates, U.S.'; 'WICHE 2024 projections'.
- **Canvas:** Simplified U.S. state shapes using preprojected path coordinates, no geographic distortions that affect interpretation. Colors encode percent change only after legend appears.
- **Animation:** `#map`: fade in state outlines; `#legend`: use a diverging legend centered on 0%, with region/state values from WICHE.
- **Constraint:** These are projected HIGH-SCHOOL GRADUATES, not college applicants or actual students traveling between states.
- **Transition:** Zoom from state choropleth to national index graph.

#### S06 — The aggregate contraction (~13 s)
- **Screen copy:** 'Peak: 2025 (projected)'; '2041: ~13% below peak'; 'PROJECTION'.
- **Canvas:** An index line set to 100 at forecast peak, declining toward approximately 87 in 2041. Use exact sourced data for plotted points and a dashed projected curve; percentage is WICHE headline figure.
- **Animation:** `#decline`: sweep timeline from 2025 to 2041, pull declining line and one teal/coral dot for endpoint.
- **Constraint:** The 2025 'peak' is a projection made in the WICHE 2024 report, not a verified actual peak as of production.
- **Transition:** Pull the graph into map annotations.

#### S07 — Uneven local impact (~14 s)
- **Screen copy:** '38 states: fewer graduates projected by 2041 than in 2023'; 'Local context matters'.
- **Canvas:** States highlight in three beats: shrinking, mixed, resilient/growing; show exact state classifications from WICHE once downloaded.
- **Animation:** `#states`: pulse states with projected declines, show 38-state count; `#response`: condense a shortlist of strategic levers (audience expansion, pathways, program mix) without presenting them as numerically guaranteed solutions.
- **Source:** WICHE 11th edition, baseline 2023 vs 2041; note differences from the 2025-peak-to-2041 headline baseline.
- **Transition:** Map zooms out into a three-institution U.S. case-study comparison (S07A).

#### S08 — Change of scale (~11 s)
- **Screen copy:** 'Admission is the beginning'; 'What happens after students start?'
- **Canvas:** Three university panels converge to a rectangular grid representing a fresh NATIONAL cohort. The case studies end before this national student sequence begins.
- **Animation:** `#enter`: anonymized conceptual dots follow soft curved paths into a generic institution; `#cohort`: the camera centers on a clean 10 x 10 grid.
- **Constraint:** Transition is conceptual and does not assert individual migration trajectories.
- **Transition:** Match cut to S09 100-dot grid.

### CHAPTER III: THREE INSTITUTIONS, THREE ENROLLMENT REALITIES — approx. 85–100 seconds

**Source of truth:** `data/institution_enrollment_2016_2025.json` / `.csv` (10 OBSERVED annual values for EACH institution, 2016–2025). This replaces all v2 endpoint-only placeholders. Animate 2016, 2017, ... 2025 in order. During interpolation between annual marks, display a smooth visual transition; values are only measured at the endpoints of each interval.

#### S07A — Three campuses, one annual clock (~15 seconds)
- **On-screen title:** 'Three universities. Ten years. Three trajectories.'
- **Subtitle:** 'Fall enrollment · 2016–2025 · Indexed to 2016 = 100'.
- **Canvas:** Zoom from US map to pins in Cambridge MA, Charlotte NC, Salem MA. Transform the pins into three aligned line-chart panels with the SAME x-axis year and normalized starting value 100. Small legends identify exact enrollment definitions.
- **Motion:** `#three` panels arrive; `#index` baseline line draws at 100; 2016 counts appear and the annual clock begins. No flat-line representation of unobserved years.
- **Time:** Advance the historical year clock at roughly 1.25 seconds per year once data is displayed.

#### S07B — Harvard: the full ten-year curve (~17 seconds)
- **Screen copy:** 'HARVARD', active fall year, live headcount, year-over-year change and 2016-index.
- **Verified counts:** 22,434; 22,947; 23,336; 23,731; 22,273; 25,126; 25,266; 24,596; 24,519; 24,317 for 2016→2025.
- **Motion:** At `#harvard`, draw each ANNUAL point and animate the years. Highlight the 2020 dip, 2021 rebound, and the 2022 peak. At `#context` reveal 'University-wide degree students, NOT Harvard College alone'.
- **Source:** Harvard OIRA 2025–26 historical enrollment, University Total, as of Oct 15.
- **Constraint:** Some 2020–21 changes reflect institutional reporting during the COVID period; do not claim a specific causal explanation without evidence.

#### S07C — UNC Charlotte: expansion and interruption (~17 seconds)
- **Screen copy:** 'UNC CHARLOTTE', active fall year, live headcount, YoY and index.
- **Verified counts:** 28,721; 29,317; 29,710; 30,615; 30,146; 30,448; 29,551; 30,298; 31,091; 32,207.
- **Motion:** `#charlotte` plots all ten points, highlighting growth to 2019, a modest 2020 dip, a 2022 dip and the 2023–25 recovery. `#pathways` shows neutral first-year and transfer components as contextual labels without fabricated stream widths.
- **Sources:** UNC System 2024 Fall Enrollment Report, Table 2 (2016–24), and UNC Charlotte fall 2025 official enrollment announcement.
- **Constraint:** 2025 is reported by the university, as IPEDS Fall Enrollment 2025 is not yet publicly released in Oct 2026.

#### S07D — Salem State: sustained contraction (~17 seconds)
- **Screen copy:** 'SALEM STATE', live year, fall headcount, YoY change, 2016 index. 'Active adaptation' later.
- **Verified counts:** 9,001; 8,702; 8,338; 7,706; 7,242; 7,131; 6,539; 6,239; 6,230; 6,009.
- **Motion:** `#salem` steps through every year with proportional annual decreases; 2023→24 displays a nearly flat but measured decline, not invented recovery. At `#response` show contextual institutional initiatives, separately labeled 'Response', never as a proven reversal.
- **Sources:** Salem State Fact Book enrollment 2016–20 and 2021–25, University Total.

#### S07E — All three curves, synchronized replay (~20 seconds)
- **Screen copy:** '2016 = 100' and '2025: Harvard +8.4% · Charlotte +12.1% · Salem −33.2%'.
- **Canvas:** Full-screen three-line indexed chart from all verified annual points; consistent axes (e.g. 60–120). Absolute headcounts may appear in a right-hand three-row live readout, and percent YoY below each institution.
- **Motion:** `#compare` resets all to 2016 and plots annual ticks simultaneously over 10–12 seconds, advancing year 2016→2025. At 2020, pause briefly to show a contextual 'Pandemic era' chapter marker. At 2022, highlight Charlotte's dip. 2025 resolves to final change badges. `#question` transitions to separate NATIONAL cohort.
- **Interpretive guardrails:** The chart shows enrollment evolution, not causation, selectivity, retention or student-success outcomes. Harvard's degree-student scope differs from Charlotte and Salem. Institutional missions differ. No synthetic or imputed annual values.
- **Transition:** Each line transforms into ONE generic dot that joins other neutral dots in the 100-student national cohort. Do not imply the 100 dots are sampled from these three institutions.

**On-screen disclosure (appears beneath all 3-line views):** 'Source: Harvard OIRA, UNC System/Charlotte, Salem State. Reporting scopes differ; indexed trends compare change within institutions.'

**Optional analytical overlays for later versions:** annual first-time entrants, transfer enrollments, degree awards, first-year retention, six-year completion, applications, admit/yield and undergraduate net price. Each requires its own annual series and stable denominator, and should NOT be drawn from the total enrollment data alone.

### CHAPTER IV: THE JOURNEY OF 100 — approx. 55 seconds

#### S09 — One hundred starters (~12 s)
- **Screen copy:** '100 college starters'; 'Fall 2019 national cohort'; 'Six-year observation'.
- **Canvas:** Exactly 100 equal-sized, individually numbered-in-data but unlabeled visible circles in 10 x 10 grid.
- **Animation:** `#dots`: fill 10 rows; `#time`: advance a simplified clock from entry to six years later; no specific year-by-year status trajectories are claimed.
- **Source:** National Student Clearinghouse, 2025 Yearly Progress and Completion; population includes beginning students across credential types and institutions.
- **Transition:** Grid begins categorizing by final outcome.

#### S10 — Six-year outcomes (~19 s)
- **Screen copy:** '61 completed'; '9 still enrolled'; '30 no longer enrolled' plus small note 'Rounded per 100; NSC fall 2019 starters'.
- **Canvas:** Exactly 61 teal, 9 amber, 30 coral dots; 3 labeled collections. Original statistics: 61.1%, 9.0%, 29.8%; rounded groups sum to 100.
- **Animation:** `#complete`: 61 move into a top/left cluster; `#continuing`: 9 move into second; `#stop`: 30 move into third; percentage text counts in on each beat. Allow final frame a full 1.5 seconds.
- **Crucial definition:** Completed = earned an undergraduate certificate/associate/bachelor's credential at any institution within six years. The remaining 30 were not enrolled at six years (not necessarily permanent non-completers). Do NOT say '39% dropped out' or '30% will never graduate'.
- **Transition:** Zoom in on three amber/coral particles as illustrative individuals.

#### S11 — Friction points (illustration) (~15 s)
- **Screen copy:** 'Financial pressure'; 'Course access'; 'Support delays'; obvious label 'ILLUSTRATIVE'.
- **Canvas:** Three pathways, each with one student dot meeting an obstacle. No fabricated prevalence rates.
- **Animation:** `#friction`: one price tag, one scheduling clash, one late advising flag appear sequentially; `#label`: text 'Possible friction points' appears, not 'causes of all dropouts'.
- **Transition:** Pull back to show the offices responsible for different touchpoints.

### CHAPTER V: THE UNIVERSITY AS A LIVING SYSTEM — approx. 90 seconds

#### S12 — The institutional network (~15 s)
- **Screen copy:** 'THE UNIVERSITY AS A LIVING SYSTEM'; label at most six nodes at one time.
- **Canvas:** Nodes for marketing/admissions, financial aid, registrar/scheduling, teaching, advising/academic support, wellbeing/belonging, careers/employer links, and alumni. Nodes can reveal in two phases to avoid crowding.
- **Animation:** `#nodes`: radial or layered network forms; `#connections`: draw lines that represent communication and handoffs. Student dots move between appropriate service nodes in logical order.
- **Transition:** Keep the positions fixed in S13–S16.

#### S13 — Where silos create friction (~15 s)
- **Screen copy:** 'Disconnected information'; 'Delayed action'; 'Repeated handoffs'.
- **Canvas:** Same persistent network as S12, with three connections temporarily dimmed or broken.
- **Animation:** `#break`: one at-risk dot pauses; a course scheduling conflict and a financial flag fail to pass to the coordinator; `#signal`: a warning reaches the network late. Show this as a deliberately hypothetical case, never a measured institution.
- **Transition:** Keep the same student and reveal the coordinated alternate route.

#### S14 — Coordinated support (~16 s)
- **Screen copy:** 'Detect → Assign → Act → Review'.
- **Canvas:** Same persistent network with a shared alert that flows to designated role owners. Include advisor, registrar, financial aid, and wellbeing touchpoints as needed.
- **Animation:** `#detect`: progress-monitoring signal glows amber; `#act`: linked team nodes respond with a subtle blue pulse; `#review`: risk flag status updates and student dot resumes a viable path. No claimed uplift percentage.
- **Leadership ideas:** early alert and predictive segmentation (subject to fairness and privacy review), clear case ownership, service SLAs, timely academic interventions, coordinated academic/financial support, closed-loop monitoring.
- **Transition:** The network collapses into five foundation pillars.

#### S15 — Five foundations (~16 s)
- **Screen copy:** 'Teaching', 'Study skills', 'Study spaces', 'Personal development', 'Professional development'.
- **Canvas:** Five evenly spaced structural tracks, each a pillar with two student dots passing through.
- **Animation:** `#teach`, `#skills`, `#space`, `#personal`, `#career`: build pillars one by one; each joins into a stable foundation under the same student pathway.
- **Constraint:** This is a proposed institutional-design framework, not an established causal five-factor formula.
- **Transition:** Five pillars become an integrated support lane behind a new 100-dot grid.

#### S16 — Counterfactual *concept* (not causal estimate) (~15 s)
- **Screen copy:** 'WITH COORDINATED SUPPORT'; 'ILLUSTRATIVE SCENARIO'; 'No modeled uplift claimed'.
- **Canvas:** Replay a small subsection of the at-risk cohort, rather than regressing the 2019 national results to a fake improved graduation rate.
- **Animation:** `#recover`: a few amber illustrative students move through documented support pathways; `#caution`: overlay 'Design scenario — outcomes require evaluation'.
- **Most important integrity rule:** Never show the national 61% automatically becoming 70%, 80% or 90% because offices were connected. Interventions are plausible design options that require proper evaluation against local outcome data.
- **Transition:** The student dot carries forward into a semester-by-semester financial ledger.

### CHAPTER VI: THE PRICE OF AN UNFINISHED DEGREE — approx. 70 seconds

#### S17 — Cost accumulates (~14 s)
- **Screen copy:** 'THE COST BEFORE COMPLETION'; 'Tuition + Living costs + Time'.
- **Canvas:** Semester ledger and a stacked total. Use neutral symbolic units or audited official College Scorecard variables for actual tuition/net price; avoid made-up dollars.
- **Animation:** `#ledger`: term cards stack and the total advances; `#balance`: cost clock pauses one semester before completion.
- **Constraint:** Forgone income cannot be assumed identical for all students and is not part of Scorecard published tuition. Keep explicit cost components separate.
- **Transition:** One ledger divides into three clearly hypothetical learner paths.

#### S18 — Divergent journeys, divergent exposure (~15 s)
- **Screen copy:** 'On-time completion'; 'Delayed completion'; 'Left without credential'; 'Illustrative pathways'.
- **Canvas:** Three paths start at the same admission point; time runs horizontally and cost accumulates vertically. Credential appears for two paths at different times; last path ends without credential during the observed period.
- **Animation:** `#paths`: draw three progressive curves; `#costs`: emphasize cost and completion timing, not fabricated earnings values. A graduate's earnings are not automatically a specific ROI.
- **Transition:** Paths morph to observed population earnings distribution bars.

#### S19 — Labor-market contrast (~18 s)
- **Screen copy:** 'U.S. median weekly earnings, 2025'; 'Bachelor’s degree: $1,578'; 'Some college, no degree: $1,062'; 'Descriptive, not causal'.
- **Canvas:** Only two horizontal comparison bars and two values in large typography; a bracket shows median difference as a descriptive observation if it does not clutter.
- **Animation:** `#bars`: grow BLS bars from zero at the same scale. `#note`: reveal 'Age 25+, full-time wage and salary workers'.
- **Source note:** BLS Education Pays 2025: data for ages 25+, full-time workers, 2025 eleven-month averages excluding October because of the government shutdown. 'Some college/no degree' is a general attainment category, not a matched set of college withdrawals; the two groups differ in other ways as well.
- **Transition:** Bars resolve into three learner questions.

#### S20 — The value question (~14 s)
- **Screen copy:** 'What will it cost?'; 'What supports completion?'; 'What happens if I leave?'
- **Canvas:** Three large accessible questions, one per beat. A single student dot sits to the left of each, visually connecting finance back to completion.
- **Animation:** `#question`: questions illuminate sequentially; earlier ledger number remains lightly visible behind the active question.
- **Transition:** Student dots travel back across the previous system diagram and turn into feedback signals.

### CHAPTER VII: DESIGNING THE FUTURE — approx. 35 seconds

#### S21 — The institutional feedback loop (~16 s)
- **Screen copy:** 'Measure → Respond → Learn → Improve'; supporting labels 'Demand', 'Experience', 'Progression', 'Completion', 'Careers'.
- **Canvas:** Five connected modules form a loop around a student flow. Academic demand, geography, progression, and economics return as miniature recognizable motifs (bars, map, 100 dots, ledger).
- **Animation:** `#loop`: draw moving light along the feedback loop; `#adapt`: small visual changes in program planning, support allocation, and pathway clarity update without any invented uplift figure.
- **Interpretation:** Enrollment leadership spans marketing and admissions, affordable onboarding, academic experience, student success, career outcomes and alumni feedback.
- **Transition:** Everything collapses to one stable, legible end frame.

#### S22 — Final vision (~14 s plus closing hold)
- **Screen copy:** 'THE LIVING UNIVERSITY'; beneath: 'From first interest to alumni'; small line: 'An adaptive system for student and institutional success'.
- **Canvas:** One continuous teal trajectory through five stages, with five quiet institutional-support nodes underneath. Source/end credits can be displayed after this frame or linked in video description.
- **Animation:** `#final`: trajectory completes and all motion slows to rest; hold final readable frame 2.4 seconds.
- **Final requirement:** No additional promotional call to action, slogan montage, or confusing diagram after this frame.

## 4. Data source and preparation contracts

**A. `data/majors.json`**
- Source: NCES IPEDS `Completions`, national, bachelor's awards by broad 2-digit CIP group, years 2000–2024 if comparable series can be reconciled.
- Format: `[{"year":2000,"cip2":"52","label":"Business","bachelors_awards":123456,"share":0.0,"source":"IPEDS"}]`.
- The numeric field is an illustrative schema placeholder, NOT a real observation. No placeholder may appear in final video.
- Reconcile CIP 2000/2010/2020 taxonomy revisions with official crosswalks; document aggregation and edge cases. Validate totals and prevent institution-level duplicate ingestion.
- Produce an additional `metadata.json` with data year, extraction date, scope (degree level), and harmonization rules.

**B. `data/wiche.json`**
- Source: WICHE 2024 `Knocking at the College Door`, report and downloaded state-level datasets.
- Format: `[{"state":"CA","baseline_year":2023,"projection_year":2041,"graduates_base":null,"graduates_projected":null,"change_pct":null}]`, plus `national_index` table with report-defined dates.
- No null value may be visualized as 0. Show data-suppressed/no-data regions in a neutral fill.
- Explain on-chart the different baselines for '13% from 2025 peak' versus '38 states compared to 2023'.

**C. `data/cohort.json`**
- Source: National Student Clearinghouse Research Center report published December 4, 2025, fall 2019 national starters; six-year results.
- Original: `{ "completed_pct": 61.1, "still_enrolled_pct": 9.0, "not_enrolled_pct": 29.8 }`.
- Visualization dots: 61/9/30, rounded for 100 dots, with exact percentages and rounding explanation in source notes.
- Do not produce per-year student movement statistics unless a validated year-by-year NSC cohort table has been independently extracted.

**D. `data/economics.json`**
- Source: 2025 U.S. BLS Education Pays publication.
- Values: `bachelors_weekly_median: 1578`, `some_college_no_degree_weekly_median: 1062`, `population: full-time wage-and-salary workers age 25+`, `observation_year: 2025`, `note: 11-month annual estimate excluding October 2025`.
- A separate College Scorecard dataset could add college-level net price, debt at withdrawal and completion, and field-specific earnings only when scopes/cohorts can be compared appropriately. Do not mix an institution's median debt with a national mean earnings value and label it individual ROI.

**E. `data/institution_enrollment_2016_2025.json` (INCLUDED)**
- **Observed data:** 30 verified institution-reported fall-enrollment points from 2016–2025, ten for each university.
- **Files:** `data/institution_enrollment_2016_2025.csv` (wide), `data/institution_enrollment_long.csv` (tidy), and `data/institution_enrollment_2016_2025.json` (all values, indices, YoY, source metadata and motion cues).
- **Reporting scope:** Harvard degree-student total as of October 15; UNC Charlotte and Salem broader total fall headcount. Charts MUST disclose this difference.
- **Normalize:** `100 * reported_headcount / fall_2016_headcount`. Calculate YoY as `(headcount_year / headcount_prior - 1)*100` and display n/a for 2016.
- **Animation:** Ten yearly data states. Use tweening only for visual smoothness between consecutive observations, never label an interpolated mid-point as a separate observed year.
- **Further comparability:** If needed, build an alternative using harmonized IPEDS Fall Enrollment fields for each of 2016–2024; IPEDS Fall Enrollment 2025 was not released as of Oct 2026. Retain this complete institution-reported 2016–2025 dataset as the declared source for v3.
- **Add other annual indicators only after verification:** first-time enrollment, retention (consistent cohort), awards, completion (consistent cohort horizon), admit/yield, or net price.

**F. `data/sources.json`**
- For every statistical scene: source organization, publication title, vintage, indicator, URL, methodology notes, and source slug.

Primary URLs:
- https://oira.harvard.edu/factbook/fact-book-enrollment/
- https://ir.charlotte.edu/wp-content/uploads/sites/871/2023/11/fb16012b.pdf
- https://ucomm.charlotte.edu/2025/09/03/september-3-2025-unc-charlottes-enrollment-surge-sets-another-record/
- https://www.salemstate.edu/sites/default/files/pdfs/CDS%20Enrollment%20and%20Persistence%202016-17.pdf
- https://records.salemstate.edu/sites/default/files/reports/2025-12/FY21-25_Fact_Book_Enrollment_WEB.pdf
- https://www.salemstate.edu/pdf/neche-report-2026
- https://nces.ed.gov/ipeds/use-the-data
- https://nces.ed.gov/ipeds/cipcode/resources.aspx?y=56
- https://www.wiche.edu/knocking/
- https://www.studentclearinghouse.org/news/college-completion-rates-hold-steady-at-recent-highs/
- https://collegescorecard.ed.gov/data/
- https://www.bls.gov/emp/tables/unemployment-earnings-education.htm

## 5. Explainroo implementation guidance

- First read the repository's current `AGENTS.md` and the example `examples/how-dns-works`.
- Set `video.json`: midnight, 16:9, 30 fps, clean caption area, calm music, minimal SFX, 1.0 pace, local Kokoro voice.
- Use `script.md` from this package without rewriting the facts; markers must match the `scenes.js` drawing cues.
- Implement one exported function per scene named exactly `s01-opening` etc. NOTE: hyphenated IDs require quoted object keys in JavaScript, e.g. `export default { 's01-opening'(s) { ... } }`.
- `s.draw({at:0}, (ctx,life)=>{...})` provides native HTML Canvas 2D access. Build custom rendering modules for dots, racing bars, state shapes, and finance tracks. Prefer the built-in `s.text`, `s.box`, `s.number`, `s.arrow`, and `s.icon` for labels, markers and diagram nodes because the Explainroo layout checker knows about those text elements.
- Use `s.mark('marker')`, `s.cue('phrase')`, `s.p(at,dur,ease)`, and `s.t` for deterministic time-based animation. Avoid retained global mutable state, arbitrary timers, `requestAnimationFrame` loops, random nondeterminism, and assumed narration timestamps.
- Every canvas frame must render correctly when requested out of order by the video renderer. Recompute particle positions from IDs and time; use stable IDs and preloaded JSON; no physics simulation that depends on the previous frame.
- Build animation helpers such as `lerp`, `easeInOut`, `drawCohort`, `drawBarRace`, `drawStateMap`, `drawNodeGraph`, and `drawLedger` as pure functions.
- Verify accessibility: no visual solely distinguished by color, give clusters text labels and values.
- Keep source labels and the same category color semantics across chapters. Display projected/hypothetical badges appropriately.
- The standard Explainroo output is a narrated MP4. An interactive website with scrubbers or clickable elements would be a separate product using the same Canvas drawing logic; Explainroo itself is not promised to generate a fully interactive browser application.

### Three-institution Canvas mechanics
- Keep each institution a persistent `InstitutionSeries` object with immutable data records, labels, source metadata, and a coherent color key.
- `s.draw({at:'#index'}, (ctx,life) => { ... })` renders charts at deterministic `s.t` or `s.p()` progress, with `s.mark()` narration cues; read the same local JSON on each frame, never mutate input data and never call live web APIs during render.
- **V3 full observed series:** draw all 10 real yearly values per institution. Animate each adjacent pair using the verified values and retain readouts for actual fall year, headcount, YoY and index. Do not create synthetic annual observations or smooth away observed inflections.
- A normalized index makes relative change comparable while raw headcounts remain visible as labels. Don't rank these schools by absolute enrollment, graduation quality or institutional success.
- Use a small citation slug in the safe area plus a source and methodology end card (or a companion website with notes); institution photo assets are optional and must be licensed or credited appropriately.
- Preserve the 2016/2025 comparator cards across scenes S07A–S07E with `at:-1` in repeated elements. Avoid a forced full-screen reset every 12 seconds.

## 6. Animation mechanics (implementation-level)

**Bar race**
- Compute the next and previous observation per category for selected display time; interpolate with `smoothstep` or cosine easing.
- Sort on interpolated values and independently ease the displayed Y rank to the next rank; do not snap vertical positions.
- Update year label only when a full year's values are visible; expose all values with matching years. No invented intermediate observations labeled as measured.
- Top eight rows maximum, separate a selected field's percentage share in S03.

**State map**
- Pre-project and simplify official state polygons to 2D Canvas path commands before scene drawing. Embed self-contained geometry or JSON. The renderer should never download live GIS data during video generation.
- Normalize to a trustworthy uniform color scale, maintain consistent legend, disable any 'movement arrows' not actually supported by migration data.

**Cohort dots**
- Stable IDs 0..99; ten columns by ten rows; precisely 61, 9, and 30 IDs in the outcome clusters. Assign colors by final six-year status only when S10 starts. Earlier years can display no implied category or a clock moving forward with final snap.
- Reuse a subset of dot IDs for S11–S16 illustrative cases, visibly relabel them 'Illustration' to separate from cohort data.

**Institution network**
- Stable, legible node locations across S12–S16; animate edges and shared alerts rather than moving the whole graph around.
- Distinguish observed cohort numbers (S10) from hypothetical support pathways (S11–S16).

**Economics**
- Use a timeline-based cost clock with variables for `net_price`, `terms`, `living_expenses` and optional debt. If data unavailable, omit dollar ticks and use conceptual labels.
- Show the 2025 BLS earnings chart as exactly two bars at correct proportional scales; mark descriptive scope.

## 7. Project layout and build commands

```text
videos/living-university/
  video.json
  script.md
  scenes.js                   # to be created by coding agent
  assets/                     # optional title/icons/backdrops
  data/
    institution_enrollment_2016_2025.json # INCLUDED, complete annual institution series
    institution_enrollment_2016_2025.csv  # INCLUDED, wide data
    institution_enrollment_long.csv       # INCLUDED, tidy data
    majors.json               # generated from IPEDS, NOT supplied here
    wiche.json                # generated from WICHE, NOT supplied here
    cohort.json               # provided in data_contracts.json
    economics.json            # provided in data_contracts.json
    sources.json              # primary-source metadata
  out/
```

Use the upstream commands:

```bash
git clone https://github.com/vincentsch/explainroo.git
cd explainroo
npm install
node bin/explainroo.js doctor --fetch
node bin/explainroo.js init videos/living-university --theme midnight --size 16:9 --title "The Living University"
# replace generated script.md and video.json with files in this package
# implement scenes.js and prepare validated data files
node bin/explainroo.js voice videos/living-university
node bin/explainroo.js check videos/living-university
node bin/explainroo.js still videos/living-university
node bin/explainroo.js sheet videos/living-university
node bin/explainroo.js render videos/living-university --draft
node bin/explainroo.js render videos/living-university
node bin/explainroo.js verify videos/living-university
```

## 8. Acceptance criteria

1. Six recognizable chapters, 22 aligned scene IDs, ~5 minutes at normal pace; no dead sections, cut-off narration, or unexpected black frames.
2. Both the national major animation and state geography use reproducible data, sound units and citation metadata; no fabricated chart numbers.
3. The 100-dot scene renders **61 completed / 9 still enrolled / 30 not enrolled** with correct labels, source and rounding qualification.
4. Intervention sequences clearly show **illustrative design**, not a promised numeric increase in completion.
5. Economic display compares the right BLS metrics and states its population; the film poses difficult questions without treating an earnings association as causal proof.
6. The final synthesis includes **full lifecycle**: marketing, admissions, affordability, teaching, student success, completion, employment and alumni.
7. At least one visual change every 2–4 seconds; avoid more than six simultaneous major elements; visually check all small on-screen text.
8. `check`, `sheet`, `render`, and `verify` are run and reviewed; every caption and statistic remains readable at 854-pixel player width.
9. Hold last frame long enough for comprehension. No second ambiguous ending.
10. A credible sources card or website description lists IPEDS, WICHE, NSC, BLS, and the caveats above.

## 9. Later extension (out of scope for first MP4)

Reuse pure Canvas drawing helpers in a separate browser presentation with section navigation, pause/play/scrub, click-to-explore major or state, and an interactive cohort simulator. That will require its own website implementation and is not a native Explainroo output.

## 7. Version 3 verified annual observations

Data file: `data/institution_enrollment_2016_2025.csv` (wide) and `data/institution_enrollment_long.csv` (long form). Ten actual observations per institution.

| Fall year | Harvard | UNC Charlotte | Salem State |
|---|---:|---:|---:|
| 2016 | 22,434 | 28,721 | 9,001 |
| 2017 | 22,947 | 29,317 | 8,702 |
| 2018 | 23,336 | 29,710 | 8,338 |
| 2019 | 23,731 | 30,615 | 7,706 |
| 2020 | 22,273 | 30,146 | 7,242 |
| 2021 | 25,126 | 30,448 | 7,131 |
| 2022 | 25,266 | 29,551 | 6,539 |
| 2023 | 24,596 | 30,298 | 6,239 |
| 2024 | 24,519 | 31,091 | 6,230 |
| 2025 | 24,317 | 32,207 | 6,009 |

**Reporting scope:** Harvard's degree-student headcount is not equivalent to Charlotte/Salem's broader reported total enrollment. Indexation standardizes the starting value and compares *within-institution percentage changes*, not the student populations or causal performance. This is suitable for a clearly disclosed illustrative institutional comparison. Rebuild with the same NCES IPEDS Fall Enrollment definition if strict cross-institution equivalence is required.

**2023 Salem discrepancy:** Use 6,239 from Salem State's 2021–25 Fact Book (the university's own NECHE self-study figure uses 6,254 in one graph). Keep the Fact Book series consistent rather than mixing sources.

**Source URLs:**
- Harvard: https://bpb-us-e1.wpmucdn.com/sites.harvard.edu/dist/6/210/files/2026/01/enrollment_historical_headcount_Fact-Book-2025-26.pdf
- UNC Charlotte (2016–24): https://www.northcarolina.edu/apps/bog/doc.php?code=bog&id=68257
- UNC Charlotte (2025): https://inside.charlotte.edu/2025/09/04/record-breaking-enrollment-football-and-a-concert-on-saturday-iron-phi-bikes-across-north-carolina-and-more/
- Salem State (2016–20): https://www.salemstate.edu/sites/default/files/pdfs/FY16-20_Fact_Book_ENROLLMENT.pdf
- Salem State (2021–25): https://records.salemstate.edu/sites/default/files/reports/2025-12/FY21-25_Fact_Book_Enrollment_WEB.pdf
