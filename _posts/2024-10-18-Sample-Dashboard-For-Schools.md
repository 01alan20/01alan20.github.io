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
<div class="container mx-auto" id="admin-dashboard">
  <div class="card w-full max-w-2xl mx-auto">
    <h2>University Student Risk Dashboard</h2>
    <p>Overview of student risk assessments</p>

    <!-- Summary Section -->
    <div class="summary-section">
      <div class="card">
        <h3>Total Students: <span id="total-students-admin">0</span></h3>
      </div>
      <div class="card">
        <h3>High Risk Students: <span id="high-risk-students-admin">0</span></h3>
        <p id="high-risk-percentage-admin">0% of total</p>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="space-y-2">
      <label for="search-admin">Search students or advisors</label>
      <input id="search-admin" type="text" placeholder="Search students or advisors..." />
    </div>

    <!-- Student Risk Table -->
    <table class="table" id="student-table-admin">
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
      <tbody id="table-body-admin">
        <!-- Rows will be inserted dynamically -->
      </tbody>
    </table>
  </div>
</div>

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

<script>
  // Separate scripts for Admin Dashboard and Student Risk Assessment

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

  // Render table rows for Admin Dashboard
  function renderTableAdmin(data) {
    const tableBody = document.getElementById('table-body-admin');
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

  // Update the summary section for Admin Dashboard
  function updateSummaryAdmin(data) {
    const totalStudents = data.length;
    const highRiskStudents = data.filter(student => student.riskScore >= 60).length;
    document.getElementById('total-students-admin').innerText = totalStudents;
    document.getElementById('high-risk-students-admin').innerText = highRiskStudents;
    document.getElementById('high-risk-percentage-admin').innerText = `${((highRiskStudents / totalStudents) * 100).toFixed(1)}% of total`;
  }

  // Initialize Admin Dashboard on page load
  document.addEventListener('DOMContentLoaded', function () {
    renderTableAdmin(students);
    updateSummaryAdmin(students);
  });
</script>
