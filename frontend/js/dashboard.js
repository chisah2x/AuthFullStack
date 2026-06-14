// ===================================================
// DASHBOARD.JS — dashboard.html logic
// Handles: Auth guard, display user info, logout
// ===================================================

// ===================================================
// STEP 1: AUTH GUARD
// If user is NOT logged in, send them back to login!
// ===================================================
window.addEventListener('DOMContentLoaded', function () {
  
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    // No token found → user is not logged in
    window.location.href = '/';
    return;
  }

  // ===================================================
  // STEP 2: POPULATE PAGE WITH USER INFO
  // ===================================================
  
  // --- Avatar: First letter of user's name ---
  const avatarEl = document.getElementById('userAvatar');
  if (avatarEl) {
    avatarEl.textContent = user.name.charAt(0).toUpperCase();
  }

  // --- Welcome heading ---
  const welcomeNameEl = document.getElementById('welcomeName');
  if (welcomeNameEl) {
    welcomeNameEl.textContent = `Welcome, ${user.name}!`;
  }

  // --- Profile: Full Name ---
  const profileNameEl = document.getElementById('profileName');
  if (profileNameEl) {
    profileNameEl.textContent = user.name;
  }

  // --- Profile: Email ---
  const profileEmailEl = document.getElementById('profileEmail');
  if (profileEmailEl) {
    profileEmailEl.textContent = user.email;
  }

  // --- Profile: Member Since ---
  const profileDateEl = document.getElementById('profileDate');
  if (profileDateEl) {
    const memberDate = getTokenIssuedDate(token);
    profileDateEl.textContent = memberDate;
  }

  // --- Page Title ---
  document.title = `TaskForge – ${user.name}'s Dashboard`;

  // --- Apply saved theme ---
  applyTheme();
});

// ===================================================
// STEP 3: LOGOUT BUTTON
// ===================================================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    clearAuthData();
    window.location.href = '/?msg=loggedout';
  });
}
