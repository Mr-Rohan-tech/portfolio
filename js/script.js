/**
 * ============================================================================
 * PORTFOLIO MAIN SCRIPT
 * ============================================================================
 * 
 * This file contains all JavaScript functionality for the public portfolio
 * website of Rohan Kumar's Cybersecurity Portfolio.
 * 
 * Features:
 * - Dynamic content loading from portfolio-data.json
 * - Navigation functionality
 * - Smooth scrolling
 * - Mobile menu toggle
 * - Scroll animations
 * - Active section highlighting
 * - Form handling
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Path to the portfolio data JSON file
 * All content is loaded from this file
 */
const DATA_PATH = '../data/portfolio-data.json';

/**
 * Cache for loaded portfolio data
 */
let portfolioData = null;

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Load portfolio data from JSON file
 * @returns {Promise<Object>} - Portfolio data object
 */
async function loadPortfolioData() {

  // Return cached data if already loaded
  if (portfolioData) {
    return portfolioData;
  }

  try {

    // 🔹 First check if admin edited data exists in localStorage
    const localData = localStorage.getItem("portfolioData");

    if (localData) {
      portfolioData = JSON.parse(localData);
      console.log('[Portfolio] Loaded data from localStorage');
      return portfolioData;
    }

    // 🔹 Otherwise load JSON file
    const response = await fetch(DATA_PATH + '?v=' + new Date().getTime()); // Cache busting

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    portfolioData = await response.json();

    // 🔹 Save JSON to localStorage for faster future loads
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));

    console.log('[Portfolio] Data loaded successfully from JSON');

    return portfolioData;

  } catch (error) {
    console.error('[Portfolio] Error loading data:', error);
    return null;
  }
}

/**
 * Get specific section data from portfolio
 * @param {string} section - Section name (e.g., 'about', 'skills', 'projects')
 * @returns {Object|null} - Section data or null
 */
async function getSectionData(section) {
  const data = await loadPortfolioData();
  return data ? data[section] : null;
}

// ============================================================================
// NAVIGATION
// ============================================================================

function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');

      const spans = menuToggle.querySelectorAll('span');
      menuToggle.classList.toggle('active');

      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');

        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
      } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  highlightActiveNavLink();
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');

      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function () {

  console.log('[Portfolio] Initializing...');

  initNavigation();

  const data = await loadPortfolioData();

  if (data) {

    if (data.skills && data.skills.technical) {
      renderSkills(data.skills.technical);
    }

    if (data.projects) {
      renderProjects(data.projects);
    }

    if (data.tools) {
      renderTools(data.tools);
    }

  }

  console.log('[Portfolio] Initialization complete');

});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadPortfolioData,
    getSectionData,
    renderSkills,
    renderProjects,
    renderTools
  };
}