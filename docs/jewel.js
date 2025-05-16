const styleForm = document.getElementById("styleForm");
const styleSelect = document.getElementById("styleSelect");
const jewelryList = document.getElementById("jewelryList");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxVo_3g4nIpAi1ZIU-o9uVx_SskJPKwao",
  authDomain: "jewelry-app-443.firebaseapp.com",
  projectId: "jewelry-app-443",
  storageBucket: "jewelry-app-443.firebasestorage.app",
  messagingSenderId: "771626678914",
  appId: "1:771626678914:web:464b70250e23a83ff1d29b",
  measurementId: "G-X6N3Z1F31R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
      <a href="https://wa.me/2347055783702?text=Hi%2C%20I%20want%20to%20buy%20the%20${encodeURIComponent( item.title)}" target="_blank" class="buy-btn">Buy Now</a>
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


  auth.onAuthStateChanged(user => {
  const status = document.getElementById('auth-status');
  if (user) {
    status.textContent = `Hello, ${user.email}`;
    document.getElementById('comment-section')?.style.setProperty('display', 'block');
  } else {
    status.textContent = 'Not logged in';
    document.getElementById('comment-section')?.style.setProperty('display', 'none');
  }
});

function signUp() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass)
    .catch(error => alert(error.message));
}

function logIn() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(error => alert(error.message));
}

function logOut() {
  auth.signOut();
}




      