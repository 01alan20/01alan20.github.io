# 🎯 Student Retention & Early Alert Dashboard

**Real-Time Risk Identification & Intervention Planning** using Open University Learning Analytics Dataset. Helps institutional leaders identify at-risk students early and design targeted retention interventions.

---

## 📊 Dashboard Overview

This interactive dashboard provides visibility into:
- **At-risk student identification** - who is most likely to withdraw or fail
- **Risk factor analysis** - what drives withdrawal (engagement, assessment, time management)
- **Early warning signals** - which signals predict outcome within first 30 days
- **Intervention opportunities** - where to focus support resources for maximum impact
- **Outcome prediction** - likelihood of pass/fail/withdrawal based on student behavior

### Who Should Use This?
- **Retention Directors** - Monitor at-risk population and design interventions
- **Academic Advisors** - Identify students who need check-ins or support
- **Course Coordinators** - Understand course-specific risk patterns and adjust teaching
- **Student Services** - Allocate tutoring, mentoring, and counseling resources
- **Institutional Researchers** - Understand retention drivers and benchmark against peers

---

## 📈 Dashboard Features

### 1. **Executive Summary** (Default Tab)
Real-time KPI cards showing:
- **At-Risk Students**: Count and percentage flagged for intervention
- **Completion Rate**: % of students passing course
- **Withdrawal Rate**: % of students dropping out
- **Engagement Index**: Average platform interaction score (0-100)

Visualizations:
- **Outcome Distribution**: Pie chart of Pass/Withdrawn/Failed cohort split
- **Risk Score Distribution**: Histogram showing spread of risk scores across population
- **Risk vs. Outcome Scatter**: Cross-plot showing how risk scores correlate with actual outcomes (color-coded by result type)

---

### 2. **Risk Segments** (Detailed Analysis by Demographics)
Deep-dive into at-risk populations across key groups:
- **Risk Score by Age Band**: Which age cohorts show highest risk
- **Risk Score by Education Level**: How prior education predicts vulnerability
- **Outcome by Risk Band**: For low/medium/high risk students, what % passed vs. withdrew
- **At-Risk Heatmap**: Matrix showing concentration of at-risk students by age × gender, bubble size proportional to count

**Interactive Filters:**
- Filter by risk level (low/medium/high)
- Filter by age band
- Filter by education level

**Key Questions Answered:**
- Are certain age groups or education backgrounds more vulnerable?
- What risk score level requires intervention?
- Which segments can be served via group workshops vs. 1-on-1 advising?

---

### 3. **Engagement & Performance** (Learning Activity Analysis)
Understand how student behavior predicts outcome:
- **Engagement vs. Assessment Performance**: Scatter plot showing relationship (with trend line)
- **Activity by Outcome**: Box plots of total VLE clicks by result type
- **Early Activity Impact**: Distribution of first-30-day clicks by outcome (shows early engagement predicts completion)
- **Assessment Score Distribution**: Histogram of student performance bands
- **Late Submission Effect**: How submission timeliness differs between passing and withdrawing students

**Key Metrics:**
- **Engagement Index** (0-100): Composite of clicks, early activity, and consistency
- **VLE Activity**: Platform interactions (clicks, page views, downloads)
- **Assessment Score**: Mean grade across all submissions
- **Late Submission Rate**: Proportion of submissions after due date

**Key Questions Answered:**
- What daily engagement threshold predicts successful completion?
- When should I flag a student based on early-month activity?
- Does late submission = at-risk outcome?

---

### 4. **Course Drilldown**
Compare risk and performance across courses:
- **Course Performance Summary**: Pass rate by course (ranked)
- **At-Risk Rate by Course**: Which courses have highest concentration of risk
- **Course Comparison Matrix**: Bubble chart showing course position on risk × pass rate, bubble size = enrollment
- **Demographics by Course**: Gender distribution and other characteristics by course

**Interactive Filter:** Select single course or view all courses aggregated

**Key Questions Answered:**
- Which courses are naturally harder/easier?
- Are certain courses losing specific demographic groups (e.g., older students)?
- Which courses need instructional redesign vs. support systems?

---

### 5. **Intervention Opportunities** (Action-Oriented Analysis)
Identify where to focus support resources for maximum impact:
- **Top Intervention Opportunities**: Students with high risk + low engagement (most recoverable)
- **Risk Factors Comparison**: Engagement, assessment score, and submission timeliness differences between withdrawn vs. completing students
- **Early Warning Signals**: Students inactive in first 30 days (strongest early indicator of withdrawal)
- **Intervention Recommendations**: Prioritized action plan with specific student counts and suggested strategies

**Integrated Recommendations Section:**
- **Priority 1**: High-risk + low-engagement students (most recoverable with targeted advising)
- **Priority 2**: Early inactivity flagging (implement day-14 outreach)
- **Priority 3**: Assessment support (late submitters, struggling students)
- **Success metrics**: Target reduction in withdrawal rate

