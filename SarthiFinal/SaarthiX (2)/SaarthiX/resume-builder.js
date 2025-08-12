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
        setupAutoSave();
        updatePreview();
    }

    // Auto-save functionality
    function setupAutoSave() {
        const formInputs = document.querySelectorAll('input, select, textarea');

        formInputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                collectFormData();
                updatePreview();
            }, 500));
        });
    }

    // Debounce function to limit updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
        const { personal, experience, education, skills, languages, certifications, selectedTemplate } = resumeData;
        const fullName = `${personal.firstName} ${personal.lastName}`.trim();

        // Generate contact information with proper links
        let contactInfo = [];
        if (personal.email) contactInfo.push(`<i class="fas fa-envelope"></i> <a href="mailto:${personal.email}" style="color: inherit; text-decoration: none;">${personal.email}</a>`);
        if (personal.phone) contactInfo.push(`<i class="fas fa-phone"></i> ${personal.phone}`);
        if (personal.location) contactInfo.push(`<i class="fas fa-map-marker-alt"></i> ${personal.location}`);
        if (personal.linkedin) contactInfo.push(`<i class="fab fa-linkedin"></i> <a href="${personal.linkedin}" target="_blank" style="color: inherit; text-decoration: none;">LinkedIn</a>`);
        if (personal.portfolio) contactInfo.push(`<i class="fas fa-globe"></i> <a href="${personal.portfolio}" target="_blank" style="color: inherit; text-decoration: none;">Portfolio</a>`);

        // Generate HTML based on selected template
        switch (selectedTemplate) {
            case 'modern':
                return generateModernTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications);
            case 'classic':
                return generateClassicTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications);
            case 'creative':
                return generateCreativeTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications);
            default:
                return generateModernTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications);
        }
    }

    function generateModernTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications) {
        let html = `
            <div class="resume-content" style="position: relative; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 40px; font-family: 'Arial', sans-serif;">
                <div class="resume-header" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 10px; margin: -40px -40px 30px -40px;">
                    <h1 class="resume-name" style="color: white; font-size: 2.8rem; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${fullName}</h1>
                    <div class="resume-contact" style="color: rgba(255,255,255,0.9); font-size: 1rem;">
                        ${contactInfo.join(' • ')}
                    </div>
                </div>
        `;

        // Professional Summary
        if (personal.summary) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-user-circle" style="font-size: 1.3rem;"></i> Professional Summary
                    </h2>
                    <div class="summary-content" style="font-size: 1.1rem; line-height: 1.7; color: #555; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">${personal.summary}</div>
                </div>
            `;
        }

        // Experience
        if (experience.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-briefcase" style="font-size: 1.3rem;"></i> Work Experience
                    </h2>
            `;

            experience.forEach(exp => {
                const endDate = exp.currentJob ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '');
                const dateRange = `${formatDate(exp.startDate)} - ${endDate}`;

                html += `
                    <div class="resume-item" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #667eea;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${exp.jobTitle}</div>
                                <div class="resume-item-company" style="color: #667eea; font-weight: 600; font-size: 1.1rem;">${exp.company}</div>
                            </div>
                            <div class="resume-item-date" style="color: #666; font-weight: 500; background: #f8f9fa; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">${dateRange}</div>
                        </div>
                        ${exp.description ? `<div class="resume-item-description" style="color: #555; line-height: 1.6;">${formatDescription(exp.description)}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Education
        if (education.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-graduation-cap" style="font-size: 1.3rem;"></i> Education
                    </h2>
            `;

            education.forEach(edu => {
                html += `
                    <div class="resume-item" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #667eea;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${edu.degree} in ${edu.fieldOfStudy}</div>
                                <div class="resume-item-company" style="color: #667eea; font-weight: 600; font-size: 1.1rem;">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                            </div>
                            <div class="resume-item-date" style="color: #666; font-weight: 500; background: #f8f9fa; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">${edu.graduationYear}</div>
                        </div>
                        ${edu.gpa ? `<div class="resume-item-description" style="color: #555; line-height: 1.6;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Skills
        if (skills.technical.length > 0 || skills.soft.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-cogs" style="font-size: 1.3rem;"></i> Skills
                    </h2>
            `;

            if (skills.technical.length > 0) {
                html += `
                    <div class="skills-category" style="margin-bottom: 20px;">
                        <h4 class="skills-subtitle" style="color: #495057; font-size: 1.1rem; margin-bottom: 10px; font-weight: 600;">Technical Skills</h4>
                        <div class="resume-skills" style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${skills.technical.map(skill => `<span class="resume-skill" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            if (skills.soft.length > 0) {
                html += `
                    <div class="skills-category" style="margin-bottom: 20px;">
                        <h4 class="skills-subtitle" style="color: #495057; font-size: 1.1rem; margin-bottom: 10px; font-weight: 600;">Soft Skills</h4>
                        <div class="resume-skills" style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${skills.soft.map(skill => `<span class="resume-skill" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        }

        // Languages
        if (languages.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-language" style="font-size: 1.3rem;"></i> Languages
                    </h2>
                    <div class="resume-skills" style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${languages.map(lang => `<span class="resume-skill" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);">${lang.language} <em>(${lang.proficiency})</em></span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Certifications
        if (certifications.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="color: #667eea; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                        <i class="fas fa-certificate" style="font-size: 1.3rem;"></i> Certifications
                    </h2>
            `;

            certifications.forEach(cert => {
                const dateInfo = cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : '';
                const expiryInfo = cert.expiryDate ? `Expires: ${formatDate(cert.expiryDate)}` : '';
                const dateRange = [dateInfo, expiryInfo].filter(Boolean).join(' | ');

                html += `
                    <div class="resume-item" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #667eea;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${cert.name}</div>
                                <div class="resume-item-company" style="color: #667eea; font-weight: 600; font-size: 1.1rem;">${cert.organization}</div>
                            </div>
                            <div class="resume-item-date" style="color: #666; font-weight: 500; background: #f8f9fa; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">${dateRange}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Watermark
        html += `
                <div class="watermark" style="position: absolute; bottom: 20px; right: 20px; color: #667eea; font-size: 0.8rem; opacity: 0.7; font-weight: 600;">Created with SaarthiX</div>
            </div>
        `;

        return html;
    }

    function generateClassicTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications) {
        let html = `
            <div class="resume-content" style="background: white; font-family: 'Times New Roman', serif; padding: 40px; position: relative;">
                <div class="resume-header" style="text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 class="resume-name" style="font-size: 2.5rem; color: #333; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px;">${fullName}</h1>
                    <div class="resume-contact" style="font-size: 1rem; color: #555; line-height: 1.5;">
                        ${contactInfo.join(' | ')}
                    </div>
                </div>
        `;

        // Professional Summary
        if (personal.summary) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">PROFESSIONAL SUMMARY</h2>
                    <div class="summary-content" style="font-size: 1.1rem; line-height: 1.7; color: #555; text-align: justify;">${personal.summary}</div>
                </div>
            `;
        }

        // Experience
        if (experience.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">WORK EXPERIENCE</h2>
            `;

            experience.forEach(exp => {
                const endDate = exp.currentJob ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '');
                const dateRange = `${formatDate(exp.startDate)} - ${endDate}`;

                html += `
                    <div class="resume-item" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${exp.jobTitle}</div>
                                <div class="resume-item-company" style="font-style: italic; color: #666; font-size: 1.1rem;">${exp.company}</div>
                            </div>
                            <div class="resume-item-date" style="font-weight: bold; color: #333;">${dateRange}</div>
                        </div>
                        ${exp.description ? `<div class="resume-item-description" style="margin-top: 8px; color: #555; line-height: 1.6;">${formatDescription(exp.description)}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Education
        if (education.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">EDUCATION</h2>
            `;

            education.forEach(edu => {
                html += `
                    <div class="resume-item" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${edu.degree} in ${edu.fieldOfStudy}</div>
                                <div class="resume-item-company" style="font-style: italic; color: #666; font-size: 1.1rem;">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                            </div>
                            <div class="resume-item-date" style="font-weight: bold; color: #333;">${edu.graduationYear}</div>
                        </div>
                        ${edu.gpa ? `<div class="resume-item-description" style="margin-top: 8px; color: #555; line-height: 1.6;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Skills
        if (skills.technical.length > 0 || skills.soft.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">SKILLS</h2>
            `;

            if (skills.technical.length > 0) {
                html += `
                    <div class="skills-category" style="margin-bottom: 15px;">
                        <strong style="color: #333; font-weight: bold; margin-right: 10px;">Technical:</strong>
                        <span style="color: #555;">${skills.technical.join(', ')}</span>
                    </div>
                `;
            }

            if (skills.soft.length > 0) {
                html += `
                    <div class="skills-category" style="margin-bottom: 15px;">
                        <strong style="color: #333; font-weight: bold; margin-right: 10px;">Soft Skills:</strong>
                        <span style="color: #555;">${skills.soft.join(', ')}</span>
                    </div>
                `;
            }

            html += `</div>`;
        }

        // Languages
        if (languages.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">LANGUAGES</h2>
                    <div style="color: #555; font-size: 1.1rem;">
                        ${languages.map(lang => `${lang.language} (${lang.proficiency})`).join(', ')}
                    </div>
                </div>
            `;
        }

        // Certifications
        if (certifications.length > 0) {
            html += `
                <div class="resume-section" style="margin-bottom: 30px;">
                    <h2 class="resume-section-title" style="font-size: 1.3rem; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #333;">CERTIFICATIONS</h2>
            `;

            certifications.forEach(cert => {
                const dateInfo = cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : '';
                const expiryInfo = cert.expiryDate ? `Expires: ${formatDate(cert.expiryDate)}` : '';
                const dateRange = [dateInfo, expiryInfo].filter(Boolean).join(' | ');

                html += `
                    <div class="resume-item" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <div class="resume-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div class="item-left" style="flex: 1;">
                                <div class="resume-item-title" style="font-size: 1.2rem; font-weight: bold; color: #333;">${cert.name}</div>
                                <div class="resume-item-company" style="font-style: italic; color: #666; font-size: 1.1rem;">${cert.organization}</div>
                            </div>
                            <div class="resume-item-date" style="font-weight: bold; color: #333;">${dateRange}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        html += `
                <div class="watermark" style="position: absolute; bottom: 20px; right: 20px; color: #999; font-size: 0.8rem; opacity: 0.7; font-style: italic;">Created with SaarthiX</div>
            </div>
        `;

        return html;
    }

    function generateCreativeTemplate(fullName, contactInfo, personal, experience, education, skills, languages, certifications) {
        let html = `
            <div class="resume-content" style="background: white; position: relative; padding: 0; font-family: 'Arial', sans-serif;">
                <div class="creative-layout" style="display: flex; min-height: 600px;">
                    <div class="creative-sidebar" style="width: 35%; background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px 25px;">
                        <div class="creative-profile" style="text-align: center; margin-bottom: 30px;">
                            <div class="profile-avatar" style="font-size: 4rem; color: #ecf0f1; margin-bottom: 15px;">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <h1 class="creative-name" style="font-size: 1.8rem; color: white; margin: 0; font-weight: 300; letter-spacing: 1px;">${fullName}</h1>
                        </div>
                        
                        <div class="creative-contact" style="margin-bottom: 30px;">
                            <h3 class="creative-section-title" style="color: #ecf0f1; font-size: 1.2rem; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Contact</h3>
                            <div class="contact-list" style="display: flex; flex-direction: column; gap: 10px;">
                                ${contactInfo.map(info => `<div class="contact-item" style="color: #bdc3c7; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">${info}</div>`).join('')}
                            </div>
                        </div>

                        ${skills.technical.length > 0 || skills.soft.length > 0 ? `
                            <div class="creative-skills" style="margin-bottom: 30px;">
                                <h3 class="creative-section-title" style="color: #ecf0f1; font-size: 1.2rem; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Skills</h3>
                                ${skills.technical.length > 0 ? `
                                    <div class="skill-group" style="margin-bottom: 20px;">
                                        <h4 style="color: #ecf0f1; font-size: 1rem; margin-bottom: 10px; font-weight: 500;">Technical</h4>
                                        <div class="creative-skill-tags" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${skills.technical.map(skill => `<span class="creative-skill-tag" style="background: #3498db; color: white; padding: 5px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${skill}</span>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                ${skills.soft.length > 0 ? `
                                    <div class="skill-group" style="margin-bottom: 20px;">
                                        <h4 style="color: #ecf0f1; font-size: 1rem; margin-bottom: 10px; font-weight: 500;">Soft Skills</h4>
                                        <div class="creative-skill-tags" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${skills.soft.map(skill => `<span class="creative-skill-tag" style="background: #3498db; color: white; padding: 5px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${skill}</span>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}

                        ${languages.length > 0 ? `
                            <div class="creative-languages" style="margin-bottom: 30px;">
                                <h3 class="creative-section-title" style="color: #ecf0f1; font-size: 1.2rem; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Languages</h3>
                                <div class="language-list" style="display: flex; flex-direction: column; gap: 10px;">
                                    ${languages.map(lang => `
                                        <div class="language-item" style="display: flex; justify-content: space-between; align-items: center; color: #bdc3c7; font-size: 0.9rem;">
                                            <span class="language-name" style="font-weight: 500;">${lang.language}</span>
                                            <span class="language-level" style="background: #3498db; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${lang.proficiency}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="creative-main" style="flex: 1; padding: 30px;">
                        ${personal.summary ? `
                            <div class="creative-summary" style="margin-bottom: 30px;">
                                <h2 class="creative-main-title" style="color: #2c3e50; font-size: 1.6rem; margin-bottom: 20px; font-weight: 300; position: relative; padding-left: 20px;">Professional Summary</h2>
                                <p class="summary-text" style="font-size: 1.1rem; line-height: 1.7; color: #555; text-align: justify;">${personal.summary}</p>
                            </div>
                        ` : ''}

                        ${experience.length > 0 ? `
                            <div class="creative-experience" style="margin-bottom: 30px;">
                                <h2 class="creative-main-title" style="color: #2c3e50; font-size: 1.6rem; margin-bottom: 20px; font-weight: 300; position: relative; padding-left: 20px;">Work Experience</h2>
                                ${experience.map(exp => {
            const endDate = exp.currentJob ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '');
            const dateRange = `${formatDate(exp.startDate)} - ${endDate}`;

            return `
                                        <div class="creative-exp-item" style="display: flex; margin-bottom: 25px; position: relative;">
                                            <div class="exp-timeline" style="width: 30px; display: flex; flex-direction: column; align-items: center; margin-right: 20px;">
                                                <div class="timeline-dot" style="width: 12px; height: 12px; background: #3498db; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3498db;"></div>
                                                <div class="timeline-line" style="width: 2px; height: 100%; background: #e0e0e0; margin-top: 5px;"></div>
                                            </div>
                                            <div class="exp-content" style="flex: 1;">
                                                <div class="exp-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                                                    <h3 class="exp-title" style="color: #2c3e50; font-size: 1.2rem; font-weight: 600; margin: 0;">${exp.jobTitle}</h3>
                                                    <span class="exp-date" style="color: #7f8c8d; font-size: 0.9rem; font-weight: 500; background: #ecf0f1; padding: 3px 8px; border-radius: 10px;">${dateRange}</span>
                                                </div>
                                                <div class="exp-company" style="color: #3498db; font-weight: 500; margin-bottom: 8px;">${exp.company}</div>
                                                ${exp.description ? `<div class="exp-description" style="color: #555; line-height: 1.6; margin-top: 10px;">${formatDescription(exp.description)}</div>` : ''}
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        ` : ''}

                        ${education.length > 0 ? `
                            <div class="creative-education" style="margin-bottom: 30px;">
                                <h2 class="creative-main-title" style="color: #2c3e50; font-size: 1.6rem; margin-bottom: 20px; font-weight: 300; position: relative; padding-left: 20px;">Education</h2>
                                ${education.map(edu => `
                                    <div class="creative-edu-item" style="display: flex; margin-bottom: 25px; position: relative;">
                                        <div class="edu-timeline" style="width: 30px; display: flex; flex-direction: column; align-items: center; margin-right: 20px;">
                                            <div class="timeline-dot" style="width: 12px; height: 12px; background: #3498db; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3498db;"></div>
                                        </div>
                                        <div class="edu-content" style="flex: 1;">
                                            <div class="edu-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                                                <h3 class="edu-title" style="color: #2c3e50; font-size: 1.2rem; font-weight: 600; margin: 0;">${edu.degree} in ${edu.fieldOfStudy}</h3>
                                                <span class="edu-date" style="color: #7f8c8d; font-size: 0.9rem; font-weight: 500; background: #ecf0f1; padding: 3px 8px; border-radius: 10px;">${edu.graduationYear}</span>
                                            </div>
                                            <div class="edu-institution" style="color: #3498db; font-weight: 500; margin-bottom: 8px;">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                                            ${edu.gpa ? `<div class="edu-gpa" style="color: #7f8c8d; font-size: 0.9rem; margin-top: 5px;">GPA: ${edu.gpa}</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${certifications.length > 0 ? `
                            <div class="creative-certifications" style="margin-bottom: 30px;">
                                <h2 class="creative-main-title" style="color: #2c3e50; font-size: 1.6rem; margin-bottom: 20px; font-weight: 300; position: relative; padding-left: 20px;">Certifications</h2>
                                ${certifications.map(cert => {
            const dateInfo = cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : '';
            const expiryInfo = cert.expiryDate ? `Expires: ${formatDate(cert.expiryDate)}` : '';
            const dateRange = [dateInfo, expiryInfo].filter(Boolean).join(' | ');

            return `
                                        <div class="creative-cert-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db;">
                                            <div class="cert-icon" style="color: #3498db; font-size: 1.5rem; margin-right: 15px; margin-top: 5px;">
                                                <i class="fas fa-certificate"></i>
                                            </div>
                                            <div class="cert-content" style="flex: 1;">
                                                <h3 class="cert-title" style="color: #2c3e50; font-size: 1.1rem; font-weight: 600; margin: 0 0 5px 0;">${cert.name}</h3>
                                                <div class="cert-org" style="color: #3498db; font-weight: 500; margin-bottom: 5px;">${cert.organization}</div>
                                                ${dateRange ? `<div class="cert-date" style="color: #7f8c8d; font-size: 0.9rem;">${dateRange}</div>` : ''}
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="watermark" style="position: absolute; bottom: 20px; right: 20px; color: #3498db; font-size: 0.8rem; opacity: 0.7; font-weight: 500;">Created with SaarthiX</div>
            </div>
        `;

        return html;
    }

    // Helper function to format descriptions with bullet points
    function formatDescription(description) {
        if (!description) return '';

        // Split by line breaks and create bullet points
        const lines = description.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
            return `<ul style="margin: 10px 0; padding-left: 20px;">${lines.map(line => `<li style="margin-bottom: 5px; color: #555; line-height: 1.6;">${line.trim()}</li>`).join('')}</ul>`;
        }
        return `<p style="margin: 10px 0; color: #555; line-height: 1.6;">${description}</p>`;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    // Preview Functions
    window.generatePreview = function () {
        collectFormData();
        updatePreview();

        // Scroll to preview if on mobile
        if (window.innerWidth <= 1200) {
            document.querySelector('.preview-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        showNotification('Resume preview updated successfully!', 'success');
    };

    window.downloadResume = function () {
        // Validate that we have minimum required data
        if (!resumeData.personal.firstName || !resumeData.personal.lastName) {
            showNotification('Please fill in at least your name before downloading.', 'error');
            return;
        }

        const downloadBtn = event.target;
        const originalHTML = downloadBtn.innerHTML;

        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;

        // Simulate PDF generation with progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating PDF... ${progress}%`;

            if (progress >= 100) {
                clearInterval(progressInterval);

                // Create a downloadable HTML file as a demo
                const resumeHTML = generateFullResumeHTML();
                const blob = new Blob([resumeHTML], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                downloadBtn.innerHTML = originalHTML;
                downloadBtn.disabled = false;
                showNotification('Resume downloaded successfully! You can print this HTML file as PDF.', 'success');
            }
        }, 200);
    };

    // Generate complete HTML for download
    function generateFullResumeHTML() {
        const resumeContent = generateResumeHTML();

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personal.firstName} ${resumeData.personal.lastName} - Resume</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .resume-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            min-height: 100vh;
        }
        
        @media print {
            body { 
                background: white; 
                margin: 0;
                padding: 0;
            }
            .resume-container { 
                box-shadow: none; 
                margin: 0;
                max-width: none;
                width: 100%;
            }
            .watermark { 
                display: none; 
            }
        }
        
        @media (max-width: 768px) {
            .creative-layout {
                flex-direction: column !important;
            }
            
            .creative-sidebar {
                width: 100% !important;
                margin: 0 !important;
            }
            
            .creative-main {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        ${resumeContent}
    </div>
</body>
</html>
        `;
    }

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

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl+S to save/generate preview
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            generatePreview();
        }

        // Ctrl+D to download
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            downloadResume();
        }
    });

    // Enhanced form validation with better UX
    function validateCurrentStepEnhanced() {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        const errors = [];

        requiredFields.forEach(field => {
            const fieldName = field.previousElementSibling?.textContent || field.name || 'Field';

            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                errors.push(fieldName.replace('*', '').trim());
                isValid = false;

                // Remove error styling after user starts typing
                field.addEventListener('input', function () {
                    this.style.borderColor = '#e0e0e0';
                    this.style.boxShadow = 'none';
                }, { once: true });
            }
        });

        if (!isValid) {
            const errorMessage = `Please fill in the following required fields: ${errors.join(', ')}`;
            showNotification(errorMessage, 'error');
        }

        return isValid;
    }

    // Override the original validation function
    const originalValidateCurrentStep = validateCurrentStep;
    validateCurrentStep = function () {
        return validateCurrentStepEnhanced();
    };

    // Enhanced preview update with error handling
    function updatePreviewSafely() {
        try {
            const previewContainer = document.getElementById('resume-preview');
            if (!previewContainer) return;

            collectFormData();
            const resumeHTML = generateResumeHTML();
            previewContainer.innerHTML = resumeHTML;
        } catch (error) {
            console.error('Preview update error:', error);
            const previewContainer = document.getElementById('resume-preview');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="preview-placeholder" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-exclamation-triangle" style="color: #dc3545; font-size: 2rem; margin-bottom: 15px;"></i>
                        <p>Error generating preview. Please check your input data.</p>
                        <button onclick="updatePreview()" style="margin-top: 15px; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-refresh"></i> Retry
                        </button>
                    </div>
                `;
            }
        }
    }

    // Override the original updatePreview with the safe version
    const originalUpdatePreview = updatePreview;
    updatePreview = function () {
        updatePreviewSafely();
    };
});