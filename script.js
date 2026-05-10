/* MOBILE MENU */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


/* POPUP */

const popup = document.getElementById("popup");

function showPopup() {
    popup.style.display = "flex";
}

function closePopup() {
    popup.style.display = "none";
}


/* STICKY NAVBAR */

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("sticky", window.scrollY > 50);
});


/* ELEMENTS */

const placeSelect = document.getElementById("place");
const distanceText = document.getElementById("distance");
const priceText = document.getElementById("price");
console.log("PRICE ELEMENT:", priceText);
console.log("DISTANCE ELEMENT:", distanceText);
const statusText = document.getElementById("status");
const bookingForm = document.getElementById("bookingForm");


/* AUTO PRICE ON PLACE CHANGE */

placeSelect.addEventListener("change", async () => {

    statusText.innerText = "Getting location...";

    navigator.geolocation.getCurrentPosition(async (position) => {

        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const pickupLocation =
            await getPlaceName(userLat, userLon);

        document.getElementById("pickup").innerText =
            pickupLocation;
        console.log(userLat, userLon);
        const [destLat, destLon] = placeSelect.value.split(",").map(Number);

        const distance = calculateDistance(
            userLat,
            userLon,
            destLat,
            destLon
        );

        const roundedDistance = Math.round(distance);
        const totalPrice = roundedDistance * 11;

        const bookingId = generateBookingId();

        distanceText.innerText = roundedDistance;
        priceText.innerText = totalPrice;
        document.getElementById("bookingId").innerText = bookingId;

        statusText.innerText = "Fare calculated successfully ✔";

        console.log("Distance:", roundedDistance);
        console.log("Price:", totalPrice);

        openRoute(userLat, userLon, destLat, destLon);
        sendWhatsApp(bookingId, roundedDistance, totalPrice, placeSelect.options[placeSelect.selectedIndex].text);

    }, (error) => {
        console.log(error);
        alert("Allow location permission to calculate fare");
    });

});
async function getPlaceName(lat, lon) {

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await response.json();

        return data.display_name;

    } catch (error) {

        return "Location not found";

    }

}
/* DISTANCE FUNCTION */

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
function openRoute(lat1, lon1, lat2, lon2) {
    const url = `https://www.google.com/maps/dir/${lat1},${lon1}/${lat2},${lon2}`;
    window.open(url, "_blank");
}

/* BOOKING SUBMIT */

bookingForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const bookingId =
        document.getElementById("bookingId").innerText;

    const placeName =
        placeSelect.options[
            placeSelect.selectedIndex
        ].text;

    const distance =
        distanceText.innerText;

    const price =
        priceText.innerText;

    const card =
        document.getElementById("confirmationCard");

    card.style.display = "block";

    document.getElementById("confirmId")
        .innerText =
        "Booking ID: " + bookingId;

    document.getElementById("confirmPlace")
        .innerText =
        "Destination: " + placeName;

    document.getElementById("confirmDistance")
        .innerText =
        "Distance: " + distance + " KM";

    document.getElementById("confirmPrice")
        .innerText =
        "Total Fare: ₹" + price;

});
async function getPlaceName(lat, lon) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        return data.display_name;
    } catch (error) {
        return "Unknown Location";
    }
}
function generateBookingId() {
    return "CG-" + Math.floor(10000 + Math.random() * 90000);
}
function sendWhatsApp(
    bookingId,
    distance,
    price,
    place
) {

    const message =

        `🚗 Car Guru Booking Confirmed

🧾 Booking ID: ${bookingId}

📍 Destination: ${place}

📏 Distance: ${distance} KM

💰 Total Fare: ₹${price}

Thank you for booking with Car Guru ❤️`;

    const phone = "919866495263";

    const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

}
function goToBooking() {
    const bookingSection = document.getElementById("booking");

    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}
/* AUTO SELECT CAR */

function selectCar(carName) {

    document.getElementById("car").value = carName;

    document.getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* AUTO SELECT TEMPLE */

function selectTemple(placeValue) {

    document.getElementById("place").value = placeValue;

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

    placeSelect.dispatchEvent(new Event("change"));

}
function confirmBooking() {

    const bookingId =
        document.getElementById("bookingId").innerText;

    const placeName =
        document.getElementById("place").options[
            document.getElementById("place").selectedIndex
        ].text;

    const distance =
        document.getElementById("distance").innerText;

    const price =
        document.getElementById("price").innerText;

    const card =
        document.getElementById("confirmationCard");

    card.style.display = "block";

    document.getElementById("confirmId").innerText =
        "Booking ID: " + bookingId;

    document.getElementById("confirmPlace").innerText =
        "Destination: " + placeName;

    document.getElementById("confirmDistance").innerText =
        "Distance: " + distance + " KM";

    document.getElementById("confirmPrice").innerText =
        "Total Fare: ₹" + price;

}