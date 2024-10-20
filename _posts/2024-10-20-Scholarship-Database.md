---
layout: post
title: Finding Scholarships for Students Studying at USA Universities
subtitle: creating a database to for students to search
thumbnail-img: 
share-img: 
tags: [data, student retention, dashboard]
author: Alan Cromlish
---

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
    </style>
</head>
<body>
    <h1>Scholarship Search</h1>

    <div id="searchForm">
        <label for="enrollment">Enrollment Level:</label>
        <select id="enrollment" multiple>
            <option value="college junior">College Junior</option>
            <option value="college freshman">College Freshman</option>
            <option value="high school senior">High School Senior</option>
            <option value="doctoral-level study">Doctoral-Level Study</option>
            <option value="master's-level study">Master's-Level Study</option>
            <!-- Add more options as needed -->
        </select><br>

        <label for="nationality">Nationality:</label>
        <select id="nationality" multiple>
            <option value="american">American</option>
            <option value="canadian">Canadian</option>
            <option value="british">British</option>
            <option value="indian">Indian</option>
            <option value="chinese">Chinese</option>
            <!-- Add more options as needed -->
        </select><br>

        <label for="major">Major:</label>
        <select id="major" multiple>
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business">Business</option>
            <!-- Add more options as needed -->
        </select><br>

        <label for="ethnicity">Ethnicity:</label>
        <select id="ethnicity" multiple>
            <option value="black/african american">Black/African American</option>
            <option value="hispanic/latino">Hispanic/Latino</option>
            <option value="asian">Asian</option>
            <option value="native american">Native American</option>
            <option value="white">White</option>
            <!-- Add more options as needed -->
        </select><br>

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

        function getSelectedValues(selectId) {
            const selectedOptions = Array.from(document.getElementById(selectId).selectedOptions);
            return selectedOptions.map(option => option.value.toLowerCase());
        }

        function searchScholarships() {
            // Get selected options
            const enrollmentLevels = getSelectedValues('enrollment');
            const nationalities = getSelectedValues('nationality');
            const majors = getSelectedValues('major');
            const ethnicities = getSelectedValues('ethnicity');

            // Filter results based on inputs
            const filteredResults = scholarshipsData.filter(scholarship => {
                const matchesEnrollment = enrollmentLevels.length === 0 || enrollmentLevels.some(level => scholarship['Enrollment level']?.toLowerCase().includes(level));
                const matchesNationality = nationalities.length === 0 || nationalities.some(nation => scholarship['Nationality']?.toLowerCase().includes(nation));
                const matchesMajor = majors.length === 0 || majors.some(major => scholarship['Major']?.toLowerCase().includes(major));
                const matchesEthnicity = ethnicities.length === 0 || ethnicities.some(ethnicity => scholarship['Ethnicity']?.toLowerCase().includes(ethnicity));

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
    </script>
</body>
</html>
