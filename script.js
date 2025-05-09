// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure research section is properly initialized
    const researchSection = document.getElementById('research');
    const researchTab = document.querySelector('.tabs a[href="#research"]');
    
    if (researchSection && researchTab) {
        // Fix any display issues with the research section
        researchTab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all sections
            document.querySelectorAll('main > section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show research section
            researchSection.style.display = 'block';
            researchSection.style.opacity = '1';
            researchSection.style.transform = 'translateY(0)';
            
            // Update active tab
            document.querySelectorAll('.tabs li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    }
    
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
    
    // Add country flags to career tiles
    addCountryFlags();
});

// Function to add country flags to career tiles
function addCountryFlags() {
    // Map of countries to their flag codes
    const countryFlags = {
        'India': 'in',
        'Norway': 'no',
        'Germany': 'de',
        'Turkey': 'tr',
        'Saudi Arabia': 'sa',
        'Netherland': 'nl',
        'Netherlands': 'nl',
        'Japan': 'jp'
    };
    
    // Get all career tiles
    const careerTiles = document.querySelectorAll('.career-tile');
    
    careerTiles.forEach(tile => {
        const placeText = tile.querySelector('.tile-place').textContent.trim();
        
        // Check which country is mentioned in the place text
        for (const [country, flagCode] of Object.entries(countryFlags)) {
            if (placeText.includes(country)) {
                // Create flag element
                const flagElement = document.createElement('span');
                flagElement.className = 'country-flag';
                flagElement.innerHTML = `<img src="https://flagcdn.com/24x18/${flagCode}.png" alt="${country} flag" title="${country}">`;
                
                // Add flag to the tile-place div
                const placeElement = tile.querySelector('.tile-place');
                placeElement.insertBefore(flagElement, placeElement.firstChild);
                
                // Add some styling to the tile-place element for proper flag positioning
                placeElement.style.display = 'flex';
                placeElement.style.alignItems = 'center';
                placeElement.style.gap = '8px';
                break;
            }
        }
    });
}

// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize career slider functionality
    initCareerSlider();
    
    // Career section tab functionality
    const tabs = document.querySelectorAll('.tabs a');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            // Hide all sections
            document.querySelectorAll('main section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            document.querySelector(target).style.display = 'block';
            
            // Update active tab
            document.querySelectorAll('.tabs li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
});

function initCareerSlider() {
    const slider = document.querySelector('.career-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const tileWidth = () => {
        const tile = slider.querySelector('.career-tile');
        if (!tile) return 0;
        return tile.offsetWidth + parseFloat(getComputedStyle(tile).marginRight);
    };
    
    // Modified to always return 1 for single tile scrolling
    const getVisibleTiles = () => {
        return 1; // Always scroll exactly 1 tile regardless of screen width
    };
    
    // Navigate slider - always scrolls 1 tile at a time now
    const navigate = (direction) => {
        const scrollAmount = tileWidth(); // Only one tile width
        if (direction === 'next') {
            slider.scrollLeft += scrollAmount;
        } else {
            slider.scrollLeft -= scrollAmount;
        }
    };
    
    // Add click event listeners
    nextBtn.addEventListener('click', () => navigate('next'));
    prevBtn.addEventListener('click', () => navigate('prev'));
    
    // Add touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) {
            navigate('next');
        } else if (touchEndX > touchStartX + 50) {
            navigate('prev');
        }
    };
    
    // Auto-scroll animation - scrolls 1 tile every 5 seconds
    let autoScrollInterval;
    
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            navigate('next');
        }, 5000);
    };
    
    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };
    
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
    slider.addEventListener('touchstart', stopAutoScroll);
    
    // Start auto-scroll
    startAutoScroll();
    
    // Window resize handler
    window.addEventListener('resize', () => {
        // No need to do anything special here now since we always scroll 1 tile
    });
}

