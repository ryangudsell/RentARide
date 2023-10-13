// Imports
// Swiper Javascript
const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    keyboard: {
        enabled: false,
    },
    allowTouchMove: false,
    direction: 'vertical'
});

// DatePicker JavaScript
const datePickerContainer = document.getElementById('custom-date-picker');
const rangepicker = new DateRangePicker(datePickerContainer, {
    // config
    format: "dd/mm/yyyy",
});

// MapBox

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [173.154931, -41.745629], // starting position [lng, lat]
    zoom: 5, // starting zoom
});

const customDirections = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    profile: 'mapbox/driving',
    controls: {
        instructions: false,
        profileSwitcher: false
    }
});

map.addControl(customDirections, 'top-left');

// calculate cost
const journeyResult = document.getElementById("shopping-cart-journey");

customDirections.on('route', function(event) {
    if (event.route && event.route.length > 0 && event.route[0].distance) {
        let routeKm = (event.route[0].distance / 1000).toFixed(2);
        let routeTime = (event.route[0].duration / 60).toFixed(1);

        userData.routeKm = routeKm;
        userData.routeTime = routeTime;
    } else {
        // Handle the case when route data is not available or invalid
        console.error('Route data is missing or invalid.');
        // You may want to set some default values or show an error message to the user
        userData.routeKm = 0;
        userData.routeTime = 0;
    }
});

// Get the datepicker to close when clicking outside of it
document.addEventListener('click', function(event) {
    let datePickers = Array.from(document.getElementsByClassName("datepicker"));
    let datePickerInputs = Array.from(document.getElementsByClassName("datepicker-input"));
    let targetElement = event.target; // looks for the element the user has clicked

    // Check if the element clicked is not a aprt of DatePicker
    for (let i = 0; i < datePickers.length; i++) { // Run through the datepicker for both the StartDate and the EndDate
        let datePicker = datePickers[i];
        let isClickedOutside = true;

        for (let index = 0; index < datePickerInputs.length; index++) { // Checks both Date Inputs
            if (datePicker.contains(targetElement) || targetElement === datePickerInputs[index]) {
                isClickedOutside = false;
                break;
            }
        }

        if (isClickedOutside) {
            datePicker.classList.remove("active"); // Closes the DatePicker

            // Reattach event listeners and modifications
            datePickerInputs[i].addEventListener('click', function() {
                datePicker.classList.add("active"); // Open the DatePicker
            });
        }
    }
});

// My Custom Js
let userData = {};
let fuelPrice = 2.363;

// Page1 Validation and going to Page2
const extraInputsBtn = document.getElementById("extra-inputs-button");
const page1Submitbtn = document.getElementById("page1-submit");

extraInputsBtn.addEventListener("click", function() {
    event.preventDefault();
    document.getElementById("extra-inputs-i").classList.toggle("bi-chevron-right");
    document.getElementById("extra-inputs-i").classList.toggle("bi-chevron-down");
    document.getElementById("page1-extra-inputs").classList.toggle("hide");
});

