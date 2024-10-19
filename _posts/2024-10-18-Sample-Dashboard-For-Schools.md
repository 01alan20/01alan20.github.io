---
layout: post
title: Sample webapps for predicting student risk and an admin view
subtitle: 
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---
<h1>Admin View Sample</h1>
<!-- Admin Dashboard HTML Structure -->
<div class="container mx-auto">
  <div class="card w-full max-w-2xl mx-auto">
    <h2>University Student Risk Dashboard</h2>
    <p>Overview of student risk assessments</p>

    <!-- Summary Section -->
    <div class="summary-section">
      <div class="card">
        <h3>Total Students: <span id="total-students">0</span></h3>
      </div>
      <div class="card">
        <h3>High Risk Students: <span id="high-risk-students">0</span></h3>
        <p id="high-risk-percentage">0% of total</p>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="space-y-2">
      <label for="search">Search students or advisors</label>
      <input id="search" type="text" placeholder="Search students or advisors..." />
    </div>

    <!-- Student Risk Table -->
    <table class="table" id="student-table">
      <thead>
        <tr>
          <th data-sort="name">Name &#x21C5;</th>
          <th data-sort="year">Year &#x21C5;</th>
          <th data-sort="gpa">GPA &#x21C5;</th>
          <th data-sort="riskScore">Risk Score &#x21C5;</th>
          <th data-sort="advisor">Academic Advisor &#x21C5;</th>
          <th>Risk Level</th>
        </tr>
      </thead>
      <tbody id="table-body">
        <!-- Rows will be inserted dynamically -->
      </tbody>
    </table>
  </div>
</div>

<script>
  const students = [
    { id: 1, name: "Alice Johnson", year: 2, gpa: 3.8, riskScore: 15, advisor: "Dr. Emily Parker" },
    { id: 2, name: "Bob Smith", year: 3, gpa: 2.1, riskScore: 65, advisor: "Prof. Michael Brown" },
    { id: 3, name: "Charlie Brown", year: 1, gpa: 3.2, riskScore: 25, advisor: "Dr. Sarah Lee" },
    { id: 4, name: "Diana Ross", year: 4, gpa: 3.9, riskScore: 10, advisor: "Prof. David Wilson" },
    { id: 5, name: "Ethan Hunt", year: 2, gpa: 2.7, riskScore: 45, advisor: "Dr. Emily Parker" },
    { id: 6, name: "Fiona Apple", year: 3, gpa: 3.5, riskScore: 20, advisor: "Prof. Michael Brown" },
    { id: 7, name: "George Michael", year: 1, gpa: 2.0, riskScore: 70, advisor: "Dr. Sarah Lee" },
    { id: 8, name: "Hannah Montana", year: 4, gpa: 3.3, riskScore: 30, advisor: "Prof. David Wilson" },
    { id: 9, name: "Ian McKellen", year: 2, gpa: 3.7, riskScore: 15, advisor: "Dr. Emily Parker" },
    { id: 10, name: "Julia Roberts", year: 3, gpa: 2.5, riskScore: 55, advisor: "Prof. Michael Brown" },
  ];

  // Render table rows
  function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';  // Clear previous rows
    data.forEach(student => {
      const riskLevel = student.riskScore < 30 ? 'Low' : student.riskScore < 60 ? 'Medium' : 'High';
      const riskColor = riskLevel === 'Low' ? 'green' : riskLevel === 'Medium' ? 'yellow' : 'red';
      const row = `
        <tr>
          <td>${student.name}</td>
          <td>${student.year}</td>
          <td>${student.gpa.toFixed(2)}</td>
          <td>${student.riskScore}</td>
          <td>${student.advisor}</td>
          <td><span style="color: ${riskColor}; font-weight: bold;">${riskLevel}</span></td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }

  // Update the summary section
  function updateSummary(data) {
    const totalStudents = data.length;
    const highRiskStudents = data.filter(student => student.riskScore >= 60).length;
    document.getElementById('total-students').innerText = totalStudents;
    document.getElementById('high-risk-students').innerText = highRiskStudents;
    document.getElementById('high-risk-percentage').innerText = `${((highRiskStudents / totalStudents) * 100).toFixed(1)}% of total`;
  }

  // Sort students by a given key
  function sortTable(key, direction = 'asc') {
    const sortedStudents = [...students].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    renderTable(sortedStudents);
  }

  // Search functionality
  document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredStudents = students.filter(student => {
      return student.name.toLowerCase().includes(searchTerm) ||
             student.advisor.toLowerCase().includes(searchTerm);
    });
    renderTable(filteredStudents);
  });

  // Attach sort functionality to table headers
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', function () {
      const sortKey = this.getAttribute('data-sort');
      const direction = this.classList.contains('asc') ? 'desc' : 'asc';
      sortTable(sortKey, direction);
      this.classList.toggle('asc', direction === 'asc');
      this.classList.toggle('desc', direction === 'desc');
    });
  });

  // Initialize the table and summary
  document.addEventListener('DOMContentLoaded', function () {
    renderTable(students);
    updateSummary(students);
  });
</script>

<h1>Student Risk</h1>
<!-- Student Risk Assessment HTML Structure -->

<div class="container mx-auto">
  <div class="card w-full max-w-2xl mx-auto">
    <h2>Student Risk Assessment</h2>
    <p>Enter student information to calculate dropout risk</p>

    <!-- GPA Input -->
    <div class="space-y-2">
      <label for="gpa">GPA (0.0 - 4.0)</label>
      <input type="range" id="gpa" min="0" max="4" step="0.1" value="0">
      <p id="gpa-display" class="text-sm">Current GPA: 0.0</p>
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
    gpa: 0,  // Set initial GPA to 0
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

    // GPA-based risk
    if (data.gpa < 2.0) score += 30;
    else if (data.gpa < 3.0) score += 15;

    // Attendance-based risk
    if (data.attendance < 70) score += 30;
    else if (data.attendance < 85) score += 15;

    // Extracurricular activities risk
    if (data.extracurricular === "none") score += 10;

    // Financial aid risk
    if (data.financialAid === "no") score += 15;

    // Year and credit risk
    if (data.year > 2 && data.totalCredits < 60) score += 20;

    // Current credit load risk
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
