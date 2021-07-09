//MODO OSCURO
const darkmodeBtn = document.querySelector("#darkmode-btn");
const searchBoxIcon = document.querySelector(".fa-search");

//if darkmode doesnt exist in local storage, create it
if (localStorage.getItem("darkmode") === null) {
    localStorage.setItem("darkmode", "false");
} else if (localStorage.getItem("darkmode") === "true") {
    toggleDarkMode();
    darkmodeBtn.textContent = "Modo Diurno"
}

//if darkmode is turnt on on pageload, change the textcontent of darkmodeBTN to modo diurno


darkmodeBtn.addEventListener("click", (e) => {
    if (localStorage.getItem("darkmode") === "false") {
        localStorage.setItem("darkmode", "true");
        e.target.textContent = "Modo Diurno";
        toggleDarkMode();
    } else if (localStorage.getItem("darkmode") === "true") {
        localStorage.setItem("darkmode", "false");
        e.target.textContent = "Modo Nocturno";
        toggleDarkMode();
    }
});

function toggleDarkMode() {
    let sectionArr = document.getElementsByTagName("section");

    //transforming most div background to dark color
    for (const section of sectionArr) {
        section.classList.toggle("darkmode-bg-light");
    }

    //transofrming the trending background to lighter
    const trendingSection = document.querySelector(".main__trending");
    trendingSection.classList.toggle("darkmode-bg-dark");

    //header and footer background
    const header = document.querySelector(".header");
    const footer = document.querySelector(".footer");

    header.classList.toggle("darkmode-bg-light");
    header.classList.toggle("darkmode-header-border");
    footer.classList.toggle("darkmode-bg-light");
    footer.classList.toggle("darkmode-footer-border");

    //header LOGO
    const logo = document.querySelector(".header__logo");

    if (localStorage.getItem("darkmode") === "true") {
        logo.src = "./img/logo-mobile-modo-noct.svg";
    } else if (localStorage.getItem("darkmode") === "false") {
        logo.src = "./img/logo-mobile.svg";
    }

    //header NAV
    const nav = document.querySelector(".header__nav");
    nav.classList.toggle("darkmode-bg-light");

    //hamburger button
    const hambrugerLines = document.querySelectorAll(".header__hamburger-line");
    for (const line of hambrugerLines) {
        line.classList.toggle("darkmode-hamburger-line");
    }

    //Searchbox
    const searchBoxContainer = document.querySelector(".main__hero__input-container");
    searchBoxContainer.classList.toggle("darkmode-searchbox-border");
    const searchBox = document.querySelector(".main__hero__input-container__searchbox");
    searchBox.classList.toggle("darkmode-searchbox-background");
    searchBoxIcon.classList.toggle("darkmode-searchbox-icon");

    //transforming all text to white
    let pArr = document.getElementsByTagName("p");

    //transforming p text
    for (const p of pArr) {
        p.classList.toggle("darkmode-text-color");
    }

    let h1Arr = document.getElementsByTagName("h1");

    //transforming h1 text
    for (const h1 of h1Arr) {
        h1.classList.toggle("darkmode-text-color");
    }

    let h2Arr = document.getElementsByTagName("h2");

    //transforming h2 text
    for (const h2 of h2Arr) {
        h2.classList.toggle("darkmode-text-color");
    }

    //transforming all spans
    let spanArr = document.getElementsByTagName("span");

    for (const span of spanArr) {
        span.classList.toggle("darkmode-text-color");
    }

    //transforming searchboxcontainer
    // const inputContainerActive = document.querySelector(".main__hero__input-container__searchbox");
    // inputContainerActive.classList.toggle("darkmode-input");
    const suggestionsContainer = document.querySelector(".main__hero__input-container__searchbox-suggestions-container");
    suggestionsContainer.classList.toggle("darkmode-suggestions-container");

    //nav links
    const navLinks = document.querySelectorAll(".header__nav__link");
    for (const link of navLinks) {
        link.classList.toggle("darkmode-text-color");
    }


    const crearGifBtn = document.querySelector(".create-gif-button");

    if (localStorage.getItem("darkmode") === "true") {
        crearGifBtn.src = "./img/CTA-crar-gifo-modo-noc.svg";
    } else if (localStorage.getItem("darkmode") === "false") {
        crearGifBtn.src = "./img/button-crear-gifo.svg"
    }

    const path = window.location.pathname;
    console.log(path);

    if (path === "/crear-gifo.html") {
        const crearGifBackground = document.querySelector(".crear-gifos");
        crearGifBackground.classList.toggle("darkmode-bg-dark");
    
        const screen = document.querySelector(".screen");
        screen.classList.toggle("darkmode-screen");
    
        const hr = document.querySelector(".hr");
        hr.classList.toggle("darkmode-hr")
    
        const startBtn = document.querySelector(".start-button");
        startBtn.classList.toggle("darkmode-start-btn");
    
        const steps = document.querySelectorAll(".step");
        for (const step of steps) {
            step.classList.toggle("darkmode-steps");
        }
    }

}