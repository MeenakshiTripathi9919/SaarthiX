// Enhanced Interactive Animations for SaarthiX
document.addEventListener('DOMContentLoaded', function() {
    
    // Node interaction effects
    const nodes = document.querySelectorAll('.node');
    const connectionLines = document.querySelectorAll('.connection-line');
    const flowParticles = document.querySelectorAll('.flow-particle');
    
    // Add click effects to nodes
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Highlight connections temporarily
            highlightConnections(this.classList[1]);
        });
        
        // Enhanced hover effects
        node.addEventListener('mouseenter', function() {
            // Pause other animations
            nodes.forEach(otherNode => {
                if (otherNode !== this) {
                    otherNode.style.animationPlayState = 'paused';
                }
            });
            
            // Enhance connection visibility
            connectionLines.forEach(line => {
                line.style.opacity = '0.8';
                line.style.transform += ' scale(1.1)';
            });
        });
        
        node.addEventListener('mouseleave', function() {
            // Resume animations
            nodes.forEach(otherNode => {
                otherNode.style.animationPlayState = 'running';
            });
            
            // Reset connections
            connectionLines.forEach(line => {
                line.style.opacity = '';
                line.style.transform = line.style.transform.replace(' scale(1.1)', '');
            });
        });
    });
    
    // Function to highlight specific connections
    function highlightConnections(nodeType) {
        let targetConnections = [];
        
        switch(nodeType) {
            case 'node-student':
                targetConnections = ['.student-to-institute', '.student-to-industry'];
                break;
            case 'node-institute':
                targetConnections = ['.student-to-institute', '.institute-to-industry'];
                break;
            case 'node-industry':
                targetConnections = ['.student-to-industry', '.institute-to-industry'];
                break;
        }
        
        targetConnections.forEach(selector => {
            const connection = document.querySelector(selector);
            if (connection) {
                connection.style.background = 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B)';
                connection.style.height = '4px';
                connection.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
                
                setTimeout(() => {
                    connection.style.background = '';
                    connection.style.height = '';
                    connection.style.boxShadow = '';
                }, 2000);
            }
        });
    }
    
    // Animated counter for trust indicators
    const trustNumbers = document.querySelectorAll('.trust-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    // Intersection Observer for trust indicators
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const trustNumber = entry.target.querySelector('.trust-number');
                if (trustNumber && !trustNumber.classList.contains('animated')) {
                    trustNumber.classList.add('animated');
                    animateCounter(trustNumber);
                }
            }
        });
    }, observerOptions);
    
    // Observe trust indicators
    const trustItems = document.querySelectorAll('.trust-item');
    trustItems.forEach(item => observer.observe(item));
    
    // Enhanced particle system
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Initialize particles
    createParticles();
    
    // Smooth scroll for action buttons
    const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Check if this is the demo button
            if (this.id === 'learnMoreBtn' || this.textContent.includes('Watch Demo')) {
                // Open NattLabs website in new tab
                window.open('https://nattlabs.com', '_blank');
                console.log('Opening NattLabs demo website...');
            } else {
                // You can add other navigation logic here
                console.log('Button clicked:', this.textContent.trim());
            }
        });
    });
    
    // Dynamic background gradient
    let gradientAngle = 135;
    setInterval(() => {
        gradientAngle += 0.5;
        const heroBackground = document.querySelector('.bg-gradient-overlay');
        if (heroBackground) {
            heroBackground.style.background = `linear-gradient(${gradientAngle}deg, 
                rgba(102, 126, 234, 0.9) 0%, 
                rgba(118, 75, 162, 0.8) 50%, 
                rgba(240, 147, 251, 0.7) 100%)`;
        }
    }, 100);
});

// CSS for click ripple effect (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    .click-ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        animation: clickRipple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes clickRipple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .trust-number {
        transition: all 0.3s ease;
    }
    
    .trust-number.animated {
        color: #FFD700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
`;
document.head.appendChild(style);