# Degree ROI & Value Model: Understanding Cost-to-Earnings Trade-offs in Higher Education

## Overview

The "Degree ROI & Value Model" dashboard provides a comprehensive analysis of institutional value across U.S. higher education by comparing the financial investment required (cost of attendance) against measurable outcomes (earnings, debt, completion rates). Rather than treating all institutions equally, this analysis recognizes that the true value of a degree depends on the complex interplay of affordability, student success, debt burden, and post-graduation earning potential.

Using real data from the U.S. Department of Education's College Scorecard, this dashboard enables prospective students, financial aid officers, institutional researchers, and policy makers to understand: Which institutions offer the best financial value? How do costs compare across regions and institution types? What role does student debt play in long-term financial outcomes? How do completion rates and earnings correlate with cost?

The dashboard introduces a composite "ROI Value Score" that synthesizes multiple dimensions of institutional performance into a single comparable metric, allowing viewers to benchmark institutions not by prestige or selectivity, but by the practical question: "Does the degree earned justify the money invested?"

## Data Source

The analysis leverages the College Scorecard dataset published by the U.S. Department of Education's Office of Planning, Evaluation and Policy Development (OPEPD). College Scorecard represents the most comprehensive publicly available dataset on institutional characteristics, student demographics, cost structures, and post-graduation outcomes for accredited institutions of higher education.

Data included in this analysis represents recent cohorts (typically 2015-2019 entry cohorts tracked to 2024), with particular focus on:

- Institutional cost structures (tuition, fees, room and board, books, supplies)
- Student demographics and selectivity (admission rate, SAT scores, Pell Grant eligibility)
- Degree level offered (Associates, Bachelors, Masters, Certificate programs)
- Student success metrics (completion rate, retention rate, loan repayment rate)
- Economic outcomes (median earnings 10 years post-graduation, monthly income, share earning above $25k)
- Institutional characteristics (type, size, geographic region)

A filtered subset of approximately 25 institutions representing diverse control types (public, private, for-profit) and geographic regions was selected for this dashboard to enable meaningful comparison while maintaining data clarity and interactive performance.

### Data Limitations and Considerations

The College Scorecard dataset, while comprehensive, contains important limitations:

**Sample and Coverage:** The earnings data is aggregated from matched Social Security Administration tax records and represents earnings for students with Social Security numbers. International students, students without U.S. tax records, and those deceased are excluded, which may underrepresent lower-income cohorts who may be less likely to file taxes.

**Causality vs. Correlation:** Higher earnings at certain institutions may reflect admitted student characteristics and economic context rather than the causal effect of attending that institution. Similarly, debt burden cannot be separated from borrowing behavior and loan amounts chosen by students.

**Missing Data:** Some fields are unavailable (marked as NA) for certain institutions or program types. For-profit institutions may have higher missing rates due to data reporting requirements.

**Program Variation:** College Scorecard reports institution-level aggregates masking significant variation within institutions. For example, engineering graduates from the same university will earn substantially more than liberal arts graduates, but the data reports a single institution-level figure.

**Temporal Lag:** Data represents cohorts from 2-10 years ago. Recent economic changes, COVID-19 impacts, and evolving job market conditions are not fully reflected for recent entry cohorts.

**Timeframe Bias:** The 10-year earnings window captures earnings at ages approximately 28-38 depending on entry age. This reflects mid-career earnings rather than lifetime earnings potential or peak earning years.

With these limitations in mind, this dashboard should be used as one data input in college decision-making, not as a definitive ranking. The patterns revealed are useful for benchmarking and understanding broad trends across institutional types and regions, but should be combined with specific program information, student circumstances, and institutional mission alignment.

## Dashboard Architecture

### Executive Summary Tab

The Executive Summary tab provides the highest-level view of ROI across all selected institutions.

**ROI Value Score Distribution Histogram:** This chart displays the distribution of ROI Value Scores across all institutions, showing the concentration of value across the dataset. The histogram uses 16 bins to smooth the distribution while showing meaningful granularity. Institutions cluster into "high value" (60+), "moderate value" (40-60), and "lower value" (<40) tiers, visible as peaks in the histogram. This view helps identify whether institutions are more concentrated in high-value or lower-value ranges, and reveals outliers—both exceptionally good and notably poor value institutions.

