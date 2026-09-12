// ===============================
// SMARTPROP - AUTHENTICATION
// ===============================

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const role = document.querySelector(
            'input[name="role"]:checked'
        );

        if (!role) {
            alert("Please select Buyer or Seller.");
            return;
        }

        const user = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: role.value
        };

        localStorage.setItem("smartpropUser", JSON.stringify(user));

        alert(
            "Account created successfully as " +
            role.value.toUpperCase() +
            "!"
        );

        // Redirect according to role
        if (role.value === "buyer") {
            window.location.href = "buyer/dashboard.html";
        } else {
            window.location.href = "seller/dashboard.html";
        }
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const savedUser = localStorage.getItem("smartpropUser");

        if (!savedUser) {
            alert("No account found. Please register first.");
            return;
        }

        const user = JSON.parse(savedUser);

        if (
            email === user.email &&
            password === user.password
        ) {
            localStorage.setItem("smartpropLoggedIn", "true");

            alert("Login successful!");

            if (user.role === "buyer") {
                window.location.href = "buyer/dashboard.html";
            } else if (user.role === "seller") {
                window.location.href = "seller/dashboard.html";
            }
        } else {
            alert("Invalid email or password.");
        }
    });
}


// ===============================
// LOGOUT FUNCTION
// ===============================

function logout() {
    localStorage.removeItem("smartpropLoggedIn");
    window.location.href = "../login.html";
}


// ===============================
// BUYER DASHBOARD USER NAME
// ===============================

const buyerGreeting = document.getElementById("buyerGreeting");
const buyerName = document.getElementById("buyerName");

const savedUser = localStorage.getItem("smartpropUser");

if (savedUser) {

    const user = JSON.parse(savedUser);

    if (buyerGreeting && user.name) {

    const hour = new Date().getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
    } 
    else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } 
    else if (hour >= 17 && hour < 21) {
        greeting = "Good evening";
    } 
    else {
        greeting = "Good night";
    }

    buyerGreeting.textContent =
        greeting + ", " + user.name + " 👋";
}
    if (buyerName && user.name) {
        buyerName.textContent = user.name;
    }
}


// ===============================
// PROPERTY SEARCH & SORT
// ===============================

const propertySearchBtn =
    document.getElementById("propertySearchBtn");

const sortProperties =
    document.getElementById("sortProperties");

const propertyGrid =
    document.getElementById("propertyGrid");

const propertyCount =
    document.getElementById("propertyCount");

const noProperties =
    document.getElementById("noProperties");


function filterProperties() {

    if (!propertyGrid) {
        return;
    }

    const location =
        document
            .getElementById("searchLocation")
            .value
            .trim()
            .toLowerCase();

    const type =
        document
            .getElementById("searchType")
            .value;

    const budget =
        document
            .getElementById("searchBudget")
            .value;


    const cards =
        Array.from(
            propertyGrid.querySelectorAll(".property-card")
        );


    let visibleCards = [];


    cards.forEach(function (card) {

        const cardLocation =
            card.dataset.location.toLowerCase();

        const cardType =
            card.dataset.type;

        const cardPrice =
            Number(card.dataset.price);


        let locationMatch =
            location === "" ||
            cardLocation.includes(location);


        let typeMatch =
            type === "" ||
            cardType === type;


        let budgetMatch = true;


        if (budget === "30") {
            budgetMatch = cardPrice < 30;
        }

        else if (budget === "50") {
            budgetMatch =
                cardPrice >= 30 &&
                cardPrice <= 50;
        }

        else if (budget === "100") {
            budgetMatch =
                cardPrice > 50 &&
                cardPrice <= 100;
        }

        else if (budget === "101") {
            budgetMatch = cardPrice > 100;
        }


        if (
            locationMatch &&
            typeMatch &&
            budgetMatch
        ) {

            card.style.display = "block";

            visibleCards.push(card);

        } else {

            card.style.display = "none";

        }

    });


    // Property count

    if (propertyCount) {

        propertyCount.textContent =
            "Showing " +
            visibleCards.length +
            " properties";

    }


    // No result message

    if (noProperties) {

        if (visibleCards.length === 0) {
            noProperties.style.display = "block";
        } else {
            noProperties.style.display = "none";
        }

    }

}


