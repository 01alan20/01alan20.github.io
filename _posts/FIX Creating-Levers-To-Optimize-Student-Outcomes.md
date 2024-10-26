---
layout: post
title: How to Use Improve Student Retention with Tutoring Support Using Data Driven Approach And Creating 'Levers' To Enhance EcoSystems
subtitle: A step-by-step guide on using data using student services as 'levers' to optimize student support
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---






Thought for 32 seconds

Certainly! I'll guide you through the process step by step:

Estimate the impact of tutoring and advising on GPA and retention using the current dataset.
Formulate an optimization model to allocate tutoring and advising hours optimally, adhering to the given constraints.
Update the dataset with new columns prefixed with OR_ to reflect the optimized allocations and their effects on GPA and retention.
1. Estimating the Impact of Tutoring and Advising on GPA and Retention
A. Regression Analysis: Impact on GPA
To estimate the impact of Tutoring_Hours and Advising_Hours on Cumulative_GPA, we'll perform a multiple linear regression analysis.

Regression Model
Cumulative_GPA
𝑖
=
𝛼
+
𝛽
1
×
Tutoring_Hours
𝑖
+
𝛽
2
×
Advising_Hours
𝑖
+
𝛽
3
×
Attendance
𝑖
+
𝛽
4
×
At_Risk_Flag
𝑖
+
𝛽
5
×
Financial_Aid
𝑖
+
𝜀
𝑖
Cumulative_GPA 
i
​
 =α+β 
1
​
 ×Tutoring_Hours 
i
​
 +β 
2
​
 ×Advising_Hours 
i
​
 +β 
3
​
 ×Attendance 
i
​
 +β 
4
​
 ×At_Risk_Flag 
i
​
 +β 
5
​
 ×Financial_Aid 
i
​
 +ε 
i
​
 
Estimated Coefficients
Assuming we obtain the following results from the regression:

Intercept (
𝛼
α): 1.5
𝛽
1
β 
1
​
  (Tutoring_Hours): +0.05 (p < 0.01)
𝛽
2
β 
2
​
  (Advising_Hours): +0.10 (p < 0.01)
𝛽
3
β 
3
​
  (Attendance): +0.02 (p < 0.01)
𝛽
4
β 
4
​
  (At_Risk_Flag): -0.30 (p < 0.01)
𝛽
5
β 
5
​
  (Financial_Aid): +0.05 (p > 0.05, not significant)
Interpretation
Tutoring_Hours: Each additional hour of tutoring is associated with a 0.05 increase in Cumulative_GPA.
Advising_Hours: Each additional hour of advising is associated with a 0.10 increase in Cumulative_GPA.
Attendance: Each percentage point increase in attendance is associated with a 0.02 increase in Cumulative_GPA.
At_Risk_Flag: Being flagged as at-risk is associated with a 0.30 decrease in Cumulative_GPA.


Assuming we obtain the following results from the regression:

Intercept (
𝛼
α): 1.5
𝛽
1
β 
1
​
  (Tutoring_Hours): +0.05 (p < 0.01)
𝛽
2
β 
2
​
  (Advising_Hours): +0.10 (p < 0.01)
𝛽
3
β 
3
​
  (Attendance): +0.02 (p < 0.01)
𝛽
4
β 
4
​
  (At_Risk_Flag): -0.30 (p < 0.01)
𝛽
5
β 
5
​
  (Financial_Aid): +0.05 (p > 0.05, not significant)
Interpretation
Tutoring_Hours: Each additional hour of tutoring is associated with a 0.05 increase in Cumulative_GPA.
Advising_Hours: Each additional hour of advising is associated with a 0.10 increase in Cumulative_GPA.
Attendance: Each percentage point increase in attendance is associated with a 0.02 increase in Cumulative_GPA.
At_Risk_Flag: Being flagged as at-risk is associated with a 0.30 decrease in Cumulative_GPA.