The ROI Value Score is a composite metric calculated as:
- (Earnings-to-Cost Ratio × 0.30) = How many dollars of earnings per dollar of cost
- + (Completion Rate × 0.30) = Likelihood students finish degrees
- + ((1 - Debt-to-Earnings Ratio) × 0.25) = Student debt relative to earnings capacity
- + (3-Year Repayment Rate × 0.15) = Loan repayment capacity
- = ROI Value Score (0-100)

This weighting reflects the importance of both financial return (earnings relative to cost) and student success (completion and repayment), recognizing that a low-cost institution where few students graduate offers poor value despite low cost.

**Cost vs. Earnings Scatter Plot:** This fundamental relationship chart plots cost of attendance (x-axis) against median 10-year earnings (y-axis) for all institutions. Each point represents one institution. The scatter plot reveals several patterns:

- Linear upward trend: Institutions with higher costs tend to produce higher earnings (typically selective private universities)
- Wide vertical scatter: At any given cost level, earnings vary enormously (different fields, different regions, different student populations)
- Outliers above trend: Institutions with lower cost but higher earnings (strong regional schools, technical institutions)
- Outliers below trend: Institutions with high cost but lower earnings (lower-selectivity private schools, some for-profits)

The relationship between cost and earnings is neither perfectly correlated nor independent—it suggests that "you get what you pay for" holds partially true, but institutional choice dramatically affects the earnings outcome at any given cost level.

Together, these two charts establish the key tension that drives the entire analysis: Are expensive institutions worth the premium? The histogram answers "not always"—some low-cost institutions score very well. The scatter plot answers "not simply"—high cost doesn't guarantee high earnings, but it correlates with it.

### Value Map Tab

The Value Map tab shifts focus from individual institutions to aggregate institutional categories, revealing patterns by degree level and institution type.

**ROI Value Score by Degree Level Bar Chart:** This chart groups institutions by the highest degree they award (Associates, Bachelors, Masters, Certificate) and displays the average ROI Value Score within each group. This comparison answers: "Do certain degree levels consistently outperform others?"

Typically, this chart reveals:

- Bachelors degree institutions: Widest variation, highest average scores (greater diversity in cost and earnings structures)
- Masters/Research institutions: Often high scores (selective institutions with strong earnings track records)
- Associates degree institutions: Mixed performance (community colleges show variable outcomes; some excel, others lag)
- Certificate programs: Limited data availability in this dataset

Degree level serves as a proxy for institutional mission and student population. Research universities train students for high-earning fields (STEM, medicine, business), while community colleges focus on workforce development, which may yield different earnings patterns and cost structures.

**ROI Value Score by Institution Control Type Bar Chart:** This chart groups institutions by control (Public, Private nonprofit, For-profit) and displays average ROI Value Score within each category. This comparison reveals systematic differences in value delivery by institutional type.

Typically observed patterns:

- Public institutions: Moderate to high scores, with lower cost structure and competitive earnings; wide variation (from flagship state universities to regional campuses)
- Private nonprofit institutions: Highly variable scores; selective private universities score very high, while lower-selectivity private institutions often score lower despite high cost
- For-profit institutions: Typically lower scores due to high cost-to-earnings ratios and lower completion rates; some specialized for-profits outperform expectations

This distinction is important because "institutional type" correlates with multiple factors simultaneously—cost, selectivity, student demographics, mission—making it difficult to isolate which factor drives the differences. Public institutions' advantage often reflects lower taxpayer subsidies rather than superior educational quality. For-profit institutions' disadvantage reflects both higher cost and serving different student populations with different outcomes.

### Cost vs Earnings Tab

The Cost vs. Earnings tab deepens the analysis of the fundamental economic relationship, adding dimensions of completion rates and geographic variation.

**Cost vs. Earnings Scatter Plot with Completion Rate Color Scale:** This advanced visualization replicates the Executive Summary scatter plot but adds a critical third dimension: student completion rate, represented by color intensity. The color scale uses Viridis (blue to yellow), where:

- Dark blue points: Lower completion rates (troubling: high cost with low completion)
- Yellow points: Higher completion rates (promising: students actually finish and can earn)

This overlay immediately identifies problematic institutions: expensive but low completion rate (students pay without graduating). Students earning their degrees is a precondition for any economic value from higher education. An institution with exceptional average earnings but 40% completion rate offers poor value to the 40% who don't graduate.

