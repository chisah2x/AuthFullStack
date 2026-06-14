// ===================================================
// THEME.JS — Dark/Light mode toggle
// Handles: Theme switching and persistence
// ===================================================

function applyTheme() {
  const savedTheme = localStorage.getItem('taskforge_theme');
  const themeBtn = document.getElementById('themeBtn');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeBtn) {
      themeBtn.textContent = 'Dark mode';
    }
  }
}

function initThemeToggle() {
  const themeBtn = document.getElementById('themeBtn');
  
  if (!themeBtn) return;
  
  // Apply saved theme on page load
  applyTheme();
  
  // Theme toggle event listener
  themeBtn.addEventListener('click', function () {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      document.body.classList.remove('light-mode');
      themeBtn.textContent = 'Light mode';
      localStorage.setItem('taskforge_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      themeBtn.textContent = 'Dark mode';
      localStorage.setItem('taskforge_theme', 'light');
    }
  });
}

// Initialize theme on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
