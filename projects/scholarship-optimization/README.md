# Scholarship Optimization Model: Revenue-Maximizing Discount Strategy

## Overview

The "Scholarship Optimization Model" dashboard demonstrates how institutions can strategically use scholarships to maximize net tuition revenue. The model addresses a fundamental enrollment management tension: increasing scholarship discounts attracts more students (improving yield and enrollment), but each discount reduces revenue per enrolled student. The optimal scholarship level balances these competing forces.

Using College Scorecard institutional data combined with price sensitivity modeling, this dashboard reveals institutional-specific scholarship optimization strategies. Rather than assuming all institutions benefit from the same discount level, the model recognizes that price sensitivity varies dramatically across institution types, regions, and student populations.

Key questions answered: What scholarship discount level maximizes net tuition revenue for each institution? How much enrollment gain can realistic discounts generate? Which institutions are "discount-sensitive" vs. "discount-resistant"? How do different discount strategies perform across institution control types and regions?

## Data and Methodology

### Data Sources

The analysis combines two data elements:

**1. College Scorecard Base Data (Real):** Institutional characteristics from the U.S. Department of Education, including:
- Institution details (name, state, control type, degree level)
- Enrollment metrics (undergraduate size, admission rate, retention rate)
- Financial data (cost of attendance, tuition proxy)
- Demographic composition (Pell Grant share, first-generation percentage)
- Market baseline (baseline yield, baseline incoming class size)

**2. Price Sensitivity Modeling (Synthetic/Derived):** For each institution, a price sensitivity coefficient estimated from empirical enrollment data patterns:
- Public universities typically show price sensitivity coefficients of 0.6-1.0 (less price-sensitive)
- Private nonprofit institutions typically show 0.7-1.2 (moderate sensitivity)
- For-profit institutions often show 1.2-2.0+ (highly price-sensitive)
- Community colleges typically show 0.8-1.4 (moderate to high sensitivity)

**3. Scholarship Scenarios (Synthetic):** For each institution, net revenue projections are calculated for scholarship discount levels of 0%, 5%, 10%, 15%, 20%, 30%, 40%, 50%, 75%, and 100%.

### Revenue Optimization Model

For each institution at each discount level, the model projects:

**Projected Yield:** Baseline yield + (scholarship discount × price sensitivity coefficient)
- Captures the enrollment lift from offering scholarships
- Higher price sensitivity → larger yield improvement from discounts
- Yield cannot exceed 100% (capped at biological maximum)

**Projected Enrollment:** Baseline incoming class × Projected yield
- Reflects estimated students who will enroll at given discount level

**Net Tuition per Student:** Sticker tuition proxy × (1 - discount percentage)
- Revenue per enrolled student decreases with scholarship discount

**Net Revenue:** Projected enrollment × Net tuition per student
- Total institutional revenue after scholarships

**Revenue Change:** (Optimized net revenue - baseline net revenue) / baseline net revenue
- Percentage improvement (or decline) from baseline strategy

**Incremental Enrollment:** Optimized enrollment - baseline enrollment
- Additional students attracted by scholarship offer

### Optimal Discount Selection

The model identifies the scholarship discount level (0%, 5%, ... 100%) that maximizes net tuition revenue for each institution. This optimization recognizes:

**When discounts improve revenue:** If the additional students attracted exceed the per-student revenue loss, total revenue increases. This typically occurs when price sensitivity is high and baseline institutions haven't fully captured available enrollment.

**Example 1 (Revenue-Positive Discount):**
- Institution: Mid-tier private university
- Baseline: $20k net tuition × 400 students = $8M
- Discount scenario (10%): $18k net tuition × 520 students = $9.36M
- Result: 10% discount increases revenue by 17%, gains 120 net students

**Example 2 (Revenue-Neutral/Negative Discount):**
- Institution: Highly selective university
- Baseline: $25k net tuition × 100% of available students = $25k yield × class
- Discount scenario (10%): $22.5k net tuition × 105% (capped yield) = No additional students
- Result: 10% discount decreases revenue; optimal stays at 0%

