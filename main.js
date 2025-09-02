// Navigation functionality
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('animate-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            targetPage.classList.remove('animate-in');
        }, 600);
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    const activeLink = Array.from(navLinks).find(link => 
        link.textContent.toLowerCase() === pageId || 
        (pageId === 'home' && link.textContent.toLowerCase() === 'home')
    );
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Show individual project
function showProject(projectId) {
    showPage(projectId);
}

// Smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth transitions to all elements
    const style = document.createElement('style');
    style.textContent = `
        * {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with home page
    showPage('home');
});

// Add some interactive hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('project-card')) {
        e.target.style.transform = 'translateY(-5px) scale(1.02)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('project-card')) {
        e.target.style.transform = 'translateY(0) scale(1)';
    }
});