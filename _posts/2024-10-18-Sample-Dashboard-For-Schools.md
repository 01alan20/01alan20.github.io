---
layout: post
title: Sample webapps for predicting student risk and an admin view
subtitle: 
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

<h1>{{ page.title }}</h1>
<p>Here’s a sample dashboard for predicting student risk and the admin view.</p>

<!-- Student Risk Assessment HTML Structure -->

<div class="container mx-auto">
  <div class="card w-full max-w-2xl mx-auto">
    <h2>Student Risk Assessment</h2>
    <p>Enter student information to calculate dropout risk</p>

    <!-- GPA Input -->
    <div class="space-y-2">
      <label for="gpa">GPA (0.0 - 4.0)</label>
      <input type="range" id="gpa" min="0" max="4" step="0.1" value="2.5">
      <p id="gpa-display" class="text-sm">Current GPA: 2.5</p>
    </div>

    <!-- Attendance Input -->
    <div class="space-y-2">
      <label for="attendance">Attendance Rate (%)</label>
      <input type="range" id="attendance" min="0" max="100" step="1" value="80">
      <p id="attendance-display" class="text-sm">Current Attendance: 80%</p>
    </div>

    <!-- Extracurricular Activities -->
    <div class="space-y-2">
      <label for="extracurricular">Extracurricular Activities</label>
      <select id="extracurricular">
        <option value="none">None</option>
        <option value="some">Some</option>
        <option value="active">Active</option>
      </select>
    </div>

    <!-- Financial Aid -->
    <div class="space-y-2">
      <label for="financialAid">Financial Aid</label>
      <select id="financialAid">
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
    </div>

    <!-- Year in University -->
    <div class="space-y-2">
      <label for="year">Year in University</label>
      <select id="year">
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
        <option value="5">5th Year or more</option>
      </select>
    </div>

    <!-- Total Credits -->
    <div class="space-y-2">
      <label for="totalCredits">Total Credit Hours Taken</label>
      <input id="totalCredits" type="number" value="0">
    </div>

    <!-- Current Credits -->
    <div class="space-y-2">
      <label for="currentCredits">Current Credit Load</label>
      <input id="currentCredits" type="number" value="12">
    </div>

    <button id="assess-button" class="w-full">Assess Risk</button>
  </div>

  <div id="assessment-result"></div>
</div>

<script>
  // JavaScript state management for student data
  const studentData = {
    gpa: 2.5,
    attendance: 80,
    extracurricular: "none",
    financialAid: "no",
    year: 1,
    totalCredits: 0,
    currentCredits: 12,
  };

  // Update GPA and Attendance display
  document.getElementById('gpa').addEventListener('input', function() {
    studentData.gpa = parseFloat(this.value);
    document.getElementById('gpa-display').innerText = `Current GPA: ${studentData.gpa.toFixed(1)}`;
  });

  document.getElementById('attendance').addEventListener('input', function() {
    studentData.attendance = parseInt(this.value);
    document.getElementById('attendance-display').innerText = `Current Attendance: ${studentData.attendance}%`;
  });

  // Update other fields
  document.getElementById('extracurricular').addEventListener('change', function() {
    studentData.extracurricular = this.value;
  });

  document.getElementById('financialAid').addEventListener('change', function() {
    studentData.financialAid = this.value;
  });

  document.getElementById('year').addEventListener('change', function() {
    studentData.year = parseInt(this.value);
  });

  document.getElementById('totalCredits').addEventListener('input', function() {
    studentData.totalCredits = parseInt(this.value);
  });

  document.getElementById('currentCredits').addEventListener('input', function() {
    studentData.currentCredits = parseInt(this.value);
  });

  // Function to calculate risk score
  function calculateRiskScore(data) {
    let score = 0;
    if (data.gpa < 2.0) score += 30;
    else if (data.gpa < 3.0) score += 15;
    if (data.attendance < 70) score += 30;
    else if (data.attendance < 85) score += 15;
    if (data.extracurricular === "none") score += 10;
    if (data.financialAid === "no") score += 15;
    if (data.year > 2 && data.totalCredits < 60) score += 20;
    if (data.currentCredits < 12) score += 15;
    else if (data.currentCredits > 18) score += 10;
    return score;
  }

  // Function to identify risks
  function identifyRisks(data) {
    const risks = [];
    if (data.gpa < 2.0) {
      risks.push({ name: "Low GPA", level: "high", recommendation: "Provide academic tutoring and study skills workshops" });
    } else if (data.gpa < 3.0) {
      risks.push({ name: "Moderate GPA", level: "medium", recommendation: "Offer optional study groups and academic counseling" });
    }
    if (data.attendance < 70) {
      risks.push({ name: "Poor Attendance", level: "high", recommendation: "Implement attendance improvement plan and regular check-ins" });
    } else if (data.attendance < 85) {
      risks.push({ name: "Moderate Attendance", level: "medium", recommendation: "Send attendance reminders and offer incentives for improvement" });
    }
    if (data.extracurricular === "none") {
      risks.push({ name: "No Extracurricular Activities", level: "low", recommendation: "Encourage participation in clubs or sports" });
    }
    if (data.financialAid === "no") {
      risks.push({ name: "No Financial Aid", level: "medium", recommendation: "Provide information on scholarship opportunities and financial counseling" });
    }
    if (data.year > 2 && data.totalCredits < 60) {
      risks.push({ name: "Insufficient Credits for Year Level", level: "high", recommendation: "Schedule academic advising to create a credit catch-up plan" });
    }
    if (data.currentCredits < 12) {
      risks.push({ name: "Low Current Credit Load", level: "medium", recommendation: "Discuss potential for adding courses or addressing barriers to full-time enrollment" });
    } else if (data.currentCredits > 18) {
      risks.push({ name: "High Current Credit Load", level: "low", recommendation: "Monitor for signs of academic stress and offer time management resources" });
    }
    return risks;
  }

  // Handle the assess button click
  document.getElementById('assess-button').addEventListener('click', function() {
    const riskScore = calculateRiskScore(studentData);
    const risks = identifyRisks(studentData);
    renderAssessmentResults(riskScore, risks);
  });

  // Function to render the assessment results
  function renderAssessmentResults(score, risks) {
    const resultContainer = document.getElementById('assessment-result');
    let resultHTML = `
      <div class="card w-full max-w-2xl mx-auto mt-4">
        <h3>Overall Risk Score: ${score}</h3>
        <p class="${score < 30 ? 'text-green-500' : score < 60 ? 'text-yellow-500' : 'text-red-500'}">
          ${score < 30 ? 'Low Risk' : score < 60 ? 'Medium Risk' : 'High Risk'}
        </p>
      </div>
      <div class="card w-full max-w-2xl mx-auto mt-4">
        <h3>Identified Risks and Recommendations:</h3>
        ${risks.map(risk => `
          <div class="border-l-4 pl-4 py-2" style="border-color: ${risk.level === 'high' ? 'red' : risk.level === 'medium' ? 'yellow' : 'green'};">
            <h4>${risk.name}</h4>
            <p>${risk.recommendation}</p>
          </div>
        `).join('')}
      </div>
    `;
    resultContainer.innerHTML = resultHTML;
  }
</script>