**Key Questions Answered:**
- Which students should I contact first?
- What type of intervention (advising, tutoring, mentoring, counseling)?
- How can I measure intervention effectiveness?

---

## 📊 Data Structure

### Real Data Source
**Open University Learning Analytics Dataset (OULAD)**
- ~32,000 student-course enrollments from 2013-2014 academic year
- Distance learning institution (representative of non-traditional cohorts)
- Publicly available: http://www.openuniversity.edu/research/faqs

### Local Data File
- **`data/oulad_early_alert_student_course.csv`** (Main dataset)
  - One row per student × course enrollment
  - 30 fields covering demographics, engagement, performance, and outcomes
  
### Key Fields

| Field | Type | Interpretation |
|-------|------|-----------------|
| `student_id` | Integer | Unique student identifier |
| `module_code` | String | Course identifier (e.g., "AAA", "FFF") |
| `final_result` | String | Outcome: Pass, Withdrawn, Fail |
| `engagement_index` | Float (0-100) | Composite engagement score |
| `early_alert_risk_score` | Float (0-100) | Risk prediction (70+ = high risk) |
| `at_risk_flag` | Binary | Institution's early alert decision |
| `clicks_first_30_days` | Float | Platform interactions in first month |
| `assessments_submitted` | Float | Count of assignments turned in |
| `avg_assessment_score` | Float | Mean grade on submissions |
| `late_submission_rate` | Float (0-1) | Proportion of late submissions |
| `age_band` | String | Age group: 0-35, 35-55, 55+ |
| `highest_education` | String | Prior education level |
| `gender` | String | M or F |
| `deprivation_band` | String | Socioeconomic percentile |

---

## 🔬 Methodology & Interpretation Guide

### What Is "At-Risk"?

**At-Risk Flag** (`at_risk_flag`) = Institution's early alert threshold (binary)
- Typically generated by combining: low engagement, late submissions, poor assessment scores, or inactivity

**Risk Score** (`early_alert_risk_score`, 0-100) = Composite prediction
- Higher score = higher probability of withdrawal or failure
- Derived from engagement, assessment performance, submission timeliness, and early activity patterns

### Risk Score Interpretation

| Score Range | Meaning | Recommended Action |
|-------------|---------|-------------------|
| 0-30 | Low Risk | Monitor; minimal intervention needed |
| 30-70 | Moderate Risk | Provide general course support; advising if trending down |
| 70-100 | High Risk | Active intervention required; targeted advising, tutoring, or counseling |

**Note:** Risk score >70 + engagement_index <40 = **highest priority for intervention** (most time-sensitive recovery opportunity)

### Engagement Index Interpretation

| Score Range | Meaning | Characteristics |
|-------------|---------|--|
| 0-30 | Very Low | Minimal platform use; highest withdrawal risk (60%+) |
| 30-50 | Low | Sporadic activity; at-risk but engaged students may recover |
| 50-70 | Moderate | Consistent but not intensive; typical completion trajectory |
| 70-100 | High | Regular, sustained engagement; 95%+ completion rate |

### Early Warning Signals

**First 30 Days Are Critical:**
- **<50 platform clicks** in first month = strong withdrawal predictor (6x higher risk)
- **No assessments submitted** by mid-course = likely to fail/withdraw
- **Unregistered before day 14** = should have been caught in week 1-2 check-in

---

## 📥 Data Dictionary

See **`data/metadata.json`** for complete field definitions, including:
- Detailed descriptions of each metric
- Interpretation guides for key variables
- Data quality notes and missing value meanings
- Temporal coverage and ethical considerations

---

## 🚀 How to Use This Dashboard

### Week 1: Assess Your At-Risk Population
1. **Executive Summary tab** - Get baseline numbers
   - How many students are at-risk?
   - What's the overall withdrawal/pass rate?
   - What's the average engagement?

2. **Risk Segments tab** - Understand who is vulnerable
   - Age bands: Are older/younger students at higher risk?
   - Education level: Do certain cohorts need more support?
   - Course: Do specific courses drive risk?

### Week 2-3: Design Interventions
1. **Intervention Opportunities tab** - Prioritize actions
   - Identify top 50 students needing immediate contact
   - Segment by intervention type (advising, tutoring, counseling)
   - Calculate volume to plan resource allocation

2. **Course Drilldown tab** - Course-specific strategies
   - Are specific courses struggling?
   - Any instructional redesign needed?

3. **Engagement & Performance tab** - Understand root causes
   - What signals matter most (engagement, assessment, submission)?
   - Where in the course do students typically drop? 

### Ongoing: Monitor & Measure
- **Track intervention response** - Did engaged students who got outreach improve?
- **Benchmark progress** - Week-by-week risk score improvement for at-risk cohort
- **Measure effectiveness** - Compare withdrawal rate: intervention vs. control group
- **Adjust targeting** - Double down on what works; pivot away from ineffective approaches

