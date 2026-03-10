/**
 * ============================================================================
 * ADMIN DASHBOARD SCRIPT
 * ============================================================================
 * 
 * This file contains all JavaScript functionality for the Admin Dashboard
 * of Rohan Kumar's Cybersecurity Portfolio.
 * 
 * Features:
 * - Dashboard statistics display
 * - Form handling for editing portfolio content
 * - Dynamic list management (add/remove items)
 * - Data persistence to localStorage (simulating JSON file updates)
 * - Modal dialogs
 * - Alert notifications
 * - Sidebar navigation
 * 
 * Note: Since GitHub Pages is static, data changes are stored in localStorage.
 * In a production environment with a backend, these would be API calls.
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Storage key for portfolio data in localStorage
 */
const STORAGE_KEY = 'portfolio_data';

/**
 * Default data path (used for initial load)
 */
const DEFAULT_DATA_PATH = '../data/portfolio-data.json';

/**
 * Cache for portfolio data
 */
let adminData = null;

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

/**
 * Load portfolio data from localStorage or fetch default
 * @returns {Promise<Object>} - Portfolio data object
 */
async function loadAdminData() {
  // Check localStorage first
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (storedData) {
    try {
      adminData = JSON.parse(storedData);
      console.log('[Admin] Data loaded from localStorage');
      return adminData;
    } catch (error) {
      console.error('[Admin] Error parsing stored data:', error);
    }
  }
  
  // If no stored data, fetch from JSON file
  try {
    const response = await fetch(DEFAULT_DATA_PATH);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    adminData = await response.json();
    
    // Save to localStorage for future use
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
    console.log('[Admin] Data loaded from JSON file');
    
    return adminData;
  } catch (error) {
    console.error('[Admin] Error loading data:', error);
    showAlert('Error loading data. Please refresh the page.', 'error');
    return null;
  }
}

/**
 * Save portfolio data to localStorage
 * @param {Object} data - Portfolio data to save
 * @returns {boolean} - True if saved successfully
 */
function saveAdminData(data) {
  try {
    // Update last modified timestamp
    data.lastUpdated = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Update cache
    adminData = data;
    
    console.log('[Admin] Data saved successfully');
    return true;
  } catch (error) {
    console.error('[Admin] Error saving data:', error);
    showAlert('Error saving data. Please try again.', 'error');
    return false;
  }
}

/**
 * Get current portfolio data
 * @returns {Object|null} - Current portfolio data
 */
function getAdminData() {
  return adminData;
}

/**
 * Reset data to default (clear localStorage)
 */
function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  adminData = null;
  showAlert('Data reset to default. Refreshing...', 'success');
  setTimeout(() => location.reload(), 1500);
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

/**
 * Initialize dashboard statistics
 */
async function initDashboardStats() {
  const data = await loadAdminData();
  if (!data) return;
  
  // Update stat cards
  updateStatValue('stat-projects', data.projects ? data.projects.length : 0);
  updateStatValue('stat-skills', data.skills && data.skills.technical ? data.skills.technical.length : 0);
  updateStatValue('stat-tools', data.tools ? data.tools.length : 0);
  updateStatValue('stat-certifications', data.certifications ? data.certifications.length : 0);
  
  // Update recent activity
  updateRecentActivity();
  
  // Update last modified date
  updateLastModified(data.lastUpdated);
}

/**
 * Update a stat value with animation
 * @param {string} elementId - ID of the element to update
 * @param {number} value - Value to display
 */
function updateStatValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    // Animate the number
    animateNumber(element, 0, value, 1000);
  }
}

/**
 * Animate a number from start to end
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const updateNumber = () => {
    current += increment;
    if (current < end) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = end;
    }
  };
  
  updateNumber();
}

/**
 * Update recent activity list
 */
