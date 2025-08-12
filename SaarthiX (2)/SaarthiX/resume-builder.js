// Resume Builder JavaScript
document.addEventListener('DOMContentLoaded', function () {
    let currentStep = 1;
    let resumeData = {
        personal: {},
        experience: [],
        education: [],
        skills: {
            technical: [],
            soft: []
        },
        languages: [],
        certifications: [],
        selectedTemplate: 'modern'
    };

    // Initialize the resume builder
    initializeResumeBuilder();

    function initializeResumeBuilder() {
        checkURLParameters();
        setupSkillsInput();
        setupFormValidation();
        setupLivePreview();
        setupTemplateSelection();
        updatePreview();
    }

    // Check for URL parameters and localStorage for template selection
    function checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const templateFromURL = urlParams.get('template');
        const templateFromStorage = localStorage.getItem('selectedTemplate');

        if (templateFromURL) {
            resumeData.selectedTemplate = templateFromURL;
            localStorage.setItem('selectedTemplate', templateFromURL);
        } else if (templateFromStorage) {
            resumeData.selectedTemplate = templateFromStorage;
        }

        // Update template selection in the UI when we reach step 5
        setTimeout(() => {
            updateTemplateSelection();
        }, 100);
    }

    function updateTemplateSelection() {
        const templateOptions = document.querySelectorAll('.template-option');
        templateOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.template === resumeData.selectedTemplate) {
                option.classList.add('active');
            }
        });
    }

    // Step Navigation
    window.changeStep = function (direction) {
        const totalSteps = 5;
        const newStep = currentStep + direction;

        if (newStep < 1 || newStep > totalSteps) return;

        // Validate current step before proceeding
        if (direction > 0 && !validateCurrentStep()) {
            return;
        }

        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');

        // Show new step
        currentStep = newStep;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');

        // Mark completed steps
        for (let i = 1; i < currentStep; i++) {
            document.querySelector(`[data-step="${i}"]`).classList.add('completed');
        }

        // Update navigation buttons
        updateNavigationButtons();

        // Update preview when moving to preview step
        if (currentStep === 5) {
            generatePreview();
        }
    };

    function updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';

        if (currentStep === 5) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
            nextBtn.innerHTML = currentStep === 4 ? 'Preview <i class="fas fa-eye"></i>' : 'Next <i class="fas fa-arrow-right"></i>';
        }
    }

    function validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;

                // Remove error styling after user starts typing
                field.addEventListener('input', function () {
                    this.style.borderColor = '#e0e0e0';
                }, { once: true });
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields before proceeding.', 'error');
        }

        return isValid;
    }

    // Skills Input Setup
    function setupSkillsInput() {
        const technicalInput = document.getElementById('technical-skill-input');
        const softInput = document.getElementById('soft-skill-input');

        technicalInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim(), 'technical');
                this.value = '';
            }
        });

        softInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim(), 'soft');
                this.value = '';
            }
        });
    }

    function addSkill(skillName, type) {
        if (!skillName || resumeData.skills[type].includes(skillName)) return;

        resumeData.skills[type].push(skillName);
        renderSkills(type);
        updatePreview();
    }

    function removeSkill(skillName, type) {
        const index = resumeData.skills[type].indexOf(skillName);
        if (index > -1) {
            resumeData.skills[type].splice(index, 1);
            renderSkills(type);
            updatePreview();
        }
    }

    function renderSkills(type) {
        const container = document.getElementById(`${type}-skills`);
        container.innerHTML = '';

        resumeData.skills[type].forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button class="remove-skill" onclick="removeSkill('${skill}', '${type}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(skillTag);
        });
    }

    // Make removeSkill globally accessible
    window.removeSkill = removeSkill;

    // Experience Management
    window.addExperience = function () {
        const container = document.getElementById('experience-container');
        const experienceCount = container.children.length + 1;

        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.innerHTML = `
            <div class="item-header">
                <h3>Experience #${experienceCount}</h3>
                <button type="button" class="remove-item" onclick="removeExperience(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" name="jobTitle" required>
                </div>
                <div class="form-group">
                    <label>Company Name *</label>
                    <input type="text" name="company" required>
                </div>
                <div class="form-group">
                    <label>Start Date *</label>
                    <input type="month" name="startDate" required>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" name="endDate">
                    <div class="checkbox-group">
                        <input type="checkbox" name="currentJob" onchange="toggleCurrentJob(this)">
                        <label>Currently working here</label>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Job Description</label>
                    <textarea name="jobDescription" rows="4" placeholder="Describe your key responsibilities and achievements..."></textarea>
                </div>
            </div>
        `;

        container.appendChild(experienceItem);
    };

    window.removeExperience = function (button) {
        const experienceItem = button.closest('.experience-item');
        experienceItem.remove();
        updateExperienceNumbers();
    };

    function updateExperienceNumbers() {
        const experienceItems = document.querySelectorAll('#experience-container .experience-item');
        experienceItems.forEach((item, index) => {
            item.querySelector('h3').textContent = `Experience #${index + 1}`;
        });
    }

    window.toggleCurrentJob = function (checkbox) {
        const endDateInput = checkbox.closest('.form-group').querySelector('input[name="endDate"]');
        if (checkbox.checked) {
            endDateInput.disabled = true;
            endDateInput.value = '';
            endDateInput.style.opacity = '0.5';
        } else {
            endDateInput.disabled = false;
            endDateInput.style.opacity = '1';
        }
    };

    // Education Management
    window.addEducation = function () {
        const container = document.getElementById('education-container');
        const educationCount = container.children.length + 1;

        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.innerHTML = `
            <div class="item-header">
                <h3>Education #${educationCount}</h3>
                <button type="button" class="remove-item" onclick="removeEducation(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" name="degree" required placeholder="e.g., Bachelor of Science">
                </div>
                <div class="form-group">
                    <label>Field of Study *</label>
                    <input type="text" name="fieldOfStudy" required placeholder="e.g., Computer Science">
                </div>
                <div class="form-group">
                    <label>Institution *</label>
                    <input type="text" name="institution" required>
                </div>
                <div class="form-group">
                    <label>Graduation Year *</label>
                    <input type="number" name="graduationYear" required min="1950" max="2030">
                </div>
                <div class="form-group">
                    <label>GPA (Optional)</label>
                    <input type="text" name="gpa" placeholder="e.g., 3.8/4.0">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="eduLocation" placeholder="City, State">
                </div>
            </div>
        `;

        container.appendChild(educationItem);
    };

    window.removeEducation = function (button) {
        const educationItem = button.closest('.education-item');
        educationItem.remove();
        updateEducationNumbers();
    };

    function updateEducationNumbers() {
        const educationItems = document.querySelectorAll('#education-container .education-item');
        educationItems.forEach((item, index) => {
            item.querySelector('h3').textContent = `Education #${index + 1}`;
        });
    }

    // Language Management
    window.addLanguage = function () {
        const container = document.getElementById('languages-container');

        const languageItem = document.createElement('div');
        languageItem.className = 'language-item';
        languageItem.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label>Language</label>
                    <input type="text" name="language" placeholder="e.g., English">
                </div>
                <div class="form-group">
                    <label>Proficiency</label>
                    <select name="proficiency">
                        <option value="">Select Level</option>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </div>
            <button type="button" class="remove-item" onclick="removeLanguage(this)" style="position: absolute; top: 10px; right: 10px;">
                <i class="fas fa-trash"></i>
            </button>
        `;

        container.appendChild(languageItem);
    };

    window.removeLanguage = function (button) {
        const languageItem = button.closest('.language-item');
        languageItem.remove();
    };

    // Certification Management
    window.addCertification = function () {
        const container = document.getElementById('certifications-container');

        const certificationItem = document.createElement('div');
        certificationItem.className = 'certification-item';
        certificationItem.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" name="certificationName" placeholder="e.g., AWS Certified Solutions Architect">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" name="issuingOrg" placeholder="e.g., Amazon Web Services">
                </div>
                <div class="form-group">
                    <label>Issue Date</label>
                    <input type="month" name="issueDate">
                </div>
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="month" name="expiryDate">
                </div>
            </div>
            <button type="button" class="remove-item" onclick="removeCertification(this)" style="position: absolute; top: 10px; right: 10px;">
                <i class="fas fa-trash"></i>
            </button>
        `;

        container.appendChild(certificationItem);
    };

    window.removeCertification = function (button) {
        const certificationItem = button.closest('.certification-item');
        certificationItem.remove();
    };

    // Template Selection
    function setupTemplateSelection() {
        const templateOptions = document.querySelectorAll('.template-option');

        templateOptions.forEach(option => {
            option.addEventListener('click', function () {
                templateOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                resumeData.selectedTemplate = this.dataset.template;
                updatePreview();
            });
        });
    }

    // Form Validation and Live Preview
    function setupFormValidation() {
        const formInputs = document.querySelectorAll('input, select, textarea');

        formInputs.forEach(input => {
            input.addEventListener('input', function () {
                collectFormData();
                updatePreview();
            });
        });
    }

    function setupLivePreview() {
        // Initial preview update
        updatePreview();
    }

    function collectFormData() {
        // Personal Information
        resumeData.personal = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            portfolio: document.getElementById('portfolio')?.value || '',
            summary: document.getElementById('summary')?.value || ''
        };

        // Experience
        resumeData.experience = [];
        const experienceItems = document.querySelectorAll('#experience-container .experience-item');
        experienceItems.forEach(item => {
            const experience = {
                jobTitle: item.querySelector('input[name="jobTitle"]')?.value || '',
                company: item.querySelector('input[name="company"]')?.value || '',
                startDate: item.querySelector('input[name="startDate"]')?.value || '',
                endDate: item.querySelector('input[name="endDate"]')?.value || '',
                currentJob: item.querySelector('input[name="currentJob"]')?.checked || false,
                description: item.querySelector('textarea[name="jobDescription"]')?.value || ''
            };
            if (experience.jobTitle || experience.company) {
                resumeData.experience.push(experience);
            }
        });

        // Education
        resumeData.education = [];
        const educationItems = document.querySelectorAll('#education-container .education-item');
        educationItems.forEach(item => {
            const education = {
                degree: item.querySelector('input[name="degree"]')?.value || '',
                fieldOfStudy: item.querySelector('input[name="fieldOfStudy"]')?.value || '',
                institution: item.querySelector('input[name="institution"]')?.value || '',
                graduationYear: item.querySelector('input[name="graduationYear"]')?.value || '',
                gpa: item.querySelector('input[name="gpa"]')?.value || '',
                location: item.querySelector('input[name="eduLocation"]')?.value || ''
            };
            if (education.degree || education.institution) {
                resumeData.education.push(education);
            }
        });

        // Languages
        resumeData.languages = [];
        const languageItems = document.querySelectorAll('#languages-container .language-item');
        languageItems.forEach(item => {
            const language = {
                language: item.querySelector('input[name="language"]')?.value || '',
                proficiency: item.querySelector('select[name="proficiency"]')?.value || ''
            };
            if (language.language) {
                resumeData.languages.push(language);
            }
        });

        // Certifications
        resumeData.certifications = [];
        const certificationItems = document.querySelectorAll('#certifications-container .certification-item');
        certificationItems.forEach(item => {
            const certification = {
                name: item.querySelector('input[name="certificationName"]')?.value || '',
                organization: item.querySelector('input[name="issuingOrg"]')?.value || '',
                issueDate: item.querySelector('input[name="issueDate"]')?.value || '',
                expiryDate: item.querySelector('input[name="expiryDate"]')?.value || ''
            };
            if (certification.name) {
                resumeData.certifications.push(certification);
            }
        });
    }

    function updatePreview() {
        collectFormData();
        const previewContainer = document.getElementById('resume-preview');

        if (!resumeData.personal.firstName && !resumeData.personal.lastName) {
            previewContainer.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <p>Fill out the form to see your resume preview</p>
                </div>
            `;
            return;
        }

        const resumeHTML = generateResumeHTML();
        previewContainer.innerHTML = resumeHTML;
    }

    function generateResumeHTML() {
        const { personal, experience, education, skills, languages, certifications } = resumeData;
        const fullName = `${personal.firstName} ${personal.lastName}`.trim();

        let contactInfo = [];
        if (personal.email) contactInfo.push(`<i class="fas fa-envelope"></i> ${personal.email}`);
        if (personal.phone) contactInfo.push(`<i class="fas fa-phone"></i> ${personal.phone}`);
        if (personal.location) contactInfo.push(`<i class="fas fa-map-marker-alt"></i> ${personal.location}`);
        if (personal.linkedin) contactInfo.push(`<i class="fab fa-linkedin"></i> LinkedIn`);
        if (personal.portfolio) contactInfo.push(`<i class="fas fa-globe"></i> Portfolio`);

        let html = `
            <div class="resume-content">
                <div class="resume-header">
                    <h1 class="resume-name">${fullName}</h1>
                    <div class="resume-contact">
                        ${contactInfo.join(' • ')}
                    </div>
                </div>
        `;

        // Professional Summary
        if (personal.summary) {
            html += `
                <div class="resume-section">
                    <h2 class="resume-section-title">Professional Summary</h2>
                    <p>${personal.summary}</p>
                </div>
            `;
        }

        // Experience
        if (experience.length > 0) {
            html += `
                <div class="resume-section">
                    <h2 class="resume-section-title">Work Experience</h2>
            `;

            experience.forEach(exp => {
                const endDate = exp.currentJob ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '');
                const dateRange = `${formatDate(exp.startDate)} - ${endDate}`;

                html += `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <div class="resume-item-title">${exp.jobTitle}</div>
                                <div class="resume-item-company">${exp.company}</div>
                            </div>
                            <div class="resume-item-date">${dateRange}</div>
                        </div>
                        ${exp.description ? `<div class="resume-item-description">${exp.description}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Education
        if (education.length > 0) {
            html += `
                <div class="resume-section">
                    <h2 class="resume-section-title">Education</h2>
            `;

            education.forEach(edu => {
                html += `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <div class="resume-item-title">${edu.degree} in ${edu.fieldOfStudy}</div>
                                <div class="resume-item-company">${edu.institution}</div>
                            </div>
                            <div class="resume-item-date">${edu.graduationYear}</div>
                        </div>
                        ${edu.gpa ? `<div class="resume-item-description">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Skills
        if (skills.technical.length > 0 || skills.soft.length > 0) {
            html += `<div class="resume-section"><h2 class="resume-section-title">Skills</h2>`;

            if (skills.technical.length > 0) {
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>Technical Skills:</strong>
                        <div class="resume-skills">
                            ${skills.technical.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            if (skills.soft.length > 0) {
                html += `
                    <div>
                        <strong>Soft Skills:</strong>
                        <div class="resume-skills">
                            ${skills.soft.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        }

        // Languages
        if (languages.length > 0) {
            html += `
                <div class="resume-section">
                    <h2 class="resume-section-title">Languages</h2>
                    <div class="resume-skills">
                        ${languages.map(lang => `<span class="resume-skill">${lang.language} (${lang.proficiency})</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Certifications
        if (certifications.length > 0) {
            html += `
                <div class="resume-section">
                    <h2 class="resume-section-title">Certifications</h2>
            `;

            certifications.forEach(cert => {
                const dateInfo = cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : '';
                const expiryInfo = cert.expiryDate ? `Expires: ${formatDate(cert.expiryDate)}` : '';
                const dateRange = [dateInfo, expiryInfo].filter(Boolean).join(' | ');

                html += `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <div class="resume-item-title">${cert.name}</div>
                                <div class="resume-item-company">${cert.organization}</div>
                            </div>
                            <div class="resume-item-date">${dateRange}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Watermark
        html += `
                <div class="watermark">Created with SaarthiX</div>
            </div>
        `;

        return html;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    // Preview Functions
    window.generatePreview = function () {
        updatePreview();
        showNotification('Resume preview generated successfully!', 'success');
    };

    window.downloadResume = function () {
        // Simulate download process
        const downloadBtn = event.target;
        const originalHTML = downloadBtn.innerHTML;

        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;

        setTimeout(() => {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.disabled = false;
            showNotification('Resume downloaded successfully! (Demo - actual PDF generation would happen here)', 'success');
        }, 3000);
    };

    // Zoom Functions
    let currentZoom = 1;

    window.zoomPreview = function (delta) {
        currentZoom = Math.max(0.5, Math.min(2, currentZoom + delta));
        const preview = document.getElementById('resume-preview');
        const zoomLevel = document.querySelector('.zoom-level');

        preview.style.transform = `scale(${currentZoom})`;
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    };

    // Utility function for notifications (if not already defined)
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
});