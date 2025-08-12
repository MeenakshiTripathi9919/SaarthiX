// Job Metrics Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeCounters();
    initializeCharts();
    initializeFilters();
    initializeSkillsToggle();
    initializeLocationMarkers();
    initializeAnimations();
    
    // Counter Animation
    function initializeCounters() {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        };
        
        // Intersection Observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Chart Initialization
    function initializeCharts() {
        // Salary Chart
        const salaryCtx = document.getElementById('salaryChart');
        if (salaryCtx) {
            new Chart(salaryCtx, {
                type: 'bar',
                data: {
                    labels: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail'],
                    datasets: [{
                        label: 'Average Salary (₹L)',
                        data: [12.5, 10.2, 8.8, 6.5, 7.2, 5.8],
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(76, 175, 80, 0.8)',
                            'rgba(255, 107, 107, 0.8)',
                            'rgba(255, 165, 0, 0.8)',
                            'rgba(156, 39, 176, 0.8)',
                            'rgba(255, 193, 7, 0.8)'
                        ],
                        borderColor: [
                            'rgba(102, 126, 234, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(255, 107, 107, 1)',
                            'rgba(255, 165, 0, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(255, 193, 7, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(102, 126, 234, 1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return `₹${context.parsed.y}L average salary`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value + 'L';
                                },
                                color: '#6c757d'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
        
        // Demand Chart
        const demandCtx = document.getElementById('demandChart');
        if (demandCtx) {
            new Chart(demandCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Software Engineering',
                        data: [2100, 2300, 2500, 2800, 3100, 3400, 3600, 3800, 4000, 4200, 4400, 4500],
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }, {
                        label: 'Data Science',
                        data: [1800, 1900, 2100, 2300, 2600, 2800, 3000, 3200, 3300, 3400, 3500, 3600],
                        borderColor: 'rgba(76, 175, 80, 1)',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }, {
                        label: 'Product Management',
                        data: [1200, 1300, 1400, 1600, 1800, 2000, 2100, 2200, 2300, 2400, 2500, 2600],
                        borderColor: 'rgba(255, 107, 107, 1)',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(255, 107, 107, 1)',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                color: '#6c757d'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(102, 126, 234, 1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y} jobs`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }
    
    // Filter Functionality
    function initializeFilters() {
        const applyFiltersBtn = document.getElementById('applyFilters');
        const filterSelects = document.querySelectorAll('.filter-select');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                // Add loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
                this.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    this.innerHTML = '<i class="fas fa-search"></i> Apply Filters';
                    this.disabled = false;
                    
                    // Show success message
                    showNotification('Filters applied successfully!', 'success');
                    
                    // Update metrics (simulate)
                    updateMetricsWithFilters();
                }, 1500);
            });
        }
        
        // Add change listeners to filters
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                // Add visual feedback
                this.style.borderColor = '#667eea';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 300);
            });
        });
    }
    
    // Skills Toggle
    function initializeSkillsToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const skillsGrids = document.querySelectorAll('.skills-grid');
        
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                toggleBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all skills grids
                skillsGrids.forEach(grid => {
                    grid.classList.remove('active');
                });
                
                // Show selected skills grid
                const targetView = this.getAttribute('data-view');
                const targetGrid = document.querySelector(`.${targetView}-skills`);
                if (targetGrid) {
                    setTimeout(() => {
                        targetGrid.classList.add('active');
                    }, 150);
                }
            });
        });
    }
    
    // Location Markers
    function initializeLocationMarkers() {
        const markers = document.querySelectorAll('.location-marker');
        
        markers.forEach(marker => {
            marker.addEventListener('click', function() {
                const city = this.getAttribute('data-city');
                showCityDetails(city);
            });
        });
    }
    
    // Animations
    function initializeAnimations() {
        // Intersection Observer for animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.metric-card, .industry-card, .path-card, .skill-item');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            animationObserver.observe(el);
        });
        
        // Stagger animations for cards
        const cards = document.querySelectorAll('.metric-card, .industry-card, .path-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Time Filter Functionality
    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            timeFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            updateChartsForPeriod(period);
        });
    });
    
    // Helper Functions
    function updateMetricsWithFilters() {
        // Simulate updating metrics based on filters
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
            const newValue = Math.floor(currentValue * (0.8 + Math.random() * 0.4));
            animateNumberChange(stat, newValue);
        });
    }
    
    function animateNumberChange(element, newValue) {
        const currentValue = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 1000;
        const increment = (newValue - currentValue) / (duration / 16);
        let current = currentValue;
        
        const updateNumber = () => {
            current += increment;
            if ((increment > 0 && current < newValue) || (increment < 0 && current > newValue)) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = newValue.toLocaleString();
            }
        };
        
        updateNumber();
    }
    
    function updateChartsForPeriod(period) {
        // This would typically update charts with new data based on the selected period
        showNotification(`Updated charts for ${period} period`, 'info');
    }
    
    function showCityDetails(city) {
        // Show detailed information about the selected city
        const cityData = {
            'Bangalore': {
                jobs: '8,500',
                avgSalary: '₹11.2L',
                growth: '+28%',
                topCompanies: ['Infosys', 'Wipro', 'TCS', 'Flipkart'],
                topSkills: ['Java', 'Python', 'React', 'AWS']
            },
            'Mumbai': {
                jobs: '6,200',
                avgSalary: '₹10.8L',
                growth: '+18%',
                topCompanies: ['Reliance', 'HDFC', 'Tata', 'Mahindra'],
                topSkills: ['Finance', 'Sales', 'Marketing', 'Operations']
            },
            'Delhi': {
                jobs: '7,100',
                avgSalary: '₹10.5L',
                growth: '+22%',
                topCompanies: ['HCL', 'Tech Mahindra', 'Genpact', 'IBM'],
                topSkills: ['Consulting', 'Management', 'Strategy', 'Analytics']
            }
        };
        
        const data = cityData[city];
        if (data) {
            showNotification(`${city}: ${data.jobs} jobs available with ${data.avgSalary} average salary`, 'info');
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Career Path Exploration
    const explorePathBtns = document.querySelectorAll('.explore-path-btn');
    explorePathBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pathCard = this.closest('.path-card');
            const pathTitle = pathCard.querySelector('h3').textContent;
            
            // Add loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = 'Explore Path';
                this.disabled = false;
                showNotification(`Opening detailed career path for ${pathTitle}`, 'success');
            }, 1000);
        });
    });
    
    // Skill Item Interactions
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const skillName = this.querySelector('.skill-name').textContent;
            const demand = this.getAttribute('data-demand');
            showNotification(`${skillName} is in ${demand}% demand. Click to see learning resources.`, 'info');
        });
    });
    
    // Industry Card Interactions
    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach(card => {
        card.addEventListener('click', function() {
            const industry = this.querySelector('h3').textContent;
            showNotification(`Exploring ${industry} industry details...`, 'info');
        });
    });
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to main action buttons
    const mainActionBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    mainActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    showNotification('Feature coming soon!', 'info');
                }, 1500);
            }
        });
    });
});

// Additional utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function generateRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Export functions for potential use in other scripts
window.JobMetrics = {
    updateMetricsWithFilters,
    showNotification,
    formatNumber,
    generateRandomData
};