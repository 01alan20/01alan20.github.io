---
layout: post
title: Sample webapps for predicting student risk
subtitle: individual risk calculator
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
      <input type="number" id="gpa-student" min="0.0" max="4.0" step="0.1" value="2.5">
      <p id="gpa-display-student" class="text-sm">Current GPA: 2.5</p>
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

<script>
document.getElementById('assess-button-student').addEventListener('click', assessRisk);

function assessRisk() {
  const gpa = parseFloat(document.getElementById('gpa-student').value);
  const attendance = parseInt(document.getElementById('attendance-student').value);
  const extracurricular = document.getElementById('extracurricular-student').value;
  const financialAid = document.getElementById('financialAid-student').value;
  const year = parseInt(document.getElementById('year-student').value);
  const totalCredits = parseInt(document.getElementById('totalCredits-student').value);
  const currentCredits = parseInt(document.getElementById('currentCredits-student').value);

  let riskScore = calculateRiskScore(gpa, attendance, extracurricular, financialAid, year, totalCredits, currentCredits);
  let risks = identifyRisks(gpa, attendance, extracurricular, financialAid, year, totalCredits, currentCredits);

  displayResults(riskScore, risks);
}

function calculateRiskScore(gpa, attendance, extracurricular, financialAid, year, totalCredits, currentCredits) {
  let score = 0;
  if (gpa < 2.0) score += 30;
  else if (gpa < 3.0) score += 15;
  if (attendance < 70) score += 30;
  else if (attendance < 85) score += 15;
  if (extracurricular === "none") score += 10;
  if (financialAid === "no") score += 15;
  if (year > 2 && totalCredits < 60) score += 20;
  if (currentCredits < 12) score += 15;
  else if (currentCredits > 18) score += 10;
  return score;
}

function identifyRisks(gpa, attendance, extracurricular, financialAid, year, totalCredits, currentCredits) {
  const risks = [];
  if (gpa < 2.0) {
    risks.push({ name: "Low GPA", level: "high", recommendation: "Provide academic tutoring and study skills workshops" });
  } else if (gpa < 3.0) {
    risks.push({ name: "Moderate GPA", level: "medium", recommendation: "Offer optional study groups and academic counseling" });
  }
  if (attendance < 70) {
    risks.push({ name: "Poor Attendance", level: "high", recommendation: "Implement attendance improvement plan and regular check-ins" });
  } else if (attendance < 85) {
    risks.push({ name: "Moderate Attendance", level: "medium", recommendation: "Send attendance reminders and offer incentives for improvement" });
  }
  if (extracurricular === "none") {
    risks.push({ name: "No Extracurricular Activities", level: "low", recommendation: "Encourage participation in clubs or sports" });
  }
  if (financialAid === "no") {
    risks.push({ name: "No Financial Aid", level: "medium", recommendation: "Provide information on scholarship opportunities and financial counseling" });
  }
  if (year > 2 && totalCredits < 60) {
    risks.push({ name: "Insufficient Credits for Year Level", level: "high", recommendation: "Schedule academic advising to create a credit catch-up plan" });
  }
  if (currentCredits < 12) {
    risks.push({ name: "Low Current Credit Load", level: "medium", recommendation: "Discuss potential for adding courses or addressing barriers to full-time enrollment" });
  } else if (currentCredits > 18) {
    risks.push({ name: "High Current Credit Load", level: "low", recommendation: "Monitor for signs of academic stress and offer time management resources" });
  }
  return risks;
}

function displayResults(riskScore, risks) {
  const resultDiv = document.getElementById('assessment-result-student');
  let riskLevel = riskScore < 30 ? 'Low Risk' : riskScore < 60 ? 'Medium Risk' : 'High Risk';
  let riskColor = riskScore < 30 ? 'green' : riskScore < 60 ? 'yellow' : 'red';

  let html = `<h3>Overall Risk Score: ${riskScore}</h3>
              <p style="color:${riskColor}; font-weight:bold;">${riskLevel}</p>
              <h3>Identified Risks and Recommendations:</h3>`;

  risks.forEach(risk => {
    html += `<div style="border-left: 4px solid ${risk.level === 'high' ? 'red' : risk.level === 'medium' ? 'yellow' : 'green'}; padding-left: 10px;">
               <h4>${risk.name}</h4>
               <p>${risk.recommendation}</p>
             </div>`;
  });

  resultDiv.innerHTML = html;
}
</script>
