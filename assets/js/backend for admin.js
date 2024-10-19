<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Risk Dashboard</title>
    <style>
        /* Add your styles here for cards and table */
        .card { border: 1px solid #ddd; padding: 16px; margin-bottom: 16px; }
        .risk-low { background-color: lightgreen; }
        .risk-medium { background-color: yellow; }
        .risk-high { background-color: lightcoral; }
    </style>
</head>
<body>

    <div id="dashboard"></div>

    <script>
        const mockStudents = [
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

        let sortConfig = { key: 'name', direction: 'asc' };
        let searchTerm = '';

        function renderDashboard() {
            const highRiskCount = mockStudents.filter(student => student.riskScore >= 60).length;

            const dashboard = `
                <div class="card">
                    <h2>University Student Risk Dashboard</h2>
                    <p>Total Students: ${mockStudents.length}</p>
                    <p>High Risk Students: ${highRiskCount} (${((highRiskCount / mockStudents.length) * 100).toFixed(1)}%)</p>
                </div>
                <div>
                    <input id="search" type="text" placeholder="Search students or advisors..." />
                    <table>
                        <thead>
                            <tr>
                                <th onclick="sortTable('name')">Name</th>
                                <th onclick="sortTable('year')">Year</th>
                                <th onclick="sortTable('gpa')">GPA</th>
                                <th onclick="sortTable('riskScore')">Risk Score</th>
                                <th onclick="sortTable('advisor')">Advisor</th>
                                <th>Risk Level</th>
                            </tr>
                        </thead>
                        <tbody id="students-table">
                        ${renderStudents(mockStudents)}
                        </tbody>
                    </table>
                </div>
            `;

            document.getElementById('dashboard').innerHTML = dashboard;

            // Attach event listener for search input
            document.getElementById('search').addEventListener('input', function(e) {
                searchTerm = e.target.value.toLowerCase();
                renderStudents(mockStudents);
            });
        }

        function renderStudents(students) {
            let filteredStudents = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm) || 
                student.advisor.toLowerCase().includes(searchTerm)
            );

            filteredStudents = sortStudents(filteredStudents);

            const studentRows = filteredStudents.map(student => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.year}</td>
                    <td>${student.gpa.toFixed(2)}</td>
                    <td>${student.riskScore}</td>
                    <td>${student.advisor}</td>
                    <td class="${getRiskClass(student.riskScore)}">
                        ${getRiskLevel(student.riskScore)}
                    </td>
                </tr>
            `).join('');

            document.getElementById('students-table').innerHTML = studentRows;
        }

        function sortStudents(students) {
            const { key, direction } = sortConfig;
            return students.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        function sortTable(key) {
            if (sortConfig.key === key) {
                sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.key = key;
                sortConfig.direction = 'asc';
            }
            renderStudents(mockStudents);
        }

        function getRiskClass(riskScore) {
            if (riskScore < 30) return 'risk-low';
            if (riskScore < 60) return 'risk-medium';
            return 'risk-high';
        }

        function getRiskLevel(riskScore) {
            if (riskScore < 30) return 'Low';
            if (riskScore < 60) return 'Medium';
            return 'High';
        }

        // Initialize the dashboard on page load
        document.addEventListener('DOMContentLoaded', renderDashboard);
    </script>

</body>
</html>