// Fix tab navigation to include the new Career tab
document.addEventListener('DOMContentLoaded', function() {
    // Make sure the Career tab is included in the navigation
    const careerTab = document.querySelector('.tabs a[href="#career"]');
    if (careerTab) {
        careerTab.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all sections
            document.querySelectorAll('main section').forEach(section => {
                section.style.display = 'none';
            });
            // Show career section
            document.querySelector('#career').style.display = 'block';
            // Update active tab
            document.querySelectorAll('.tabs li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    }
});

// Add this to your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel if career section is active
    function initCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) return;
        
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        
        let currentIndex = 0;
        const slideCount = slides.length;
        let autoPlayInterval;
        
        // Set initial position
        updateCarousel();
        
        // Start autoplay
        startAutoPlay();
        
        // Handle prev button click
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
            resetAutoPlay();
        });
        
        // Handle next button click
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
            resetAutoPlay();
        });
        
        // Handle indicator dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel();
                resetAutoPlay();
            });
        });
        
        // Pause autoplay on hover
        carouselTrack.parentElement.addEventListener('mouseenter', function() {
            clearInterval(autoPlayInterval);
        });
        
        // Resume autoplay on mouse leave
        carouselTrack.parentElement.addEventListener('mouseleave', function() {
            startAutoPlay();
        });
        
        // Touch events for mobile
        let startX = 0;
        let endX = 0;
        
        carouselTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            clearInterval(autoPlayInterval);
        });
        
        carouselTrack.addEventListener('touchmove', function(e) {
            endX = e.touches[0].clientX;
        });
        
        carouselTrack.addEventListener('touchend', function() {
            const threshold = 50;
            if (startX - endX > threshold) {
                // Swipe left, go next
                currentIndex = (currentIndex + 1) % slideCount;
                updateCarousel();
            } else if (endX - startX > threshold) {
                // Swipe right, go prev
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateCarousel();
            }
            startAutoPlay();
        });
        
        // Function to update carousel state
        function updateCarousel() {
            // Move slide track
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot indicator
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Function to start autoplay
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(function() {
                currentIndex = (currentIndex + 1) % slideCount;
                updateCarousel();
            }, 5000); // Change slide every 5 seconds
        }
        
        // Function to reset autoplay
        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }
    
    // Initialize carousel when career tab is clicked
    const careerTab = document.querySelector('nav.tabs li a[href="#career"]');
    if (careerTab) {
        careerTab.addEventListener('click', function() {
            // Allow time for tab content to display
            setTimeout(initCarousel, 100);
        });
    }
    
    // If career section is initially active
    if (document.querySelector('#career').style.display !== 'none') {
        initCarousel();
    }
});




// Add to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Auto-scrolling functionality
    const autoscrollElements = document.querySelectorAll('.autoscroll-content');
    
    autoscrollElements.forEach(element => {
        let isScrolling = true;
        let hasInteracted = false;
        let scrollSpeed = 0.5; // pixels per interval
        let scrollInterval;
        
        // Add scroll indicator
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<i class="fas fa-arrow-down"></i> Scroll for more';
        element.appendChild(indicator);
        
        // Start auto-scrolling
        function startAutoScroll() {
            if (isScrolling && !hasInteracted) {
                scrollInterval = setInterval(() => {
                    element.scrollTop += scrollSpeed;
                    
                    // Reset to top when reaching bottom
                    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
                        element.scrollTop = 0;
                    }
                }, 30);
            }
        }
        
        // Stop on user interaction
        element.addEventListener('wheel', function() {
            hasInteracted = true;
            isScrolling = false;
            indicator.classList.add('hidden');
            if (scrollInterval) clearInterval(scrollInterval);
        });
        
        element.addEventListener('touchstart', function() {
            hasInteracted = true;
            isScrolling = false;
            indicator.classList.add('hidden');
            if (scrollInterval) clearInterval(scrollInterval);
        });
        
        element.addEventListener('mousedown', function() {
            hasInteracted = true;
            isScrolling = false;
            indicator.classList.add('hidden');
            if (scrollInterval) clearInterval(scrollInterval);
        });
        
        // Delay start to ensure DOM is fully loaded
        setTimeout(startAutoScroll, 2000);
    });
});

