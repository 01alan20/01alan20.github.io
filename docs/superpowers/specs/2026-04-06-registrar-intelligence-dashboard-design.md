# University Registrar Intelligence Dashboard Design

## Summary

This project will be a standalone portfolio dashboard that presents a current-term registrar operations command center for a generic public university. The public-facing branding will stay generic, but the underlying academic-policy logic and program structure will be modeled from official Oregon State University catalog and regulations sources so the operational rules are traceable and credible.

The dashboard is meant to show registrar triage, not just reporting. It should help a viewer answer four practical questions quickly:

1. Which students are blocked from registration, and why?
2. Which required courses are creating bottlenecks right now?
3. Which students are off-track for degree progress, and what rule is failing?
4. Which students appear graduation-ready but have not completed the administrative step?

## Product Positioning

**Working title:** `University Registrar Intelligence Dashboard`

**Page framing:** a current-term operations dashboard for registration blockers, course bottlenecks, degree-audit risk, and graduation follow-up.

**Portfolio role:** a higher-education operations project that demonstrates registrar domain understanding, policy-aware audit logic, and the ability to turn institutional rules into clear operational dashboards.

## Audience

Primary audience:

- registrar operations staff
- registration support teams
- degree-audit and graduation teams

Secondary audience:

- deans
- directors
- academic operations leaders

The page must therefore support two reading modes:

- quick executive scan at the top
- operational drilldown and action queues below

## Design Goals

- Make the page usable as a current-term command center rather than a passive analytics report.
- Keep the interface modern, but avoid startup-style novelty that makes the page harder to read.
- Make action clear for both frontline staff and institutional leaders.
- Use synthetic data, but ensure the logic behind the data is policy-aware and structurally believable.
- Keep the page understandable without requiring a notebook or technical explanation first.

## Non-Goals For V1

- full transcript workflow simulation
- faculty grading workflow
- transfer articulation engine
- scheduling collision engine
- multi-term planning or forecasting as the main user story
- full replication of every Oregon State catalog rule

## Public Framing And Methodology

The page itself will present as a generic public-university dashboard. The methodology copy will state that the logic is modeled from official Oregon State catalog and registrar policy sources plus synthetic operational data.

That split is important:

- public brand stays generic and reusable
- methodology remains explicit and defensible

## Institutional Basis

The modeled undergraduate programs are:

- Business Administration
- Business Analytics
- Elementary Education
- Secondary Education

The policy basis should reference official Oregon State sources:

- Academic Regulations: https://catalog.oregonstate.edu/regulations/
- Business Administration: https://catalog.oregonstate.edu/college-departments/business/business-administration-ba-bs-hba-hbs/
- Business Analytics: https://catalog.oregonstate.edu/college-departments/business/business-analytics-bs-hbs/
- Elementary Education: https://catalog.oregonstate.edu/college-departments/education/educational-practice-research/elementary-education-ba-bs-hba-hbs/
- Secondary Education: https://catalog.oregonstate.edu/college-departments/education/educational-practice-research/secondary-education-ba-bs-hba-hbs/

## Policy Logic To Encode

The dashboard should model a believable undergraduate degree-audit layer built on the following institutional rules:

- 180 earned quarter credits for degree completion
- 60 upper-division credits minimum
- 36 credits in each major, including at least 24 upper-division credits in each major
- minimum 2.00 OSU cumulative GPA for institutional degree completion
- residence expectations, including last-credit residence and upper-division residence in the major
- core curriculum completion
- world language completion

Additional program-sensitive logic:

- education programs should use stricter progression logic than business programs
- education majors should reflect higher GPA and course-grade expectations
- professional progression and student-teaching readiness should be represented as derived readiness flags

The dashboard does not need to expose every rule directly, but the degree-audit and action-queue outputs must clearly map to rule categories such as:

- credit deficit
- upper-division deficit
- missing required courses
- GPA below threshold
- residence not satisfied
- core curriculum incomplete
- world language incomplete
- professional progression incomplete

## Data Strategy

The project will use synthetic but rule-based operational data sized to feel institutionally plausible without attempting full university scale.

Recommended v1 scale:

- 8,000 to 12,000 students
- one current term as the primary view
- four modeled undergraduate programs
- enough course and section coverage to make required-course pressure believable

The dashboard should be driven by structured flat files generated from a reproducible script pipeline, not hand-authored JSON.

## Core Data Entities

The project should include, at minimum, the following conceptual tables:

- `dim_student`
- `dim_program`
- `dim_course`
- `bridge_program_courses`
- `dim_section`
- `dim_term`
- `dim_hold_type`
- `fact_holds`
- `fact_enrollment`
- `fact_academic_progress`
- `fact_degree_audit`
- `fact_graduation`
- `fact_waitlist`

The most important bridge is `bridge_program_courses`, because it supports:

- required-course classification
- elective classification
- program-specific audit logic
- bottleneck-course interpretation

## Operational Logic

### Registration And Holds

Students should be assigned realistic registration outcomes based on hold status and general registration behavior:

- most students register successfully
- a smaller portion remain unregistered without a hold
- active holds sharply increase registration failure risk
- financial holds should be the most blocking

The dashboard should distinguish:

- registered
- blocked by hold
- not registered without active hold

