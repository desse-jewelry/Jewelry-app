const favoritesList = document.getElementById("favoritesList");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.getElementById("theme-toggle");

// Load favorites from localStorage
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>$${item.price}</p>
      <p><em>Style: ${item.style}</em></p>
    `;
    favoritesList.appendChild(card);
  });
}

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  hamburger.classList.toggle("active");
});

// Dark mode
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  setTheme(newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  loadFavorites();
});