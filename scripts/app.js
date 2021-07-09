let API_KEY = "Cv9QCQFlZXObceduecD5DKq5lEFtvZuY";

let trendingContainer = document.querySelector(".main__trending__img-container");

//getting the trending GIFs

fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=21`)
.then((giphyResponse) => {
    return giphyResponse.json();
})
.then((parsedGiphyResponse) => {
    buildTrendingGifs(parsedGiphyResponse);
})
.catch((err) => {
    console.error(err);
})

function buildTrendingGifs(parsedGiphyResponse) {
    //mobile version of the trending gifs
    for (const gif of parsedGiphyResponse.data) {
        let individualDiv = document.createElement("div");
        individualDiv.classList.add("main__trending__img-container__individual-gif")

        let gifURL = gif.images.fixed_width.url;
        let currentImg = document.createElement("img");
        currentImg.classList.add("main__trending__img-container__img");
        currentImg.src = gifURL;

        //creating the purple overlay over the trending gifs
        let overlay = createOverlay(gif);
        overlay.classList.add("trending-gif-overlay")
        
        individualDiv.addEventListener("mouseover", () => {
            overlay.classList.add("gif-overlay-display");
        });
        
        individualDiv.addEventListener("mouseout", () => {
            overlay.classList.remove("gif-overlay-display");
        });
        //end of overlay

        individualDiv.appendChild(currentImg);
        individualDiv.appendChild(overlay);

        currentImg.addEventListener("click", () => {
            createFullscreenOverlay(gif);
        });

        trendingContainer.appendChild(individualDiv);
    }

    //desktop version of mobile gifs
    const trendingContainerDesktop = document.querySelector(".trending-container-desktop");
    const giphyCopy = parsedGiphyResponse.data.slice();
    const groupsOfThreeArr = [];
    for (let i = 1; i <= 7; i++) {
        let auxiliaryArr = [];
        auxiliaryArr.push(giphyCopy.shift());
        auxiliaryArr.push(giphyCopy.shift());
        auxiliaryArr.push(giphyCopy.shift());

        //here we add the gifs in groups of three to an array
        groupsOfThreeArr.push(auxiliaryArr);
    }

    //The starting active array must be in the first index
    let index = 0;
    let activeArr = groupsOfThreeArr[index];
    //now we need to build the first three
    for (const gif of activeArr) {
        create3Gifs(gif);
    }

    //now we need to add functionality to the buttons
    //if the right button is clicked, switch the active array and disiplay it
    const rightBtn = document.querySelector(".right-button");
    rightBtn.addEventListener("click", () => {
        if (index < 6) {
            index++;
            activeArr = groupsOfThreeArr[index];

            while (trendingContainerDesktop.firstElementChild) {
                trendingContainerDesktop.firstElementChild.remove();
            }

            for (const gif of activeArr) {
                create3Gifs(gif);
            }
        }
    });

    const leftBtn = document.querySelector(".left-button");
    leftBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            activeArr = groupsOfThreeArr[index];

            while (trendingContainerDesktop.firstElementChild) {
                trendingContainerDesktop.firstElementChild.remove();
            }

            for (const gif of activeArr) {
                create3Gifs(gif);
            }
        }
    });

function create3Gifs(gif) {
    let individualDiv = document.createElement("div");
    individualDiv.classList.add("main__trending__img-container__individual-gif")

    let gifURL = gif.images.fixed_width.url;
    let currentImg = document.createElement("img");
    currentImg.classList.add("main__trending__img-container__img");
    currentImg.src = gifURL;

    //creating the purple overlay over the trending gifs
    let overlay = createOverlay(gif);
    overlay.classList.add("trending-gif-overlay")
    
    individualDiv.addEventListener("mouseover", () => {
        overlay.classList.add("gif-overlay-display");
    });
    
    individualDiv.addEventListener("mouseout", () => {
        overlay.classList.remove("gif-overlay-display");
    });
    //end of overlay

    individualDiv.appendChild(currentImg);
    individualDiv.appendChild(overlay);

    currentImg.addEventListener("click", () => {
        createFullscreenOverlay(gif);
    });

    trendingContainerDesktop.appendChild(individualDiv);
}
}

//DESKTOP TRENDING GIF
window.addEventListener("resize", () => {
    if (x.matches) {

    }
});

//select the searchbox
const searchbox = document.querySelector(".main__hero__input-container__searchbox");
const suggestionContainer = document.querySelector(".main__hero__input-container__searchbox-suggestions-container");
const inputIcon = document.querySelector(".main__hero__input-container__input-icon");

inputIcon.addEventListener("click", () => {
    searchbox.focus();
});

//When pressing enter on the searchbox
searchbox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchbox.value !== "") {
        searchAction();
    }
});

searchbox.addEventListener("input", () => {
    let searchValue = searchbox.value;
    
    if (searchValue !== "") {
        fetchSuggestions(searchValue);
        changeIcon();
    } else {
        removeSuggestions();
        revertIcon();
    }
});

const mainHeroHeading = document.querySelector(".main__hero__heading");
const mainHeroImg = document.querySelector(".main__hero__img");


searchbox.addEventListener("focus", () => {
    // if (window.innerWidth < 700) {
    //     mainHeroHeading.classList.add("main-hero-heading-nodisplay");
    //     mainHeroImg.classList.add("main-hero-img-nodisplay");
    // }

    let searchValue = searchbox.value;
    if (searchValue !== "") {
        fetchSuggestions(searchValue);
        changeIcon();
    }
});

searchbox.addEventListener("blur", () => {
    // if (window.innerWidth < 700) {
    //     mainHeroHeading.classList.remove("main-hero-heading-nodisplay");
    //     mainHeroImg.classList.remove("main-hero-img-nodisplay");
    // }

    setTimeout(removeSuggestions, 100);
});




//fetch the searchbox suggestions

function fetchSuggestions(searchValue) {
    fetch(`https://api.giphy.com/v1/tags/related/${searchValue}?api_key=${API_KEY}`)
    .then((suggestionResponse) => {
        return suggestionResponse.json();
    })
    .then((parsedSuggestionsResponse) => {

        //cleanup the suggestions everytime it updates
        removeSuggestions();
        
        let total = 1;
        for (const suggestion of parsedSuggestionsResponse.data) {
            let currentItem = suggestion.name;
            
            if (total <= 5) {
                //create current row
                let currentRow = document.createElement("div");
                currentRow.classList.add("main__hero__input-container__searchbox-suggestions-row");
    
    
                //create html element
                let currentItemDOM = document.createElement("span");
                currentItemDOM.textContent = currentItem;
                currentItemDOM.classList.add("main__hero__input-container__searchbox-suggestions");
    
                //create magnifying glass fontawesome
                let searchIcon = document.createElement("i");
                searchIcon.classList.add("fas");
                searchIcon.classList.add("fa-search");
                // searchIcon.classList.add("fa-lg");
                searchIcon.classList.add("main__hero__input-container__searchbox-magnifying-glass");
                
                currentRow.appendChild(searchIcon);
                currentRow.appendChild(currentItemDOM);

                //adding the event listeners to the search suggestions
                currentRow.addEventListener("click", (e) => {
                    let searchSuggestion = e.target.childNodes[1].textContent;
                    let searchValue = document.querySelector(".main__hero__input-container__searchbox");
                    searchValue.value = searchSuggestion;
                    searchAction();
                });

                searchIcon.addEventListener("click", (e) => {
                    let searchSuggestion = e.target.parentElement.childNodes[1].textContent;
                    let searchValue = document.querySelector(".main__hero__input-container__searchbox");
                    searchValue.value = searchSuggestion;
                    searchAction();
                });

                currentItemDOM.addEventListener("click", (e) => {
                    let searchSuggestion = e.target.textContent;
                    let searchValue = document.querySelector(".main__hero__input-container__searchbox");
                    searchValue.value = searchSuggestion;
                    searchAction();
                });
    
                suggestionContainer.appendChild(currentRow);
            }

            total++;
        }
    })
}

