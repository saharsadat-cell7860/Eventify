
// ==================================
// GET EVENT INFORMATION FROM URL
// ==================================

let urlParams = new URLSearchParams(window.location.search);

let eventId = Number(urlParams.get("eventId"));

let initialQuantity = Number(urlParams.get("quantity")) || 1;


// ==================================
// SELECT EVENT
// ==================================

let selectedEvent = events.find(function(event) {
    return event.id === eventId;
});


// ==================================
// SELECT HTML ELEMENTS
// ==================================

let bookingSection = document.getElementById("bookingSection");
let bookingError = document.getElementById("bookingError");
let bookingSuccess = document.getElementById("bookingSuccess");

let bookingForm = document.getElementById("bookingForm");

let customerName = document.getElementById("customerName");
let customerEmail = document.getElementById("customerEmail");
let customerPhone = document.getElementById("customerPhone");

let bookingQuantity = document.getElementById("bookingQuantity");
let paymentMethod = document.getElementById("paymentMethod");
let terms = document.getElementById("terms");

let bookingImage = document.getElementById("bookingImage");
let bookingCategory = document.getElementById("bookingCategory");
let bookingEventName = document.getElementById("bookingEventName");

let bookingDate = document.getElementById("bookingDate");
let bookingTime = document.getElementById("bookingTime");
let bookingLocation = document.getElementById("bookingLocation");

let summaryPrice = document.getElementById("summaryPrice");
let summaryQuantity = document.getElementById("summaryQuantity");
let summaryTotal = document.getElementById("summaryTotal");


// ==================================
// CHECK EVENT
// ==================================

if (!selectedEvent) {

    bookingSection.style.display = "none";
    bookingError.style.display = "block";

    bookingError.querySelector("h2").textContent = "Event Not Found!";
    bookingError.querySelector("p").textContent =
        "Sorry, this event does not exist.";

} else if (selectedEvent.availableTickets <= 0) {

    bookingSection.style.display = "none";
    bookingError.style.display = "block";

    bookingError.querySelector("h2").textContent = "Sold Out!";

    bookingError.querySelector("p").textContent =
        "Sorry, all tickets for this event have been sold.";

} else {

    startBooking();

}


// ==================================
// START BOOKING
// ==================================

function startBooking() {

    let quantity = Math.max(
        1,
        Math.min(initialQuantity, selectedEvent.availableTickets)
    );

    bookingQuantity.max = selectedEvent.availableTickets;
    bookingQuantity.min = 1;
    bookingQuantity.value = quantity;

    displayBookingInfo();

    updateBookingTotal();


    // Quantity Input Event

    bookingQuantity.addEventListener("input", function() {

        updateBookingTotal();

    });


    // Form Submit Event

    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (validateBookingForm()) {

            saveBooking();

        }

    });

}


// ==================================
// DISPLAY EVENT INFORMATION
// ==================================

function displayBookingInfo() {

    bookingImage.src = selectedEvent.image;
    bookingImage.alt = selectedEvent.name;

    bookingCategory.textContent = selectedEvent.category;

    bookingEventName.textContent = selectedEvent.name;


    // Format Date

    let formattedDate = new Date(
        selectedEvent.date + "T00:00:00"
    ).toLocaleDateString("en-US", {

        month: "long",
        day: "numeric",
        year: "numeric"

    });

    bookingDate.textContent = formattedDate;

    bookingTime.textContent = selectedEvent.time;

    bookingLocation.textContent = selectedEvent.location;

    summaryPrice.textContent = "$" + selectedEvent.price;

}


// ==================================
// UPDATE TOTAL PRICE
// ==================================

function updateBookingTotal() {

    let quantity = Number(bookingQuantity.value);

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > selectedEvent.availableTickets
    ) {

        summaryQuantity.textContent = "0";
        summaryTotal.textContent = "$0";

        return;
    }

    summaryQuantity.textContent = quantity;

    let total = selectedEvent.price * quantity;

    summaryTotal.textContent = "$" + total;

}


// ==================================
// FORM VALIDATION
// ==================================

function validateBookingForm() {

    let isValid = true;


    // Clear Old Errors

    document.querySelectorAll(".form-error").forEach(function(error) {

        error.textContent = "";

    });


    // Name Validation

    let nameValue = customerName.value.trim();

    if (nameValue.length < 3) {

        document.getElementById("nameError").textContent =
            "Name must contain at least 3 characters.";

        isValid = false;

    }


    // Email Validation

    let emailValue = customerEmail.value.trim();

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {

        document.getElementById("emailError").textContent =
            "Please enter a valid email address.";

        isValid = false;

    }


    // Phone Validation

    let phoneValue = customerPhone.value.trim();

    let phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!phonePattern.test(phoneValue)) {

        document.getElementById("phoneError").textContent =
            "Please enter a valid phone number.";

        isValid = false;

    }


    // Quantity Validation

    let quantity = Number(bookingQuantity.value);

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > selectedEvent.availableTickets
    ) {

        document.getElementById("quantityError").textContent =
            "Please select a valid number of available tickets.";

        isValid = false;

    }


    // Payment Validation

    if (paymentMethod.value === "") {

        document.getElementById("paymentError").textContent =
            "Please select a payment method.";

        isValid = false;

    }


    // Terms Validation

    if (!terms.checked) {

        document.getElementById("termsError").textContent =
            "You must accept the terms and conditions.";

        isValid = false;

    }

    return isValid;

}


// ==================================
// SAVE BOOKING
// ==================================

function saveBooking() {

    let quantity = Number(bookingQuantity.value);

    let total = selectedEvent.price * quantity;

    let bookingCode = "EVT-" + Date.now();


    // Create Booking Object

    let newBooking = {

        bookingId: bookingCode,

        eventId: selectedEvent.id,

        eventName: selectedEvent.name,

        eventImage: selectedEvent.image,

        eventCategory: selectedEvent.category,

        eventDate: selectedEvent.date,

        eventTime: selectedEvent.time,

        eventLocation: selectedEvent.location,

        customerName: customerName.value.trim(),

        customerEmail: customerEmail.value.trim(),

        customerPhone: customerPhone.value.trim(),

        quantity: quantity,

        price: selectedEvent.price,

        totalPrice: total,

        paymentMethod: paymentMethod.value,

        bookingDate: new Date().toISOString(),

        status: "Confirmed"

    };


    // Get Previous Bookings

    let savedBookings = JSON.parse(
        localStorage.getItem("eventifyTickets")
    ) || [];


    // Add New Booking

    savedBookings.push(newBooking);


    // Save in LocalStorage

    localStorage.setItem(
        "eventifyTickets",
        JSON.stringify(savedBookings)
    );


    // Show Success Message

    bookingSection.style.display = "none";

    bookingSuccess.style.display = "block";


    document.getElementById("successBookingId").textContent =
        bookingCode;

    document.getElementById("successEventName").textContent =
        selectedEvent.name;

    document.getElementById("successQuantity").textContent =
        quantity;

    document.getElementById("successTotal").textContent =
        "$" + total;


    // Scroll To Top

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

}