page1Submitbtn.addEventListener("click", function() {
    event.preventDefault();
    
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;
    let groupSize = document.getElementById("group-size").value;

    // Check if any optional inputs are entered
    let vehicleMake = document.getElementById("vehicle-make").value;
    let vehicleRating = document.getElementById("vehicle-rating").value;
    let safetyRating = document.getElementById("safety-rating").value;

    // Required Input Validation
    let validated = true;
    
    let dateFeedback = document.getElementById("date-input-feedback");
    dateFeedback.innerHTML = "";
    let groupFeedback = document.getElementById("group-input-feedback");
    groupFeedback.innerHTML = "";

    if (startDate === "" || endDate === "") {
        dateFeedback.innerHTML = `<p class="red-text">One or more date fields empty.</p>`;
        validated = false;
    }
    // Letter Inputs are automatically removed via DatePicker
    if (groupSize === "") {
        groupFeedback.innerHTML = `<p class="red-text">Group size field empty.</p>`;
        validated = false;
    } else if (parseInt(groupSize) <= 0) {
        groupFeedback.innerHTML = `<p class="red-text">Group size field should not be less than 1.</p>`;
        validated = false;
    } else if (parseInt(groupSize) >= 7) {
        groupFeedback.innerHTML = `<p class="red-text">Group size field should not be more than 6.</p>`;
        validated = false;
    } else {
        groupSize = parseInt(groupSize);
    }
    // Group Size Number Input does not allow letter inputs

    // Optional Input Validation
    let makeFeedback = document.getElementById("make-input-feedback");
    makeFeedback.innerHTML = "";
    let ratingFeedback = document.getElementById("rating-input-feedback");
    ratingFeedback.innerHTML = "";
    let safetyFeedback = document.getElementById("safety-input-feedback");
    safetyFeedback.innerHTML = "";

    let optionalSearches = [];

    // See if any optional values have been filled, in order to validate them.
    if (vehicleMake != "") {
        if (isNaN(parseInt(vehicleMake)) === false) {
            makeFeedback.innerHTML = `<p class="red-text">Vehicle make should be a word.</p>`;
            validated = false;
        }
        vehicleMake = parseInt(vehicleMake);
        optionalSearches.push("VehicleMake");
    }
    if (vehicleRating != "") {
        if (isNaN(parseInt(vehicleRating))) {
            ratingFeedback.innerHTML = `<p class="red-text">Vehicle rating should be a number.</p>`;
            validated = false;
        } else {
            vehicleRating = parseInt(vehicleRating);
        }
        vehicleRating = parseInt(vehicleRating);
        optionalSearches.push("VehicleRating");
    }
    if (safetyRating != "") {
        if (isNaN(parseInt(safetyRating))) {
            safetyFeedback.innerHTML = `<p class="red-text">Safety rating should be a number.</p>`;
            validated = false;
        } else {
            vehicleMake = parseInt(vehicleMake);
        }
        safetyRating = parseInt(safetyRating);
        optionalSearches.push("SafetyRating");
    }

    if (validated === false) {
        return;
    } else if (validated === true) {
        let totalDays = totalDayCalculator();
        
        userData = {
            dayTotal: totalDays,
            groupSize: groupSize,
            make: vehicleMake,
            rating: vehicleRating,
            safetyRating: safetyRating,
            routeKm: 0,
            routeTime: 0,
            fuelEfficiency: 0,
            fuelConsumption: 0,
            fuelCost: 0,
            optionalSearches: optionalSearches
        };

        swiper.slideNext();

        page2(userData);
    }
});

function totalDayCalculator() {
    // collect the dates
    let dates = rangepicker.getDates();
    // calculate the date by difference
    let difference = dates[1].getTime() - dates[0].getTime();
    // convert the amount of milliseconds into an amount of days
    let totalDays = Math.floor(difference / (1000 * 3600 * 24));
    return totalDays;
}

// Page 2
const carousel = document.getElementById("vehicle-carousel");

function findMatches(userData) {
    let selectedVehicles = [];

    for (let i = 0; i < data.length; i++) {
        if (userData.dayTotal <= data[i].maxDays && userData.dayTotal >= data[i].minDays) {
            if (userData.groupSize <= data[i].maxPeople && userData.groupSize >= data[i].minPeople) {
                selectedVehicles.push(data[i]);
            }
        }
    }
    if (selectedVehicles.length === 0) {
        alert("Search found no results");
        swiper.slideTo(0);
    }
    return selectedVehicles;
}

function showResults(vehicles) {
    carousel.innerHTML = ``;
    for (let i = 0; i < vehicles.length; i++) {
        let dayHTML = ``;
        if (vehicles[i].maxPeople - vehicles[i].minPeople === 0) {
            dayHTML = `1 person allowed`;
        } else {
            dayHTML = `${vehicles[i].minPeople}-${vehicles[i].maxPeople} people allowed`;
        }
        carousel.innerHTML += `
        <div class="card-wrapper">
            <img src="${vehicles[i].image}" alt="${vehicles[i].alt}">
            <div>
                <h4>${vehicles[i].name} ($${vehicles[i].rentPerDay}/day)</h4>
                <p>${vehicles[i].minDays}-${vehicles[i].maxDays} days available</p>
                <p>${dayHTML}</p>
                <p>${vehicles[i].lpkm}l / 100km</p>
                <button class="vehicle-info-button" data-id="${vehicles[i].id}"><p>Add to cart</p></button>
            </div>
        </div>
        `;
    }
}