function changeIcon() {
    inputIcon.classList.remove("fa-search");
    inputIcon.classList.add("fa-times");

    inputIcon.addEventListener("click", clearSearchbox);
}

function clearSearchbox() {
    searchbox.value = "";
    revertIcon();
}

function revertIcon() {
    inputIcon.classList.remove("fa-times");
    inputIcon.classList.add("fa-search");
    inputIcon.removeEventListener("click", clearSearchbox);
}

function removeSuggestions() {
    while(suggestionContainer.firstElementChild) {
        suggestionContainer.firstElementChild.remove();
    }
}

const searchResultsNode = document.querySelector(".main__hero__search-results");

function getSearchResults(searchQuery) {

    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchQuery}`)
        .then((queryResponse) => {
            return queryResponse.json();
        })
        .then((parsedQueryResponse) => {
            sessionStorage.setItem("currentSearchArray", JSON.stringify(parsedQueryResponse.data));

    
            while(searchResultsNode.firstElementChild) {
                searchResultsNode.firstElementChild.remove();
            }
        
            
            let searchTitle = document.createElement("h2");
            searchTitle.textContent = sessionStorage.getItem("lastSearch");
            searchTitle.classList.add("main__hero__search-results__search-title");

            if (localStorage.getItem("darkmode") === "true") {
                searchTitle.classList.add("darkmode-text-color");
            }
            
            searchResultsNode.appendChild(searchTitle);

            if (parsedQueryResponse.data.length > 0) {
                createSearchElements(addSearchItemsToArray(parsedQueryResponse), searchResultsNode);
            } else if (parsedQueryResponse.data.length === 0) {
                const ouchIcon = document.createElement("img");
                ouchIcon.src = "./img/icon-busqueda-sin-resultado.svg";
                ouchIcon.classList.add("ouch-icon");

                const failedSearchText = document.createElement("p");
                failedSearchText.textContent = "Intenta con otra búsqueda.";
                failedSearchText.classList.add("failed-search-text");

                searchResultsNode.appendChild(ouchIcon);
                searchResultsNode.appendChild(failedSearchText);
            }

        })
        .catch((err) => {
            console.error(err);
        });

}

function addSearchItemsToArray(parsedQueryResponse) {

    let searchResultArray = [];
    for (let i = 0; i < 12; i++) {
        let currentItem = parsedQueryResponse.data[i];
        searchResultArray.push(currentItem);
    }

    return searchResultArray;
}

function createSearchElements(searchResultArray, searchResultsNode) {

    let searchGrid = buildSearchGrid(searchResultArray);

    const moreButton = document.createElement("a");
    moreButton.classList.add("main__hero__search-results__more-button");
    moreButton.textContent = "Ver Más";


    if (localStorage.getItem("darkmode") === "true") {
        moreButton.classList.add("darkmode-more-button");
    }

    let counter = 0;

    moreButton.addEventListener("click", (e) => {
        counter++;
        
        let parsedArray = mostrar12ItemsMas(e.target, counter);

        if (parsedArray && parsedArray.length === 0 && counter > 1) {
            e.target.remove();
        }
    });


    searchResultsNode.appendChild(searchGrid);

    searchResultsNode.appendChild(moreButton);
}

function buildSearchGrid(searchResultArray) {
    const searchGrid = document.createElement("div"); //create the grid div
    searchGrid.classList.add("main__hero__search-results__search-grid"); //adding the grid class

    //loop through the search result array and build the grid
    for (const result of searchResultArray) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("search-result-wrapper")

        let currentGifURL = result.images.fixed_height_small.url;

        let gifElement = document.createElement("img");
        gifElement.src = currentGifURL;
        gifElement.classList.add("main__hero__search-results__gif");
        gifElement.addEventListener("click", () => {
            createFullscreenOverlay(result);
        });

        let overlay = createOverlay(result);
        overlay.classList.add("search-result-overlay");

        wrapper.appendChild(gifElement);
        wrapper.appendChild(overlay);

        searchGrid.appendChild(wrapper);
    }

    return searchGrid;
}

function mostrar12ItemsMas(target, counter) {
    const button = target;
    let parsedArray;

    if (counter === 1) {
        parsedArray = JSON.parse(sessionStorage.getItem("currentSearchArray"));
        let searchItemsFrom12Onwards = parsedArray.slice(12); //array con los items restantes de la busqueda

        let displayedItems = searchItemsFrom12Onwards.splice(0, 12);
        sessionStorage.setItem("remainingItemsToDisplay", JSON.stringify(searchItemsFrom12Onwards));
        
        let newGrid = buildSearchGrid(displayedItems);
        
        button.parentNode.insertBefore(newGrid, button);
    } else if (counter > 1) {
        parsedArray = JSON.parse(sessionStorage.getItem("remainingItemsToDisplay"));

        let displayedItems = parsedArray.splice(0, 12);
        sessionStorage.setItem("remainingItemsToDisplay", JSON.stringify(parsedArray));
        
        let newGrid = buildSearchGrid(displayedItems);
        
        button.parentNode.insertBefore(newGrid, button);

        return parsedArray;
    }


}

function searchAction() {
    let searchQuery = searchbox.value;
        
    sessionStorage.setItem("lastSearch", searchQuery);

    const searchTitle = document.querySelector(".main__hero__trending-container__paragraph")

    getSearchResults(searchQuery);

    setTimeout(function() {searchTitle.scrollIntoView({behavior: "smooth"})}, 500);
}

let trendingSearchDOM = document.querySelector(".main__hero__trending-container__paragraph");
//GET TRENDING SEARCHES
function getTrendingSearchResults() {
    fetch(`https://api.giphy.com/v1/trending/searches?api_key=${API_KEY}`)
    .then((response)=> {
        return response.json();
    })
    .then((parsedResponse) => {
        let trendingArray = parsedResponse.data.slice(0, 5);

        injectNewTrendingSearch(trendingArray);
    });
}

