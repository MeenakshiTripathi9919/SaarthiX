// Job Metrics Navigation System
class JobMetricsNavigation {
    constructor() {
        this.currentLevel = 'course';
        this.selectedCourse = '';
        this.selectedStream = '';
        this.selectedIndustry = '';
        
        this.initializeData();
        this.bindEvents();
    }

    initializeData() {
        // Course data with streams and industries
        this.courseData = {
            btech: {
                name: 'B.Tech',
                streams: {
                    'computer-science': {
                        name: 'Computer Science Engineering',
                        icon: 'fas fa-laptop-code',
                        industries: ['Software Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'AI/ML', 'Gaming', 'Fintech']
                    },
                    'mechanical': {
                        name: 'Mechanical Engineering',
                        icon: 'fas fa-cogs',
                        industries: ['Manufacturing', 'Automotive', 'Aerospace', 'Energy', 'Robotics', 'Construction']
                    },
                    'electrical': {
                        name: 'Electrical Engineering',
                        icon: 'fas fa-bolt',
                        industries: ['Power Systems', 'Electronics', 'Telecommunications', 'Renewable Energy', 'Automation']
                    },
                    'civil': {
                        name: 'Civil Engineering',
                        icon: 'fas fa-building',
                        industries: ['Construction', 'Infrastructure', 'Real Estate', 'Urban Planning', 'Environmental']
                    },
                    'electronics': {
                        name: 'Electronics & Communication',
                        icon: 'fas fa-microchip',
                        industries: ['Telecommunications', 'Electronics', 'Embedded Systems', 'IoT', 'Semiconductor']
                    },
                    'chemical': {
                        name: 'Chemical Engineering',
                        icon: 'fas fa-flask',
                        industries: ['Chemicals', 'Pharmaceuticals', 'Petrochemicals', 'Food Processing', 'Environmental']
                    },
                    'information-technology': {
                        name: 'Information Technology',
                        icon: 'fas fa-server',
                        industries: ['IT Services', 'Software Development', 'System Administration', 'Network Security', 'Database Management']
                    },
                    'biotechnology': {
                        name: 'Biotechnology',
                        icon: 'fas fa-dna',
                        industries: ['Pharmaceuticals', 'Healthcare', 'Research', 'Agriculture', 'Environmental']
                    }
                }
            },
            bcom: {
                name: 'B.Com',
                streams: {
                    'general': {
                        name: 'General Commerce',
                        icon: 'fas fa-chart-bar',
                        industries: ['Banking', 'Finance', 'Accounting', 'Insurance', 'Retail']
                    },
                    'accounting': {
                        name: 'Accounting & Finance',
                        icon: 'fas fa-calculator',
                        industries: ['Accounting Firms', 'Banking', 'Financial Services', 'Taxation', 'Auditing']
                    },
                    'marketing': {
                        name: 'Marketing',
                        icon: 'fas fa-bullhorn',
                        industries: ['Digital Marketing', 'Advertising', 'E-commerce', 'Retail', 'Media']
                    },
                    'economics': {
                        name: 'Economics',
                        icon: 'fas fa-chart-line',
                        industries: ['Banking', 'Government', 'Research', 'Consulting', 'Policy Making']
                    },
                    'international-business': {
                        name: 'International Business',
                        icon: 'fas fa-globe',
                        industries: ['Import/Export', 'MNCs', 'Trade', 'Logistics', 'Consulting']
                    }
                }
            },
            bsc: {
                name: 'BSc',
                streams: {
                    'computer-science': {
                        name: 'Computer Science',
                        icon: 'fas fa-desktop',
                        industries: ['Software Development', 'IT Services', 'Data Science', 'Research', 'Education']
                    },
                    'mathematics': {
                        name: 'Mathematics',
                        icon: 'fas fa-square-root-alt',
                        industries: ['Data Science', 'Research', 'Banking', 'Education', 'Actuarial Science']
                    },
                    'physics': {
                        name: 'Physics',
                        icon: 'fas fa-atom',
                        industries: ['Research', 'Education', 'Electronics', 'Space Technology', 'Nuclear Energy']
                    },
                    'chemistry': {
                        name: 'Chemistry',
                        icon: 'fas fa-vial',
                        industries: ['Pharmaceuticals', 'Research', 'Chemicals', 'Quality Control', 'Education']
                    },
                    'biology': {
                        name: 'Biology',
                        icon: 'fas fa-leaf',
                        industries: ['Healthcare', 'Research', 'Pharmaceuticals', 'Biotechnology', 'Education']
                    },
                    'statistics': {
                        name: 'Statistics',
                        icon: 'fas fa-chart-pie',
                        industries: ['Data Science', 'Market Research', 'Banking', 'Government', 'Quality Control']
                    }
                }
            },
            bca: {
                name: 'BCA',
                streams: {
                    'software-development': {
                        name: 'Software Development',
                        icon: 'fas fa-code',
                        industries: ['Software Companies', 'IT Services', 'Startups', 'E-commerce', 'Gaming']
                    },
                    'web-development': {
                        name: 'Web Development',
                        icon: 'fas fa-globe-americas',
                        industries: ['Web Development', 'Digital Agencies', 'E-commerce', 'Startups', 'Freelancing']
                    },
                    'database-management': {
                        name: 'Database Management',
                        icon: 'fas fa-database',
                        industries: ['IT Services', 'Banking', 'Healthcare', 'Government', 'E-commerce']
                    },
                    'network-administration': {
                        name: 'Network Administration',
                        icon: 'fas fa-network-wired',
                        industries: ['IT Services', 'Telecommunications', 'Banking', 'Government', 'Healthcare']
                    }
                }
            },
            mca: {
                name: 'MCA',
                streams: {
                    'software-engineering': {
                        name: 'Software Engineering',
                        icon: 'fas fa-laptop-code',
                        industries: ['Software Development', 'Product Companies', 'Consulting', 'Fintech', 'Healthcare Tech']
                    },
                    'data-science': {
                        name: 'Data Science & Analytics',
                        icon: 'fas fa-chart-area',
                        industries: ['Data Science', 'Analytics', 'AI/ML', 'Consulting', 'Research']
                    },
                    'cybersecurity': {
                        name: 'Cybersecurity',
                        icon: 'fas fa-shield-alt',
                        industries: ['Cybersecurity', 'Banking', 'Government', 'Consulting', 'IT Services']
                    },
                    'cloud-computing': {
                        name: 'Cloud Computing',
                        icon: 'fas fa-cloud',
                        industries: ['Cloud Services', 'IT Consulting', 'DevOps', 'System Integration', 'Startups']
                    },
                    'mobile-development': {
                        name: 'Mobile App Development',
                        icon: 'fas fa-mobile-alt',
                        industries: ['Mobile Development', 'Startups', 'E-commerce', 'Gaming', 'Digital Agencies']
                    }
                }
            }
        };

        // Industry roadmaps with skills and certifications
        this.industryRoadmaps = {
            'Software Development': {
                icon: 'fas fa-code',
                description: 'Build applications and software solutions',
                avgSalary: '₹6-15 LPA',
                skills: {
                    'Core Skills': ['Programming Languages (Java, Python, JavaScript)', 'Data Structures & Algorithms', 'Object-Oriented Programming', 'Version Control (Git)', 'Database Management'],
                    'Frontend Skills': ['HTML/CSS', 'JavaScript Frameworks (React, Angular, Vue)', 'Responsive Design', 'UI/UX Principles'],
                    'Backend Skills': ['Server-side Languages', 'APIs & Web Services', 'Database Design', 'Cloud Platforms'],
                    'Soft Skills': ['Problem Solving', 'Team Collaboration', 'Communication', 'Project Management']
                },
                certifications: [
                    'Oracle Certified Java Programmer',
                    'Microsoft Certified: Azure Developer',
                    'AWS Certified Developer',
                    'Google Cloud Professional Developer',
                    'Certified Scrum Developer'
                ],
                careerPath: [
                    'Junior Developer (0-2 years)',
                    'Software Developer (2-4 years)',
                    'Senior Developer (4-7 years)',
                    'Tech Lead (7-10 years)',
                    'Engineering Manager (10+ years)'
                ]
            },
            'Data Science': {
                icon: 'fas fa-chart-line',
                description: 'Extract insights from data to drive business decisions',
                avgSalary: '₹8-20 LPA',
                skills: {
                    'Programming': ['Python', 'R', 'SQL', 'Scala'],
                    'Statistics & Math': ['Statistics', 'Linear Algebra', 'Calculus', 'Probability'],
                    'Machine Learning': ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'Neural Networks'],
                    'Tools & Libraries': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Tableau', 'Power BI'],
                    'Soft Skills': ['Critical Thinking', 'Business Acumen', 'Communication', 'Storytelling']
                },
                certifications: [
                    'Google Data Analytics Certificate',
                    'IBM Data Science Professional Certificate',
                    'Microsoft Certified: Azure Data Scientist',
                    'Tableau Desktop Specialist',
                    'AWS Certified Machine Learning'
                ],
                careerPath: [
                    'Data Analyst (0-2 years)',
                    'Data Scientist (2-5 years)',
                    'Senior Data Scientist (5-8 years)',
                    'Principal Data Scientist (8-12 years)',
                    'Chief Data Officer (12+ years)'
                ]
            },
            'Banking': {
                icon: 'fas fa-university',
                description: 'Financial services and banking operations',
                avgSalary: '₹4-12 LPA',
                skills: {
                    'Financial Knowledge': ['Banking Operations', 'Financial Analysis', 'Risk Management', 'Investment Banking'],
                    'Technical Skills': ['Excel', 'Financial Modeling', 'Database Management', 'Banking Software'],
                    'Regulatory': ['Compliance', 'KYC/AML', 'Banking Regulations', 'Audit Procedures'],
                    'Soft Skills': ['Customer Service', 'Communication', 'Attention to Detail', 'Integrity']
                },
                certifications: [
                    'Certified Financial Planner (CFP)',
                    'Financial Risk Manager (FRM)',
                    'Chartered Financial Analyst (CFA)',
                    'Certified Anti-Money Laundering Specialist',
                    'NISM Certifications'
                ],
                careerPath: [
                    'Banking Associate (0-2 years)',
                    'Relationship Manager (2-5 years)',
                    'Assistant Manager (5-8 years)',
                    'Branch Manager (8-12 years)',
                    'Regional Manager (12+ years)'
                ]
            },
            'Cybersecurity': {
                icon: 'fas fa-shield-alt',
                description: 'Protect systems and data from cyber threats',
                avgSalary: '₹7-18 LPA',
                skills: {
                    'Security Fundamentals': ['Network Security', 'Information Security', 'Risk Assessment', 'Incident Response'],
                    'Technical Skills': ['Penetration Testing', 'Vulnerability Assessment', 'Security Tools', 'Forensics'],
                    'Programming': ['Python', 'PowerShell', 'Bash', 'C++'],
                    'Soft Skills': ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Continuous Learning']
                },
                certifications: [
                    'Certified Ethical Hacker (CEH)',
                    'CompTIA Security+',
                    'Certified Information Security Manager (CISM)',
                    'Certified Information Systems Auditor (CISA)',
                    'CISSP (Certified Information Systems Security Professional)'
                ],
                careerPath: [
                    'Security Analyst (0-3 years)',
                    'Security Engineer (3-6 years)',
                    'Senior Security Consultant (6-9 years)',
                    'Security Architect (9-12 years)',
                    'Chief Information Security Officer (12+ years)'
                ]
            },
            'Manufacturing': {
                icon: 'fas fa-industry',
                description: 'Design, produce and optimize manufacturing processes',
                avgSalary: '₹5-14 LPA',
                skills: {
                    'Technical Skills': ['CAD/CAM Software', 'Lean Manufacturing', 'Six Sigma', 'Quality Control', 'Production Planning'],
                    'Engineering Skills': ['Mechanical Design', 'Process Engineering', 'Materials Science', 'Automation', 'Robotics'],
                    'Software Tools': ['AutoCAD', 'SolidWorks', 'MATLAB', 'SAP', 'ERP Systems'],
                    'Soft Skills': ['Project Management', 'Team Leadership', 'Problem Solving', 'Communication']
                },
                certifications: [
                    'Six Sigma Green Belt/Black Belt',
                    'Lean Manufacturing Certification',
                    'PMP (Project Management Professional)',
                    'AutoCAD Certified Professional',
                    'ISO 9001 Quality Management'
                ],
                careerPath: [
                    'Production Engineer (0-3 years)',
                    'Process Engineer (3-6 years)',
                    'Production Manager (6-10 years)',
                    'Plant Manager (10-15 years)',
                    'Operations Director (15+ years)'
                ]
            },
            'Finance': {
                icon: 'fas fa-chart-pie',
                description: 'Manage financial operations and investment strategies',
                avgSalary: '₹4-16 LPA',
                skills: {
                    'Financial Analysis': ['Financial Modeling', 'Valuation', 'Risk Assessment', 'Portfolio Management', 'Investment Analysis'],
                    'Technical Skills': ['Excel Advanced', 'Bloomberg Terminal', 'SQL', 'Python/R', 'Financial Software'],
                    'Regulatory Knowledge': ['SEBI Regulations', 'Banking Laws', 'Tax Planning', 'Compliance', 'Audit'],
                    'Soft Skills': ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Client Management']
                },
                certifications: [
                    'Chartered Financial Analyst (CFA)',
                    'Financial Risk Manager (FRM)',
                    'Certified Financial Planner (CFP)',
                    'NISM Series Certifications',
                    'Chartered Accountant (CA)'
                ],
                careerPath: [
                    'Financial Analyst (0-3 years)',
                    'Senior Analyst (3-6 years)',
                    'Finance Manager (6-10 years)',
                    'Finance Director (10-15 years)',
                    'Chief Financial Officer (15+ years)'
                ]
            },
            'Healthcare': {
                icon: 'fas fa-heartbeat',
                description: 'Improve health outcomes through technology and research',
                avgSalary: '₹6-18 LPA',
                skills: {
                    'Medical Knowledge': ['Anatomy & Physiology', 'Medical Terminology', 'Healthcare Systems', 'Patient Care', 'Medical Ethics'],
                    'Technical Skills': ['Medical Devices', 'Healthcare IT', 'Data Analysis', 'Research Methods', 'Biostatistics'],
                    'Software Tools': ['EPIC', 'Cerner', 'MATLAB', 'R/Python', 'Medical Imaging Software'],
                    'Soft Skills': ['Empathy', 'Communication', 'Critical Thinking', 'Teamwork']
                },
                certifications: [
                    'Healthcare Information Management (RHIA)',
                    'Clinical Research Certification',
                    'Medical Device Certification',
                    'Healthcare Quality Certification',
                    'Biomedical Engineering Certification'
                ],
                careerPath: [
                    'Healthcare Analyst (0-3 years)',
                    'Clinical Researcher (3-6 years)',
                    'Healthcare Manager (6-10 years)',
                    'Director of Operations (10-15 years)',
                    'Chief Medical Officer (15+ years)'
                ]
            },
            'Digital Marketing': {
                icon: 'fas fa-bullhorn',
                description: 'Promote brands and products through digital channels',
                avgSalary: '₹3-12 LPA',
                skills: {
                    'Marketing Fundamentals': ['Market Research', 'Consumer Behavior', 'Brand Management', 'Campaign Strategy', 'Content Marketing'],
                    'Digital Tools': ['Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO/SEM', 'Email Marketing'],
                    'Creative Skills': ['Graphic Design', 'Video Editing', 'Copywriting', 'Social Media', 'Content Creation'],
                    'Analytics': ['Data Analysis', 'A/B Testing', 'Conversion Optimization', 'ROI Analysis']
                },
                certifications: [
                    'Google Ads Certification',
                    'Google Analytics Certification',
                    'Facebook Blueprint Certification',
                    'HubSpot Content Marketing',
                    'Hootsuite Social Media Marketing'
                ],
                careerPath: [
                    'Digital Marketing Executive (0-2 years)',
                    'Digital Marketing Specialist (2-5 years)',
                    'Digital Marketing Manager (5-8 years)',
                    'Head of Digital Marketing (8-12 years)',
                    'Chief Marketing Officer (12+ years)'
                ]
            },
            'Cloud Computing': {
                icon: 'fas fa-cloud',
                description: 'Design and manage cloud infrastructure and services',
                avgSalary: '₹8-22 LPA',
                skills: {
                    'Cloud Platforms': ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'IBM Cloud', 'Oracle Cloud'],
                    'Technical Skills': ['Virtualization', 'Containerization (Docker, Kubernetes)', 'Microservices', 'DevOps', 'Infrastructure as Code'],
                    'Programming': ['Python', 'Java', 'PowerShell', 'Bash', 'Terraform'],
                    'Security': ['Cloud Security', 'Identity Management', 'Encryption', 'Compliance']
                },
                certifications: [
                    'AWS Certified Solutions Architect',
                    'Microsoft Azure Architect',
                    'Google Cloud Professional Architect',
                    'Certified Kubernetes Administrator',
                    'Docker Certified Associate'
                ],
                careerPath: [
                    'Cloud Engineer (0-3 years)',
                    'Cloud Architect (3-6 years)',
                    'Senior Cloud Architect (6-10 years)',
                    'Cloud Solutions Director (10-15 years)',
                    'Chief Technology Officer (15+ years)'
                ]
            },
            'AI/ML': {
                icon: 'fas fa-robot',
                description: 'Develop intelligent systems and machine learning solutions',
                avgSalary: '₹10-25 LPA',
                skills: {
                    'Programming': ['Python', 'R', 'Java', 'Scala', 'Julia'],
                    'Machine Learning': ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'Neural Networks', 'NLP'],
                    'Tools & Frameworks': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Apache Spark'],
                    'Mathematics': ['Statistics', 'Linear Algebra', 'Calculus', 'Probability', 'Optimization']
                },
                certifications: [
                    'Google AI/ML Professional Certificate',
                    'AWS Certified Machine Learning',
                    'Microsoft Azure AI Engineer',
                    'TensorFlow Developer Certificate',
                    'IBM AI Engineering Professional'
                ],
                careerPath: [
                    'ML Engineer (0-3 years)',
                    'Senior ML Engineer (3-6 years)',
                    'Principal ML Engineer (6-10 years)',
                    'AI Research Director (10-15 years)',
                    'Chief AI Officer (15+ years)'
                ]
            },
            'E-commerce': {
                icon: 'fas fa-shopping-cart',
                description: 'Build and manage online retail platforms and experiences',
                avgSalary: '₹4-15 LPA',
                skills: {
                    'Technical Skills': ['Web Development', 'Mobile App Development', 'Database Management', 'API Integration', 'Payment Gateways'],
                    'E-commerce Platforms': ['Shopify', 'Magento', 'WooCommerce', 'Amazon Seller Central', 'Flipkart Seller Hub'],
                    'Digital Marketing': ['SEO', 'PPC', 'Social Media Marketing', 'Email Marketing', 'Content Marketing'],
                    'Analytics': ['Google Analytics', 'Conversion Tracking', 'Customer Analytics', 'Inventory Management']
                },
                certifications: [
                    'Shopify Partner Certification',
                    'Google Ads E-commerce Certification',
                    'Amazon Advertising Certification',
                    'Magento Developer Certification',
                    'Facebook Blueprint E-commerce'
                ],
                careerPath: [
                    'E-commerce Executive (0-2 years)',
                    'E-commerce Manager (2-5 years)',
                    'E-commerce Head (5-8 years)',
                    'Director of E-commerce (8-12 years)',
                    'Chief Digital Officer (12+ years)'
                ]
            },
            'Research': {
                icon: 'fas fa-microscope',
                description: 'Conduct scientific research and development',
                avgSalary: '₹5-20 LPA',
                skills: {
                    'Research Methods': ['Experimental Design', 'Data Collection', 'Statistical Analysis', 'Literature Review', 'Hypothesis Testing'],
                    'Technical Skills': ['Laboratory Techniques', 'Instrumentation', 'Data Analysis Software', 'Research Tools', 'Documentation'],
                    'Software Tools': ['SPSS', 'R', 'Python', 'MATLAB', 'LabVIEW'],
                    'Academic Skills': ['Technical Writing', 'Presentation', 'Grant Writing', 'Peer Review']
                },
                certifications: [
                    'Good Clinical Practice (GCP)',
                    'Research Ethics Certification',
                    'Statistical Analysis Certification',
                    'Laboratory Safety Certification',
                    'Project Management for Researchers'
                ],
                careerPath: [
                    'Research Assistant (0-3 years)',
                    'Research Associate (3-6 years)',
                    'Senior Researcher (6-10 years)',
                    'Research Director (10-15 years)',
                    'Chief Research Officer (15+ years)'
                ]
            }
        };
    }

    bindEvents() {
        // Course selection
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const course = e.currentTarget.dataset.course;
                this.selectCourse(course);
            });
        });

        // Back buttons
        document.getElementById('backToCourse').addEventListener('click', () => {
            this.showLevel('course');
        });

        document.getElementById('backToStream').addEventListener('click', () => {
            this.showLevel('stream');
        });

        document.getElementById('backToIndustry').addEventListener('click', () => {
            this.showLevel('industry');
        });

        // Floating action button
        document.getElementById('floatingAction').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.goBack();
            }
        });
    }

    showHelpModal() {
        const helpContent = {
            'course': 'Select your educational background from the available courses. Each course has different specialization streams.',
            'stream': 'Choose your area of specialization within your course. This will determine which industries are most relevant for you.',
            'industry': 'Pick an industry that interests you. We\'ll show you the specific requirements and career path for that field.',
            'roadmap': 'This is your complete career roadmap! Review the skills, certifications, and career progression steps.'
        };

        const message = helpContent[this.currentLevel] || 'Navigate through the levels to discover your career path!';
        
        // Simple alert for now - can be enhanced with a proper modal
        alert(`Help: ${message}`);
    }

    goBack() {
        const backMap = {
            'stream': 'course',
            'industry': 'stream',
            'roadmap': 'industry'
        };

        const previousLevel = backMap[this.currentLevel];
        if (previousLevel) {
            this.showLevel(previousLevel);
        }
    }

    selectCourse(courseKey) {
        this.selectedCourse = courseKey;
        this.updateBreadcrumb(['Select Course', this.courseData[courseKey].name]);
        this.populateStreams(courseKey);
        this.showLevel('stream');
    }

    selectStream(streamKey) {
        this.selectedStream = streamKey;
        const courseName = this.courseData[this.selectedCourse].name;
        const streamName = this.courseData[this.selectedCourse].streams[streamKey].name;
        this.updateBreadcrumb(['Select Course', courseName, streamName]);
        this.populateIndustries(this.selectedCourse, streamKey);
        this.showLevel('industry');
    }

    selectIndustry(industryName) {
        this.selectedIndustry = industryName;
        const courseName = this.courseData[this.selectedCourse].name;
        const streamName = this.courseData[this.selectedCourse].streams[this.selectedStream].name;
        this.updateBreadcrumb(['Select Course', courseName, streamName, industryName]);
        this.populateRoadmap(industryName);
        this.showLevel('roadmap');
    }

    populateStreams(courseKey) {
        const streamGrid = document.getElementById('streamGrid');
        const selectedCourseSpan = document.getElementById('selectedCourse');
        
        selectedCourseSpan.textContent = this.courseData[courseKey].name;
        streamGrid.innerHTML = '';

        Object.entries(this.courseData[courseKey].streams).forEach(([streamKey, streamData]) => {
            const streamCard = document.createElement('div');
            streamCard.className = 'stream-card';
            streamCard.innerHTML = `
                <div class="stream-icon">
                    <i class="${streamData.icon}"></i>
                </div>
                <h3>${streamData.name}</h3>
                <div class="stream-stats">
                    <span class="stat">${streamData.industries.length} Industries</span>
                </div>
            `;
            
            streamCard.addEventListener('click', () => {
                this.selectStream(streamKey);
            });
            
            streamGrid.appendChild(streamCard);
        });
    }

    populateIndustries(courseKey, streamKey) {
        const industryGrid = document.getElementById('industryGrid');
        const selectedStreamSpan = document.getElementById('selectedStream');
        
        selectedStreamSpan.textContent = this.courseData[courseKey].streams[streamKey].name;
        industryGrid.innerHTML = '';

        const industries = this.courseData[courseKey].streams[streamKey].industries;
        
        industries.forEach(industry => {
            const industryCard = document.createElement('div');
            industryCard.className = 'industry-card';
            industryCard.innerHTML = `
                <div class="industry-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>${industry}</h3>
                <p>Explore career opportunities</p>
                <div class="industry-stats">
                    <span class="stat">View Roadmap</span>
                </div>
            `;
            
            industryCard.addEventListener('click', () => {
                this.selectIndustry(industry);
            });
            
            industryGrid.appendChild(industryCard);
        });
    }

    populateRoadmap(industryName) {
        const roadmapContainer = document.getElementById('roadmapContainer');
        const selectedIndustrySpan = document.getElementById('selectedIndustry');
        
        selectedIndustrySpan.textContent = industryName;
        roadmapContainer.innerHTML = '';

        const roadmap = this.industryRoadmaps[industryName];
        
        if (!roadmap) {
            roadmapContainer.innerHTML = `
                <div class="roadmap-placeholder">
                    <h3>Roadmap Coming Soon</h3>
                    <p>We're working on creating a comprehensive roadmap for ${industryName}. Please check back soon!</p>
                </div>
            `;
            return;
        }

        roadmapContainer.innerHTML = `
            <div class="roadmap-header">
                <div class="roadmap-icon">
                    <i class="${roadmap.icon}"></i>
                </div>
                <div class="roadmap-info">
                    <h3>${industryName}</h3>
                    <p>${roadmap.description}</p>
                    <div class="salary-info">
                        <span class="salary-label">Average Salary:</span>
                        <span class="salary-value">${roadmap.avgSalary}</span>
                    </div>
                </div>
            </div>

            <div class="roadmap-content">
                <div class="roadmap-section">
                    <h4><i class="fas fa-tools"></i> Required Skills</h4>
                    <div class="skills-categories">
                        ${Object.entries(roadmap.skills).map(([category, skills]) => `
                            <div class="skill-category">
                                <h5>${category}</h5>
                                <div class="skill-tags">
                                    ${skills.map(skill => `
                                        <span class="skill-tag tooltip" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(skill + ' online course')}', '_blank')">
                                            ${skill}
                                            <span class="tooltiptext">Click to search for ${skill} courses</span>
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="roadmap-section">
                    <h4><i class="fas fa-certificate"></i> Recommended Certifications</h4>
                    <div class="certification-list">
                        ${roadmap.certifications.map(cert => `
                            <div class="certification-item tooltip" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(cert + ' certification exam')}', '_blank')">
                                <i class="fas fa-award"></i>
                                <span>${cert}</span>
                                <span class="tooltiptext">Click to search for ${cert} information</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="roadmap-section">
                    <h4><i class="fas fa-route"></i> Career Progression</h4>
                    <div class="career-path">
                        ${roadmap.careerPath.map((role, index) => `
                            <div class="career-step">
                                <div class="step-number">${index + 1}</div>
                                <div class="step-content">
                                    <span class="role-title">${role}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showLevel(level) {
        // Hide all levels
        document.querySelectorAll('.navigation-level').forEach(el => {
            el.classList.add('hidden');
        });

        // Show selected level
        document.getElementById(`${level}Level`).classList.remove('hidden');
        this.currentLevel = level;
        
        // Update progress indicator
        this.updateProgressIndicator(level);
    }

    updateProgressIndicator(level) {
        const stepMap = {
            'course': 1,
            'stream': 2,
            'industry': 3,
            'roadmap': 4
        };
        
        const currentStep = stepMap[level];
        const progressDots = document.querySelectorAll('.progress-dot');
        
        progressDots.forEach((dot, index) => {
            const step = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (step < currentStep) {
                dot.classList.add('completed');
            } else if (step === currentStep) {
                dot.classList.add('active');
            }
        });
    }

    updateBreadcrumb(items) {
        const breadcrumbNav = document.getElementById('breadcrumbNav');
        breadcrumbNav.innerHTML = items.map((item, index) => {
            const isActive = index === items.length - 1;
            return `<span class="breadcrumb-item ${isActive ? 'active' : ''}">${item}</span>`;
        }).join('<i class="fas fa-chevron-right breadcrumb-separator"></i>');
    }
}

// Initialize the navigation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobMetricsNavigation();
});