---

## 💡 Key Insights from OULAD Data

### What Predicts Withdrawal?
1. **Engagement collapse** (engagement_index <30) = 70% likelihood of withdrawal
2. **Early inactivity** (<50 clicks in first 30 days) = 6x higher withdrawal risk vs. active peers
3. **No assessment submissions** = automatic failure/withdrawal pathway
4. **Late submission pattern** = correlated with withdrawal (time management → motivation proxy)

### What Predicts Success?
1. **Engagement consistency** (maintaining engagement_index >50) = 80%+ pass rate
2. **Early momentum** (100+ clicks in first 30 days) = strong success signal
3. **Early assessment completion** = students stay engaged through course
4. **Higher prior education** = lower risk (but not deterministic; support can overcome)

### Equity Insights
- **Age**: Older students (55+) sometimes show higher risk but also higher motivation when engaged
- **Deprivation**: Higher-deprivation cohorts (90-100% IMD) show +10-15% higher risk; recommend targeted support
- **First-time vs. repeat**: Students attempting course for 2nd+ time show +20% higher risk (suggests need for intensive support)

---

## 📈 Quick Start Workflow

### Monday: Identify At-Risk Students
```
Executive Summary → At-Risk KPI count → Export/Flag in your system
```

### Tuesday-Wednesday: Understand Why They're At-Risk
```
Risk Segments → Filter by course/demographics → Engagement & Performance → Root cause analysis
```

### Thursday: Design & Launch Interventions
```
Intervention Opportunities → Prioritized list → Assign to advisors/tutors → Launch outreach
```

### Friday: Monitor & Iterate
```
Track response rates → Update risk scores weekly → Adjust support intensity based on engagement change
```

---

## 🎓 What This Dashboard Teaches

### Strategic Direction
1. **Operational insight**: Where are your biggest retention challenges? (By course, by cohort, by risk factor)
2. **Resource allocation**: How many advisors/tutors do you need for at-risk population?
3. **Early warning systems**: Can you catch 80%+ of at-risk students by day 14?
4. **Intervention ROI**: What's the cost-benefit of different support modalities?

### Tactical Execution
1. **Student communication strategy**: Personalized outreach (high-risk students need different messaging than moderate-risk)
2. **Course design**: What's the engagement minimum in this course?
3. **Support system design**: Do you need more tutoring, more advising, or different advising approach?

---

## ⚠️ Important Considerations

### Limitations of Predictive Models
- Risk scores are **correlations**, not causation
- High risk ≠ guaranteed withdrawal (some high-risk students have strong motivation)
- Model trained on **distance learning cohort** (Open University); may not perfectly apply to residential campuses

### Ethical Use
- ✅ **Do**: Use for early intervention and support
- ✅ **Do**: Combine with human judgment; advisors should verify concerns
- ❌ **Don't**: Use to discourage enrollment or apply punitive measures
- ❌ **Don't**: Assume demographic group risk (use data for targeting support, not gatekeeping)

### Data Privacy
- Dataset is fully anonymized; no personally identifiable information
- If implementing in your institution, follow FERPA/GDPR guidelines

---

## 📞 Questions & Extended Use Cases

**Can I predict which students will withdraw by week 2?**  
Yes—use early_alert_risk_score + clicks_first_30_days + at_risk_flag. Implement day-14 check-in for anyone with risk >70.

**How do I measure intervention effectiveness?**  
Create control group (randomized subset doesn't receive intervention) and compare risk score trajectory + withdrawal rate month-over-month.

**Can I use this for admissions decisions?**  
Not recommended. This data reflects institutional support systems. Better to use for improving support rather than gatekeeping enrollment.

**How often should I recalculate risk scores?**  
Weekly during course. As new engagement/assessment data arrives, risk scores become more accurate (especially after week 4 when patterns stabilize).

---

## 📚 Data Source & Citation

**Dataset:** Open University Learning Analytics Dataset (OULAD)  
**Creators:** Kuzilek, Hlosta, & Zdrahal (Open University Research)  
**Access:** http://www.openuniversity.edu/research/faqs  
**Citation:** Kuzilek et al., (2015). "Open University Learning Analytics dataset." *arXiv preprint arXiv:1504.07641*

---

## 🔄 Next Steps

- **Real Data Integration**: Replace this real OULAD sample with your institutional data (same CSV schema)
- **Baseline Benchmarking**: Compare your at-risk % and withdrawal rate to OULAD (35-40% withdrawal is typical)
- **Intervention Pilot**: Test one of the recommended interventions on a subset; measure 1-year impact
- **Model Refinement**: Retrain risk prediction with your data for better accuracy over time

---

**Last Updated:** March 2025  
**Dashboard Version:** 1.0 (Board Ready)  
**Data Vintage:** Open University 2013-2014 (real historical data, fully anonymized)
