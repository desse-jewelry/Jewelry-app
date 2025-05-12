const styleForm = document.getElementById("styleForm");
const styleSelect = document.getElementById("styleSelect");
const jewelryList = document.getElementById("jewelryList");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// DARK MODE TOGGLE
const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

async function fetchJewelry() {
  const response = await fetch("jewel.json");
  const data = await response.json();
  return data;
}

function displayJewelry(items, filterStyle = "all") {
  jewelryList.innerHTML = "";

  const filtered = filterStyle === "all" ? items : items.filter(i => i.style === filterStyle);

  if (filtered.length === 0) {
    jewelryList.innerHTML = "<p>No jewelry matches this style.</p>";
    return;
  }

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  filtered.forEach(item => {
    const isFavorite = favorites.some(fav => fav.id == item.id);

    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-aos", "zoom-in");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>$${item.price}</p>
      <p><em>Style: ${item.style}</em></p>
      <p>${item.description}</p>
      <button class="favorite-btn" data-id="${item.id}">
        ${isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <a href="https://wa.me/2347055783702?text=Hi%2C%20I%20want%20to%20buy%20the%20${encodeURIComponent(item.title)}" target="_blank" class="buy-btn">Buy Now</a>
    `;
    jewelryList.appendChild(card);
  });

  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      toggleFavorite(id, items);
    });
  });
}

function toggleFavorite(id, items) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.id == id);

  if (index === -1) {
    const item = items.find(i => i.id == id);
    favorites.push(item);
    alert(`${item.title} added to favorites!`);
  } else {
    const removed = favorites.splice(index, 1)[0];
    alert(`${removed.title} removed from favorites.`);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayJewelry(items); // Refresh the UI to update the button text
}

styleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const style = styleSelect.value;
  const jewelry = await fetchJewelry();
  displayJewelry(jewelry, style);
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  hamburger.classList.toggle("active");
});

fetchJewelry().then(data => displayJewelry(data));

const favoritesLink = document.getElementById("favoritesLink");

favoritesLink.addEventListener("click", (e) => {
  e.preventDefault();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    jewelryList.innerHTML = "<p>You have no favorites yet.</p>";
  } else {
    displayJewelry(favorites, "all");
  }
});

const homeLink = document.getElementById("homeLink");

homeLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const allJewelry = await fetchJewelry();
  displayJewelry(allJewelry, "all");
});

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  const jewelry = await fetchJewelry();
  const filteredJewelry = jewelry.filter(item => item.title.toLowerCase().includes(query));
  displayJewelry(filteredJewelry);
});

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
  }, 2000); // 2 seconds
});