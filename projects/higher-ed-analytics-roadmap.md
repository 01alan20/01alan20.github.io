# Higher-Ed Analytics Roadmap

This portfolio track will be built as five separate static projects under `projects/`, each with its own local data files and later its own dashboard entry point.

## Delivery Structure

1. `enrollment-funnel-benchmark`
   Uses a synthetic student-level funnel dataset calibrated to realistic benchmark ranges.
   Board view: inquiries, applications, offers, enrollments, yield, velocity, source quality.
   Drill-down tabs: Funnel Conversion, Source and Market Mix, Conversion Velocity, Segment Drilldown.

2. `retention-early-alert`
   Uses real OULAD data prepared into a student-course summary table.
   Board view: at-risk rate, engagement index, assessment momentum, withdrawal concentration, course hotspots.
   Drill-down tabs: Risk Segments, Engagement and Assessment, Course Drilldown, Intervention Opportunities.

3. `degree-roi-value`
   Uses real College Scorecard institution-level data.
   Board view: value score, cost of attendance, completion, retention, debt, earnings, repayment.
   Drill-down tabs: Value Map, Cost vs Earnings, Debt and Completion, Institution Drilldown.

4. `scholarship-optimization`
   Uses real College Scorecard base data plus modeled scholarship discounts.
   Board view: net tuition curve, enrollment lift, revenue peak, discount efficiency, segment sensitivity.
   Drill-down tabs: Revenue Curve, Yield Response, Discount Bands, Institution Drilldown.

5. `crm-engagement-analytics`
   Uses a real churn dataset translated into student engagement and attrition language.
   Board view: attrition risk, support-service usage, commitment mix, billing pressure, profile gaps.
   Drill-down tabs: Attrition Risk, Service Usage, Billing and Commitment, Profile Drilldown.

## Build Sequence

Two sequences matter here:

- Data setup sequence: create all five folders now, with the first project synthetic and the rest tied to real public data or real-data-derived scenarios.
- Dashboard build sequence: start with `retention-early-alert`, then `degree-roi-value`, then `enrollment-funnel-benchmark`, then `scholarship-optimization`, then `crm-engagement-analytics`.

That order gives one fast operational win first, one highly publishable value dashboard second, and then the more bespoke strategy simulations.

## Dashboard Standard

Every project should follow the same executive pattern:

- Top summary strip with 6 to 8 KPI cards.
- One board-ready narrative section that answers "what should leadership do next?"
- Tabs or section jumps for deeper drill-down analysis.
- Segment filters that make the data useful for decision making, not just exploration.

## Site Fit

The current site already uses self-contained project folders under `projects/`. These five projects will follow that pattern so each one can later be linked directly from `/projects` without adding a build system.