function injectNewTrendingSearch(trendingArray) {
    //remove all of the trending search results
    trendingSearchDOM.textContent = "";
    for (const trend of trendingArray) {
        let trendLink = document.createElement("span");
        let coma = document.createElement("span");

        coma.textContent = ", "

        trendLink.textContent = trend;
        trendLink.classList.add("trend-link");
        trendLink.addEventListener("click", () => {
            searchbox.value = trendLink.textContent;
            searchAction();
        });
        trendingSearchDOM.appendChild(trendLink)
        trendingSearchDOM.appendChild(coma)
    }

    trendingSearchDOM.lastElementChild.remove();
}

getTrendingSearchResults();

//IF THE FAVORITES ARRAY DOES NOT EXIST IN LOCAL STORAGE CREATE IT

if (localStorage.getItem("favorites") === null) {
    localStorage.setItem("favorites", "[]");
}

//CREATE GIF OVERLAY
function createOverlay(gif) {

    let overlay = document.createElement("div");
    overlay.classList.add("gif-overlay");

    let leftDiv = document.createElement("div");
    leftDiv.classList.add("gif-overlay__left-div");

    let rightDiv = document.createElement("div");
    rightDiv.classList.add("gif-overlay__right-div");
    
    let heartAnchor = createHeartButton(gif);

    const downloadAnchor = createDownloadButton(gif);
    
    const fullscreenButtonAnchor = createFullscreenButton(gif);


    let userGifInfo = document.createElement("h5");
    userGifInfo.textContent = gif.username;
    userGifInfo.classList.add("gif-overlay-display__username");

    let gifTitle = document.createElement("h6");
    gifTitle.textContent = gif.title;
    gifTitle.classList.add("gif-overlay-display__gif-title");


    leftDiv.appendChild(userGifInfo);
    leftDiv.appendChild(gifTitle);
    rightDiv.appendChild(heartAnchor);
    rightDiv.appendChild(downloadAnchor);
    rightDiv.appendChild(fullscreenButtonAnchor);

    overlay.appendChild(leftDiv);
    overlay.appendChild(rightDiv);

    return overlay;
}

