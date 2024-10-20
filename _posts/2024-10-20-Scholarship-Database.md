---
layout: post
title: Finding Scholarships for Students Studying at USA Universities
subtitle: creating a database to for students to search
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

This is just a sample of available scholarships.  For me, it was an opportunity to create a sample database that people can search.  
<!DOCTYPE html>
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
    </style>
</head>
<body>
    <h1>Scholarship Search</h1>

    <div id="searchForm">
        <!-- Enrollment Level -->
        <label for="enrollment">Enrollment Level:</label>
        <select id="enrollment">
            <option value="all">All</option>
            <option value="college junior">College Junior</option>
            <option value="college freshman">College Freshman</option>
            <option value="high school senior">High School Senior</option>
            <option value="doctoral-level study">Doctoral-Level Study</option>
            <option value="master's-level study">Master's-Level Study</option>
        </select>
        <button onclick="addSelectedOption('enrollment')">Add</button>
        <div class="selected-options" id="enrollment-selected"></div>

        <!-- Nationality -->
        <label for="nationality">Nationality:</label>
        <select id="nationality">
            <option value="all">All</option>
            <option value="american">American</option>
            <option value="canadian">Canadian</option>
            <option value="british">British</option>
            <option value="indian">Indian</option>
            <option value="chinese">Chinese</option>
        </select>
        <button onclick="addSelectedOption('nationality')">Add</button>
        <div class="selected-options" id="nationality-selected"></div>

        <!-- Major -->
        <label for="major">Major:</label>
        <select id="major">
            <option value="all">All</option>
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
            <option value="all">All</option>
            <option value="black/african american">Black/African American</option>
            <option value="hispanic/latino">Hispanic/Latino</option>
            <option value="asian">Asian</option>
            <option value="native american">Native American</option>
            <option value="white">White</option>
        </select>
        <button onclick="addSelectedOption('ethnicity')">Add</button>
        <div class="selected-options" id="ethnicity-selected"></div>

        <button onclick="searchScholarships()">Search</button>
    </div>

    <div id="results"></div>

    <script>
        let scholarshipsData = [];

        // Load JSON data on page load
        window.onload = function () {
            fetch('assets/json/scholarships_data_truncated.json')  // Pointing to truncated JSON file
                .then(response => response.json())
                .then(data => {
                    scholarshipsData = data;
                })
                .catch(error => console.error('Error loading JSON:', error));
        };

        // Store selected options for each category
        const selectedOptions = {
            enrollment: [],
            nationality: [],
            major: [],
            ethnicity: []
        };

        // Add selected option to the confirmation list below the select box
        function addSelectedOption(selectId) {
            const select = document.getElementById(selectId);
            const value = select.value.toLowerCase();

            if (!selectedOptions[selectId].includes(value) && value !== 'all') {
                selectedOptions[selectId].push(value);

                const selectedDiv = document.getElementById(`${selectId}-selected`);
                selectedDiv.innerHTML += `
                    <div class="selected-option">
                        ${value}
                        <span class="remove-option" onclick="removeSelectedOption('${selectId}', '${value}')">x</span>
                    </div>
                `;
            } else if (value === 'all') {
                selectedOptions[selectId] = ['all'];  // Set to 'all' and ignore other options
                document.getElementById(`${selectId}-selected`).innerHTML = '<div class="selected-option">All</div>';
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

        function searchScholarships() {
            // Get selected values from selectedOptions object
            const enrollmentLevels = selectedOptions.enrollment.length ? selectedOptions.enrollment : ['all'];
            const nationalities = selectedOptions.nationality.length ? selectedOptions.nationality : ['all'];
            const majors = selectedOptions.major.length ? selectedOptions.major : ['all'];
            const ethnicities = selectedOptions.ethnicity.length ? selectedOptions.ethnicity : ['all'];

            // Filter results based on inputs
            const filteredResults = scholarshipsData.filter(scholarship => {
                const matchesEnrollment = enrollmentLevels.includes('all') || enrollmentLevels.some(level => scholarship['Enrollment level']?.toLowerCase().includes(level) || !scholarship['Enrollment level']);
                const matchesNationality = nationalities.includes('all') || nationalities.some(nation => scholarship['Nationality']?.toLowerCase().includes(nation) || !scholarship['Nationality']);
                const matchesMajor = majors.includes('all') || majors.some(major => scholarship['Major']?.toLowerCase().includes(major) || !scholarship['Major']);
                const matchesEthnicity = ethnicities.includes('all') || ethnicities.some(ethnicity => scholarship['Ethnicity']?.toLowerCase().includes(ethnicity) || !scholarship['Ethnicity']);

                return matchesEnrollment && matchesNationality && matchesMajor && matchesEthnicity;
            });

            // Display the results
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';  // Clear previous results

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
                            <p><strong>URL:</strong> <a href="${scholarship['URL']}" target="_blank">${scholarship['URL']}</a></p>
                        </div>
                    `;
                    resultsDiv.innerHTML += resultItem;
                });
            }
        }
   