// ===============================
// SEARCH BUTTON
// ===============================

if (propertySearchBtn) {

    propertySearchBtn.addEventListener(
        "click",
        filterProperties
    );

}


// ===============================
// SORT PROPERTIES
// ===============================

if (sortProperties) {

    sortProperties.addEventListener(
        "change",
        function () {

            if (!propertyGrid) {
                return;
            }


            const cards =
                Array.from(
                    propertyGrid.querySelectorAll(
                        ".property-card"
                    )
                );


            if (this.value === "low") {

                cards.sort(function (a, b) {

                    return (
                        Number(a.dataset.price) -
                        Number(b.dataset.price)
                    );

                });

            }


            else if (this.value === "high") {

                cards.sort(function (a, b) {

                    return (
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                    );

                });

            }


            cards.forEach(function (card) {

                propertyGrid.appendChild(card);

            });

        }
    );

}

// ===============================
// DASHBOARD SEARCH
// ===============================

const dashboardSearchBtn =
    document.getElementById("dashboardSearchBtn");

if (dashboardSearchBtn) {

    dashboardSearchBtn.addEventListener("click", function () {

        const location =
            document.getElementById("dashboardLocation").value.trim();

        const type =
            document.getElementById("dashboardType").value;

        const budget =
            document.getElementById("dashboardBudget").value;


        // Create URL parameters
        const params = new URLSearchParams();


        if (location !== "") {
            params.set("location", location);
        }


        if (type !== "") {
            params.set("type", type);
        }


        if (budget !== "") {
            params.set("budget", budget);
        }


        // Open properties page
        const query = params.toString();

        if (query !== "") {

            window.location.href =
                "properties.html?" + query;

        } else {

            window.location.href =
                "properties.html";

        }

    });

}

// ===============================
// LOAD DASHBOARD SEARCH FILTERS
// ===============================

if (propertyGrid) {

    const params = new URLSearchParams(
        window.location.search
    );

    const location =
        params.get("location");

    const type =
        params.get("type");

    const budget =
        params.get("budget");


    // Fill filters from URL

    if (location) {
        const locationInput =
            document.getElementById("searchLocation");

        if (locationInput) {
            locationInput.value = location;
        }
    }


    if (type) {
        const typeSelect =
            document.getElementById("searchType");

        if (typeSelect) {
            typeSelect.value = type;
        }
    }


    if (budget) {
        const budgetSelect =
            document.getElementById("searchBudget");

        if (budgetSelect) {
            budgetSelect.value = budget;
        }
    }


    // Automatically apply filters

    if (location || type || budget) {

        filterProperties();

    }

}

// ===============================
// DYNAMIC PROPERTY DETAILS
// ===============================

const propertyDetails = {

    1: {
        title: "Modern 2 BHK Apartment",
        location: "📍 Kolar Road, Bhopal",
        price: "₹42 Lakh",
        type: "Apartment",
        bhk: "2 BHK",
        area: "1200 sq.ft",
        floor: "3rd Floor",
        age: "5 Years",
        availability: "Ready to Move",
        match: "94%",
        estimatedPrice: "₹44 Lakh"
    },

    2: {
        title: "Premium Family Villa",
        location: "📍 Vijay Nagar, Indore",
        price: "₹78 Lakh",
        type: "Villa",
        bhk: "3 BHK",
        area: "1850 sq.ft",
        floor: "Ground + 1",
        age: "3 Years",
        availability: "Ready to Move",
        match: "91%",
        estimatedPrice: "₹81 Lakh"
    },

    3: {
        title: "Spacious Independent House",
        location: "📍 Arera Colony, Bhopal",
        price: "₹55 Lakh",
        type: "House",
        bhk: "3 BHK",
        area: "1650 sq.ft",
        floor: "Ground Floor",
        age: "7 Years",
        availability: "Ready to Move",
        match: "88%",
        estimatedPrice: "₹57 Lakh"
    },

    4: {
        title: "Affordable City Apartment",
        location: "📍 Rau, Indore",
        price: "₹32 Lakh",
        type: "Apartment",
        bhk: "2 BHK",
        area: "1050 sq.ft",
        floor: "2nd Floor",
        age: "4 Years",
        availability: "Ready to Move",
        match: "86%",
        estimatedPrice: "₹34 Lakh"
    }
};


