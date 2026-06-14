// ===================================================
// AUTH-PAGE.JS — index.html logic
// Handles: Register, Login, Tab switching, Flash msgs
// ===================================================

const API_URL = '/api/auth';

// ===== ELEMENT REFERENCES =====
const loginTab       = document.getElementById('loginTab');
const signupTab      = document.getElementById('signupTab');
const loginForm      = document.getElementById('loginForm');
const registerForm   = document.getElementById('registerForm');
const loginEmail     = document.getElementById('loginEmail');
const loginPassword  = document.getElementById('loginPassword');
const loginError     = document.getElementById('loginError');
const loginBtn       = document.getElementById('loginBtn');
const regName        = document.getElementById('regName');
const regEmail       = document.getElementById('regEmail');
const regPassword    = document.getElementById('regPassword');
const registerError  = document.getElementById('registerError');
const registerBtn    = document.getElementById('registerBtn');
const flashMsg       = document.getElementById('flashMsg');
const goToSignup     = document.getElementById('goToSignup');
const goToLogin      = document.getElementById('goToLogin');

// ===================================================
// STEP 1: CHECK URL FOR FLASH MESSAGES
// ===================================================
window.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const msg = params.get('msg');

  if (msg === 'registered') {
    showFlash(
      '✅ Registration successful! Please log in to continue.',
      'flash-success'
    );
    showLoginTab();
  }

  if (msg === 'loggedout') {
    showFlash(
      '👋 You have been successfully logged out.',
      'flash-info'
    );
    showLoginTab();
  }

  // Clean the URL
  window.history.replaceState({}, document.title, '/');
});

// ===================================================
// STEP 2: TAB SWITCHING
// ===================================================
loginTab.addEventListener('click', function () {
  showLoginTab();
  clearErrors();
});

signupTab.addEventListener('click', function () {
  showSignupTab();
  clearErrors();
});

goToSignup.addEventListener('click', function (e) {
  e.preventDefault();
  showSignupTab();
  clearErrors();
});

goToLogin.addEventListener('click', function (e) {
  e.preventDefault();
  showLoginTab();
  clearErrors();
});

function showLoginTab() {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
}

function showSignupTab() {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
}

// ===================================================
// STEP 3: REGISTER FORM
// ===================================================
registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const name     = regName.value.trim();
  const email    = regEmail.value.trim();
  const password = regPassword.value.trim();

  registerError.textContent = '';

  // Frontend validation
  if (!name) {
    registerError.textContent = '⚠️ Please enter your name.';
    return;
  }
  if (!email || !isValidEmail(email)) {
    registerError.textContent = '⚠️ Please enter a valid email.';
    return;
  }
  if (password.length < 6) {
    registerError.textContent = '⚠️ Password must be at least 6 characters.';
    return;
  }

  // Disable button while waiting
  registerBtn.textContent = 'Creating account...';
  registerBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = '/?msg=registered';
    } else {
      registerError.textContent = `⚠️ ${data.message}`;
    }

  } catch (error) {
    registerError.textContent = '⚠️ Cannot connect to server. Is it running?';
    console.error('Register error:', error);
  }

  registerBtn.textContent = 'Create account';
  registerBtn.disabled = false;
});

// ===================================================
// STEP 4: LOGIN FORM
// ===================================================
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email    = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  loginError.textContent = '';

  // Frontend validation
  if (!email) {
    loginError.textContent = '⚠️ Please enter your email.';
    return;
  }
  if (!password) {
    loginError.textContent = '⚠️ Please enter your password.';
    return;
  }

  // Disable button while waiting
  loginBtn.textContent = 'Logging in...';
  loginBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = '/dashboard.html';
    } else {
      loginError.textContent = `⚠️ ${data.message}`;
    }

  } catch (error) {
    loginError.textContent = '⚠️ Cannot connect to server. Is it running?';
    console.error('Login error:', error);
  }

  loginBtn.textContent = 'Login';
  loginBtn.disabled = false;
});

// ===================================================
// HELPER FUNCTIONS
// ===================================================
function showFlash(message, type) {
  flashMsg.textContent = message;
  flashMsg.className = `flash-msg ${type}`;
  flashMsg.style.display = 'block';

  setTimeout(function () {
    flashMsg.style.display = 'none';
  }, 6000);
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function clearErrors() {
  loginError.textContent = '';
  registerError.textContent = '';
  flashMsg.style.display = 'none';
}
