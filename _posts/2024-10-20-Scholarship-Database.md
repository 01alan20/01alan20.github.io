---
layout: post
title: Scholarship Search by Interests and Majors
subtitle: Find scholarships tailored to your interests and field of study
thumbnail-img: 
share-img: 
tags: [scholarships, education, database]
author: Alan Cromlish
---

This database allows students to search for scholarships based on their interests and major fields of study. The results are paginated, showing 10 scholarships per page.

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Search by Interests and Majors</title>
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
    <h1>Scholarship Search by Interests and Majors</h1>

    <div id="searchForm">
        <!-- Interests -->
        <label for="interests">Interests:</label>
        <select id="interests">
            <option value="all">All Interests</option>
            <option value="arts">Arts</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="community service">Community Service</option>
        </select>

        <!-- Major -->
        <label for="major">Major:</label>
        <select id="major">
            <option value="all">All Majors</option>
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business">Business</option>
        </select>

        <button onclick="validateAndSearch()">Search</button>
    </div>

    <div id="results"></div>
    <div id="pagination"></div> <!-- Pagination buttons will be rendered here -->

    <script>
        let scholarshipsData = [];
        let currentPage = 1;
        const itemsPerPage = 10;  // Display 10 scholarships per page

        // Load JSON data on page load
        window.onload = function () {
            fetch('https://01alan20.github.io/assets/json/scholarships_data_truncated.json')
                .then(response => response.json())
                .then(data => {
                    scholarshipsData = data;
                    paginateResults(scholarshipsData); // Show first page by default
                })
                .catch(error => console.error('Error loading JSON:', error));
        };

        // Validate and search scholarships based on selected filters
        function validateAndSearch() {
            const selectedInterest = document.getElementById('interests').value.toLowerCase();
            const selectedMajor = document.getElementById('major').value.toLowerCase();
            searchScholarships(selectedInterest, selectedMajor);
        }

        // Search scholarships based on interests and majors
        function searchScholarships(selectedInterest, selectedMajor) {
            const filteredResults = scholarshipsData.filter(scholarship => {
                const interests = (scholarship['Interests'] || 'all').toLowerCase().split(',');
                const majors = (scholarship['Major'] || 'all').toLowerCase().split(',');

                const matchesInterest = selectedInterest === 'all' || interests.includes(selectedInterest);
                const matchesMajor = selectedMajor === 'all' || majors.includes(selectedMajor);

                return matchesInterest && matchesMajor;
            });

            paginateResults(filteredResults);
        }

        // Paginate the filtered results
        function paginateResults(filteredResults) {
            const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);

            displayResults(paginatedResults);
            displayPagination(totalPages);
        }

        // Display filtered scholarships
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
                            <p><strong>Apply URL:</strong> <a href="${scholarship['Apply URL']}" target="_blank">${scholarship['Apply URL']}</a></p>
                            <p><strong>Average Award:</strong> ${scholarship['Average award'] || 'N/A'}</p>
                            <p><strong>Ethnicity:</strong> ${scholarship['Ethnicity'] || 'N/A'}</p>
                            <p><strong>Race:</strong> ${scholarship['Race'] || 'N/A'}</p>
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
                    validateAndSearch();  // Re-search and show the current page
                };
                paginationDiv.appendChild(pageButton);
            }
        }
    </script>
</body>
</html>
