# Enrollment Funnel Model

**Board-Ready Benchmark Dashboard** for inquiry-to-enrollment pipeline analysis. Synthetic data calibrated to realistic higher-ed conversion benchmarks.

---

## Dashboard Overview

This interactive dashboard provides institutional leaders with visibility into:
- **Conversion performance** across the student recruitment pipeline
- **Bottleneck identification** at each stage (inquiry → app → offer → enrollment)
- **Segment-level insights** by student type, program, geography, and source channel
- **Scenario modeling** to explore "what-if" strategies

### Who Should Use This?
- **Enrollment Directors** - Monitor funnel health and conversion rates
- **Admissions Counselors** - Identify high-performing source channels
- **Institutional Planners** - Forecast enrollment outcomes under different strategies
- **Finance / Provost** - Understand yield and net revenue implications

---

## Dashboard Features

### 1. **Executive Summary** (Default Tab)
Real-time KPI cards showing:
- Total inquiries in active cycle
- Application conversion rate vs. benchmark (20-40%)
- Offer rate vs. benchmark (60-80%)
- Enrollment/yield rate vs. benchmark (20-50%)

Visualizations:
- **Funnel Waterfall**: Shows student counts and drop-off at each stage
- **Enrollment Velocity**: Box plots of days-to-convert by stage (inquiry→app→offer→enroll)
- **Conversion vs. Benchmarks**: Actual rates vs. industry standards with error bands

---

### 2. **Funnel Analysis**
Deep-dive into conversion mechanics:
- **Stage Progression**: Count of students at each step (inquiry → app → offer → enrollment)
- **Exit Rates**: % of students dropping out at each transition
- **Funnel Detail Breakdown**: Trends by student type (First-Year, Transfer, Graduate)

**Key Questions Answered:**
- Where are we losing the most students? (Stage with highest exit rate)
- Are conversion rates consistent across demographics?

---

### 3. **Source & Geography**
Understand where students come from and how location impacts conversion:
- **Conversion by Source**: Which channels (Website, Campus Visit, Counselor, etc.) convert best?
- **Geographic Distribution**: Pie chart of inquiry volume by territory (Local, Regional, National, International)
- **Source Performance Matrix**: Bubble chart showing App Rate vs. Enrollment Rate by channel (bubble size = volume)

**Key Questions Answered:**
- Which source channels have highest ROI?
- Do domestic vs. international students convert differently?

---

### 4. **Segment Drilldown**
Interactive filters to compare performance across groups:
- Filter by **Student Type** (First-Year, Transfer, Graduate)
- Filter by **Academic Program** (CS, Engineering, Business, Liberal Arts)

Visualizations:
- **Conversion by Student Type**: Multi-stage comparison (Inq→App, App→Offer, Offer→Enroll)
- **Academic Index Impact**: How scholar quality (composite academic score) drives enrollment
- **Program Performance**: Enrollment rate ranking by major

**Key Questions Answered:**
- Do engineering students convert differently than business students?
- What's the minimum academic index for viable enrollment?

---

### 5. **Scenario Modeling** (Interactive)
"What-if" analysis engine to test strategic initiatives:

**Adjustable Parameters:**
- Inquiry → Application rate (benchmark: 20-40%)
- Application → Offer rate (benchmark: 60-80%)
- Offer → Enrollment rate (benchmark: 20-50%)
- Starting inquiry volume (default: current cycle)

**Projected Outcomes:**
- Total applications, offers, enrollments
- Overall conversion rate (inquiry to enrollment)
- Comparison to current performance

**Use Cases:**
- "If we improve yield from 35% → 42%, how many more students enroll?"
- "What enrollment target requires if we maintain current app rates?"
- "How sensitive is enrollment to marginal improvements in offer conversion?"

---

## Data Structure

### Local Data Files
- **`data/enrollment_funnel_synthetic.csv`** (Main dataset)
  - ~10,000 synthetic student records across 2024-2025 cycles
  - 33 fields including demographics, engagement, timeline, and outcomes
  
- **`data/metadata.json`** (Data dictionary)
  - Field definitions, data types, and value ranges
  - Generation methodology and benchmark sources
  
- **`data/enrollment_funnel_summary.csv`** (Aggregated summary)
  - Pre-calculated funnel metrics by segment

### Key Fields
| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| `student_id` | String | ENR-00001 | Unique identifier |
| `cycle_year` | Int | 2025 | Admissions cohort |
| `student_type` | String | First-Year | Segment analysis |
| `source_channel` | String | Campus Visit | Source attribution |
| `academic_program` | String | Computer Science | Program analysis |
| `academic_index` | Float (0-100) | 74.3 | Academic quality |
| `*_flag` | Binary | 1 / 0 | Stage progression |
| `*_date` | Date | 2025-03-20 | Temporal analysis |
| `days_*` | Float | 48.0 | Conversion velocity |
| `final_stage` | String | Enrolled | Outcome classification |

