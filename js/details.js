
// ==================================
// GET EVENT ID FROM URL
// ==================================

let urlParams = new URLSearchParams(window.location.search);

let eventId = Number(urlParams.get("id"));

let selectedEvent = events.find(function(event) {
    return event.id === eventId;
});


// ==================================
// SELECT HTML ELEMENTS
// ==================================

let eventDetailsContent = document.getElementById("eventDetailsContent");
let detailsError = document.getElementById("detailsError");

let detailImage = document.getElementById("detailImage");
let detailCategory = document.getElementById("detailCategory");
let detailName = document.getElementById("detailName");
let detailDescription = document.getElementById("detailDescription");

let detailDate = document.getElementById("detailDate");
let detailTime = document.getElementById("detailTime");
let detailLocation = document.getElementById("detailLocation");
let detailAvailable = document.getElementById("detailAvailable");
let detailPrice = document.getElementById("detailPrice");

let decreaseBtn = document.getElementById("decreaseBtn");
let increaseBtn = document.getElementById("increaseBtn");

let ticketQuantity = document.getElementById("ticketQuantity");
let totalPrice = document.getElementById("totalPrice");

let bookNowBtn = document.getElementById("bookNowBtn");

let relatedEventsGrid = document.getElementById("relatedEventsGrid");
let relatedSection = document.getElementById("relatedSection");


// ==================================
// TICKET QUANTITY
// ==================================

let quantity = 1;


// ==================================
// CHECK EVENT
// ==================================

if (!selectedEvent) {

    eventDetailsContent.style.display = "none";
    detailsError.style.display = "block";
    relatedSection.style.display = "none";

} else {

    // DISPLAY EVENT INFORMATION

    function displayEventDetails() {

        detailImage.src = selectedEvent.image;
        detailImage.alt = selectedEvent.name;

        detailCategory.textContent = selectedEvent.category;
        detailName.textContent = selectedEvent.name;
        detailDescription.textContent = selectedEvent.description;

        let formattedDate = new Date(
            selectedEvent.date + "T00:00:00"
        ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        detailDate.textContent = formattedDate;
        detailTime.textContent = selectedEvent.time;
        detailLocation.textContent = selectedEvent.location;

        detailAvailable.textContent = selectedEvent.availableTickets;

        detailPrice.textContent = "$" + selectedEvent.price;

        if (selectedEvent.availableTickets === 0) {

            bookNowBtn.disabled = true;
            bookNowBtn.textContent = "Sold Out";

            increaseBtn.disabled = true;
            decreaseBtn.disabled = true;

        }

        updateTotalPrice();
    }


    // UPDATE TOTAL PRICE

    function updateTotalPrice() {

        ticketQuantity.textContent = quantity;

        let total = selectedEvent.price * quantity;

        totalPrice.textContent = "$" + total;
    }


    // INCREASE TICKETS

    increaseBtn.addEventListener("click", function() {

        if (quantity < selectedEvent.availableTickets) {

            quantity++;

            updateTotalPrice();

        } else {

            alert("Sorry! No more tickets are available.");

        }

    });


    // DECREASE TICKETS

    decreaseBtn.addEventListener("click", function() {

        if (quantity > 1) {

            quantity--;

            updateTotalPrice();

        }

    });


    // BOOK NOW

    bookNowBtn.addEventListener("click", function() {

        if (quantity > 0 &&
            quantity <= selectedEvent.availableTickets) {

            window.location.href =
                "booking.html?eventId=" +
                selectedEvent.id +
                "&quantity=" +
                quantity;

        }

    });


    // RELATED EVENTS

    function displayRelatedEvents() {

        let relatedEvents = events.filter(function(event) {

            return event.category === selectedEvent.category &&
                   event.id !== selectedEvent.id;

        });

        relatedEvents = relatedEvents.slice(0, 3);

        relatedEventsGrid.innerHTML = "";

        if (relatedEvents.length === 0) {

            relatedEventsGrid.innerHTML =
                '<p class="related-empty">No related events found.</p>';

            return;
        }

        relatedEvents.forEach(function(event) {

            let eventCard = `
                <div class="related-card">

                    <img src="${event.image}" alt="${event.name}">

                    <div class="related-card-content">

                        <span class="related-category">
                            ${event.category}
                        </span>

                        <h3>${event.name}</h3>

                        <p>
                            <i class="far fa-calendar-alt"></i>
                            ${event.date}
                        </p>

                        <p>
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.location}
                        </p>

                        <a href="event-details.html?id=${event.id}">
                            View Details
                            <i class="fas fa-arrow-right"></i>
                        </a>

                    </div>

                </div>
            `;

            relatedEventsGrid.innerHTML += eventCard;

        });

    }


    // RUN FUNCTIONS

    displayEventDetails();

    displayRelatedEvents();

}