### Course Demand And Seat Pressure

Required sections should have stronger demand than electives. That should create:

- high-fill required sections
- waitlist pressure on core bottleneck courses
- some underfilled elective sections

This section should help a viewer identify where seat supply is failing against requirement demand.

### Degree Audit

Each student should be assigned a derived audit status:

- `on_track`
- `near_risk`
- `off_track`

The audit logic should evaluate both pace and rule completion. A student can be off-track because of:

- insufficient earned credits
- insufficient upper-division progress
- missing major requirements
- GPA below threshold
- incomplete residence or general university requirements
- education-program progression gaps

### Graduation Pipeline

Final-year students should flow into administrative states:

- not eligible
- eligible not applied
- applied pending
- ready to award

This preserves a registrar distinction between academic eligibility and administrative completion.

## Page Architecture

The dashboard should be a single long-form project page with clear sections and sticky navigation.

### 1. Executive Snapshot

Purpose:

- let a dean, director, or registrar lead grasp the state of the term in under a minute

Content:

- registration completion rate
- blocked-by-hold count
- unresolved hold rate
- waitlist pressure index
- percent of students off-track
- final-year eligible-not-applied count

Each KPI should include a plain-language footnote so the numbers do not float without interpretation.

### 2. Registration And Holds

Purpose:

- show where registration is failing and what staff should work first

Views:

- registration status by program
- blocked students by hold type
- continuing students not registered
- top outreach segments

Interpretation sentence:

- what this means operationally, in plain language

### 3. Course Demand And Seat Pressure

Purpose:

- show which courses are constraining student progression

Views:

- required-course waitlist pressure
- seat fill rate vs capacity risk
- over-capacity and under-viability sections
- program-linked bottleneck courses

Interpretation sentence:

- what courses need section relief, review, or intervention

### 4. Degree Audit And Graduation Risk

Purpose:

- show which students are off-track and why

Views:

- audit status by program
- audit status by class level
- missing-requirement categories
- graduation funnel for final-year students

Interpretation sentence:

- whether the issue is pace, policy, or missing administrative action

### 5. Action Queues

Purpose:

- make the dashboard feel operational instead of abstract

Queues:

- students blocked by active hold
- students off-track for graduation-critical reasons
- students eligible but not applied

Records should be anonymized but concrete, with fields such as:

- student id
- program
- class level
- issue summary
- urgency
- recommended next action

The queue should sort by urgency rather than alphabetically.

### 6. Methodology Drawer

Purpose:

- explain the modeling basis without overwhelming the main page

Content:

- synthetic operational data disclaimer
- official-source basis for policies and program mappings
- concise summary of audit logic and hold logic

## Filters And Interactions

The page should include lightweight filters that update all charts and action queues together:

- program
- class level
- hold status
- audit status

Interaction rules:

- clicking a KPI or chart element should refine the action queues below
- the reset action should be obvious
- there should be no deeply nested drilldown flow
- methodology content should stay collapsed by default

## Visual Direction

The interface should look modern and deliberate, but it must remain operationally readable.

Style direction:

- warm neutral background
- strong navy for structural emphasis
- deep green for healthy/complete states
- amber for warning states
- brick/red for blocked or urgent states
- expressive but disciplined typography
- large KPI numerals
- careful spacing and strong table legibility

Layout direction:

- one-page command center
- sticky local navigation
- panels with strong section headers
- charts only where comparisons benefit from a visual
- tables for triage and ranked action

Motion direction:

- restrained load-in transitions
- no decorative movement that competes with reading

## Recommended Charts And Tables

Charts:

- blocked registration by hold type
- registration status by program
- required-course waitlist pressure
- section fill rate vs viability risk
- audit status by program and class level
- graduation funnel

Tables:

- highest-pressure required courses
- unresolved hold queue
- graduation-risk queue
- eligible-not-applied queue

## Recommended Project Structure

The implementation should follow the existing standalone project pattern in this repo.

Recommended project slug:

- `projects/university-registrar-intelligence-dashboard/`

Expected files:

- `projects/university-registrar-intelligence-dashboard/index.html`
- `projects/university-registrar-intelligence-dashboard/dashboard.css`
- `projects/university-registrar-intelligence-dashboard/dashboard.js`
- `projects/university-registrar-intelligence-dashboard/data/...`
- `scripts/prepare_university_registrar_dashboard.py`
- homepage card update in `index.html`

## Success Criteria

The project is successful if:

- the page clearly reads as registrar operations work rather than generic analytics
- the page can be understood quickly by a dean or director
- the action queues make the operational value concrete
- the policy logic is believable and traceable
- the interface feels modern without sacrificing clarity
- the project is strong enough to stand beside the existing enrollment and retention dashboards on the portfolio site

## Risks To Avoid

- making the page feel like an academic-policy lecture instead of an operations console
- overbuilding v1 with too many workflows
- mixing undergraduate and graduate rules
- using random synthetic data with no visible logic behind it
- hiding the best operational value below too many tabs or interactions

## Final Design Decision

Build a generic public-university registrar command-center dashboard, modeled from official Oregon State undergraduate program and policy logic, focused on current-term triage for registration blockers, course bottlenecks, degree-audit risk, and graduation follow-up.