const proceedToCartBtn = document.getElementById("cart-button");

function addButtonEvents(selected) {
    const vehicleInfoBtns = document.getElementsByClassName("vehicle-info-button");

    for (let i = 0; i < vehicleInfoBtns.length; i++) {
        vehicleInfoBtns[i].addEventListener("click", function () {
            let currentId = vehicleInfoBtns[i].dataset.id;
            
            for (let index = 0; index < selected.length; index++) {
                if (currentId == selected[index].id) {
                    let cartContent = selected[index];
                    proceedToCartBtn.addEventListener("click", function() {
                        openCart(userData, cartContent);
                    });
                }
            }
        });
    }
}

function page2(userData) {
    let selectedVehicles = findMatches(userData);
    if (selectedVehicles.length === 0) {
        return;
    }
    showResults(selectedVehicles);
    addButtonEvents(selectedVehicles);
}

// Modal (Mobile)
const shoppingCartWrapper = document.getElementById("vehicle-shopping-cart-wrapper");
const vehicleResult = document.getElementById("shopping-cart-vehicle");
const shoppingCartCloseBtn = document.getElementById("shopping-cart-close-button");

function closeCart() {
    shoppingCartWrapper.classList.add("hide");
    proceedToCartBtn.classList.remove("hide");
}

shoppingCartCloseBtn.addEventListener("click", function() {
    vehicleResult.innerHTML = ``;
    journeyResult.innerHTML = ``;
    closeCart();
});

function openCart(userData, vehicle) {
    proceedToCartBtn.classList.add("hide");
    // Day calculations
    let peopleHTML = ``;
    if (vehicle.maxPeople - vehicle.minPeople === 0) {
        peopleHTML = `1 person allowed`;
    } else {
        peopleHTML = `${vehicle.minPeople}-${vehicle.maxPeople} people allowed`;
    }
    // Fuel Calculations
    userData.fuelEfficiency = (100 / vehicle.lpkm);
    userData.fuelConsumption = (userData.routeKm / userData.fuelEfficiency);
    userData.fuelCost = (userData.fuelConsumption * fuelPrice);

    // Present Data
    vehicleResult.innerHTML = `
    <h4 id="h4-cart">${vehicle.name} ($${vehicle.rentPerDay}/day):</h4>
    <img id="img-cart" src="${vehicle.image}" alt="${vehicle.alt}">
    <div id="p-cart">
        <p>${vehicle.minDays}-${vehicle.maxDays} days available</p>
        <p>${peopleHTML}</p>
        <p>${vehicle.lpkm}l / 100km</p>
        <p>${vehicle.safetyRating} Star Safety Rating</p>
        <p>${vehicle.rating} Star User Rated</p>
        <p>Make: ${vehicle.make}</p>
        <a href="#">Read Terms of Purchase</a>
    </div>
    `;

    journeyResult.innerHTML = `
    <h4>Journey Details:</h4>
    <p>Distance between A and B: <strong>${userData.routeKm}km</strong></p>
    <p>Fuel cost between A and B: <strong>$${(userData.fuelCost).toFixed(2)}</strong></p>
    <p>Predicted time travelled between A and B: <strong>${userData.routeTime} minutes (${(userData.routeTime / 60).toFixed(2)} hours)</strong></p>
    <h4>Total Cost (Rent x Total Days + Fuel): $${((vehicle.rentPerDay * userData.dayTotal) + userData.fuelCost).toFixed(2)}</h4>
    `;

    shoppingCartWrapper.classList.remove("hide");
}