// Check if property details page exists
const propertyTitle = document.getElementById("propertyTitle");

if (propertyTitle) {

    const params = new URLSearchParams(window.location.search);

    const propertyId = params.get("id");

    const property = propertyDetails[propertyId];


    if (property) {

        // Title
        propertyTitle.textContent = property.title;


        // Location
        const locationElement =
            document.getElementById("propertyLocation");

        if (locationElement) {
            locationElement.textContent = property.location;
        }


        // Price
        const priceElement =
            document.getElementById("propertyPrice");

        if (priceElement) {
            priceElement.textContent = property.price;
        }


        // Smart Match
        const matchElement =
            document.querySelector(".property-match strong");

        if (matchElement) {
            matchElement.textContent = property.match;
        }


        // Overview
        const overviewItems =
            document.querySelectorAll(".overview-item strong");

        if (overviewItems.length >= 6) {

            overviewItems[0].textContent = property.type;
            overviewItems[1].textContent = property.bhk;
            overviewItems[2].textContent = property.area;
            overviewItems[3].textContent = property.floor;
            overviewItems[4].textContent = property.age;
            overviewItems[5].textContent = property.availability;
        }


        // Estimated Market Price
        const estimatedPrice =
            document.querySelector(".price-insight-box h3");

        if (estimatedPrice) {
            estimatedPrice.textContent =
                property.estimatedPrice;
        }

    } else {

        // Invalid property ID
        propertyTitle.textContent =
            "Property Not Found";

    }
}

// ===============================
// GALLERY IMAGE SWITCHER
// ===============================

function changeGalleryImage(imagePath, selectedThumbnail) {

    const mainImage =
        document.getElementById("mainPropertyPhoto");

    if (!mainImage) {
        return;
    }

    mainImage.src = imagePath;


    const thumbnails =
        document.querySelectorAll(".thumbnail");

    thumbnails.forEach(function (thumbnail) {
        thumbnail.classList.remove("active");
    });


    if (selectedThumbnail) {
        selectedThumbnail.classList.add("active");
    }
}

// ===============================
// CONTACT SELLER FORM
// ===============================

const contactSellerBtn =
    document.getElementById("contactSellerBtn");

const contactSellerSection =
    document.getElementById("contactSellerSection");

const cancelContactBtn =
    document.getElementById("cancelContactBtn");

const sellerContactForm =
    document.getElementById("sellerContactForm");


