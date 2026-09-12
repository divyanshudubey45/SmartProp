
// Search button
function startSearch() {

    alert(
        "Property search feature will be available soon!"
    );

}


// ===============================
// NAVBAR SCROLL EFFECT
// ===============================

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            "0 5px 20px rgba(0, 0, 0, 0.08)";

    } else {

        navbar.style.boxShadow = "none";

    }

});
