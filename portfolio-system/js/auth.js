/**
 * ============================================================================
 * AUTHENTICATION MODULE
 * ============================================================================
 * 
 * This file handles all authentication-related functionality for the admin
 * dashboard of Rohan Kumar's Cybersecurity Portfolio.
 * 
 * Features:
 * - Login functionality with username/password validation
 * - Session management using localStorage
 * - Authentication state checking
 * - Logout functionality
 * - Protection for admin routes
 * 
 * Security Notes:
 * - This is a client-side authentication system suitable for GitHub Pages
 * - For production use, implement server-side authentication
 * - Credentials are stored in plain text for demo purposes only
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Admin credentials configuration
 * In a production environment, these should be stored server-side
 */
const AUTH_CONFIG = {
  // Default admin credentials
  username: 'admin',
  password: 'admin123',
  
  // localStorage key for session
  sessionKey: 'portfolio_admin_session',
  
  // Session duration in milliseconds (24 hours)
  sessionDuration: 24 * 60 * 60 * 1000
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Initialize authentication module
 * Checks if user is on an admin page and verifies authentication
 */
function initAuth() {
  // Get current page path
  const currentPath = window.location.pathname;

  // Check if current page is an admin page
  const isAdminPage = currentPath.includes('/admin/');

  // Check if current page is the login page
  const isLoginPage = currentPath.includes('login.html');

  // Only protect admin pages EXCEPT login page
  if (isAdminPage && !isLoginPage) {
    // Check if user is logged in
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      redirectToLogin();
    } else {
      // Update UI to show logged-in state
      updateAuthUI();
    }
  }
}

/**
 * Authenticate user with username and password
 * @param {string} username - The username entered by user
 * @param {string} password - The password entered by user
 * @returns {boolean} - True if authentication successful, false otherwise
 */
function login(username, password) {
  // Validate credentials against stored config
  if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
    // Create session object
    const session = {
      username: username,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + AUTH_CONFIG.sessionDuration).toISOString()
    };
    
    // Store session in localStorage
    localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
    
    console.log('[Auth] Login successful for user:', username);
    return true;
  } else {
    console.log('[Auth] Login failed - Invalid credentials');
    return false;
  }
}

/**
 * Logout user and clear session
 */
function logout() {
  // Remove session from localStorage
  localStorage.removeItem(AUTH_CONFIG.sessionKey);
  
  console.log('[Auth] User logged out');
  
  // Redirect to login page
  redirectToLogin();
}

/**
 * Check if user is currently authenticated
 * @returns {boolean} - True if user has valid session
 */
function isAuthenticated() {
  // Get session from localStorage
  const sessionData = localStorage.getItem(AUTH_CONFIG.sessionKey);
  
  if (!sessionData) {
    return false;
  }
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      // Session expired, clear it
      localStorage.removeItem(AUTH_CONFIG.sessionKey);
      console.log('[Auth] Session expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Auth] Error parsing session:', error);
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    return false;
  }
}

/**
 * Get current session information
 * @returns {Object|null} - Session object or null if not authenticated
 */
function getSession() {
  if (!isAuthenticated()) {
    return null;
  }
  
  const sessionData = localStorage.getItem(AUTH_CONFIG.sessionKey);
  return JSON.parse(sessionData);
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
  // Get current path to redirect back after login
  const currentPath = window.location.pathname;
  
  // Only store redirect if not already on login page
  if (!currentPath.includes('login.html')) {
    sessionStorage.setItem('redirect_after_login', currentPath);
  }
  
  // Redirect to login page
  window.location.href = 'login.html';
}

/**
 * Redirect to dashboard after successful login
 */
function redirectToDashboard() {
  // Check if there's a stored redirect path
  const redirectPath = sessionStorage.getItem('redirect_after_login');
  
  if (redirectPath) {
    sessionStorage.removeItem('redirect_after_login');
    window.location.href = redirectPath;
  } else {
    window.location.href = 'dashboard.html';
  }
}

/**
 * Update UI elements based on authentication state
 */
function updateAuthUI() {
  const session = getSession();
  
  if (session) {
    // Update user name display if element exists
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
      el.textContent = session.username;
    });
    
    // Add logout event listeners
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    });
  }
}

// ============================================================================
// LOGIN FORM HANDLER
// ============================================================================

/**
 * Initialize login form functionality
 * Should be called on login.html page
 */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('loginError');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form inputs
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      
      // Validate inputs
      if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
        showLoginError('Please enter both username and password');
        return;
      }
      
      // Disable submit button during login
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      // Simulate network delay for better UX
      setTimeout(() => {
        // Attempt login
        const success = login(usernameInput.value.trim(), passwordInput.value);
        
        if (success) {
          // Clear any error message
          hideLoginError();
          
          // Show success message
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
          submitBtn.style.background = 'linear-gradient(135deg, #2ed573 0%, #00ff88 100%)';
          
          // Redirect to dashboard after short delay
          setTimeout(() => {
            redirectToDashboard();
          }, 500);
        } else {
          // Show error message
          showLoginError('Invalid username or password');
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
          
          // Clear password field
          passwordInput.value = '';
          passwordInput.focus();
        }
      }, 800);
    });
  }
}

/**
 * Show login error message
 * @param {string} message - Error message to display
 */
function showLoginError(message) {
  const errorElement = document.getElementById('loginError');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

/**
 * Hide login error message
 */
function hideLoginError() {
  const errorElement = document.getElementById('loginError');
  if (errorElement) {
    errorElement.classList.remove('show');
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  initLoginForm();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    login,
    logout,
    isAuthenticated,
    getSession,
    redirectToLogin,
    redirectToDashboard
  };
}