### Model Limitations

**Aggregate projections:** Model uses institutional-level price sensitivity, masking variation by degree program, student demographic, or field of study.

**Assumption of linear response:** Assumes scholarship discount impact scales linearly; actual enrollment response may be non-linear (bigger jumps at certain price points).

**No interaction effects:** Model doesn't account for competitive scholarship dynamics (if all universities increase discounts simultaneously, overall yield may be lower than projected).

**Historical basis:** Price sensitivity coefficients derive from recent historical patterns; future market conditions may differ significantly.

**Static valuation:** Assumes net tuition revenue is the only objective; some institutions may prioritize enrollment growth, demographic diversity, or other non-revenue metrics alongside or instead of revenue maximization.

**"Net revenue" definition:** This model focuses narrowly on net tuition revenue (tuition after scholarships) and doesn't account for room & board, fees, cost of instruction, or downstream revenue impacts (retention, degrees-earned, alumni support).

## Dashboard Architecture

### Executive Summary Tab

The Executive Summary tab provides headline metrics and overall strategy effectiveness.

**Scholarship Optimization Distribution Histogram:** Shows the distribution of optimal scholarship discount levels across all institutions. Reveals strategic patterns: Are most institutions best served by no discount? Do few institutions benefit from large discounts? Do institutions cluster around specific discount tiers? The histogram shape reflects the diversity of optimal strategies across the institutional landscape.

**Revenue Lift vs. Enrollment Gain Scatter Plot:** Each institution appears as a point showing trade-off between revenue change (x-axis) and incremental enrollment (y-axis). Reveals four strategy zones:

- Upper-right (positive revenue, strong enrollment gain): "Virtuous" institutions where discounts unlock significant new enrollment without proportional revenue loss
- Upper-left (negative revenue, strong enrollment gain): "Growth-at-cost" institutions trading revenue for scale
- Lower-right (positive revenue, minimal enrollment gain): "Selective" institutions where discounts don't substantially improve yield
- Lower-left (negative revenue, minimal enrollment gain): "No-win" institutions where discounts both hurt revenue and fail to attract students (rare)

### Revenue Curves Tab

While the dashboard focuses on optimal discounts, understanding revenue curves across discount levels is essential for strategy. This tab displays net revenue outcomes at each discount scenario (0%-100%) for selected institutions.

*Interpretation:* Revenue curves reveal institutional strategy flexibility. Institutions with sharp revenue peaks ("strong optimal") indicate narrow win-zones—small changes around optimal discount significantly impact revenue. Institutions with flat revenue curves ("flexible") indicate discounts have minimal revenue impact; strategy can focus on non-revenue objectives (enrollment growth, demographic goals, competitive positioning).

### Yield Response Analysis Tab

The Yield Response tab analyzes the enrollment elasticity to scholarship discount—how sensitively yield and enrollment respond to discount changes.

**Discount vs. Projected Yield Scatter:** Each point is an institution; x-axis shows optimal discount %, y-axis shows resulting yield %. Reveals:

- Institutions clustered high-left: High yield with minimal discount (selective, strong demand)
- Institutions scattered low-left: High yield but small discounts (selective but using scholarships for merit/targeted recruitment)
- Institutions clustered low-right: Lower yield requiring larger discounts (less selective, need price incentives)
- Institutions scattered high-right: High yield despite large discounts (high price sensitivity; would lose many students without scholarships)

**Discount vs. Projected Enrollment Scatter:** Similar analysis but shows absolute enrollment numbers rather than percentage yield. Helps identify scale impact—which institutions gain the most students from scholarship strategies.

### Discount Band Strategy Tab

The Discount Band tab aggregates institutions by optimal discount strategy and analyzes outcomes by band.

**Discount Distribution Histogram:** Count of institutions in each band (0%, 1-5%, 6-10%, 11-20%, 21%+). Shows whether institutions cluster in specific discount strategies or spread across a wide range.