function updateRecentActivity() {
  const activityList = document.getElementById('activityList');
  if (!activityList) return;
  
  // Get activity from localStorage or use defaults
  const activities = JSON.parse(localStorage.getItem('portfolio_activity') || '[]');
  
  if (activities.length === 0) {
    activityList.innerHTML = '<p class="text-muted">No recent activity</p>';
    return;
  }
  
  // Show last 5 activities
  activityList.innerHTML = activities.slice(0, 5).map(activity => `
    <div class="activity-item">
      <div class="activity-icon ${activity.type}">
        <i class="fas fa-${getActivityIcon(activity.type)}"></i>
      </div>
      <div class="activity-content">
        <p>${activity.message}</p>
        <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Get icon class for activity type
 * @param {string} type - Activity type
 * @returns {string} - Font Awesome icon class
 */
function getActivityIcon(type) {
  const icons = {
    'edit': 'edit',
    'add': 'plus',
    'delete': 'trash',
    'login': 'sign-in-alt',
    'logout': 'sign-out-alt'
  };
  return icons[type] || 'info-circle';
}

/**
 * Add activity to the log
 * @param {string} type - Activity type
 * @param {string} message - Activity message
 */
function addActivity(type, message) {
  const activities = JSON.parse(localStorage.getItem('portfolio_activity') || '[]');
  
  activities.unshift({
    type: type,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 20 activities
  if (activities.length > 20) {
    activities.pop();
  }
  
  localStorage.setItem('portfolio_activity', JSON.stringify(activities));
}

/**
 * Format timestamp to relative time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Relative time string
 */
function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

/**
 * Update last modified display
 * @param {string} timestamp - ISO timestamp
 */
function updateLastModified(timestamp) {
  const element = document.getElementById('lastModified');
  if (element && timestamp) {
    const date = new Date(timestamp);
    element.textContent = date.toLocaleString();
  }
}

// ============================================================================
// SIDEBAR NAVIGATION
// ============================================================================

/**
 * Initialize sidebar navigation
 */
function initSidebar() {
  // Mobile sidebar toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
  
  // Highlight active nav item based on current page
  highlightActiveNavItem();
}

/**
 * Highlight active navigation item
 */
function highlightActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href') || item.dataset.page;
    if (href === currentPage) {
      item.classList.add('active');
    }
  });
}

// ============================================================================
// FORM HANDLING
// ============================================================================

/**
 * Initialize form handlers for edit pages
 */
function initEditForms() {
  // About form
  const aboutForm = document.getElementById('aboutForm');
  if (aboutForm) {
    aboutForm.addEventListener('submit', handleAboutSubmit);
    loadAboutData();
  }
  
  // Services form
  const servicesForm = document.getElementById('servicesForm');
  if (servicesForm) {
    servicesForm.addEventListener('submit', handleServicesSubmit);
    loadServicesData();
  }
  
  // Skills form
  const skillsForm = document.getElementById('skillsForm');
  if (skillsForm) {
    skillsForm.addEventListener('submit', handleSkillsSubmit);
    loadSkillsData();
  }
  
  // Projects form
  const projectsForm = document.getElementById('projectsForm');
  if (projectsForm) {
    projectsForm.addEventListener('submit', handleProjectsSubmit);
    loadProjectsData();
  }
  
  // Tools form
  const toolsForm = document.getElementById('toolsForm');
  if (toolsForm) {
    toolsForm.addEventListener('submit', handleToolsSubmit);
    loadToolsData();
  }
  
  // Education form
  const educationForm = document.getElementById('educationForm');
  if (educationForm) {
    educationForm.addEventListener('submit', handleEducationSubmit);
    loadEducationData();
  }
  
  // Certifications form
  const certificationsForm = document.getElementById('certificationsForm');
  if (certificationsForm) {
    certificationsForm.addEventListener('submit', handleCertificationsSubmit);
    loadCertificationsData();
  }
  
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
    loadContactData();
  }
}

// ============================================================================
// ABOUT SECTION
// ============================================================================

async function loadAboutData() {
  const data = await loadAdminData();
  if (!data || !data.about) return;
  
  document.getElementById('aboutHeading').value = data.about.heading || '';
  document.getElementById('aboutSubheading').value = data.about.subheading || '';
  document.getElementById('aboutDescription').value = data.about.description || '';
  document.getElementById('aboutExtended').value = data.about.extendedDescription || '';
  document.getElementById('aboutMission').value = data.about.mission || '';
  document.getElementById('aboutVision').value = data.about.vision || '';
}

async function handleAboutSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  data.about = {
    ...data.about,
    heading: document.getElementById('aboutHeading').value,
    subheading: document.getElementById('aboutSubheading').value,
    description: document.getElementById('aboutDescription').value,
    extendedDescription: document.getElementById('aboutExtended').value,
    mission: document.getElementById('aboutMission').value,
    vision: document.getElementById('aboutVision').value
  };
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated About section');
    showAlert('About section updated successfully!', 'success');
  }
}

// ============================================================================
// SERVICES SECTION
// ============================================================================

async function loadServicesData() {
  const data = await loadAdminData();
  if (!data || !data.services) return;
  
  renderServicesList(data.services);
}

function renderServicesList(services) {
  const container = document.getElementById('servicesList');
  if (!container) return;
  
  container.innerHTML = services.map((service, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Service #${index + 1}</h4>
        <button type="button" class="btn-remove" onclick="removeService(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="service-title" value="${service.title}" required>
        </div>
        <div class="form-group">
          <label>Icon</label>
          <input type="text" class="service-icon" value="${service.icon}" placeholder="e.g., shield, network">
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea class="service-description" rows="3">${service.description}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addService() {
  const data = getAdminData();
  if (!data) return;
  
  data.services.push({
    id: Date.now(),
    title: 'New Service',
    description: 'Service description',
    icon: 'shield',
    features: []
  });
  
  renderServicesList(data.services);
}

function removeService(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.services.splice(index, 1);
  renderServicesList(data.services);
}

async function handleServicesSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  // Collect services from form
  const serviceItems = document.querySelectorAll('.dynamic-item');
  data.services = Array.from(serviceItems).map(item => ({
    id: parseInt(item.dataset.index) + 1,
    title: item.querySelector('.service-title').value,
    description: item.querySelector('.service-description').value,
    icon: item.querySelector('.service-icon').value,
    features: []
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Services section');
    showAlert('Services updated successfully!', 'success');
  }
}

// ============================================================================
// SKILLS SECTION
// ============================================================================

async function loadSkillsData() {
  const data = await loadAdminData();
  if (!data || !data.skills || !data.skills.technical) return;
  
  renderSkillsList(data.skills.technical);
}

function renderSkillsList(skills) {
  const container = document.getElementById('skillsList');
  if (!container) return;
  
  container.innerHTML = skills.map((skill, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Skill #${index + 1}</h4>
        <button type="button" class="btn-remove" onclick="removeSkill(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Skill Name</label>
          <input type="text" class="skill-name" value="${skill.name}" required>
        </div>
        <div class="form-group">
          <label>Proficiency Level (%)</label>
          <input type="number" class="skill-level" value="${skill.level}" min="0" max="100" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select class="skill-category">
            <option value="security" ${skill.category === 'security' ? 'selected' : ''}>Security</option>
            <option value="programming" ${skill.category === 'programming' ? 'selected' : ''}>Programming</option>
            <option value="systems" ${skill.category === 'systems' ? 'selected' : ''}>Systems</option>
            <option value="cloud" ${skill.category === 'cloud' ? 'selected' : ''}>Cloud</option>
            <option value="tools" ${skill.category === 'tools' ? 'selected' : ''}>Tools</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');
}

function addSkill() {
  const data = getAdminData();
  if (!data) return;
  
  data.skills.technical.push({
    name: 'New Skill',
    level: 50,
    category: 'security'
  });
  
  renderSkillsList(data.skills.technical);
}

function removeSkill(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.skills.technical.splice(index, 1);
  renderSkillsList(data.skills.technical);
}

async function handleSkillsSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  const skillItems = document.querySelectorAll('.dynamic-item');
  data.skills.technical = Array.from(skillItems).map(item => ({
    name: item.querySelector('.skill-name').value,
    level: parseInt(item.querySelector('.skill-level').value),
    category: item.querySelector('.skill-category').value
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Skills section');
    showAlert('Skills updated successfully!', 'success');
  }
}

// ============================================================================
// PROJECTS SECTION
// ============================================================================

async function loadProjectsData() {
  const data = await loadAdminData();
  if (!data || !data.projects) return;
  
  renderProjectsList(data.projects);
}

function renderProjectsList(projects) {
  const container = document.getElementById('projectsList');
  if (!container) return;
  
  container.innerHTML = projects.map((project, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Project #${index + 1}: ${project.title}</h4>
        <button type="button" class="btn-remove" onclick="removeProject(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="project-title" value="${project.title}" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" class="project-category" value="${project.category}" required>
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea class="project-description" rows="3" required>${project.description}</textarea>
        </div>
        <div class="form-group">
          <label>GitHub URL</label>
          <input type="url" class="project-github" value="${project.github || ''}">
        </div>
        <div class="form-group">
          <label>Demo URL</label>
          <input type="url" class="project-demo" value="${project.demo || ''}">
        </div>
        <div class="form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" class="project-tech" value="${project.technologies ? project.technologies.join(', ') : ''}">
        </div>
        <div class="form-group">
          <label>Completion Date</label>
          <input type="date" class="project-date" value="${project.completionDate || ''}">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" class="project-featured" ${project.featured ? 'checked' : ''}>
            Featured Project
          </label>
        </div>
      </div>
    </div>
  `).join('');
}

