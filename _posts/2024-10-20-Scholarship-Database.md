---
layout: post
title: Finding Scholarships for Students Studying at USA Universities
subtitle: Creating a searchable database for students
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

This is a curated database of available scholarships for students studying at USA universities. It allows users to search scholarships by enrollment level, race, major, and ethnicity, with easy pagination to browse through the results.

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Search</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        #searchForm {
            margin: 20px 0;
        }
        label {
            display: inline-block;
            width: 150px;
            margin-bottom: 10px;
        }
        select {
            width: 300px;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        #results {
            margin-top: 20px;
        }
        .result-item {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
        }
        .result-item h3 {
            margin: 0 0 5px;
        }
        .result-item p {
            margin: 0 0 10px;
        }
        .selected-options {
            margin: 10px 0;
        }
        .selected-option {
            display: inline-block;
            padding: 5px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            margin-right: 5px;
            cursor: pointer;
        }
        .remove-option {
            margin-left: 10px;
            color: red;
            cursor: pointer;
        }
        #pagination button {
            padding: 5px 10px;
            margin: 2px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        #pagination button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Scholarship Search</h1>

    <div id="searchForm">
        <!-- Enrollment Level -->
        <label for="enrollment">Enrollment Level:</label>
        <select id="enrollment">
            <option value="all">All Enrollment Levels</option> <!-- Default is "all" -->
            <option value="college junior">College Junior</option>
            <option value="college freshman">College Freshman</option>
            <option value="high school senior">High School Senior</option>
            <option value="doctoral-level study">Doctoral-Level Study</option>
            <option value="master's-level study">Master's-Level Study</option>
        </select>

        <!-- Race -->
        <label for="race">Race:</label>
        <select id="race">
            <option value="all">All Races</option> <!-- Default is "all" -->
            <option value="black/african american">Black/African American</option>
            <option value="hispanic/latino">Hispanic/Latino</option>
            <option value="asian">Asian</option>
            <option value="native american">Native American</option>
            <option value="white">White</option>
        </select>

        <!-- Major -->
        <label for="major">Major:</label>
        <select id="major">
            <option value="all">All Majors</option> <!-- Default is "all" -->
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business">Business</option>
        </select>

        <!-- Ethnicity -->
        <label for="ethnicity">Ethnicity:</label>
        <select id="ethnicity">
            <option value="all">All Ethnicities</option> <!-- Default is "all" -->
            <option value="italian">Italian</option>
            <option value="armenian">Armenian</option>
            <option value="jewish">Jewish</option>
            <option value="chinese">Chinese</option>
            <option value="caribbean">Caribbean</option>
            <option value="spanish">Spanish</option>
        </select>

        <button onclick="validateAndSearch()">Search</button>
    </div>

    <div id="results"></div>
    <div id="pagination"></div> <!-- Pagination buttons will be rendered here -->

    <script>
        let scholarshipsData = [];
        let currentPage = 1;
        const itemsPerPage = 50;  // Number of items per page

        // Load JSON data on page load
        window.onload = function () {
            fetch('https://01alan20.github.io/assets/json/scholarships_data_truncated.json')
                .then(response => response.json())
                .then(data => {
                    scholarshipsData = data;
                    paginateResults(scholarshipsData); // Initial load with default settings
                })
                .catch(error => console.error('Error loading JSON:', error));
        };

        // Default options for each category
        const selectedOptions = {
            enrollment: ['all'],
            race: ['all'],
            major: ['all'],
            ethnicity: ['all']
        };

        // Validate and search scholarships based on selected criteria
        function validateAndSearch() {
            selectedOptions.enrollment = [document.getElementById('enrollment').value.toLowerCase()];
            selectedOptions.race = [document.getElementById('race').value.toLowerCase()];
            selectedOptions.major = [document.getElementById('major').value.toLowerCase()];
            selectedOptions.ethnicity = [document.getElementById('ethnicity').value.toLowerCase()];

            searchScholarships();
        }

        // Search scholarships and paginate results
        function searchScholarships() {
            const filteredResults = scholarshipsData.filter(scholarship => {
                const matchesEnrollment = selectedOptions.enrollment.includes('all') || selectedOptions.enrollment.some(level => scholarship['Enrollment level'] && scholarship['Enrollment level'].toLowerCase().includes(level));
                const matchesRace = selectedOptions.race.includes('all') || selectedOptions.race.some(race => scholarship['Race'] && scholarship['Race'].toLowerCase().includes(race));
                const matchesMajor = selectedOptions.major.includes('all') || selectedOptions.major.some(major => scholarship['Major'] && scholarship['Major'].toLowerCase().includes(major));
                const matchesEthnicity = selectedOptions.ethnicity.includes('all') || selectedOptions.ethnicity.some(ethnicity => scholarship['Ethnicity'] && scholarship['Ethnicity'].toLowerCase().includes(ethnicity));

                return matchesEnrollment && matchesRace && matchesMajor && matchesEthnicity;
            });

            paginateResults(filteredResults);
        }

        // Paginate and display results
        function paginateResults(filteredResults) {
            const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);

            displayResults(paginatedResults);
            displayPagination(totalPages);
        }

        // Display the results
        function displayResults(paginatedResults) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (paginatedResults.length === 0) {
                resultsDiv.innerHTML = '<p>No scholarships found matching the criteria.</p>';
            } else {
                paginatedResults.forEach(scholarship => {
                    const resultItem = `
                        <div class="result-item">
                            <h3>${scholarship['Title']}</h3>
                            <p><strong>Description:</strong> ${scholarship['Description']}</p>
                            <p><strong>Average Award:</strong> ${scholarship['Average award'] || 'N/A'}</p>
                            <p><strong>Deadline:</strong> ${scholarship['Deadline'] || 'N/A'}</p>
                            <p><strong>Apply URL:</strong> <a href="${scholarship['Apply URL']}" target="_blank">${scholarship['Apply URL']}</a></p>
                        </div>
                    `;
                    resultsDiv.innerHTML += resultItem;
                });
            }
        }

        // Display pagination buttons
        function displayPagination(totalPages) {
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.innerText = i;
                pageButton.onclick = function() {
                    currentPage = i;
                    searchScholarships();  // Re-filter results and show the current page
                };
                paginationDiv.appendChild(pageButton);
            }
        }
    </script>
</body>
</html>
