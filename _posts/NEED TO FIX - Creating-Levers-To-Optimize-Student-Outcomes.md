---
layout: post
title: How to Use Improve Student Retention with Tutoring Support Using Data Driven Approach And Creating 'Levers' To Enhance EcoSystems
subtitle: A step-by-step guide on using data using student services as 'levers' to optimize student support
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

## Introduction

Student retention is a critical factor for any educational institution, and maintaining a GPA threshold is a key part of retention strategies as a metric that 'things are ok'.  There are clearly more factors that go into it, but without real data or a better case study, I am doing my best with this use case. In this post, I am aiming to apply techniques to support students in maintaining a **2.5 GPA** or higher using **tutoring hours**. 

We'll explore:
- How to model the relationship between tutoring hours and GPA.
- How to allocate tutoring resources optimally.
- Provide a sample dataset and walk you through the process.

## The Problem

We will focus on **students with a GPA below 2.5** which is linked to their risk.


The goal is to increase tutoring engagement to support those students.  **How those hours are performed, such as online, in person, or with an AI, it does not matter**.  

To allocate **150 tutoring hours** across students who are at risk of falling below a **2.5 GPA**.  This is to put pressure on the system to allocate tutoring hours to support the organization.
- Ensuring that no more than 12 hours of tutoring are allocated to any student.
- Estimating how tutoring improves GPA.

## Approach

ADD SOMETHING HERE

### Define the Problem

For students with a GPA below 2.5, we want to determine the number of tutoring hours needed to help them improve their GPA to at least 2.5. 

We'll assume the following:
- **1 hour of tutoring** improves a student's GPA by **0.04** if their GPA is below 2.5.
- **Tutoring impact diminishes** as GPA increases, and students with higher GPAs receive smaller improvements.

### Building the Dataset

I made a sample dataset with 100 students with the following attributes:
- **GPA**: Their current GPA.
- **Attendance**: Percentage of classes attended.
- **Financial Aid**: Whether they are receiving financial aid.
- **Extracurriculars**: Number of extracurricular activities they are involved in.
- **Risk Score**: A number between 0 and 1 indicating their dropout risk.  This risk score can be calculated from dropout rates and mapping this to new students, but it is not covered here.

You can download the dataset [here](assets\csv\Original_Student_Data__0_04_increase_per_hour.csv).

### Define the Tutoring Hours Calculation

For students with a GPA below 2.5, tutoring is allocated, and the resulting GPA is calculated as 1 hour of tutoring increases the GPA by 0.04 with a maximum of 12 hours. So the most a student can increase their GPA through this assumed tutoring is 0.48, about half a letter grade.

### Allocation of Tutoring Hours

### Results

After running the model, we observe that students with the lowest GPAs benefit the most from tutoring, while those with GPAs closer to 2.5 require fewer hours to meet the threshold.

Here's an example of the data after applying the model:
|   StudentID |     GPA |   TutoringHoursNeeded |   TutoringHoursAllocated |   RiskScore |   GPAAfterTutoring |
|------------:|--------:|----------------------:|-------------------------:|------------:|-------------------:|
|           4 | 1.80622 |                    35 |                       12 |    0.852182 |            2.28622 |
|          35 | 1.84061 |                    33 |                       12 |    0.492618 |            2.32061 |
|          67 | 1.99626 |                    25 |                       12 |    0.873579 |            2.47626 |
|          55 | 2.02467 |                    24 |                       12 |    0.17701  |            2.50467 |
|          20 | 2.06824 |                    22 |                       12 |    0.437475 |            2.54824 |
|          25 | 2.09231 |                    20 |                       12 |    0.396543 |            2.57231 |
|          48 | 2.09907 |                    20 |                       12 |    0.473962 |            2.57907 |
|          72 | 2.13977 |                    18 |                       12 |    0.74826  |            2.61977 |
|          64 | 2.18457 |                    16 |                       12 |    0.79941  |            2.66457 |
|          71 | 2.18152 |                    16 |                       12 |    0.806201 |            2.66152 |


### Considerations
Next steps would be to better define the GPA increase from tutoring which you could get from historical data and take the average difference in the GPA if a student went to a tutor or the Teaching and Learning Centers.  



### Interactive Walkthrough
Below is a simple interactive example where you can input a student's GPA and see how many tutoring hours are needed to reach the 2.5 threshold.  This is **only** based on this example with lots and lots of assumptions.  


<div>
  <label for="gpa">Enter Student's GPA:</label>
  <input type="number" id="gpa" name="gpa" step="0.01" min="0" max="4.0">
  <button onclick="calculateHours()">Calculate Tutoring Hours Needed</button>
</div>
<p id="result"></p>

<script>
function calculateHours() {
  const gpa = parseFloat(document.getElementById('gpa').value);
  let hoursNeeded = 0;
  
  if (gpa < 2.5) {
    hoursNeeded = (2.5 - gpa) / 0.04;  // Adjusted to 0.04 GPA increase per hour
    hoursNeeded = Math.min(hoursNeeded, 12);  // Cap at 12 hours
  }
  
  document.getElementById('result').innerText = `Tutoring Hours Needed: ${Math.round(hoursNeeded)}`;
}
</script>