const header = document.querySelector("header");

function createFullscreenOverlay(gif) {

    //create screen overlay
    const fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.classList.add("fullscreen-overlay");

    
    //create X button
    const exitButton = document.createElement("i");
    exitButton.classList.add("fas");
    exitButton.classList.add("fa-times");
    exitButton.classList.add("fa-lg");
    
    exitButton.classList.add("fullscreen-overlay__exit-button");
    
    exitButton.addEventListener("click", () => {
        fullscreenOverlay.remove();
    });
    
    //darkmode logic
    if (localStorage.getItem("darkmode") === "true") {
        fullscreenOverlay.classList.add("darkmode-fullscreen-overlay");
        exitButton.classList.add("darkmode-searchbox-icon");
    }
    

    fullscreenOverlay.appendChild(exitButton);

    //create the gif and its elements
    const parentContainerDOM = document.createElement("div");
    parentContainerDOM.classList.add("fullscreen-gif-container");

    const fullscreenGifDOM = document.createElement("img");
    fullscreenGifDOM.src = gif.images.original.url;
    fullscreenGifDOM.classList.add("fullscreen-gif-container__gif");

    const cardBottomContainer = document.createElement("div");
    cardBottomContainer.classList.add("fullscreen-gif-container__card-bottom");


    const textContainerDOM = document.createElement("div");
    textContainerDOM.classList.add("fullscreen-gif-container__card-bottom__text-container");
    const userNameDOM = document.createElement("h5");
    userNameDOM.textContent = gif.username;
    userNameDOM.classList.add("fullscreen-gif-container__card-bottom__text-container__username");
    const gifTitleDOM = document.createElement("h6");
    gifTitleDOM.textContent = gif.title;
    gifTitleDOM.classList.add("fullscreen-gif-container__card-bottom__text-container__gif-title");


    const iconContainerDOM = document.createElement("div");
    iconContainerDOM.classList.add("fullscreen-gif-container__card-bottom__icon-container");
    const heartIconDOM = createHeartButton(gif);
    heartIconDOM.classList.add("fullscreen-gif-container__card-bottom__icon-container__icons");
    heartIconDOM.classList.add("fa-lg");
    const downloadIconDOM = createDownloadButton(gif);
    downloadIconDOM.classList.add("fullscreen-gif-container__card-bottom__icon-container__icons");
    downloadIconDOM.classList.add("fa-lg");


    textContainerDOM.appendChild(userNameDOM);
    textContainerDOM.appendChild(gifTitleDOM);

    iconContainerDOM.appendChild(heartIconDOM);
    iconContainerDOM.appendChild(downloadIconDOM);

    cardBottomContainer.appendChild(textContainerDOM);
    cardBottomContainer.appendChild(iconContainerDOM);

    parentContainerDOM.appendChild(fullscreenGifDOM);
    parentContainerDOM.appendChild(cardBottomContainer);

    fullscreenOverlay.appendChild(parentContainerDOM);

    document.body.insertBefore(fullscreenOverlay,  document.body.firstChild);

}

