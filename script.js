// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Feature Cards Toggle
    const featureToggles = document.querySelectorAll('.feature-toggle');
    
    featureToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const featureCard = this.closest('.feature-card');
            const featureDetail = featureCard.querySelector('.feature-detail');
            
            // Toggle active class on the detail
            featureDetail.classList.toggle('active');
            
            // Toggle button text
            if (featureDetail.classList.contains('active')) {
                this.textContent = 'Show Less';
                this.classList.add('active');
            } else {
                this.textContent = 'Learn More';
                this.classList.remove('active');
            }
        });
    });
    
    // Technology Component Interactions
    const techComponents = document.querySelectorAll('.tech-component');
    const techDetails = document.querySelectorAll('.tech-detail');
    
    techComponents.forEach(component => {
        component.addEventListener('click', function() {
            const techType = this.getAttribute('data-tech');
            
            // Remove active class from all details
            techDetails.forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Add active class to corresponding detail
            const targetDetail = document.getElementById(`${techType}Detail`);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }
            
            // Highlight the clicked component
            techComponents.forEach(comp => {
                comp.style.transform = 'scale(1)';
            });
            this.style.transform = 'scale(1.1)';
        });
    });
    
    // Interactive Demo Controls
    const takeoffBtn = document.getElementById('takeoffBtn');
    const landBtn = document.getElementById('landBtn');
    const scanBtn = document.getElementById('scanBtn');
    const alertBtn = document.getElementById('alertBtn');
    const patrolMode = document.getElementById('patrolMode');
    const cameraView = document.getElementById('cameraView');
    const droneMarker = document.getElementById('droneMarker');
    const cameraFeed = document.getElementById('cameraFeed');
    const alertLog = document.getElementById('alertLog');
    const feedTime = document.getElementById('feedTime');
    const hotspots = document.querySelectorAll('.hotspot');
    
    let droneFlying = false;
    let scanActive = false;
    let alertCount = 1;
    
    // Update time in camera feed
    function updateFeedTime() {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        feedTime.textContent = timeString;
    }
    
    // Update time every second
    setInterval(updateFeedTime, 1000);
    updateFeedTime(); // Initial call
    
    // Add alert to log
    function addAlert(message, type = 'info') {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        
        const alertEntry = document.createElement('div');
        alertEntry.className = 'alert-entry';
        
        const alertTime = document.createElement('span');
        alertTime.className = 'alert-time';
        alertTime.textContent = timeString;
        
        const alertText = document.createElement('span');
        alertText.className = 'alert-text';
        alertText.textContent = message;
        
        if (type === 'warning') {
            alertText.style.color = '#e74c3c';
            alertText.style.fontWeight = '600';
        } else if (type === 'success') {
            alertText.style.color = '#2ecc71';
        }
        
        alertEntry.appendChild(alertTime);
        alertEntry.appendChild(alertText);
        
        alertLog.prepend(alertEntry);
        
        // Limit alert log to 10 entries
        if (alertLog.children.length > 10) {
            alertLog.removeChild(alertLog.lastChild);
        }
    }
    
    // Takeoff button functionality
    if (takeoffBtn) {
        takeoffBtn.addEventListener('click', function() {
            if (!droneFlying) {
                droneFlying = true;
                takeoffBtn.disabled = true;
                landBtn.disabled = false;
                
                // Move drone marker
                droneMarker.style.top = '20%';
                droneMarker.style.left = '50%';
                droneMarker.style.transform = 'translate(-50%, -50%)';
                
                // Add alert
                addAlert('Drone taking off. Beginning patrol pattern.', 'success');
                
                // Update camera feed appearance
                cameraFeed.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.5)';
                
                // Start battery drain simulation
                startBatteryDrain();
            }
        });
    }
    
    // Land button functionality
    if (landBtn) {
        landBtn.addEventListener('click', function() {
            if (droneFlying) {
                droneFlying = false;
                takeoffBtn.disabled = false;
                landBtn.disabled = true;
                
                // Return drone to starting position
                droneMarker.style.top = '50%';
                droneMarker.style.left = '30%';
                droneMarker.style.transform = 'translate(-50%, -50%)';
                
                // Add alert
                addAlert('Drone landing at home base.', 'info');
                
                // Reset camera feed appearance
                cameraFeed.style.boxShadow = 'none';
                
                // Stop battery drain simulation
                stopBatteryDrain();
            }
        });
    }
    
    // Scan button functionality
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            if (!droneFlying) {
                addAlert('Cannot scan. Drone is not airborne.', 'warning');
                return;
            }
            
            if (!scanActive) {
                scanActive = true;
                scanBtn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Scan';
                
                // Add scanning effect to camera feed
                cameraFeed.style.animation = 'pulse 1s infinite';
                
                // Add alert
                addAlert('Initiating area scan. Analyzing for suspicious activity...', 'info');
                
                // Simulate scan completion after 3 seconds
                setTimeout(function() {
                    if (scanActive) {
                        scanActive = false;
                        scanBtn.innerHTML = '<i class="fas fa-search"></i> Area Scan';
                        cameraFeed.style.animation = '';
                        
                        // Randomly detect a threat
                        const randomThreat = Math.random() > 0.6;
                        
                        if (randomThreat) {
                            addAlert('SCAN COMPLETE: Suspicious activity detected at coordinates X-234, Y-567.', 'warning');
                            
                            // Highlight a hotspot
                            const crimeHotspot = document.querySelector('.hotspot[data-type="crime"]');
                            crimeHotspot.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.8)';
                            crimeHotspot.style.animation = 'pulse 0.5s infinite';
                            
                            // Reset after 5 seconds
                            setTimeout(function() {
                                crimeHotspot.style.boxShadow = '';
                                crimeHotspot.style.animation = 'pulse 1s infinite';
                            }, 5000);
                        } else {
                            addAlert('SCAN COMPLETE: No threats detected. Area secure.', 'success');
                        }
                    }
                }, 3000);
            } else {
                // Stop scanning
                scanActive = false;
                scanBtn.innerHTML = '<i class="fas fa-search"></i> Area Scan';
                cameraFeed.style.animation = '';
                addAlert('Scan terminated by operator.', 'info');
            }
        });
    }
    
    // Test Alert button functionality
    if (alertBtn) {
        alertBtn.addEventListener('click', function() {
            if (!droneFlying) {
                addAlert('Cannot test alert system. Drone is not airborne.', 'warning');
                return;
            }
            
            const alertMessages = [
                'AI detection: Possible weapon identified in downtown area.',
                'Automatic alert: Unusual crowd gathering detected near central park.',
                'Priority alert: Suspected burglary in progress at 123 Main Street.',
                'Emergency: Vehicle matching stolen car database detected.'
            ];
            
            const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            addAlert(`TEST ALERT ${alertCount}: ${randomMessage}`, 'warning');
            alertCount++;
            
            // Flash the alert panel
            const alertPanel = document.querySelector('.alert-panel');
            alertPanel.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            setTimeout(() => {
                alertPanel.style.backgroundColor = '';
            }, 1000);
        });
    }
    
    // Patrol Mode change
    if (patrolMode) {
        patrolMode.addEventListener('change', function() {
            const mode = this.value;
            const modeNames = {
                'standard': 'Standard Patrol',
                'night': 'Night Surveillance',
                'search': 'Search Pattern',
                'crowd': 'Crowd Monitoring'
            };
            
            addAlert(`Patrol mode changed to: ${modeNames[mode]}`, 'info');
            
            // Change camera feed appearance based on mode
            if (mode === 'night') {
                cameraFeed.style.filter = 'sepia(0.5) contrast(1.2)';
            } else if (mode === 'search') {
                cameraFeed.style.filter = 'hue-rotate(90deg)';
            } else {
                cameraFeed.style.filter = 'none';
            }
        });
    }
    
    // Camera View change
    if (cameraView) {
        cameraView.addEventListener('change', function() {
            const view = this.value;
            const viewNames = {
                'standard': 'Standard View',
                'thermal': 'Thermal Vision',
                'zoom': 'Zoom (30x)',
                'wide': 'Wide Angle'
            };
            
            addAlert(`Camera view changed to: ${viewNames[view]}`, 'info');
        });
    }
    
    // Hotspot interactions
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            if (!droneFlying) return;
            
            const type = this.getAttribute('data-type');
            
            // Move drone to hotspot
            const rect = this.getBoundingClientRect();
            const mapRect = document.getElementById('cityMap').getBoundingClientRect();
            
            const relativeLeft = ((rect.left + rect.width/2) - mapRect.left) / mapRect.width * 100;
            const relativeTop = ((rect.top + rect.height/2) - mapRect.top) / mapRect.height * 100;
            
            droneMarker.style.left = `${relativeLeft}%`;
            droneMarker.style.top = `${relativeTop}%`;
            
            // Add alert based on hotspot type
            if (type === 'crime') {
                addAlert('Drone dispatched to investigate potential crime scene.', 'warning');
            } else if (type === 'suspicious') {
                addAlert('Investigating suspicious activity at designated coordinates.', 'info');
            } else {
                addAlert('Routine inspection of area in progress.', 'info');
            }
        });
    });
    
    // Battery drain simulation
    let batteryDrainInterval;
    const batteryFill = document.querySelector('#batteryStatus .status-fill');
    const batteryValue = document.querySelector('#batteryStatus .status-value');
    
    function startBatteryDrain() {
        let batteryLevel = 78;
        
        batteryDrainInterval = setInterval(function() {
            if (batteryLevel > 0) {
                batteryLevel -= 0.1;
                batteryFill.style.width = `${batteryLevel}%`;
                batteryValue.textContent = `${Math.floor(batteryLevel)}%`;
                
                // Change color based on battery level
                if (batteryLevel < 20) {
                    batteryFill.style.backgroundColor = '#e74c3c';
                    if (batteryLevel < 10 && Math.random() > 0.7) {
                        addAlert('WARNING: Battery critically low. Return to base recommended.', 'warning');
                    }
                } else if (batteryLevel < 40) {
                    batteryFill.style.backgroundColor = '#f39c12';
                } else {
                    batteryFill.style.backgroundColor = '#2ecc71';
                }
            } else {
                stopBatteryDrain();
                addAlert('EMERGENCY: Battery depleted. Drone executing emergency landing.', 'warning');
                landBtn.click();
            }
        }, 1000);
    }
    
    function stopBatteryDrain() {
        if (batteryDrainInterval) {
            clearInterval(batteryDrainInterval);
        }
    }
    
    // Animate impact stats on scroll
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statCards = entry.target.querySelectorAll('.stat-card');
                
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const impactSection = document.getElementById('impact');
    if (impactSection) {
        // Set initial state for animation
        const statCards = impactSection.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        observer.observe(impactSection);
    }
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(26, 26, 46, 0.98)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.backgroundColor = 'rgba(26, 26, 46, 0.95)';
            navbar.style.padding = '15px 0';
        }
    });
});