// Open contact form
if (contactSellerBtn && contactSellerSection) {

    contactSellerBtn.addEventListener("click", function () {

        contactSellerSection.style.display = "block";

        contactSellerSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


// Cancel contact form
if (cancelContactBtn && contactSellerSection) {

    cancelContactBtn.addEventListener("click", function () {

        contactSellerSection.style.display = "none";

    });

}


/* =========================
   CONTACT SELLER -> MESSAGES
========================= */

if (sellerContactForm) {

    sellerContactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const message =
            document.getElementById("buyerMessage").value.trim();

        if (message === "") {
            alert("Please enter your message.");
            return;
        }

        const params =
            new URLSearchParams(window.location.search);

        const propertyId =
            params.get("id");

        if (!propertyId) {
            alert("Property ID not found.");
            return;
        }

        const propertyDetails = {

            1: {
                title: "Modern 2 BHK Apartment",
                location: "📍 Kolar Road, Bhopal"
            },

            2: {
                title: "Premium Family Villa",
                location: "📍 Vijay Nagar, Indore"
            },

            3: {
                title: "Spacious Independent House",
                location: "📍 Arera Colony, Bhopal"
            },

            4: {
                title: "Affordable City Apartment",
                location: "📍 Rau, Indore"
            }

        };

        const property = propertyDetails[propertyId];

        if (!property) {
            alert("Property not found.");
            return;
        }

        let messages =
            JSON.parse(localStorage.getItem("smartpropMessages")) || [];

        const newMessage = {

            id: Date.now().toString(),

            propertyId: propertyId,

            propertyTitle: property.title,

            location: property.location,

            seller: "Verified Seller",

            message: message,

            time: new Date().toLocaleString(),

            unread: true

        };

        messages.push(newMessage);

        localStorage.setItem(
            "smartpropMessages",
            JSON.stringify(messages)
        );

        alert(
            "Enquiry sent successfully! Seller will contact you soon."
        );

        sellerContactForm.reset();

        contactSellerSection.style.display = "none";

    });

}

// ===============================
// FAVORITES
// ===============================

const favoriteButtons =
    document.querySelectorAll(".secondary-btn");

favoriteButtons.forEach(function (button) {

    if (button.textContent.includes("Favorites")) {

        button.addEventListener("click", function () {

            const params =
                new URLSearchParams(window.location.search);

            const propertyId = params.get("id");

            if (!propertyId) {
                alert("Property ID not found.");
                return;
            }

            let favorites =
                JSON.parse(
                    localStorage.getItem("smartpropFavorites")
                ) || [];


            if (favorites.includes(propertyId)) {

                favorites =
                    favorites.filter(function (id) {
                        return id !== propertyId;
                    });

                localStorage.setItem(
                    "smartpropFavorites",
                    JSON.stringify(favorites)
                );

                button.textContent =
                    "♡ Add to Favorites";

            } else {

                favorites.push(propertyId);

                localStorage.setItem(
                    "smartpropFavorites",
                    JSON.stringify(favorites)
                );

                button.textContent =
                    "❤️ Added to Favorites";

            }

        });

    }

});

// ===============================
// LOAD FAVORITE STATE
// ===============================

const currentPropertyParams =
    new URLSearchParams(window.location.search);

const currentPropertyId =
    currentPropertyParams.get("id");

const favoriteButton =
    document.querySelector(".secondary-btn");

if (favoriteButton && currentPropertyId) {

    let savedFavorites =
        JSON.parse(
            localStorage.getItem("smartpropFavorites")
        ) || [];

    if (savedFavorites.includes(currentPropertyId)) {

        favoriteButton.textContent =
            "❤️ Added to Favorites";

    }

}


// ===============================
// FAVORITES PAGE
// ===============================

const favoritesGrid =
    document.getElementById("favoritesGrid");

const emptyFavorites =
    document.getElementById("emptyFavorites");

const favoriteCount =
    document.getElementById("favoriteCount");


if (favoritesGrid) {

    const savedFavorites =
        JSON.parse(
            localStorage.getItem("smartpropFavorites")
        ) || [];


    const allProperties = {

        1: {
            title: "Modern 2 BHK Apartment",
            location: "📍 Kolar Road, Bhopal",
            price: "₹42 Lakh",
            details: "2 BHK • 1200 sq.ft",
            match: "94%"
        },

        2: {
            title: "Premium Family Villa",
            location: "📍 Vijay Nagar, Indore",
            price: "₹78 Lakh",
            details: "3 BHK • 1850 sq.ft",
            match: "91%"
        },

        3: {
            title: "Spacious Independent House",
            location: "📍 Arera Colony, Bhopal",
            price: "₹55 Lakh",
            details: "3 BHK • 1650 sq.ft",
            match: "88%"
        },

        4: {
            title: "Affordable City Apartment",
            location: "📍 Rau, Indore",
            price: "₹32 Lakh",
            details: "2 BHK • 1050 sq.ft",
            match: "86%"
        }

    };


    if (savedFavorites.length === 0) {

        favoritesGrid.style.display = "none";
        emptyFavorites.style.display = "block";

        if (favoriteCount) {
            favoriteCount.textContent =
                "You haven't saved any properties yet.";
        }

    } else {

        favoritesGrid.innerHTML = "";

        savedFavorites.forEach(function (id) {

            const property =
                allProperties[id];

            if (!property) {
                return;
            }


            const card =
                document.createElement("div");

            card.className = "property-card";


            card.innerHTML = `

    <div class="property-image">

        <div class="property-image-placeholder">
            🏠
        </div>

        <span class="verified-badge">
            ✓ Verified
        </span>

    </div>


    <div class="property-content">

        <div class="property-price">
            ${property.price}
        </div>

        <h3>
            ${property.title}
        </h3>

        <p class="property-location">
            ${property.location}
        </p>

        <div class="property-details">

            <span>
                🏠 ${property.details}
            </span>

        </div>

        <div class="property-match">
            ⭐ ${property.match} Smart Match
        </div>


        <div class="favorite-actions">

            <a
                href="property-details.html?id=${id}"
                class="primary-btn">

                View Details

            </a>

            <button
                type="button"
                class="remove-favorite-btn"
                onclick="removeFavorite('${id}', this)">

                🗑 Remove

            </button>

        </div>

    </div>
`;


            favoritesGrid.appendChild(card);

        });


        if (favoriteCount) {

            favoriteCount.textContent =
                savedFavorites.length +
                " favorite propert" +
                (savedFavorites.length === 1 ? "y" : "ies");

        }

    }

}

// ===============================
// REMOVE FAVORITE
// ===============================

function removeFavorite(propertyId, button) {

    let favorites =
        JSON.parse(
            localStorage.getItem("smartpropFavorites")
        ) || [];


    favorites =
        favorites.filter(function (id) {
            return id !== propertyId;
        });


    localStorage.setItem(
        "smartpropFavorites",
        JSON.stringify(favorites)
    );


    const card =
        button.closest(".property-card");

    if (card) {
        card.remove();
    }


    const remainingCards =
        document.querySelectorAll(
            "#favoritesGrid .property-card"
        );


    const count =
        remainingCards.length;


    if (favoriteCount) {

        favoriteCount.textContent =
            count +
            " favorite propert" +
            (count === 1 ? "y" : "ies");

    }


    if (count === 0) {

        favoritesGrid.style.display = "none";

        emptyFavorites.style.display = "block";

        if (favoriteCount) {
            favoriteCount.textContent =
                "You haven't saved any properties yet.";
        }

    }

}


const compareSection = document.getElementById("compareSection");
const emptyCompare = document.getElementById("emptyCompare");

if (compareSection && emptyCompare) {

    const compareProperties = {
        1: {
            title: "Modern 2 BHK Apartment",
            location: "📍 Kolar Road, Bhopal",
            price: "₹42 Lakh",
            estimated: "₹44 Lakh",
            type: "Apartment",
            bhk: "2 BHK",
            area: "1200 sq.ft",
            floor: "3rd Floor",
            age: "5 Years",
            availability: "Ready to Move",
            match: "94%"
        },

        2: {
            title: "Premium Family Villa",
            location: "📍 Vijay Nagar, Indore",
            price: "₹78 Lakh",
            estimated: "₹81 Lakh",
            type: "Villa",
            bhk: "3 BHK",
            area: "1850 sq.ft",
            floor: "Ground + 1",
            age: "3 Years",
            availability: "Ready to Move",
            match: "91%"
        },

        3: {
            title: "Spacious Independent House",
            location: "📍 Arera Colony, Bhopal",
            price: "₹55 Lakh",
            estimated: "₹57 Lakh",
            type: "House",
            bhk: "3 BHK",
            area: "1650 sq.ft",
            floor: "Ground Floor",
            age: "7 Years",
            availability: "Ready to Move",
            match: "88%"
        },

        4: {
            title: "Affordable City Apartment",
            location: "📍 Rau, Indore",
            price: "₹32 Lakh",
            estimated: "₹34 Lakh",
            type: "Apartment",
            bhk: "2 BHK",
            area: "1050 sq.ft",
            floor: "2nd Floor",
            age: "4 Years",
            availability: "Ready to Move",
            match: "86%"
        }
    };


    let selectedCompare =
        JSON.parse(localStorage.getItem("smartpropCompare")) || [];


    function loadCompareProperties() {

        if (selectedCompare.length === 0) {

            compareSection.style.display = "none";
            emptyCompare.style.display = "block";

            return;
        }


        compareSection.style.display = "block";
        emptyCompare.style.display = "none";


        for (let i = 1; i <= 3; i++) {

            const id = selectedCompare[i - 1];

            if (!id || !compareProperties[id]) {

                document.getElementById("propertyColumn" + i).style.display = "none";

                const cells = document.querySelectorAll(
                    ".compare-table tbody tr"
                );

                cells.forEach(function(row) {

                    if (row.children[i]) {
                        row.children[i].style.display = "none";
                    }

                });

                continue;
            }


            const property = compareProperties[id];


            document.getElementById("propertyColumn" + i).textContent =
                "Property " + i;


            document.getElementById("compareTitle" + i).textContent =
                property.title;

            document.getElementById("compareLocation" + i).textContent =
                property.location;

            document.getElementById("comparePrice" + i).textContent =
                property.price;

            document.getElementById("compareEstimated" + i).textContent =
                property.estimated;

            document.getElementById("compareType" + i).textContent =
                property.type;

            document.getElementById("compareBhk" + i).textContent =
                property.bhk;

            document.getElementById("compareArea" + i).textContent =
                property.area;

            document.getElementById("compareFloor" + i).textContent =
                property.floor;

            document.getElementById("compareAge" + i).textContent =
                property.age;

            document.getElementById("compareAvailability" + i).textContent =
                property.availability;

            document.getElementById("compareMatch" + i).textContent =
                property.match;


            document.getElementById("compareView" + i).href =
                "property-details.html?id=" + id;
        }
    }


    window.clearCompare = function() {

        localStorage.removeItem("smartpropCompare");

        selectedCompare = [];

        loadCompareProperties();

    };


    loadCompareProperties();
}

const compareButtons = document.querySelectorAll(".compare-btn");

compareButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const propertyId = button.getAttribute("data-id");

        let compareList =
            JSON.parse(localStorage.getItem("smartpropCompare")) || [];


        // Already added
        if (compareList.includes(propertyId)) {
            alert("This property is already added for comparison.");
            return;
        }


        // Maximum 3 properties
        if (compareList.length >= 3) {
            alert("You can compare maximum 3 properties.");
            return;
        }


        // Add property
        compareList.push(propertyId);

        localStorage.setItem(
            "smartpropCompare",
            JSON.stringify(compareList)
        );


        button.textContent = "✓ Added to Compare";

        button.disabled = true;


        alert("Property added to comparison!");
    });

});