function createHeartButton(gif) {
    let heartAnchor = document.createElement("a");
    let heartButton = document.createElement("i");
    heartButton.classList.add("far");
    heartButton.classList.add("fa-heart");
    heartButton.classList.add("gif-overlay-display__icon");

    //search the favorites array frmo local storage. If the array contains the gif, display the favorited style
    let favoritos = JSON.parse(localStorage.getItem("favorites"));

    if (favoritos.indexOf(gif.id) != -1) {
        heartButton.classList.add("favorited");
        heartButton.classList.remove("far");
        heartButton.classList.add("fas");
    }

    heartButton.addEventListener("click", () => {
        const favoritesArr = JSON.parse(localStorage.getItem("favorites"));

        if (favoritesArr.indexOf(gif.id) === -1) {
            favoritesArr.unshift(gif.id);
            localStorage.setItem("favorites", JSON.stringify(favoritesArr));
            heartButton.classList.add("favorited");
            heartButton.classList.remove("far");
            heartButton.classList.add("fas");
        } else {
            const index = favoritesArr.indexOf(gif.id);

            
            favoritesArr.splice(index, 1);
            localStorage.setItem("favorites", JSON.stringify(favoritesArr));

            heartButton.classList.remove("favorited");
            heartButton.classList.remove("fas");
            heartButton.classList.add("far");
        }

    });
    heartAnchor.classList.add("gif-overlay-anchor");
    heartAnchor.appendChild(heartButton);

    return heartAnchor;
}

