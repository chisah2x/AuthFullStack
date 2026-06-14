// ===================================================
// APP.JS — Frontend JavaScript
// Now talks to the backend instead of localStorage!
// ===================================================

// ===== BASE URL OF OUR BACKEND =====
const API_URL = '/api/auth';
// All requests will go to this base URL
// Change this when you deploy to production

// ===== GET ALL ELEMENT REFERENCES =====
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');

const themeBtn = document.getElementById('themeBtn');

// ===================================================
// TAB SWITCHING
// ===================================================
loginTab.addEventListener('click', function () {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  clearMessages();
});

signupTab.addEventListener('click', function () {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  clearMessages();
});

// ===================================================
// REGISTER FORM — Sends data to POST /api/auth/register
// ===================================================
registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  // Prevent page refresh

  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();

  registerError.textContent = '';
  registerSuccess.textContent = '';

  // --- FRONTEND VALIDATION (quick checks before sending) ---
  if (!name) {
    registerError.textContent = '⚠️ Please enter your name.';
    return;
  }
  if (!email) {
    registerError.textContent = '⚠️ Please enter your email.';
    return;
  }
  if (!isValidEmail(email)) {
    registerError.textContent = '⚠️ Please enter a valid email.';
    return;
  }
  if (password.length < 6) {
    registerError.textContent = '⚠️ Password must be at least 6 characters.';
    return;
  }

  // --- DISABLE BUTTON WHILE WAITING FOR SERVER ---
  const submitBtn = registerForm.querySelector('.submit-btn');
  submitBtn.textContent = 'Creating account...';
  submitBtn.disabled = true;
  // Prevents double-clicking while request is in progress

  try {
    // --- SEND REQUEST TO BACKEND ---
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      // POST request — we are sending data to the server

      headers: {
        'Content-Type': 'application/json'
        // Tells server we're sending JSON data
      },

      body: JSON.stringify({ name, email, password })
      // JSON.stringify() converts JS object to JSON string
      // This is the data we send to the backend
    });

    const data = await response.json();
    // response.json() reads and parses the JSON response from server
    // data will be like: { message: "Account created!" }

    if (response.ok) {
      // response.ok is true if status code is 200-299
      registerSuccess.textContent = `✅ ${data.message}`;
      registerForm.reset();
      // Clear form on success
    } else {
      // Server returned an error (400, 409, 500, etc.)
      registerError.textContent = `⚠️ ${data.message}`;
    }

  } catch (error) {
    // Network error — server might be offline
    registerError.textContent = '⚠️ Cannot connect to server. Is it running?';
    console.error('Register fetch error:', error);
  }

  // --- RE-ENABLE BUTTON ---
  submitBtn.textContent = 'Create account';
  submitBtn.disabled = false;
});

// ===================================================
// LOGIN FORM — Sends data to POST /api/auth/login
// ===================================================
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  loginError.textContent = '';
  loginSuccess.textContent = '';

  // --- FRONTEND VALIDATION ---
  if (!email) {
    loginError.textContent = '⚠️ Please enter your email.';
    return;
  }
  if (!password) {
    loginError.textContent = '⚠️ Please enter your password.';
    return;
  }

  // --- DISABLE BUTTON WHILE WAITING ---
  const submitBtn = loginForm.querySelector('.submit-btn');
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;

  try {
    // --- SEND REQUEST TO BACKEND ---
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
      // Send email and password to server
    });

    const data = await response.json();
    // data will be like: { message: "Welcome back!", token: "...", user: {...} }

    if (response.ok) {
      // --- SAVE JWT TOKEN TO localStorage ---
      localStorage.setItem('taskforge_token', data.token);
      // Save the token — we'll use this to prove user is logged in
      // on future requests to protected routes

      localStorage.setItem('taskforge_user', JSON.stringify(data.user));
      // Save basic user info (name, email) for display purposes

      loginSuccess.textContent = `✅ ${data.message}`;
      loginForm.reset();

      // 💡 Later: redirect to dashboard
      // window.location.href = 'dashboard.html';

    } else {
      loginError.textContent = `⚠️ ${data.message}`;
    }

  } catch (error) {
    loginError.textContent = '⚠️ Cannot connect to server. Is it running?';
    console.error('Login fetch error:', error);
  }

  // --- RE-ENABLE BUTTON ---
  submitBtn.textContent = 'Login';
  submitBtn.disabled = false;
});

// ===================================================
// THEME TOGGLE
// ===================================================
const savedTheme = localStorage.getItem('taskforge_theme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  themeBtn.textContent = 'Dark mode';
}

themeBtn.addEventListener('click', function () {
  const isLightMode = document.body.classList.contains('light-mode');

  if (isLightMode) {
    document.body.classList.remove('light-mode');
    themeBtn.textContent = 'Light mode';
    localStorage.setItem('taskforge_theme', 'dark');
  } else {
    document.body.classList.add('light-mode');
    themeBtn.textContent = 'Dark mode';
    localStorage.setItem('taskforge_theme', 'light');
  }
});

// ===================================================
// HELPER FUNCTIONS
// ===================================================
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function clearMessages() {
  loginError.textContent = '';
  loginSuccess.textContent = '';
  registerError.textContent = '';
  registerSuccess.textContent = '';
}

