
// ======================================
// EVENTIFY - EXPLORE EVENTS JAVASCRIPT
// ======================================


// 1. SELECT HTML ELEMENTS

let allEventsGrid = document.getElementById("allEventsGrid");

let searchInput = document.getElementById("searchInput");

let categoryInputs = document.querySelectorAll(
    'input[name="category"]'
);

let priceRange = document.getElementById("priceRange");

let priceValue = document.getElementById("priceValue");

let availableOnly = document.getElementById("availableOnly");

let sortSelect = document.getElementById("sortSelect");

let resultCount = document.getElementById("resultCount");

let emptyState = document.getElementById("emptyState");

let resetFilters = document.getElementById("resetFilters");

let emptyReset = document.getElementById("emptyReset");

let clearSearch = document.getElementById("clearSearch");


// 2. FAVORITES

let favorites = getFavorites();


// 3. GET SELECTED CATEGORY

function getSelectedCategory() {

    let selected = document.querySelector(
        'input[name="category"]:checked'
    );

    return selected ? selected.value : "All";

}


// 4. FILTER EVENTS

function filterEvents() {

    let searchText = searchInput.value.toLowerCase().trim();

    let selectedCategory = getSelectedCategory();

    let maximumPrice = Number(priceRange.value);

    let onlyAvailable = availableOnly.checked;


    // FILTER METHOD

    let filteredEvents = events.filter(function (event) {

        let matchesSearch =
            event.name.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText);

        let matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        let matchesPrice = event.price <= maximumPrice;

        let matchesAvailability =
            !onlyAvailable || event.availableTickets > 0;


        return matchesSearch &&
               matchesCategory &&
               matchesPrice &&
               matchesAvailability;

    });


    // SORT EVENTS

    let sortType = sortSelect.value;

    if (sortType === "price-low") {

        filteredEvents.sort(function (a, b) {
            return a.price - b.price;
        });

    }

    else if (sortType === "price-high") {

        filteredEvents.sort(function (a, b) {
            return b.price - a.price;
        });

    }

    else if (sortType === "date") {

        filteredEvents.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

    }

    else if (sortType === "name") {

        filteredEvents.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    }


    // DISPLAY RESULTS

    displayAllEvents(filteredEvents);

}


// 5. DISPLAY EVENT CARDS

function displayAllEvents(eventList) {

    allEventsGrid.innerHTML = "";

    resultCount.textContent = eventList.length;


    // CHECK IF EVENTS EXIST

    if (eventList.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";


    // LOOP THROUGH EVENTS

    eventList.forEach(function (event) {

        let isFavorite = favorites.includes(event.id);


        let formattedDate = new Date(
            event.date + "T00:00:00"
        ).toLocaleDateString("en-US", {

            month: "short",
            day: "numeric",
            year: "numeric"

        });


        let eventCard = `

            <div class="event-card">

                <div class="event-image">

                    <img
                        src="${event.image}"
                        alt="${event.name}"
                        loading="lazy"
                    >

                    <span class="event-category">
                        ${event.category}
                    </span>


                    <button
                        class="favorite-btn ${isFavorite ? "liked" : ""}"
                        data-id="${event.id}"
                        aria-label="Toggle favorite"
                    >

                        <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>

                    </button>

                </div>


                <div class="event-info">

                    <h3>${event.name}</h3>

                    <div class="event-meta">

                        <span>
                            <i class="fa-regular fa-calendar"></i>
                            ${formattedDate}
                        </span>

                        <span>
                            <i class="fa-regular fa-clock"></i>
                            ${event.time}
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            ${event.location}
                        </span>

                        <span>
                            <i class="fa-solid fa-ticket"></i>
                            ${event.availableTickets} Tickets Available
                        </span>

                    </div>


                    <div class="event-bottom">

                        <div class="event-price">
                            $${event.price}
                            <small>/ ticket</small>
                        </div>

                        <a
                            href="event-details.html?id=${event.id}"
                            class="details-btn"
                        >
                            View Details
                        </a>

                    </div>

                </div>

            </div>

        `;


        allEventsGrid.innerHTML += eventCard;

    });

}


// 6. SEARCH EVENT

searchInput.addEventListener("input", function () {

    filterEvents();

});


// CLEAR SEARCH

clearSearch.addEventListener("click", function () {

    searchInput.value = "";

    filterEvents();

    searchInput.focus();

});


// 7. CATEGORY FILTER

categoryInputs.forEach(function (input) {

    input.addEventListener("change", function () {

        filterEvents();

    });

});


// 8. PRICE FILTER

priceRange.addEventListener("input", function () {

    priceValue.textContent = priceRange.value;

    filterEvents();

});


// 9. AVAILABILITY FILTER

availableOnly.addEventListener("change", function () {

    filterEvents();

});


// 10. SORT EVENTS

sortSelect.addEventListener("change", function () {

    filterEvents();

});


// 11. FAVORITE BUTTON

allEventsGrid.addEventListener("click", function (event) {

    let favoriteButton = event.target.closest(".favorite-btn");

    if (!favoriteButton) {
        return;
    }


    let eventId = Number(favoriteButton.dataset.id);


    if (favorites.includes(eventId)) {

        // REMOVE FAVORITE

        favorites = favorites.filter(function (id) {

            return id !== eventId;

        });

    }

    else {

        // ADD FAVORITE

        favorites.push(eventId);

    }


    // SAVE TO LOCAL STORAGE

    localStorage.setItem(
        "eventifyFavorites",
        JSON.stringify(favorites)
    );


    // UPDATE NAVBAR

    updateFavoriteCount();


    // UPDATE CARDS

    filterEvents();

});


// 12. RESET ALL FILTERS

function resetAllFilters() {

    searchInput.value = "";

    priceRange.value = 100;

    priceValue.textContent = 100;

    availableOnly.checked = false;

    sortSelect.value = "default";


    categoryInputs.forEach(function (input) {

        input.checked = input.value === "All";

    });


    filterEvents();

}


// RESET BUTTON

resetFilters.addEventListener("click", resetAllFilters);

emptyReset.addEventListener("click", resetAllFilters);


// 13. READ SEARCH FROM HOME PAGE URL

let urlParameters = new URLSearchParams(window.location.search);

let homeSearchValue = urlParameters.get("search");


if (homeSearchValue) {

    searchInput.value = homeSearchValue;

}


// 14. INITIAL DISPLAY

filterEvents();
