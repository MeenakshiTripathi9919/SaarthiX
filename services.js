// Shared Service Pages JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all service page components
    initializeAnimations();
    initializeFAQ();
    initializePricingCards();
    initializeTestimonials();
    initializeCTAButtons();
    initializeFormHandling();
    
    // Animation on scroll
    function initializeAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .process-step, .benefit-item, .testimonial-card, .pricing-card'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
            animationObserver.observe(el);
        });
    }
    
    // FAQ Functionality
    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Close all other FAQs
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    answer.classList.add('active');
                }
            });
        });
    }
    
    // Pricing Cards
    function initializePricingCards() {
        const pricingBtns = document.querySelectorAll('.pricing-btn');
        
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const planName = this.closest('.pricing-card').querySelector('h3').textContent;
                
                // Add loading state
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    showNotification(`Selected ${planName} plan. Redirecting to checkout...`, 'success');
                }, 2000);
            });
        });
    }
    
    // Testimonials Carousel (if multiple testimonials)
    function initializeTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length > 3) {
            // Add carousel functionality for mobile
            let currentIndex = 0;
            const showTestimonials = () => {
                testimonialCards.forEach((card, index) => {
                    if (window.innerWidth <= 768) {
                        card.style.display = index === currentIndex ? 'block' : 'none';
                    } else {
                        card.style.display = 'block';
                    }
                });
            };
            
            // Auto-rotate testimonials on mobile
            if (window.innerWidth <= 768) {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % testimonialCards.length;
                    showTestimonials();
                }, 5000);
            }
            
            showTestimonials();
            window.addEventListener('resize', showTestimonials);
        }
    }
    
    // CTA Buttons
    function initializeCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                    e.preventDefault();
                    
                    const buttonText = this.textContent.trim();
                    const originalHTML = this.innerHTML;
                    
                    // Add loading state
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.pointerEvents = 'auto';
                        
                        if (buttonText.toLowerCase().includes('get started') || 
                            buttonText.toLowerCase().includes('enroll') ||
                            buttonText.toLowerCase().includes('book')) {
                            showNotification('Redirecting to enrollment form...', 'success');
                        } else if (buttonText.toLowerCase().includes('demo') || 
                                 buttonText.toLowerCase().includes('preview')) {
                            showNotification('Loading demo content...', 'info');
                        } else if (buttonText.toLowerCase().includes('contact') || 
                                 buttonText.toLowerCase().includes('support')) {
                            showNotification('Opening contact form...', 'info');
                        } else {
                            showNotification('Feature coming soon!', 'info');
                        }
                    }, 1500);
                }
            });
        });
    }
    
    // Form Handling
    function initializeFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        showNotification('Form submitted successfully! We will contact you soon.', 'success');
                        form.reset();
                    }, 2000);
                }
            });
        });
    }
    
    // Utility Functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icons[type]}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Smooth scrolling for anchor links
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
    
    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .benefit-item, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize tooltips for feature icons
    const featureIcons = document.querySelectorAll('.feature-icon, .benefit-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
    
    .scroll-to-top:hover {
        transform: translateY(-3px) scale(1.1) !important;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
        }
        
        .scroll-to-top {
            bottom: 20px !important;
            right: 20px !important;
            width: 45px !important;
            height: 45px !important;
        }
    }
`;

document.head.appendChild(animationStyles);