// Function to handle form submission
function sendEmail(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Email addresses to send the form data to
    const recipientEmail = "pradiptochowdhury6@gmail.com";
    const labEmail = "greencatal20@gmail.com";
    
    // Create mailto link
    const mailtoLink = `mailto:${recipientEmail},${labEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Optional: You can also use an AJAX request to send the form data to a server-side script
    // which would then send the email using a service like PHPMailer, Nodemailer, etc.
    
    // Show success message
    alert('Thank you for your message. We will get back to you soon!');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Tab functionality (if not already in your main script)
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs li a');
    const sections = document.querySelectorAll('main section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            document.querySelector(target).style.display = 'block';
            
            // Add active class to clicked tab
            tabs.forEach(tab => {
                tab.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Add 'active' class to the section for animation
            setTimeout(() => {
                document.querySelector(target).classList.add('active');
            }, 100);
        });
    });
});




// JavaScript for the project carousel with fixed auto-scrolling and click functionality
document.addEventListener('DOMContentLoaded', function() {
    const researchSection = document.querySelector('#research.research-section');
    
    if (researchSection) {
        const carousel = researchSection.querySelector('.project-carousel');
        const tiles = researchSection.querySelectorAll('.project-tile');
        const prevBtn = researchSection.querySelector('.prev-btn');
        const nextBtn = researchSection.querySelector('.next-btn');
        
        if (carousel && tiles.length > 0 && prevBtn && nextBtn) {
            let currentPosition = 0;
            const totalTiles = tiles.length;
            
            function getTilesPerView() {
                const width = window.innerWidth;
                if (width < 576) return 1;
                if (width < 768) return 1; 
                if (width < 992) return 2;
                if (width < 1200) return 3;
                return 3; // Show more tiles on large screens
            }
            
            function updateCarouselLayout() {
                const tilesPerView = getTilesPerView();
                const containerWidth = carousel.parentElement.offsetWidth - 100; // Account for padding
                const tileWidth = (containerWidth / tilesPerView) - 24; // Account for gap properly
                const gap = 24; // 1.5rem gap
                
                // Update max position based on screen size and ensure it's not less than 0
                const maxScroll = Math.max(0, totalTiles - tilesPerView);
                
                // Ensure current position is valid
                currentPosition = Math.min(currentPosition, maxScroll);
                
                // Set width for each tile - make sure ALL tiles get the same treatment
                tiles.forEach((tile, index) => {
                    tile.style.width = `${tileWidth}px`;
                    tile.style.marginRight = `${gap}px`;
                    
                    // Make sure all tiles have the same container properties
                    tile.style.flex = '0 0 auto';
                    tile.style.boxSizing = 'border-box';
                    tile.style.display = 'flex';
                    tile.style.flexDirection = 'column';
                    
                    // Ensure last tile doesn't have margin (causes alignment issues)
                    if (index === tiles.length - 1) {
                        tile.style.marginRight = '0';
                    }
                });
                
                // Remove the min-width to fix the unusual width issue
                carousel.style.minWidth = '';
                
                return {
                    tilesPerView,
                    tileWidth,
                    gap,
                    maxScroll
                };
            }
            
            function moveCarousel(direction) {
                const { tilesPerView, tileWidth, gap, maxScroll } = updateCarouselLayout();
                
                // Implement infinite scrolling
                if (direction === 'next') {
                    if (currentPosition >= maxScroll) {
                        // Immediate reset to beginning without animation
                        carousel.style.transition = 'none';
                        currentPosition = 0;
                        carousel.style.transform = 'translateX(0)';
                        // Force reflow
                        void carousel.offsetHeight;
                        // Restore animation
                        carousel.style.transition = 'transform 0.3s ease-in-out';
                    } else {
                        currentPosition++;
                    }
                } else if (direction === 'prev') {
                    if (currentPosition <= 0) {
                        // Jump to end without animation
                        carousel.style.transition = 'none';
                        currentPosition = maxScroll;
                        const moveAmount = currentPosition * (tileWidth + gap);
                        carousel.style.transform = `translateX(-${moveAmount}px)`;
                        // Force reflow
                        void carousel.offsetHeight;
                        // Restore animation
                        carousel.style.transition = 'transform 0.3s ease-in-out';
                    } else {
                        currentPosition--;
                    }
                }
                
                // Calculate the exact transform value including gap
                const moveAmount = currentPosition * (tileWidth + gap);
                carousel.style.transform = `translateX(-${moveAmount}px)`;
                
                // Enable both buttons for infinite scrolling
                prevBtn.style.opacity = '1';
                prevBtn.disabled = false;
                nextBtn.style.opacity = '1';
                nextBtn.disabled = false;
            }
            
            // Initialize carousel
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.3s ease-in-out';
            carousel.style.width = 'auto'; // Let it expand as needed
            
            // Initial layout
            updateCarouselLayout();
            moveCarousel();
            
            // Event Listeners
            prevBtn.addEventListener('click', () => moveCarousel('prev'));
            nextBtn.addEventListener('click', () => moveCarousel('next'));
            
            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    updateCarouselLayout();
                    moveCarousel();
                }, 200);
            });
            
            // Add touch swipe functionality with improved sensitivity
            let touchStartX = 0;
            let touchEndX = 0;
            
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 30; // Reduced threshold for better responsiveness
                
                if (touchStartX - touchEndX > swipeThreshold) {
                    moveCarousel('next');
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    moveCarousel('prev');
                }
            }, { passive: true });
            
            // Auto-scrolling functionality
            let autoScrollInterval;
            
            function startAutoScroll() {
                stopAutoScroll();
                autoScrollInterval = setInterval(() => {
                    moveCarousel('next');
                }, 30000); // Scroll every 5 seconds
            }
            
            function stopAutoScroll() {
                if (autoScrollInterval) {
                    clearInterval(autoScrollInterval);
                }
            }
            
            // Start auto-scroll
            startAutoScroll();
            
            // Stop on user interaction
            carousel.addEventListener('mouseenter', stopAutoScroll);
            carousel.addEventListener('mouseleave', startAutoScroll);
            carousel.addEventListener('touchstart', stopAutoScroll);
        }
    }
});

// Research Gallery and Publications Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize research gallery
    initResearchGallery();
    
    // Initialize publications autoscrolling
    initPublicationsScroll();
    
    // Apply glassmorphic effect
    applyGlassmorphicEffect();
    
    // When research tab is clicked, make sure sections are initialized
    const researchTab = document.querySelector('.tabs a[href="#research"]');
    if (researchTab) {
        researchTab.addEventListener('click', function() {
            // Short delay to ensure section is visible
            setTimeout(() => {
                initResearchGallery();
                initPublicationsScroll();
                applyGlassmorphicEffect();
            }, 100);
        });
    }
});

// Function to apply glassmorphic effect based on data-color attribute
function applyGlassmorphicEffect() {
    document.querySelectorAll('.glassmorphic[data-color]').forEach(element => {
        const color = element.getAttribute('data-color');
        if (color) {
            // Apply subtle hover effect
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            });
        }
    });
}

function initResearchGallery() {
    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack) return;
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-control.prev');
    const nextBtn = document.querySelector('.gallery-control.next');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    let currentIndex = 0;
    let autoScrollInterval;
    let userInteracted = false;
    let pauseTimer;
    
    // Set initial position
    updateGallery();
    
    // Start auto-scrolling
    startAutoScroll();
    
    // Previous button click
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateGallery();
        userInteractionHandler();
    });
    
    // Next button click
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateGallery();
        userInteractionHandler();
    });
    
    // Handle clicking on images to open lightbox
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('click', function() {
                openLightbox(img.src, img.alt);
                userInteractionHandler();
            });
            
            // Add hover effect to images
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
            });
            
            img.addEventListener('mouseleave', function() {
                if (!lightbox.classList.contains('active')) {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                }
            });
        }
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
    });
    
    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            }
        }
    });
    
    // Swipe functionality for gallery
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        userInteractionHandler();
    }, { passive: true });
    
    galleryTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateGallery();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateGallery();
        }
    }, { passive: true });
    
    // Function to update gallery position
    function updateGallery() {
        galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Function to open lightbox
    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        document.querySelector('.lightbox-caption').textContent = alt;
        lightbox.classList.add('active');
    }
    
    // Handle user interaction with 50 second pause
    function userInteractionHandler() {
        userInteracted = true;
        stopAutoScroll();
        
        // Clear any existing pause timer
        if (pauseTimer) clearTimeout(pauseTimer);
        
        // Set new pause timer for 50 seconds
        pauseTimer = setTimeout(() => {
            userInteracted = false;
            startAutoScroll();
        }, 50000); // 50 seconds
    }
    
    // Start auto-scrolling
    function startAutoScroll() {
        if (!userInteracted) {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateGallery();
            }, 5000); // Scroll every 5 seconds
        }
    }
    
    // Stop auto-scrolling
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }
}

function initPublicationsScroll() {
    const publicationsList = document.querySelector('.publications-list');
    if (!publicationsList) return;
    
    const publicationItems = document.querySelectorAll('.publication-item');
    let autoScrollInterval;
    let userInteracted = false;
    let scrollSpeed = 1; // pixels per interval
    
    // Add search bar to publications
    addPublicationsSearch(publicationsList, publicationItems);
    
    // Apply hover effects to publication items
    publicationItems.forEach(item => {
        const link = item.querySelector('.publication-link');
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(105, 162, 151, 0.15)';
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
            
            if (link) {
                link.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
            
            if (link) {
                link.style.transform = 'scale(1)';
            }
        });
    });
    
    // Start auto-scrolling
    startAutoScroll();
    
    // Handle user interaction (mouse wheel, touch, click)
    publicationsList.addEventListener('wheel', stopAutoScrollPermanently);
    publicationsList.addEventListener('touchstart', stopAutoScrollPermanently, { passive: true });
    publicationsList.addEventListener('mousedown', stopAutoScrollPermanently);
    
    // Publication link clicks
    const publicationLinks = document.querySelectorAll('.publication-link');
    publicationLinks.forEach(link => {
        link.addEventListener('click', stopAutoScrollPermanently);
    });
    
    // Function to permanently stop auto-scrolling after any user interaction
    function stopAutoScrollPermanently() {
        userInteracted = true;
        stopAutoScroll();
        
        // No timer to restart - once stopped, it stays stopped
        console.log('Publications autoscroll permanently stopped after user interaction');
    }
    
    // Start auto-scrolling
    function startAutoScroll() {
        if (!userInteracted) {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                publicationsList.scrollTop += scrollSpeed;
                
                // If reached the bottom, reset to top
                if (publicationsList.scrollTop >= (publicationsList.scrollHeight - publicationsList.clientHeight)) {
                    // Add small delay before resetting
                    setTimeout(() => {
                        publicationsList.scrollTop = 0;
                    }, 1000);
                }
            }, 30); // Update every 30ms for smooth scrolling
        }
    }
    
    // Stop auto-scrolling
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }
}

// Function to add search functionality to publications
function addPublicationsSearch(publicationsList, publicationItems) {
    // Check if a search container already exists
    const existingSearch = document.querySelector('.publications-search');
    if (existingSearch) {
        return; // Exit if search bar already exists
    }
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'publications-search glassmorphic';
    searchContainer.setAttribute('data-color', 'rgba(105, 162, 151, 0.15)');
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Find by Name/Year/Author...';
    searchInput.className = 'publications-search-input';
    
    // Create search icon
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search search-icon';
    
    // Add elements to container
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    // Find the showcase title to insert after it
    const showcaseTitle = publicationsList.parentNode.querySelector('.showcase-title');
    if (showcaseTitle) {
        showcaseTitle.insertAdjacentElement('afterend', searchContainer);
    } else {
        // Fallback - insert before publications list
        publicationsList.parentNode.insertBefore(searchContainer, publicationsList);
    }
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase().trim();
        
        publicationItems.forEach(item => {
            const title = item.querySelector('.publication-title').textContent.toLowerCase();
            const authors = item.querySelector('.publication-authors').textContent.toLowerCase();
            const journal = item.querySelector('.publication-journal').textContent.toLowerCase();
            
            if (title.includes(searchQuery) || 
                authors.includes(searchQuery) || 
                journal.includes(searchQuery)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Stop auto-scrolling when searching
        if (searchQuery.length > 0) {
            stopAutoScrollPermanently();
        }
    });
    
    // Clear search on X button click (for browsers that support it)
    searchInput.addEventListener('search', function() {
        if (this.value === '') {
            // Reset all items to visible
            publicationItems.forEach(item => {
                item.style.display = 'block';
            });
        }
    });
    
    function stopAutoScrollPermanently() {
        const event = new Event('mousedown');
        publicationsList.dispatchEvent(event);
    }
}