Institutions in the "value zone" appear as yellow points in the upper-left area: lower cost with higher completion rates and strong earnings. The wide variation in color at any cost level emphasizes the diverse quality of institutional performance.

**Earnings Distribution by Institution Control Type Box Plot:** This chart displays the distribution of median 10-year earnings within each institution type (Public, Private, For-profit) using box plots. The box shows the middle 50% of earnings, the line inside shows the median, whiskers extend to outliers, and individual dot outliers appear as points.

This view reveals:

- Control type's central tendency: What's the typical earnings outcome for each institutional type?
- Control type's variability: Is a type's value consistent or inconsistent?
- Outliers: Which institutions break the type's expected pattern?

Public institutions typically show tight, reliable central tendency (predictable outcomes), while private institutions show wider spread (greater variability in outcomes). For-profit institutions often show lower medians with outliers below.

**Median Cost of Attendance by Region Bar Chart:** This chart groups institutions by geographic region and shows the average cost of attendance within each region, sorted descending from highest to lowest cost. Regions with higher cost (typically coastal urban areas and selective institution concentrations) appear on the left, while lower-cost regions appear on the right.

This geographic view highlights regional economic patterns:

- High-cost regions (often Northeast, West Coast): Concentrate selective expensive universities, high living costs
- Lower-cost regions (often Midwest, South): Mix of lower-cost public universities and regional schools
- These regional differences compound individual institutional cost variation

Understanding regional cost and earnings baselines helps contextualize individual institutions. A $50k annual cost is steep in affordable regions but competitive in high-cost areas. Similarly, $40k earnings may exceed regional cost of living in low-cost areas but provide limited purchasing power in expensive urban regions.

### Debt & Completion Tab

The Debt & Completion tab focuses on potentially problematic outcomes: students leaving with debt burdens they cannot service, and failures to complete degrees.

**Debt-to-Earnings Ratio vs. Completion Rate Scatter:** This chart plots debt-to-earnings ratio (x-axis: median debt ÷ median 10-year earnings) against completion rate (y-axis: % of students graduating). Each point is one institution.

Key zones in this chart:

- Upper-left quadrant (lower debt, higher completion): The "ideal zone"; institutions helping students finish and keeping debt manageable
- Upper-right quadrant (higher debt, higher completion): Trade-off zone; students complete but graduate with significant debt burden
- Lower-left quadrant (lower debt, lower completion): Problematic; students who attend don't finish despite low debt
- Lower-right quadrant (higher debt, lower completion): Crisis zone; students who don't complete nonetheless graduate with debt obligations

An institution appearing in the lower-right represents significant borrower risk—students investing and borrowing without completing their degree. An institution in the upper-left represents best-case outcomes—students graduate without excessive debt burden.

Ratios below 0.5 are generally considered manageable (debt less than half of annual earnings at age 28-38); ratios above 0.7 indicate potential hardship. Completion rates above 70% are strong; below 50%, are concerning.

**Median Student Debt by Degree Level Bar Chart:** This chart shows the average cumulative debt at graduation by degree level (Associates, Bachelors, Masters, Certificate). Degree level drives debt differently:

- Associates: Lower absolute debt (2-year programs) but higher debt-to-income ratios (lower typical earnings)
- Bachelors: Moderate debt, higher earnings (debt more manageable)
- Masters: Highest absolute debt (longer programs) but strong earnings (typically debt-serviceable)
- Certificate: Lowest debt (short programs)

The relationship between debt and degree level is not simply "more education = more debt." Field of study, entry point (some students start at associates then transfer), and undergraduate borrowing all affect total debt. This chart helps students understand typical debt levels for degree levels of interest.

**3-Year Loan Repayment Rate by Institution Type Bar Chart:** This chart shows the percentage of borrowers from each institution type making progress on loan repayment (paying $1+ toward principal) within 3 years of leaving the institution. This is a leading indicator of default risk—borrowers not making progress within 3 years often enter long-term repayment difficulty.

Repayment rate concerns:

- Below 50%: High risk that many borrowers will face repayment difficulty or default
- 50-70%: Moderate concern; meaningful proportion of borrowers struggling
- Above 75%: Healthy pattern; borrowers capable of loan service

Repayment rate serves as a reality check on ROI value scores. An institution with high earnings but low repayment rate indicates students aren't actually earning, or the cost-to-debt ratio created unsustainable obligations.

