// ===================================================
// AUTH-STORAGE.JS — localStorage helper functions
// Handles: Token, user info, and theme persistence
// ===================================================

const StorageKeys = {
  TOKEN: 'taskforge_token',
  USER: 'taskforge_user',
  THEME: 'taskforge_theme'
};

// ===== TOKEN MANAGEMENT =====
function saveToken(token) {
  localStorage.setItem(StorageKeys.TOKEN, token);
}

function getToken() {
  return localStorage.getItem(StorageKeys.TOKEN);
}

function removeToken() {
  localStorage.removeItem(StorageKeys.TOKEN);
}

// ===== USER MANAGEMENT =====
function saveUser(user) {
  localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
}

function getUser() {
  const userRaw = localStorage.getItem(StorageKeys.USER);
  return userRaw ? JSON.parse(userRaw) : null;
}

function removeUser() {
  localStorage.removeItem(StorageKeys.USER);
}

// ===== AUTH STATE =====
function isAuthenticated() {
  return getToken() !== null && getUser() !== null;
}

function clearAuthData() {
  removeToken();
  removeUser();
}

// ===== THEME MANAGEMENT =====
function saveTheme(theme) {
  localStorage.setItem(StorageKeys.THEME, theme);
}

function getTheme() {
  return localStorage.getItem(StorageKeys.THEME);
}

// ===== JWT DECODING =====
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

function getTokenIssuedDate(token) {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.iat) return 'Recently joined';
    
    const date = new Date(decoded.iat * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'Recently joined';
  }
}
