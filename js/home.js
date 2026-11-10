
// ==============================
// EVENTIFY - HOME PAGE JAVASCRIPT
// ==============================


// HTML Elements

let eventsGrid = document.getElementById("eventsGrid");

let noEvents = document.getElementById("noEvents");

let categoryButtons = document.querySelectorAll(".category-card");


// Get Favorites

let favorites = getFavorites();


// Display Events

function displayEvents(eventList) {

    eventsGrid.innerHTML = "";

    if (eventList.length === 0) {

        noEvents.style.display = "block";

        return;

    }

    noEvents.style.display = "none";


    eventList.forEach(function (event) {

        let isFavorite = favorites.includes(event.id);

        let eventDate = new Date(
            event.date + "T00:00:00"
        ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });


        let eventCard = `

            <div class="event-card">

                <div class="event-image">

                    <img src="${event.image}"
                    alt="${event.name}"
                    loading="lazy">

                    <span class="event-category">
                        ${event.category}
                    </span>

                    <button class="favorite-btn
                    ${isFavorite ? "liked" : ""}"
                    data-id="${event.id}"
                    aria-label="Toggle favorite">

                        <i class="${isFavorite
                            ? "fa-solid"
                            : "fa-regular"} fa-heart"></i>

                    </button>

                </div>


                <div class="event-info">

                    <h3>${event.name}</h3>

                    <div class="event-meta">

                        <span>
                            <i class="fa-regular fa-calendar"></i>
                            ${eventDate}
                        </span>

                        <span>
                            <i class="fa-regular fa-clock"></i>
                            ${event.time}
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            ${event.location}
                        </span>

                    </div>


                    <div class="event-bottom">

                        <div class="event-price">
                            $${event.price}
                            <small>/ ticket</small>
                        </div>

                        <a href="event-details.html?id=${event.id}"
                        class="details-btn">
                            View Details
                        </a>

                    </div>

                </div>

            </div>

        `;


        eventsGrid.innerHTML += eventCard;

    });

}


// Initial Display

displayEvents(events.slice(0, 6));


// Category Filtering

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class from all buttons

        categoryButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });


        // Add active class to clicked button

        button.classList.add("active");


        // Get Selected Category

        let selectedCategory = button.dataset.category;


        // Filter Events

        let filteredEvents = events.filter(function (event) {

            if (selectedCategory === "All") {
                return true;
            }

            return event.category === selectedCategory;

        });


        // Display Filtered Events

        displayEvents(filteredEvents);

    });

});


// Favorite Button Event

eventsGrid.addEventListener("click", function (event) {

    let favoriteButton = event.target.closest(".favorite-btn");

    if (!favoriteButton) {
        return;
    }


    // Get Event ID

    let eventId = Number(favoriteButton.dataset.id);


    // Check If Event Is Already Favorite

    if (favorites.includes(eventId)) {

        // Remove From Favorites

        favorites = favorites.filter(function (id) {
            return id !== eventId;
        });

    } else {

        // Add To Favorites

        favorites.push(eventId);

    }


    // Save Favorites

    localStorage.setItem(
        "eventifyFavorites",
        JSON.stringify(favorites)
    );


    // Update Navbar Count

    updateFavoriteCount();


    // Update Event Cards

    let activeCategory = document.querySelector(
        ".category-card.active"
    );

    let selectedCategory = activeCategory
        ? activeCategory.dataset.category
        : "All";

    let filteredEvents = selectedCategory === "All"
        ? events
        : events.filter(function (event) {
            return event.category === selectedCategory;
        });

    displayEvents(filteredEvents);

});

// ==============================
// HOME PAGE SEARCH
// ==============================

let homeSearchForm = document.getElementById("homeSearchForm");

let homeSearch = document.getElementById("homeSearch");


homeSearchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let searchValue = homeSearch.value.trim();

    if (searchValue === "") {

        homeSearch.focus();

        return;

    }

    // Send Search To Explore Events Page

    window.location.href =
        "events.html?search=" + encodeURIComponent(searchValue);

});