### Institution Drilldown Tab

The Institution Drilldown tab enables detailed comparison of specific institutions filtered by user preferences.

**Filter Dropdowns:** Users can filter institutions by:

- Region: Geographic area of institution
- Institution Type: Public, Private nonprofit, or For-profit

Filtering enables comparative analysis: "Show me all public universities in the Midwest" or "Which for-profit institutions have the highest ROI scores?" The drilldown updates dynamically when filters change.

**Top 15 Institutions by ROI Value Score Horizontal Bar Chart:** This chart displays the 15 highest-ranked institutions (within the current filter selection) ranked by ROI Value Score from lowest to highest (so the highest-value institution appears at the top). The horizontal layout allows institution names to display clearly without truncation.

This chart answers the practical question: "Within this category and region, which institutions offer the best value?" It directly reveals hierarchical comparisons—the gap between first and fifteenth place, whether scores cluster together or spread wide, which institutions are standouts.

Interactively, this chart is the most dynamic. Changing filters immediately updates both which institutions appear and their relative rankings. A student filtering to "Public Universities in the Southwest" sees a completely different set of comparable institutions than filtering "Private Universities in the Northeast."

The drilldown serves multiple purposes:

1. **Comparative shopping:** Students can find peers for a specific institution type and region
2. **Outlier analysis:** Identify unexpected high or low performers within a category
3. **Strategic filtering:** Users can explore trade-offs—does cost increase if I move to a different region? Do for-profits compete on value with public universities?

## Methodology and Calculations

### ROI Value Score Composite Metric

The ROI Value Score combines four dimensions of institutional value into a single 0-100 comparable metric. Each component is normalized to 0-100 range then weighted to create the composite.

**Component 1: Earnings-to-Cost Ratio (weight: 0.30, 30 points possible)**

Calculation: Median 10-year earnings ÷ Annual cost of attendance

This ratio answers: "How many dollars of lifetime earnings per dollar of annual cost?" A ratio of 1.0 means 10-year earnings equal 1 year of cost (approximately break-even over 10 years accounting for earning many years). A ratio of 2.0 means earnings are 2x annual cost (strong return). A ratio of 0.5 means earnings are half annual cost (weak return).

Example: An institution with $20,000 annual cost and $400,000 median 10-year earnings has ratio of 20.0 (exceptional).

Normalization: Ratios are capped at 6.0 (scores above this receive 100 points for this component). Ratios below 0.5 receive 0 points. Values between 0.5-6.0 are linearly scaled (ratio of 3.25 would receive approximately 54 points in this component).

Rationale: Earnings-to-cost directly measures financial return. 30% weighting reflects that earnings potential is the primary driver of value, but not the only consideration.

**Component 2: Completion Rate (weight: 0.30, 30 points possible)**

Calculation: Share of students who graduate or transfer within 150% of normal time

Completion rate measures process quality—whether students actually finish degrees. An institution may appear to offer good value on earnings metrics, but if 30% of admitted students never graduate, the value is only realized by the 70% who complete. Non-completion represents failed investments by students (costs incurred, no degree) and foregone earning potential.

Range: 0-100% naturally maps to 0-30 points.

Rationale: Completion is foundational to all other value dimensions. No earnings without degree completion. 30% weighting reflects equal importance with earnings-to-cost ratio.

**Component 3: Debt Service Capacity (weight: 0.25, 25 points possible)**

Calculation: 1 - (Median debt ÷ Median 10-year earnings), capped at 0-1

This ratio measures the proportion of 10-year earnings available after accounting for student debt burden. A ratio of 0.3 means debt is 30% of earnings (manageable). A ratio of 0.8 means debt is 80% of earnings (concerning). 

Example: $30,000 debt against $400,000 earnings = ratio of 0.075 (excellent, debt is under 10% of earnings). Then 1 - 0.075 = 0.925 score before weighting.

Normalization: Ratios are capped at 1.0 (debt cannot exceed earnings in this calculation) and floor at 0 (avoiding negative scores). Score of 1.0 in this component requires debt-to-earnings below 0.0 (essentially no debt), receiving 25 points.

Rationale: Debt capacity is less important than earnings and completion (weighted at 25%) but critical for loan repayment sustainability. Students with moderate earnings but excessive debt face default risk, reducing actual value.