// =========================
// SCHEDULE PROPERTY VISIT
// =========================

const scheduleVisitBtn =
    document.getElementById("scheduleVisitBtn");

const scheduleVisitSection =
    document.getElementById("scheduleVisitSection");

const cancelScheduleBtn =
    document.getElementById("cancelScheduleBtn");

const scheduleVisitForm =
    document.getElementById("scheduleVisitForm");


if (scheduleVisitBtn && scheduleVisitSection) {

    scheduleVisitBtn.addEventListener("click", function() {

        scheduleVisitSection.style.display = "block";

        scheduleVisitSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


if (cancelScheduleBtn && scheduleVisitSection) {

    cancelScheduleBtn.addEventListener("click", function() {

        scheduleVisitSection.style.display = "none";

    });

}


if (scheduleVisitForm) {

    scheduleVisitForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const visitDate =
            document.getElementById("visitDate").value;

        const visitTime =
            document.getElementById("visitTime").value;


        if (visitDate === "" || visitTime === "") {

            alert("Please select date and time.");

            return;
        }


        // Get current property ID
        const params =
            new URLSearchParams(window.location.search);

        const propertyId =
            params.get("id");


        if (!propertyId) {

            alert("Property ID not found.");

            return;
        }


        // Get property information
        const propertyDetails = {

            1: {
                title: "Modern 2 BHK Apartment",
                location: "📍 Kolar Road, Bhopal"
            },

            2: {
                title: "Premium Family Villa",
                location: "📍 Vijay Nagar, Indore"
            },

            3: {
                title: "Spacious Independent House",
                location: "📍 Arera Colony, Bhopal"
            },

            4: {
                title: "Affordable City Apartment",
                location: "📍 Rau, Indore"
            }

        };


        const property =
            propertyDetails[propertyId];


        if (!property) {

            alert("Property not found.");

            return;
        }


        // Get existing visits
        let visits =
            JSON.parse(
                localStorage.getItem("smartpropVisits")
            ) || [];


        // Create new visit
        const newVisit = {

            id: Date.now().toString(),

            propertyId: propertyId,

            title: property.title,

            location: property.location,

            date: visitDate,

            time: visitTime,

            status: "Scheduled"

        };


        visits.push(newVisit);


        // Save visit
        localStorage.setItem(
            "smartpropVisits",
            JSON.stringify(visits)
        );


        alert(
            "Property visit scheduled successfully!"
        );


        // Reset form
        scheduleVisitForm.reset();


        // Hide form
        scheduleVisitSection.style.display = "none";

    });

}


/* =========================
   MY VISITS
========================= */

const visitsList = document.getElementById("visitsList");
const visitsSection = document.getElementById("visitsSection");
const emptyVisits = document.getElementById("emptyVisits");
const visitCount = document.getElementById("visitCount");

if (visitsList && visitsSection && emptyVisits) {

    let savedVisits =
        JSON.parse(localStorage.getItem("smartpropVisits")) || [];


    function displayVisits() {

        if (savedVisits.length === 0) {

            visitsSection.style.display = "none";
            emptyVisits.style.display = "block";

            return;
        }


        visitsSection.style.display = "block";
        emptyVisits.style.display = "none";

        visitsList.innerHTML = "";


        savedVisits.forEach(function(visit) {

            const card = document.createElement("div");

            card.className = "visit-card";


            card.innerHTML = `
                <div class="visit-card-header">

                    <div>
                        <h3>${visit.title}</h3>

                        <p class="visit-location">
                            ${visit.location}
                        </p>
                    </div>

                    <span class="visit-status">
                        ${visit.status}
                    </span>

                </div>


                <div class="visit-info">

                    <div class="visit-info-item">

                        <div class="visit-info-icon">
                            📅
                        </div>

                        <div>
                            <strong>Date</strong>
                            <span>${visit.date}</span>
                        </div>

                    </div>


                    <div class="visit-info-item">

                        <div class="visit-info-icon">
                            🕐
                        </div>

                        <div>
                            <strong>Time</strong>
                            <span>${visit.time}</span>
                        </div>

                    </div>


                    <div class="visit-info-item">

                        <div class="visit-info-icon">
                            🏠
                        </div>

                        <div>
                            <strong>Property ID</strong>
                            <span>${visit.propertyId}</span>
                        </div>

                    </div>

                </div>


                <div class="visit-actions">

                    <a
                        href="property-details.html?id=${visit.propertyId}"
                        class="primary-btn">
                        View Property
                    </a>

                    <button
                        type="button"
                        class="cancel-visit-btn"
                        onclick="cancelVisit('${visit.id}')">
                        Cancel Visit
                    </button>

                </div>
            `;


            visitsList.appendChild(card);

        });


        if (visitCount) {

            visitCount.textContent =
                savedVisits.length +
                " visit" +
                (savedVisits.length === 1 ? "" : "s");

        }

    }


    window.cancelVisit = function(visitId) {

        const confirmCancel =
            confirm("Are you sure you want to cancel this visit?");


        if (!confirmCancel) {
            return;
        }


        savedVisits =
            savedVisits.filter(function(visit) {

                return visit.id !== visitId;

            });


        localStorage.setItem(
            "smartpropVisits",
            JSON.stringify(savedVisits)
        );


        displayVisits();

    };


    displayVisits();

}

/* =========================
   DISPLAY MESSAGES
========================= */

const messagesList = document.getElementById("messagesList");
const messagesSection = document.getElementById("messagesSection");
const emptyMessages = document.getElementById("emptyMessages");
const messageCount = document.getElementById("messageCount");

if (messagesList && messagesSection && emptyMessages) {

    let savedMessages =
        JSON.parse(localStorage.getItem("smartpropMessages")) || [];


    function displayMessages() {

        if (savedMessages.length === 0) {

            messagesSection.style.display = "none";
            emptyMessages.style.display = "block";

            return;
        }


        messagesSection.style.display = "block";
        emptyMessages.style.display = "none";

        messagesList.innerHTML = "";


        savedMessages.forEach(function(message) {

            const card = document.createElement("div");

            card.className =
                "message-card" +
                (message.unread ? " unread" : "");


            card.innerHTML = `
                <div class="message-avatar">
                    S
                </div>

                <div class="message-content">

                    <h3>
                        ${message.seller}
                    </h3>

                    <p class="message-property">
                        ${message.propertyTitle}
                    </p>

                    <p class="message-preview">
                        ${message.message}
                    </p>

                </div>

                <div class="message-meta">

                    <span class="message-time">
                        ${message.time}
                    </span>

                    ${
                        message.unread
                        ? '<span class="unread-badge">Unread</span>'
                        : ''
                    }

                </div>
            `;


            messagesList.appendChild(card);

        });


        if (messageCount) {

            messageCount.textContent =
                savedMessages.length +
                " conversation" +
                (savedMessages.length === 1 ? "" : "s");

        }

    }


    displayMessages();

}

/* =========================
   SETTINGS - PROFILE
========================= */

const profileForm =
    document.getElementById("profileForm");

const settingsName =
    document.getElementById("settingsName");

const settingsEmail =
    document.getElementById("settingsEmail");

const settingsPhone =
    document.getElementById("settingsPhone");

const settingsAvatar =
    document.getElementById("settingsAvatar");


if (profileForm) {

    const savedUser =
        localStorage.getItem("smartpropUser");


    if (savedUser) {

        const user =
            JSON.parse(savedUser);


        settingsName.value =
            user.name || "";

        settingsEmail.value =
            user.email || "";

        settingsPhone.value =
            user.phone || "";


        if (settingsAvatar && user.name) {

            settingsAvatar.textContent =
                user.name.charAt(0).toUpperCase();

        }

    }


    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const savedUser =
            localStorage.getItem("smartpropUser");


        if (!savedUser) {

            alert("User account not found.");

            return;
        }


        const user =
            JSON.parse(savedUser);


        user.name =
            settingsName.value.trim();

        user.email =
            settingsEmail.value.trim();

        user.phone =
            settingsPhone.value.trim();


        if (
            user.name === "" ||
            user.email === "" ||
            user.phone === ""
        ) {

            alert("Please fill all profile fields.");

            return;
        }


        localStorage.setItem(
            "smartpropUser",
            JSON.stringify(user)
        );


        if (settingsAvatar) {

            settingsAvatar.textContent =
                user.name.charAt(0).toUpperCase();

        }


        alert(
            "Profile updated successfully!"
        );

    });

}


/* =========================
   SETTINGS - PASSWORD
========================= */

const passwordForm =
    document.getElementById("passwordForm");


if (passwordForm) {

    passwordForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        const savedUser =
            localStorage.getItem("smartpropUser");


        if (!savedUser) {

            alert("User account not found.");

            return;
        }


        const user =
            JSON.parse(savedUser);


        // Check current password
        if (currentPassword !== user.password) {

            alert("Current password is incorrect.");

            return;
        }


        // Minimum password length
        if (newPassword.length < 6) {

            alert(
                "New password must be at least 6 characters."
            );

            return;
        }


        // Confirm password
        if (newPassword !== confirmPassword) {

            alert(
                "New passwords do not match."
            );

            return;
        }


        // Update password
        user.password = newPassword;


        localStorage.setItem(
            "smartpropUser",
            JSON.stringify(user)
        );


        passwordForm.reset();


        alert(
            "Password updated successfully!"
        );

    });

}

