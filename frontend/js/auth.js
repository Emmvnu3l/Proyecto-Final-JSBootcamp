import { login, register } from './api.js';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function updateNavbar() {
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const userSection = document.getElementById('user-section');
  const usernameSpan = document.getElementById('username');
  const logoutBtn = document.getElementById('logout-btn');

  if (isLoggedIn()) {
    const user = getCurrentUser();
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (userSection) {
      userSection.style.display = 'block';
      if (usernameSpan) usernameSpan.textContent = user.username;
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
    if (userSection) userSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// Login form handler
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('login-msg');

  try {
    const res = await login({ email, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    window.location.href = 'index.html';
  } catch (err) {
    msg.textContent = err.message;
    msg.style.color = 'red';
  }
}

// Register form handler
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('register-msg');

  try {
    await register({ username, email, password });
    msg.textContent = 'Registro exitoso. Redirigiendo...';
    msg.style.color = 'green';
    setTimeout(() => (window.location.href = 'login.html'), 1500);
  } catch (err) {
    msg.textContent = err.message;
    msg.style.color = 'red';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});

export { isLoggedIn, getCurrentUser, logout, updateNavbar };