**Component 4: Loan Repayment Rate (weight: 0.15, 15 points possible)**

Calculation: 3-year repayment rate as direct percentage

This is the proportion of borrowers making progress on loans 3 years after leaving the institution.

Normalization: 0-100% directly maps to 0-15 points.

Rationale: Repayment rate is a leading indicator of borrower financial health and loan sustainability. Low repayment rates signal distressed borrowers. Weighted at 15% (lower than earnings/completion/debt capacity) because it's somewhat correlated with earnings levels and debt metrics, but provides independent evidence of borrower success.

**Composite Calculation Example:**

Institution A:
- Earnings-to-cost ratio 2.0 → 33/33 points (ratio above 1.5 caps at maximum)
- Completion rate 82% → 25/30 points (0.82 × 30)
- Debt-to-earnings 0.35 → 16/25 points (1 - 0.35 = 0.65; 0.65 × 25)
- Repayment rate 78% → 12/15 points (0.78 × 15)
- **Total Score: 86 points** (high value)

Institution B:
- Earnings-to-cost ratio 0.8 → 9/33 points (0.8 is below 2.0; 0.8/6.0 × 33 ≈ 4.4, but floor is higher; ~9 points)
- Completion rate 62% → 19/30 points (0.62 × 30)
- Debt-to-earnings 0.58 → 11/25 points (1 - 0.58 = 0.42; 0.42 × 25)
- Repayment rate 54% → 8/15 points (0.54 × 15)
- **Total Score: 47 points** (moderate value)

This methodology creates a composite metric that rewards institutions achieving balance across all dimensions, not just one strength. An institution with exceptional earnings but high debt and low completion will score lower than one with good performance across all dimensions.

### Regional and Degree Level Aggregations

When comparing by region or degree level, the dashboard calculates weighted averages of the underlying metrics by institution count within that category. For example:

- Bachelors institutions average ROI = (All ROI scores for Bachelors institutions) ÷ (Count of Bachelors institutions)
- Northeast region average cost = Sum of all costs for Northeast institutions ÷ Count of Northeast institutions

This ensures that regions or degree levels with more institutions don't overwhelm comparisons through pure count, but also recognizes that larger categories have more diverse performance.

### Data Filtering and Drilldown Logic

When users select filters (Region, Institution Type), the dashboard:

1. Maintains allRows (unfiltered dataset) for KPI calculations and tabs not affected by filters
2. Creates filteredRows subset where (Region matches selected OR all regions) AND (Control Type matches selected OR all types)
3. Re-renders only the Institution Drilldown chart using filteredRows
4. Other tabs (Executive Summary, Cost vs Earnings, etc.) continue displaying all institutions for consistency

This design choice ensures that the summary tabs always show the full picture (important for context), while the drilldown tab enables focused comparison.

## Interpretation Guide

### Reading ROI Value Scores

ROI Value Scores range from 0-100. General interpretation:

- **60+: High Value** — Institutions delivering strong financial returns, good completion rates, and manageable debt. These represent institutions where cost investment yields meaningful earnings and career advancement. Prospective students should prioritize these institutions.

- **40-60: Moderate Value** — Institutions with mixed performance—strong in some dimensions (perhaps good earnings but higher debt burden, or lower cost but lower earnings). These institutions may offer good value for specific student profiles or programs but warrant careful evaluation.

- **Below 40: Limited Value** — Institutions where the value proposition is weaker. May have high cost with lower earnings, or high debt burden relative to outcomes, or lower completion rates. Prospective students should perform additional analysis before choosing these institutions—they may be appropriate for specific circumstances but shouldn't be default choices.

### Interpreting Scatter Plots

Cost vs. Earnings scatter plots show individual institutions as points. Key patterns:

- **Upper-left cluster:** Lower cost, higher earnings—exceptional value institutions. These represent rare combinations of affordability and earning potential.

- **Upper-right cluster:** Higher cost, higher earnings—selective prestigious institutions. Value depends on whether earnings justify the cost.

- **Lower-left cluster:** Lower cost, lower earnings—affordable but with limited economic impact. May be appropriate for students pursuing non-lucrative fields or seeking affordable options despite lower earnings.

- **Lower-right cluster:** Higher cost, lower earnings—problematic value. Large gap between investment and return suggests weak value proposition.