**Band Outcomes Chart:** For each band, displays average revenue change and average enrollment gain. Reveals whether particular discount strategies are more effective than others on average. Typical patterns:

- 0% discount band: Often includes selective institutions with high demand; average revenue impact near zero (can't improve by cutting price)
- 5-10% discount band: Often includes moderately selective institutions; common optimal zone
- 11-20% discount band: Often includes less selective institutions with moderate price sensitivity
- 20%+ discount band: Often includes open-access institutions or highly price-sensitive populations

### Institution Drilldown Tab

The Institution Drilldown tab enables comparative analysis of specific institutions and their scholarship strategies.

**Filter Dropdowns:**

- State: Compare institutions within a specific state
- Institution Type: Compare across Public, Private, For-Profit categories

**Top 15 Institutions by Optimized Net Revenue Bar Chart:** Displays institutions ranked by projected net revenue with optimal discount applied. Bar labels show the optimal discount % applied. Filtering enables:

- State comparison: "How do my institution's optimal strategy and revenue rank within my state?"
- Type comparison: "How do public universities' strategies differ from private institutions?"
- Regional or category analysis: Identify outliers within peer groups

## Key Insights and Interpretation

### When Scholarships Increase Revenue (Counter-Intuitive)

The model identifies institutions where modest scholarships paradoxically *increase* total net revenue. This occurs when:

1. **Baseline yield is low:** Many available students don't enroll despite admission. Small price reductions unlock significant enrollment additions.
2. **Price sensitivity is high:** Small price discounts generate large yield improvements.
3. **Revenue per student is above cost:** After marginal cost, additional students contribute positive net revenue.

Classic example: Community colleges or regional public universities with baseline 30-40% yield. Offering 10-15% scholarship might improve yield to 40-50%, gaining enough students to offset the reduced per-student net revenue.

### When Scholarships Decrease Revenue

The model identifies institutions where scholarships harm revenue:

1. **Baseline yield is high:** Most available students already enroll. Scholarships reach few marginal students.
2. **Price sensitivity is low:** Large price discounts generate minimal yield improvements.
3. **Selective institutions:** Where demand exceeds supply, price cuts don't improve enrollment; they only reduce revenue per student.

Classic example: Highly selective private universities with 50%+ baseline yield. Offering 10% scholarship generates no additional enrollment (already at capacity) and simply reduces revenue. Optimal strategy: No discount.

### Institution Type Patterns

**Public Universities:**
- Tend toward 5-15% optimal discounts
- Moderate price sensitivity; modest discounts often improve revenue
- Strategy rationale: Serve underserved populations; improve access without sacrificing revenue

**Private Nonprofit Institutions:**
- Range widely depending on selectivity
- Highly selective colleges: 0% optimal (no discounts needed)
- Mid-tier and less selective colleges: 10-20% optimal (discounts needed to compete)
- Strategy rationale: Merit scholarships used for prestige/selectivity management

**For-Profit Institutions:**
- Often show 5-15% optimal discounts
- High price sensitivity to scholarships
- Strategy rationale: Price is critical competitive variable; small discounts significant in enrollment

**Community Colleges:**
- Range 10-20% optimal discounts
- High price sensitivity; serving cost-conscious populations
- Strategy rationale: Even modest tuition reductions unlock significant enrollment

### Strategic Use Cases

**For Enrollment Management:**
1. Current scholarship levels vs. optimal: Are you over-discounting or under-discounting?
2. Competitive positioning: Compare your institution's strategy to peer institutions' optimal strategies
3. Financial scenario planning: Model revenue and enrollment impact of various discount levels

**For Financial Planning:**
1. Constraint-based optimization: If strategic goals require 5% enrollment growth, what discount achieves it while maintaining revenue?
2. Demographic strategy: If diversity goals require targeting specific populations with different price sensitivity, how do discounts affect forecasts?
3. Multi-year planning: As demographics shift, optimal discount may change; track and adjust annually

**For Institutional Research:**
1. Benchmark institutional price sensitivity: How price-responsive is our student population relative to peers?
2. Segmentation analysis: Do different student populations show different price sensitivity? Should discounts be differentiated?
3. Market dynamics: As competition increases, optimal discounts may increase; track changes over time

## Ethical Considerations and Limitations

### When Revenue Maximization Isn't the Goal

This model focuses on revenue optimization, but many institutions prioritize competing goals:

- **Access and equity:** Using scholarships to serve underrepresented populations may reduce revenue but increase access
- **Educational quality:** Selective admission policies may cap enrollment below revenue-maximizing levels
- **Mission alignment:** Religious, specialized, or mission-driven institutions may accept lower revenues to serve specific populations
- **Regional economic development:** Playing a role in regional workforce development may require subsidizing certain programs

The revenue-maximizing strategy should be one input to scholarship strategy, not the only input.

### Who Wins and Who Loses

Revenue-optimization focus can mask equity impacts:

- **Winners:** Institutions with high baseline yield or low price sensitivity keep scholarships small and maintain high net revenue per student
- **Losers:** Higher-price-sensitivity students may face smaller scholarships (because institutions with their population don't "need" discounts to increase enrollment)
- **Distortion:** Students with identical qualifications may face different prices based on institutional price sensitivity, not student merit or need

### Competitive Dynamics

If all institutions simultaneously increase scholarships based on revenue optimization, the landscape changes:

- Total enrollment may not improve (zero-sum game across institutions)
- Revenue across the sector may decline (price-based competition)
- Individual institutions' optimal strategies become sub-optimal in the competitive equilibrium

This model assumes institutions make decisions independently; actual market dynamics are more complex.

### Long-Term vs. Short-Term

Revenue optimization focuses on immediate tuition revenue. Long-term impacts include:

- **Enrollment composition:** Will different scholarship strategies attract different student populations, affecting retention and degree completion?
- **Reputation and brand:** More selective scholarship strategies may harm institutional reputation and future enrollment
- **Student debt:** Which scholarship strategies result in lower or higher student debt burdens?
- **Alumni outcomes:** Do scholarship recipients have different career outcomes, affecting future willingness to financially support institutions?

## Conclusion

The Scholarship Optimization Model provides a framework for evidence-based scholarship strategy. Rather than assuming all discounts help (or harm) equally, the model recognizes that optimal scholarship strategies vary dramatically across institutions based on price sensitivity, baseline yield, and institutional characteristics.

The model reveals counter-intuitive insight: for many institutions, modest scholarships *increase* net revenue by attracting additional students who value financial aid. For selective institutions with strong demand, scholarships primarily reduce revenue without improving enrollment.

The dashboard enables institutions to:

1. **Understand their position:** Where does your institution fall in the scholarship strategy landscape?
2. **Benchmark against peers:** How does your current strategy compare to optimal strategy and to peer institutions?
3. **Scenario plan:** What happens if you increase or decrease scholarship discounts?
4. **Balance multiple objectives:** Revenue optimization is one goal; balance it against access, equity, quality, and mission objectives

---

## Technical Details

**Data Files:**
- `data/scholarship_optimal_discount_summary.csv`: Optimal discount and outcomes for each institution
- `data/scholarship_revenue_curve.csv`: Full revenue curves across all discount scenarios

**Dashboard Architecture:**
- **Chart Library:** Plotly.js (interactive, responsive)
- **Data Processing:** Client-side CSV parsing via PapaParse
- **Navigation:** 5-tab interface with filtering
- **Responsive Design:** Mobile-optimized (480px-1920px+)

**Dashboard Tabs:**
1. Executive Summary: KPIs and headline effectiveness metrics
2. Revenue Curves: Net revenue at each discount level for top institutions
3. Yield Response: Scatter analysis of discount sensitivity and enrollment response
4. Discount Bands: Strategy distribution and outcomes by discount band
5. Institution Drilldown: Top performers by net revenue (filtered by state/type)
