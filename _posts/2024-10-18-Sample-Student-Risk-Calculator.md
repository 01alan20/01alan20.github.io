---
layout: post
title: Sample webapps for predicting student risk
subtitle: individual risk risk calculator 
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---


<h1>Student Risk</h1>

<!-- Student Risk Assessment HTML Structure -->
<div class="container mx-auto" id="student-risk">
  <div class="card w-full max-w-2xl mx-auto">
    <h2>Student Risk Assessment</h2>
    <p>Enter student information to calculate dropout risk</p>

    <!-- GPA Input -->
    <div class="space-y-2">
      <label for="gpa-student">GPA (0.0 - 4.0)</label>
      <input type="range" id="gpa-student" min="0" max="4" step="0.1" value="0">
      <p id="gpa-display-student" class="text-sm">Current GPA: 0.0</p>
    </div>

    <!-- Attendance Input -->
    <div class="space-y-2">
      <label for="attendance-student">Attendance Rate (%)</label>
      <input type="range" id="attendance-student" min="0" max="100" step="1" value="80">
      <p id="attendance-display-student" class="text-sm">Current Attendance: 80%</p>
    </div>

    <!-- Extracurricular Activities -->
    <div class="space-y-2">
      <label for="extracurricular-student">Extracurricular Activities</label>
      <select id="extracurricular-student">
        <option value="none">None</option>
        <option value="some">Some</option>
        <option value="active">Active</option>
      </select>
    </div>

    <!-- Financial Aid -->
    <div class="space-y-2">
      <label for="financialAid-student">Financial Aid</label>
      <select id="financialAid-student">
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
    </div>

    <!-- Year in University -->
    <div class="space-y-2">
      <label for="year-student">Year in University</label>
      <select id="year-student">
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
        <option value="5">5th Year or more</option>
      </select>
    </div>

    <!-- Total Credits -->
    <div class="space-y-2">
      <label for="totalCredits-student">Total Credit Hours Taken</label>
      <input id="totalCredits-student" type="number" value="0">
    </div>

    <!-- Current Credits -->
    <div class="space-y-2">
      <label for="currentCredits-student">Current Credit Load</label>
      <input id="currentCredits-student" type="number" value="12">
    </div>

    <button id="assess-button-student" class="w-full">Assess Risk</button>
  </div>

  <div id="assessment-result-student"></div>
</div>
