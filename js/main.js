
// ==============================
// EVENTIFY - MAIN JAVASCRIPT
// ==============================

// Mobile Navigation

let menuToggle = document.getElementById("menuToggle");
let navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("show");

        let isOpen = navLinks.classList.contains("show");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

    });

}


// Close menu when clicking a link

if (navLinks) {

    navLinks.addEventListener("click", function (event) {

        if (event.target.tagName === "A") {

            navLinks.classList.remove("show");

            if (menuToggle) {
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';
            }

        }

    });

}


// Display Current Year

let currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// Get Favorites From LocalStorage

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("eventifyFavorites")
    ) || [];

}


// Update Favorite Count

function updateFavoriteCount() {

    let favoriteCount = document.getElementById("favoriteCount");

    if (favoriteCount) {

        let favorites = getFavorites();

        favoriteCount.textContent = favorites.length;

    }

}


// Update Count When Page Loads

updateFavoriteCount();
