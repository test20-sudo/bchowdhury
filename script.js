// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // More subtle background animation
    const backgroundElement = document.querySelector('.background-animation');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // Subtle parallax effect for background - reduced movement
        backgroundElement.style.backgroundPosition = `${50 + (mouseX - 0.5) * 20}% ${50 + (mouseY - 0.5) * 20}%`;
        
        // Removed the transform for more subtlety
    });
    
    // Tab navigation functionality with animations
    const tabLinks = document.querySelectorAll('.tabs a');
    const sections = document.querySelectorAll('main > section');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            document.querySelectorAll('.tabs li').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.parentElement.classList.add('active');
            
            // Show the corresponding section
            const targetId = this.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.style.display = 'none';
                
                // Add fade-out effect
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Small delay for animation purposes
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                    targetSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }, 50);
            }
        });
    });
    
    // Awards rotation animation - kept this animation as it's for content
    const awardTexts = document.querySelectorAll('.award-text');
    let currentAwardIndex = 0;
    
    // Show the first award
    if (awardTexts.length > 0) {
        awardTexts[0].classList.add('active');
    }
    
    // Rotate awards every 3 seconds
    setInterval(() => {
        // Hide current award
        awardTexts[currentAwardIndex].classList.remove('active');
        
        // Move to next award
        currentAwardIndex = (currentAwardIndex + 1) % awardTexts.length;
        
        // Show next award
        awardTexts[currentAwardIndex].classList.add('active');
    }, 3000);
    
    // Removed floating animations for About section boxes
    
    // Add hover effects for buttons - kept button animations
    const buttons = document.querySelectorAll('.tabs a');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.parentElement.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            }
        });
    });
    
    // Removed particle effects for more subtlety

    // Update the number animation function to handle formatted values
    function animateNumber(element, target) {
        const duration = 2000;
        const steps = 50;
        const stepDuration = duration / steps;
        let current = 0;
        const increment = target / steps;
        const finalValue = element.getAttribute('data-value');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = finalValue; // Use the formatted value at the end
                clearInterval(timer);
            } else {
                // Format numbers while animating
                if (target >= 1000000) { // For millions (project value)
                    element.textContent = '₹' + Math.floor(current/1000000) + 'M';
                } else if (target >= 1000) { // For thousands (citations)
                    element.textContent = Math.floor(current).toLocaleString();
                } else { // For smaller numbers (papers)
                    element.textContent = Math.floor(current);
                }
            }
        }, stepDuration);
    }

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateNumber(stat, target);
                });
                statsObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    // Observe the stats container
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Add error handling for CV download
    const cvButton = document.querySelector('.cv-button');
    if (cvButton) {
        cvButton.addEventListener('click', function(e) {
            // Check if the file exists
            fetch(this.href)
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        alert('CV file is currently unavailable. Please try again later.');
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    alert('Unable to download CV. Please try again later.');
                });
        });
    }

    // Update stats from config
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const type = stat.closest('.stat-item').querySelector('.stat-label').textContent.toLowerCase();
        if (type.includes('project')) {
            stat.setAttribute('data-target', professorStats.projectValue.number);
            stat.setAttribute('data-value', professorStats.projectValue.display);
        } else if (type.includes('citations')) {
            stat.setAttribute('data-target', professorStats.citations.number);
            stat.setAttribute('data-value', professorStats.citations.display);
        } else if (type.includes('papers')) {
            stat.setAttribute('data-target', professorStats.papers.number);
            stat.setAttribute('data-value', professorStats.papers.display);
        }
    });
});