- **Distance above/below trend line:** Institutions above the trend line (same cost, better earnings) outperform peer cost-level institutions. Institutions below underperform.

### Reading Regional Comparisons

Regional cost and earnings patterns reflect multiple factors:

- **Cost variation (200%+ differences):** Driven by cost of living, institutional density, regional selectivity, and public funding availability. Coastal urban regions typically cost more; rural and less expensive regions cost less.

- **Earnings variation:** Driven by graduate migration patterns (students migrate to high-earning urban areas after graduation), regional economic structure (tech hubs show higher earnings than agricultural regions), and field mix (regions with more engineering/business schools show higher earnings).

When comparing regional institutions, recognize that an institution's regional location partly determines its cost and earnings context. A $40k annual cost may be premium in the South but competitive in the Northeast.

### Reading Degree Level Analysis

Degree level profoundly affects outcomes through multiple mechanisms:

- **Associates degrees:** Lower cost, lower completion than Bachelor's, lower earnings, but faster time-to-workforce entry. Can be high-value for focused career paths (nursing, skilled trades) where Bachelor's degree may be unnecessary.

- **Bachelor's degrees:** Highest diversity of outcomes—ranging from outstanding value at large state schools to poor value at selective private institutions. Field matters enormously (engineering > business > humanities > liberal arts).

- **Master's degrees:** Higher cost and higher earnings, typically strong value for students seeking advanced credentials. However, earnings aren't always higher than related Bachelor's degree; opportunity cost of additional years matters.

- **Certificate programs:** Limited earnings data in this dataset, but can represent quick workforce entry with minimal debt.

### Understanding Outliers and Unexpected Results

The dashboard will reveal institutions that break expected patterns:

- **High cost, high completion, high earnings:** Prestigious selective universities delivering strong value to students who complete.

- **Low cost, high completion, high earnings:** Efficient institutions, often public universities or specialized private schools, operating at high value.

- **High cost, low completion:** Taking students' money without delivering degrees—major red flag.

- **High earnings, high debt:** Students earning well but borrowing heavily in absolute dollars (or starting from high debt, reducing available earnings for other purposes).

Many outliers reflect field effects that the institution-level aggregate data hides. An institution with high earnings despite high debt may have many engineering graduates (high earnings, high absolute debt) mixed with liberal arts graduates (moderate earnings, low debt). The aggregate number hides this heterogeneity.

## Strategic Use Cases

### For Prospective Students

1. **Narrowing college options:** Filter to degree level and region matching your criteria. Identify high-value institutions (60+ ROI scores) and low-value institutions to avoid.

2. **Evaluating scholarship decisions:** Compare the cost-adjusted value of institutions you've been accepted to. A full-ride scholarship at a lower-value institution might still better than a partially-paid enrollment at a higher-cost, higher-earnings institution, depending on your earning potential in your planned field.

3. **Debt decision-making:** Compare debt levels across institutions and debt-to-earnings ratios. Understand the expected absolute debt amount and expected earning level in your field to make informed borrowing decisions.

4. **Program-field alignment:** While this analysis reports institution-level aggregates, recognize that your specific program within the institution may have substantially different earnings (engineering 80% higher than liberal arts at the same institution). Use institutional averages as a starting point, then seek program-specific data.

### For Institutional Researchers and Policy Makers

1. **Benchmarking:** Compare your institution's ROI value score against similar institutions (same region, same degree level, same control type) to identify performance gaps or areas of competitive advantage.

2. **Problem diagnosis:** If your institution scores below-average on ROI despite high earnings, examine completion rate and debt levels. Perhaps students complete and earn well but graduate with excessive debt. If cost is the issue, perhaps the value proposition is simply one of premium cost without premium outcome.

3. **Strategic positioning:** Understanding where your institution falls on cost-earnings-completion-debt dimensions helps in strategic planning. An institution attempting to compete on low cost but finding poor earnings might benefit from focusing on specific high-earning fields or improving completion.

4. **Accountability:** The ROI value score, while imperfect, provides a meaningful accountability metric for the core question higher education must answer: "Are we delivering sufficient value to justify the cost?"

### For Financial Aid Officers

1. **Aid allocation strategy:** Institutions with low completion rates or high debt burdens might benefit from allocating additional aid to students demonstrating high completion probability, improving institutional metrics over time.