---

## Methodology & Benchmarks

### Synthetic Data Approach
- **Why synthetic?** Public higher-ed funnel datasets are rare/incomplete
- **Calibration**: Conversion rates anchored to industry research (NACAC, EAB)
- **Realism**: Probabilistic generation with correlated variables (e.g., higher academic index → higher enrollment probability)

### Benchmark Ranges
These ranges reflect realistic higher-education admissions:

| Stage | Benchmark Range | Industry Source |
|-------|-----------------|-----------------|
| Inquiry → Application | 20-40% | NACAC reports |
| Application → Offer | 60-80% | EAB research |
| Offer → Enrollment | 20-50% | Institutional data |

**Note:** Your actual rates may vary by:
- Selectivity (highly selective: lower app rate, higher offer rate)
- Tuition level (affordability impacts yield)
- Geographic market
- Program mix

---

## How to Interpret the Dashboard

### Quick Health Check Questions

1. **Inquiry Quality** - Is the academic_index distribution healthy?
   - Low = recruiting too broadly → wasted effort
   - High = potentially limiting addressable market
   
2. **Funnel Efficiency** - Are conversion rates within benchmark?
   - Below range = potential bottleneck (fix targeting → offer → yield)
   - Above range = likely overqualified applicants (can raise standards)

3. **Source Effectiveness** - Which channels deserve budget?
   - High conversion + volume = primary investment
   - Low conversion = test before scaling
   
4. **Segment Disparities** - Are any groups underperforming?
   - First-Gen students converting < peers → need targeted support
   - International drops sharply at yield → affordability issue?

---

## What This Dashboard Teaches You

### Strategic Insights Available

1. **Institutional Profile**
   - How selective are we? (% of applicants offered)
   - How yielding is our offer? (% of offers enrolling)
   - What's our funnel efficiency? (inquiry-to-enrollment conversion)

2. **Market Segmentation**
   - Which demographics show different behaviors?
   - Are there untapped high-value segments?

3. **Channel ROI**
   - Cost-per-inquiry by source (requires marketing spend data)
   - Cost-per-enrollment (what source channels generate actual revenue?)

4. **Operational Bottlenecks**
   - Stage with highest attrition (application, yield, etc.)
   - Time-to-conversion (velocity) by segment

5. **What-If Capacity**
   - Enrollment target requires what baseline inquiries?
   - Realistic improvement scenarios vs. stretch goals

---

## Data Dictionary

See **`data/metadata.json`** for complete field definitions including:
- Data types and ranges
- Value mappings (e.g., student_type: First-Year, Transfer, Graduate)
- Null value meanings
- Quality notes and temporal coverage

---

## Next Steps

### To Make This Your Own
1. **Replace synthetic data** with real institutional data (CSV format, same schema)
2. **Add marketing spend** to calculate cost-per-enrollment by source
3. **Overlay financial aid** to understand price sensitivity / yield impact
4. **Layer in survey data** (why students didn't apply, why they chose competitors)

### To Extend the Analysis
- **Time series**: Track funnel changes quarter-over-quarter
- **Predictive modeling**: Build classifier to identify high-yield applicants
- **Sensitivity analysis**: Test enrollment impact of specific interventions
- **Cohort comparison**: Compare 2024 vs 2025 funnel shapes

---

## Data Source & Caveats

**Source:** Synthetic student-level data calibrated to higher-education industry benchmarks (NACAC, EAB, institutional case studies)

**Synthetic ≠ Unrealistic:** This data mirrors real funnel dynamics while protecting institutional privacy. Appropriate for:
- Dashboard prototyping & design testing
- Analytics capability demonstration
- Teaching decision frameworks

**Not appropriate for:**
- Institutional planning (use real data)
- Policy decisions affecting students
- Compliance / regulatory reporting

---

## Questions?

**Key Metrics Reference:**
- **Conversion Rate** = (Students at next stage / Students at current stage) × 100
- **Exit Rate** = (Students who left / Students at start) × 100
- **Overall Conversion** = (Enrollments / Inquiries) × 100
- **Velocity** = Median days-to-convert for successful students

---

**Last Updated:** March 2025  
**Dashboard Version:** 1.0 (Board Ready)  
**Data Vintage:** Synthetic, calibrated to 2024-2025 benchmarks
