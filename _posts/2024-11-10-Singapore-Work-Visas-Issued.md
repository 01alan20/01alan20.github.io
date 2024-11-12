---
layout: post
title: Singapore Work Visas Issued
subtitle: Many people are moving out but visas are continuing to be issued
thumbnail-img: 
share-img: 
tags: [data, singapore]
author: Alan Cromlish
---

# Foreign Workforce Visualization

<h2 style="text-align: center;">Foreign Workforce Numbers (2019 - 2024)</h2>

<canvas id="workforceChart"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('workforceChart').getContext('2d');
        const workforceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Dec 2019', 'Dec 2020', 'Dec 2021', 'Dec 2022', 'Dec 2023', 'Jun 2024'],
                datasets: [
                    {
                        label: 'Employment Pass (EP)',
                        data: [193700, 177100, 161700, 187300, 205400, 202400],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'S Pass',
                        data: [200000, 174000, 161800, 177900, 178500, 176400],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Work Permit (Total)',
                        data: [999000, 848200, 849700, 1033500, 1113000, 1138200],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Other work passes',
                        data: [34700, 32200, 27200, 25400, 28500, 28200],
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Total foreign workforce',
                        data: [1427400, 1231500, 1200400, 1424200, 1525500, 1545200],
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time Period'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Workers'
                        }
                    }
                }
            }
        });
    });
</script>

<style>
    canvas {
        max-width: 800px;
        margin: 20px auto;
    }
</style>
