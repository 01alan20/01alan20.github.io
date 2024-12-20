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
            type: 'bar',  // Change to 'bar' type for stacked bar chart
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],  // Update labels to year only
                datasets: [
                    {
                        label: 'Employment Pass (EP)',
                        data: [193700, 177100, 161700, 187300, 205400, 202400],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)'
                    },
                    {
                        label: 'S Pass',
                        data: [200000, 174000, 161800, 177900, 178500, 176400],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)'
                    },
                    {
                        label: 'Work Permit (Total)',
                        data: [999000, 848200, 849700, 1033500, 1113000, 1138200],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)'
                    },
                    {
                        label: 'Other work passes',
                        data: [34700, 32200, 27200, 25400, 28500, 28200],
                        backgroundColor: 'rgba(153, 102, 255, 0.7)'
                    },
                    {
                        label: 'Total foreign workforce',
                        data: [1427400, 1231500, 1200400, 1424200, 1525500, 1545200],
                        backgroundColor: 'rgba(255, 206, 86, 0.7)',
                        hidden: true  // Hide total workforce by default to focus on individual categories
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue.toLocaleString()}`;
                            }
                        }
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
                            text: 'Year',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        stacked: true,  // Enable stacking on x-axis
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Workers',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        stacked: true,  // Enable stacking on y-axis
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)'
                        }
                    }
                }
            }
        });
    });
</script>

<style>
    canvas {
        max-width: 1000px;
        margin: 20px auto;
        display: block;
    }
</style>