function addProject() {
  const data = getAdminData();
  if (!data) return;
  
  data.projects.push({
    id: Date.now(),
    title: 'New Project',
    description: 'Project description',
    technologies: [],
    github: '',
    demo: '',
    category: 'Security',
    featured: false,
    completionDate: new Date().toISOString().split('T')[0]
  });
  
  renderProjectsList(data.projects);
}

function removeProject(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.projects.splice(index, 1);
  renderProjectsList(data.projects);
}

async function handleProjectsSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  const projectItems = document.querySelectorAll('.dynamic-item');
  data.projects = Array.from(projectItems).map((item, idx) => ({
    id: idx + 1,
    title: item.querySelector('.project-title').value,
    description: item.querySelector('.project-description').value,
    category: item.querySelector('.project-category').value,
    technologies: item.querySelector('.project-tech').value.split(',').map(t => t.trim()).filter(t => t),
    github: item.querySelector('.project-github').value,
    demo: item.querySelector('.project-demo').value,
    featured: item.querySelector('.project-featured').checked,
    completionDate: item.querySelector('.project-date').value
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Projects section');
    showAlert('Projects updated successfully!', 'success');
  }
}

// ============================================================================
// TOOLS SECTION
// ============================================================================

async function loadToolsData() {
  const data = await loadAdminData();
  if (!data || !data.tools) return;
  
  renderToolsList(data.tools);
}

function renderToolsList(tools) {
  const container = document.getElementById('toolsList');
  if (!container) return;
  
  container.innerHTML = tools.map((tool, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Tool #${index + 1}: ${tool.name}</h4>
        <button type="button" class="btn-remove" onclick="removeTool(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Tool Name</label>
          <input type="text" class="tool-name" value="${tool.name}" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" class="tool-category" value="${tool.category}" required>
        </div>
        <div class="form-group">
          <label>Proficiency</label>
          <select class="tool-proficiency">
            <option value="Beginner" ${tool.proficiency === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${tool.proficiency === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${tool.proficiency === 'Advanced' ? 'selected' : ''}>Advanced</option>
            <option value="Expert" ${tool.proficiency === 'Expert' ? 'selected' : ''}>Expert</option>
          </select>
        </div>
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" class="tool-website" value="${tool.website || ''}">
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea class="tool-description" rows="2">${tool.description}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addTool() {
  const data = getAdminData();
  if (!data) return;
  
  data.tools.push({
    id: Date.now(),
    name: 'New Tool',
    category: 'Security',
    description: 'Tool description',
    proficiency: 'Beginner',
    website: ''
  });
  
  renderToolsList(data.tools);
}

function removeTool(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.tools.splice(index, 1);
  renderToolsList(data.tools);
}

async function handleToolsSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  const toolItems = document.querySelectorAll('.dynamic-item');
  data.tools = Array.from(toolItems).map((item, idx) => ({
    id: idx + 1,
    name: item.querySelector('.tool-name').value,
    category: item.querySelector('.tool-category').value,
    description: item.querySelector('.tool-description').value,
    proficiency: item.querySelector('.tool-proficiency').value,
    website: item.querySelector('.tool-website').value
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Tools section');
    showAlert('Tools updated successfully!', 'success');
  }
}

// ============================================================================
// EDUCATION SECTION
// ============================================================================

async function loadEducationData() {
  const data = await loadAdminData();
  if (!data || !data.education) return;
  
  renderEducationList(data.education);
}

function renderEducationList(education) {
  const container = document.getElementById('educationList');
  if (!container) return;
  
  container.innerHTML = education.map((edu, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Education #${index + 1}: ${edu.degree}</h4>
        <button type="button" class="btn-remove" onclick="removeEducation(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Degree</label>
          <input type="text" class="edu-degree" value="${edu.degree}" required>
        </div>
        <div class="form-group">
          <label>Specialization</label>
          <input type="text" class="edu-specialization" value="${edu.specialization || ''}">
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input type="text" class="edu-institution" value="${edu.institution}" required>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="edu-location" value="${edu.location || ''}">
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="date" class="edu-start" value="${edu.startDate || ''}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="date" class="edu-end" value="${edu.endDate || ''}">
        </div>
        <div class="form-group">
          <label>GPA/Percentage</label>
          <input type="text" class="edu-gpa" value="${edu.gpa || ''}">
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea class="edu-description" rows="2">${edu.description || ''}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addEducation() {
  const data = getAdminData();
  if (!data) return;
  
  data.education.push({
    id: Date.now(),
    degree: 'New Degree',
    institution: 'Institution Name',
    specialization: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
    courses: []
  });
  
  renderEducationList(data.education);
}

function removeEducation(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.education.splice(index, 1);
  renderEducationList(data.education);
}

async function handleEducationSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  const eduItems = document.querySelectorAll('.dynamic-item');
  data.education = Array.from(eduItems).map((item, idx) => ({
    id: idx + 1,
    degree: item.querySelector('.edu-degree').value,
    specialization: item.querySelector('.edu-specialization').value,
    institution: item.querySelector('.edu-institution').value,
    location: item.querySelector('.edu-location').value,
    startDate: item.querySelector('.edu-start').value,
    endDate: item.querySelector('.edu-end').value,
    gpa: item.querySelector('.edu-gpa').value,
    description: item.querySelector('.edu-description').value,
    courses: []
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Education section');
    showAlert('Education updated successfully!', 'success');
  }
}

// ============================================================================
// CERTIFICATIONS SECTION
// ============================================================================

async function loadCertificationsData() {
  const data = await loadAdminData();
  if (!data || !data.certifications) return;
  
  renderCertificationsList(data.certifications);
}

function renderCertificationsList(certifications) {
  const container = document.getElementById('certificationsList');
  if (!container) return;
  
  container.innerHTML = certifications.map((cert, index) => `
    <div class="dynamic-item" data-index="${index}">
      <div class="dynamic-item-header">
        <h4>Certification #${index + 1}: ${cert.name}</h4>
        <button type="button" class="btn-remove" onclick="removeCertification(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" class="cert-name" value="${cert.name}" required>
        </div>
        <div class="form-group">
          <label>Issuer</label>
          <input type="text" class="cert-issuer" value="${cert.issuer}" required>
        </div>
        <div class="form-group">
          <label>Credential ID</label>
          <input type="text" class="cert-id" value="${cert.credentialId || ''}">
        </div>
        <div class="form-group">
          <label>Issue Date</label>
          <input type="date" class="cert-date" value="${cert.date || ''}">
        </div>
        <div class="form-group">
          <label>Expiry Date (leave empty if no expiry)</label>
          <input type="date" class="cert-expiry" value="${cert.expiry || ''}">
        </div>
        <div class="form-group">
          <label>Verification URL</label>
          <input type="url" class="cert-url" value="${cert.url || ''}">
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea class="cert-description" rows="2">${cert.description || ''}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addCertification() {
  const data = getAdminData();
  if (!data) return;
  
  data.certifications.push({
    id: Date.now(),
    name: 'New Certification',
    issuer: 'Issuer Name',
    date: new Date().toISOString().split('T')[0],
    expiry: '',
    credentialId: '',
    url: '',
    description: ''
  });
  
  renderCertificationsList(data.certifications);
}

function removeCertification(index) {
  const data = getAdminData();
  if (!data) return;
  
  data.certifications.splice(index, 1);
  renderCertificationsList(data.certifications);
}

async function handleCertificationsSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  const certItems = document.querySelectorAll('.dynamic-item');
  data.certifications = Array.from(certItems).map((item, idx) => ({
    id: idx + 1,
    name: item.querySelector('.cert-name').value,
    issuer: item.querySelector('.cert-issuer').value,
    credentialId: item.querySelector('.cert-id').value,
    date: item.querySelector('.cert-date').value,
    expiry: item.querySelector('.cert-expiry').value,
    url: item.querySelector('.cert-url').value,
    description: item.querySelector('.cert-description').value
  }));
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Certifications section');
    showAlert('Certifications updated successfully!', 'success');
  }
}

// ============================================================================
// CONTACT SECTION
// ============================================================================

async function loadContactData() {
  const data = await loadAdminData();
  if (!data || !data.contact) return;
  
  document.getElementById('contactHeading').value = data.contact.heading || '';
  document.getElementById('contactSubheading').value = data.contact.subheading || '';
  document.getElementById('contactDescription').value = data.contact.description || '';
  document.getElementById('contactEmail').value = data.contact.email || '';
  document.getElementById('contactPhone').value = data.contact.phone || '';
  document.getElementById('contactLocation').value = data.contact.location || '';
  document.getElementById('contactAvailability').value = data.contact.availability || '';
  document.getElementById('contactResponse').value = data.contact.responseTime || '';
  document.getElementById('contactLinkedIn').value = data.contact.socialLinks?.linkedin || '';
  document.getElementById('contactGitHub').value = data.contact.socialLinks?.github || '';
  document.getElementById('contactTwitter').value = data.contact.socialLinks?.twitter || '';
}

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const data = await loadAdminData();
  if (!data) return;
  
  data.contact = {
    ...data.contact,
    heading: document.getElementById('contactHeading').value,
    subheading: document.getElementById('contactSubheading').value,
    description: document.getElementById('contactDescription').value,
    email: document.getElementById('contactEmail').value,
    phone: document.getElementById('contactPhone').value,
    location: document.getElementById('contactLocation').value,
    availability: document.getElementById('contactAvailability').value,
    responseTime: document.getElementById('contactResponse').value,
    socialLinks: {
      linkedin: document.getElementById('contactLinkedIn').value,
      github: document.getElementById('contactGitHub').value,
      twitter: document.getElementById('contactTwitter').value
    }
  };
  
  if (saveAdminData(data)) {
    addActivity('edit', 'Updated Contact section');
    showAlert('Contact information updated successfully!', 'success');
  }
}

// ============================================================================
// ALERT NOTIFICATIONS
// ============================================================================

/**
 * Show alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'warning', 'info')
 */
function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${getAlertIcon(type)}"></i>
    <span>${message}</span>
  `;
  
  // Insert at top of content area
  const content = document.querySelector('.content');
  if (content) {
    content.insertBefore(alert, content.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
}

/**
 * Get icon class for alert type
 * @param {string} type - Alert type
 * @returns {string} - Font Awesome icon class
 */
function getAlertIcon(type) {
  const icons = {
    'success': 'check-circle',
    'error': 'exclamation-circle',
    'warning': 'exclamation-triangle',
    'info': 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize admin dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async function() {
  console.log('[Admin] Initializing...');
  
  // Initialize sidebar navigation
  initSidebar();
  
  // Initialize dashboard stats (if on dashboard page)
  initDashboardStats();
  
  // Initialize edit forms (if on edit pages)
  initEditForms();
  
  console.log('[Admin] Initialization complete');
});

// Export functions for use in HTML onclick handlers
window.addService = addService;
window.removeService = removeService;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.addProject = addProject;
window.removeProject = removeProject;
window.addTool = addTool;
window.removeTool = removeTool;
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.addCertification = addCertification;
window.removeCertification = removeCertification;
window.resetData = resetData;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadAdminData,
    saveAdminData,
    addActivity,
    showAlert
  };
}
