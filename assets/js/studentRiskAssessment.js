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