function createFullscreenButton(gif) {

    let fullscreenButtonAnchor = document.createElement("a");
    let fullscreenButton = document.createElement("i");
    fullscreenButton.classList.add("fas");
    fullscreenButton.classList.add("fa-expand-alt");
    fullscreenButton.classList.add("gif-overlay-display__icon");
    fullscreenButton.addEventListener("click", () => {
        createFullscreenOverlay(gif);

    });

    fullscreenButtonAnchor.classList.add("gif-overlay-anchor");
    fullscreenButtonAnchor.classList.add("fullscreenButton-margin");
    fullscreenButtonAnchor.appendChild(fullscreenButton);

    return fullscreenButtonAnchor;
}

function createDownloadButton(gif) {
    let downloadAnchor = document.createElement("a");
    let downloadButton = document.createElement("i");
    downloadButton.classList.add("fas");
    downloadButton.classList.add("fa-download");
    downloadButton.classList.add("gif-overlay-display__icon");
    
    const url = gif.images.original.url;
    
    downloadAnchor.appendChild(downloadButton);
    downloadAnchor.classList.add("gif-overlay-anchor");
    
    downloadAnchor.addEventListener("click", async () => {
        const hiddenLink = document.createElement("a");
        
        const response = await fetch(url);
        const file = await response.blob();
        
        hiddenLink.download = gif.title;
        hiddenLink.href = window.URL.createObjectURL(file);
        hiddenLink.click();
        window.URL.revokeObjectURL(file);
    });

    return downloadAnchor;
}

const crearGifBtn = document.querySelector(".create-gif-button");
crearGifBtn.addEventListener("mouseover", (e) => {
    e.target.src = "./img/CTA-crear-gifo-hover.svg";
});
crearGifBtn.addEventListener("mouseout", (e) => {
    e.target.src = "./img/button-crear-gifo.svg";
});

//START OF NAVBARSEARCH
const navbarSearch = document.querySelector(".navbar-search-container");
const navbar = document.querySelector(".navbar-search");
const navbarIcon = document.querySelector(".navbar-search-icon");
const x = window.matchMedia("(min-width: 1440px)");
window.addEventListener("scroll", (e) => {
    if (x.matches) {
        if (window.scrollY > 0) {
            navbarSearch.classList.remove("navbar-search-container-nodisplay");
        } else if (window.scrollY === 0) {
            navbarSearch.classList.add("navbar-search-container-nodisplay");
        }
    }
});

navbar.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && navbar.value !== "") {
        searchActionNav();
    }
});

navbarIcon.addEventListener("click", () => {
    if (navbar.value != "") {
        searchActionNav();
    }
});

function searchActionNav() {
    let searchQuery = navbar.value;
        
    sessionStorage.setItem("lastSearch", searchQuery);

    const searchTitle = document.querySelector(".main__hero__trending-container__paragraph")

    getSearchResults(searchQuery);

    setTimeout(function() {searchTitle.scrollIntoView({behavior: "smooth"})}, 500);
}
//END OF NAVBAR SEARCH
