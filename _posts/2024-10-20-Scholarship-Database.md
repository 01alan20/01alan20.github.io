---
layout: post
title: Finding Scholarships for Students Studying at USA Universities
subtitle: creating a database for students to search
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

This is just a sample of available scholarships. For me, it was an opportunity to create a sample database that people can search.

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
            <option value="">Select Enrollment Level</option> <!-- Make sure they choose an option -->
            <option value="college junior">College Junior</option>
            <option value="college freshman">College Freshman</option>
            <option value="high school senior">High School Senior</option>
            <option value="doctoral-level study">Doctoral-Level Study</option>
            <option value="master's-level study">Master's-Level Study</option>
        </select>
        <button onclick="addSelectedOption('enrollment')">Add</button>
        <div class="selected-options" id="enrollment-selected"></div>

        <!-- Race -->
        <label for="race">Race:</label>
        <select id="race">
            <option value="">Select Race</option> <!-- Make sure they choose an option -->
            <option value="black/african american">Black/African American</option>
            <option value="hispanic/latino">Hispanic/Latino</option>
            <option value="asian">Asian</option>
            <option value="native american">Native American</option>
            <option value="white">White</option>
        </select>
        <button onclick="addSelectedOption('race')">Add</button>
        <div class="selected-options" id="race-selected"></div>

        <!-- Major -->
        <label for="major">Major:</label>
        <select id="major">
            <option value="">Select Major</option> <!-- Make sure they choose an option -->
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business">Business</option>
        </select>
        <button onclick="addSelectedOption('major')">Add</button>
        <div class="selected-options" id="major-selected"></div>

        <!-- Ethnicity -->
        <label for="ethnicity">Ethnicity:</label>
        <select id="ethnicity">
            <option value="">Select Ethnicity</option> <!-- Make sure they choose an option -->
            <option value="black/african american">Black/African American</option>
            <option value="hispanic/latino">Hispanic/Latino</option>
            <option value="asian">Asian</option>
            <option value="native american">Native American</option>
            <option value="white">White</option>
        </select>
        <button onclick="addSelectedOption('ethnicity')">Add</button>
        <div class="selected-options" id="ethnicity-selected"></div>

        <button onclick="validateAndSearch()">Search</button>
    </div>

    <div id="results"></div>
    <div id="pagination"></div> <!-- Pagination buttons will be rendered here -->

    <script>
        let scholarshipsData = [];
        let currentPage = 1;
        const itemsPerPage = 50;  // Set number of items to display per page

        // Load JSON data on page load
        window.onload = function () {
            fetch('https://01alan20.github.io/assets/json/scholarships_data_truncated.json')
                .then(response => response.json())
                .then(data => {
                    scholarshipsData = data;
                    console.log("Data loaded: ", scholarshipsData);
                })
                .catch(error => console.error('Error loading JSON:', error));
        };

        // Store selected options for each category
        const selectedOptions = {
            enrollment: [],
            race: [],
            major: [],
            ethnicity: []
        };

        // Add selected option to the confirmation list below the select box
        function addSelectedOption(selectId) {
            const select = document.getElementById(selectId);
            const value = select.value.toLowerCase();

            if (value && !selectedOptions[selectId].includes(value)) {
                selectedOptions[selectId].push(value);

                const selectedDiv = document.getElementById(`${selectId}-selected`);
                selectedDiv.innerHTML += `
                    <div class="selected-option">
                        ${value}
                        <span class="remove-option" onclick="removeSelectedOption('${selectId}', '${value}')">x</span>
                    </div>
                `;
            }
        }

        // Remove selected option
        function removeSelectedOption(selectId, value) {
            selectedOptions[selectId] = selectedOptions[selectId].filter(opt => opt !== value);
            const selectedDiv = document.getElementById(`${selectId}-selected`);
            selectedDiv.innerHTML = selectedOptions[selectId].map(opt => `
                <div class="selected-option">
                    ${opt}
                    <span class="remove-option" onclick="removeSelectedOption('${selectId}', '${opt}')">x</span>
                </div>
            `).join('');
        }

        // Validate that the user has made a selection in each area before searching
        function validateAndSearch() {
            const isValid = selectedOptions.enrollment.length > 0 &&
                            selectedOptions.race.length > 0 &&
                            selectedOptions.major.length > 0 &&
                            selectedOptions.ethnicity.length > 0;

            if (isValid) {
                searchScholarships();
            } else {
                alert("Please make a selection in each category.");
            }
        }

        // Search scholarships and paginate the results
        function searchScholarships() {
            console.log('Search button clicked');
            
            const enrollmentLevels = selectedOptions.enrollment;
            const races = selectedOptions.race;
            const majors = selectedOptions.major;
            const ethnicities = selectedOptions.ethnicity;

            console.log('Filters applied: ', { enrollmentLevels, races, majors, ethnicities });

            const filteredResults = scholarshipsData.filter(scholarship => {
                const matchesEnrollment = enrollmentLevels.some(level => scholarship['Enrollment level'] && scholarship['Enrollment level'].toLowerCase().includes(level));
                const matchesRace = races.some(race => scholarship['Race'] && scholarship['Race'].toLowerCase().includes(race));
                const matchesMajor = majors.some(major => scholarship['Major'] && scholarship['Major'].toLowerCase().includes(major));
                const matchesEthnicity = ethnicities.some(ethnicity => scholarship['Ethnicity'] && scholarship['Ethnicity'].toLowerCase().includes(ethnicity));

                return matchesEnrollment && matchesRace && matchesMajor && matchesEthnicity;
            });

            console.log('Filtered results:', filteredResults);
            paginateResults(filteredResults);
        }

        // Paginate results and display only a portion of the data
        function paginateResults(filteredResults) {
            const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);

            displayResults(paginatedResults);
            displayPagination(totalPages);
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

        // Display filtered results
        function displayResults(filteredResults) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (filteredResults.length === 0) {
                resultsDiv.innerHTML = '<p>No scholarships found matching the criteria.</p>';
            } else {
                filteredResults.forEach(scholarship => {
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
    </script>
</body>
</html>