2. **Student advising:** Use this dashboard to help students understand the earnings expectations and debt implications of their institutional choice, enabling informed aid package discussions.

3. **Retention focus:** Institutions with low completion rates should investigate whether aid inadequacy, preparation gaps, or other factors are driving attrition. Improving completion rate strongly improves ROI value score.

## Limitations and Ethical Considerations

### Limitations

1. **Aggregation hides diversity:** Institution-level averages mask tremendous diversity within institutions. Your specific program's outcomes may differ dramatically from the institution average.

2. **Earnings reflect cohort effects:** Students graduating in 2014 entered college in 2010 during the Great Recession aftermath and graduated into the 2013-2014 job market—unique economic conditions not representative of all eras.

3. **Earnings capture inequality:** Earnings averages are dragged up by high-earning outliers. Median earnings partially address this, but still aggregate across students with very different outcomes.

4. **Regional data limits:** Students often migrate for careers after graduation, so the state/region of the institution doesn't fully determine post-graduation earnings location and associated cost of living.

5. **Causality claims:** Earnings differences between institutions may reflect student selection effects (higher-earning institutions may admit higher-ability students who would earn more anywhere) rather than causal effects of attending that institution.

### Ethical Considerations

1. **Reductive metric:** Reducing college value to "ROI" misses legitimate educational purposes—citizenship, personal development, specific fields with social value but lower earning potential (social work, teaching, nonprofit work). Use this dashboard as one input, not the defining metric.

2. **Access and equity:** Lower-cost institutions may have lower earnings for legitimate reasons—they serve populations with less family wealth and more workforce obligations. It's unethical to steward students away from these institutions solely based on earnings, without understanding their critical role in educational access.

3. **Self-fulfilling prophecy:** If high-value institutions receive more recruiting attention and more students, they may maintain strong cohorts and outcomes. If lower-value institutions are avoided, they may enter a decline spiral. Value may become self-fulfilling rather than inherent.

4. **Field bias:** This analysis cannot fully capture high-value fields with lower earnings (education, social work, ministry, nonprofit work). Students pursuing these fields shouldn't be discouraged by lower earnings metrics from institutions serving these populations.

5. **Student agency:** This dashboard should empower student choice, not replace it. The ROI value score represents average outcomes. Your specific circumstances, abilities, interests, and life goals may point toward a different choice than the "highest-value" institution suggests.

## Conclusion

The Degree ROI & Value Model dashboard addresses a fundamental question in higher education: "What is the relationship between the investment made (cost of attendance) and the outcomes achieved (earnings, completion, manageable debt)?"

The analysis reveals significant variation across institutions in this relationship. Some institutions deliver strong financial value—low cost combined with strong earnings and low debt burden. Others charge premium prices without delivering premium outcomes. Most fall somewhere in between, representing trade-offs students and families must evaluate in context of specific programs and personal circumstances.

This dashboard should stimulate three questions in every viewer's mind:

1. **Transparency:** Why aren't these metrics more visible in institutional marketing? Why must prospective students hunt for this data rather than institutions volunteering meaningful value metrics?

2. **Accountability:** What is the higher education industry doing to improve value? Are institutions using ROI metrics to drive improvement, or dismissing them as reductive?

3. **Personal alignment:** How does my specific situation—my field, my abilities, my financial circumstances, my values—align with what these metrics show? Are the average outcomes applicable to my likely outcomes?

Ultimately, no algorithm can replace student agency and careful consideration of fit, mission, specific program offerings, and personal goals. But informed decision-making requires transparency about what higher education costs and what outcomes students can expect. This dashboard provides that transparency, enabling better choices in one of life's most consequential and expensive decisions.

---

## Technical Details

**Data Source File:** college_scorecard_roi.csv
**Chart Library:** Plotly.js (interactive, responsive visualizations)
**Data Format:** Client-side CSV parsing via PapaParse (no server required)
**Responsive Design:** Mobile-first layout adapted for 480px-1920px+ viewports
**Data Filtering:** Real-time filtering with dropdown selectors in drilldown tab

**Field Dictionary:** See data/metadata.json for comprehensive documentation of all 25+ fields in the College Scorecard dataset, interpretation guides, and calculation methodology.

**Citation:** U.S. Department of Education, Office of Planning, Evaluation and Policy Development. (2024). College Scorecard Dataset. Retrieved from https://collegescorecard.ed.gov/
