let API_KEY = "Cv9QCQFlZXObceduecD5DKq5lEFtvZuY";

//IF THE FAVORITES ARRAY DOES NOT EXIST IN LOCAL STORAGE CREATE IT

if (localStorage.getItem("favorites") === null) {
    localStorage.setItem("favorites", "[]");
}

//REMOVE THE HERO
const hero = document.querySelector(".main__hero");
hero.classList.add("remove-hero");


//AGREGAR CONTENIDO A LA PÁGINA
decideFavoriteDOMContent();

function decideFavoriteDOMContent() {
    if (JSON.parse(localStorage.getItem("favorites")).length > 0) {
        addFavorites();
    } else {
        //agregar elementos DOM de favoritos vacío
        addStaticDOMFavorites();
    }
}

function addStaticDOMFavorites() {
    const favoriteContent = document.querySelector("#favoriteContent");
    removeAllChildren(favoriteContent);

    //lo que se muestra cuando el array de favoritos está vacío
    //crear un div con una imagen y un text debajo
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("contentdiv-favorites")


    const heartImg = document.createElement("img");
    heartImg.src = "../img/icon-fav-sin-contenido.svg";
    heartImg.classList.add("heart-img")

    const favoriteText = document.createElement("p");
    favoriteText.textContent = '"¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!"';
    favoriteText.classList.add("favorite-text");

    contentDiv.appendChild(heartImg);
    contentDiv.appendChild(favoriteText);

    favoriteContent.appendChild(contentDiv);
}

async function addFavorites() {
    try {
        //lo que se muestra cuando hay items en el array de favoritos
        const arrayFavorites = JSON.parse(localStorage.getItem("favorites"));
        
        const favorites = arrayFavorites.join(",");
        const favoritesToAdd = await searchFavorites(favorites);
        //En la siguiente función se malogra el código
        createSearchElements(favoritesToAdd);
    } catch (err) {
        console.error(err);
    }
}

function removeAllChildren(parent) {
    while(parent.firstElementChild) {
        parent.firstElementChild.remove();
    }
}

function createSearchElements(favoritesToAdd) {
    const favoritesContainerDOM = document.querySelector("#favoriteContent");
    
    removeAllChildren(favoritesContainerDOM);
    
    //Hasta acá sabemos que el código funciona
    if (JSON.parse(localStorage.getItem("favorites")).length <= 12) {
        let favoritesGrid = buildFavoritesGrid(favoritesToAdd);

        favoritesContainerDOM.appendChild(favoritesGrid);

    } else if (JSON.parse(localStorage.getItem("favorites")).length > 12) {
        //creating the view more button        
        const moreButton = document.createElement("a");
        moreButton.classList.add("main__hero__search-results__more-button");
        moreButton.textContent = "Ver Más";

        if (localStorage.getItem("darkmode") === "true") {
            moreButton.classList.add("darkmode-more-button")
        }

        let dividedArray = divideArrayOver12(favoritesToAdd);
        //HASTA ACA FUNCIONA EL CODIGO, DIVIDED ARRAY RESULTA EN UN ARRAY DE ARRAYS DE 12 GIFS
        console.log(dividedArray);

        //AHORA DEBEMOS RENDERIZAR EL PRIMER ARRAY DE 12 FAVORITOS
        let currentArray = dividedArray.splice(0,1);
        console.log(currentArray);
        console.log(dividedArray);

        const favoritesGridInicial = buildFavoritesGrid(currentArray[0]);

        moreButton.addEventListener("click", (e) => {
            currentArray = dividedArray.splice(0,1);
            console.log(currentArray);
            let favoritesGrids = buildFavoritesGrid(currentArray[0]);

            e.target.parentElement.insertBefore(favoritesGrids, moreButton);

            if (dividedArray.length === 0) {
                e.target.remove();
            }
        });
    
        favoritesContainerDOM.appendChild(favoritesGridInicial);
    
        favoritesContainerDOM.appendChild(moreButton);
    }
}

function buildFavoritesGrid(favoritesToAdd) {
    const favoriteGrid = document.createElement("div"); //create the grid div
    favoriteGrid.classList.add("main__hero__search-results__search-grid"); //adding the grid class

    //loop through the favorite array and build the grid
    for (const gif of favoritesToAdd) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("search-result-wrapper")

        let currentGifURL = gif.images.fixed_height_small.url;

        let gifElement = document.createElement("img");
        gifElement.src = currentGifURL;
        gifElement.classList.add("main__hero__search-results__gif");
        gifElement.addEventListener("click", () => {
            createFullscreenOverlay(gif);
        });

        let overlay = createOverlay(gif);
        overlay.classList.add("search-result-overlay");

        wrapper.appendChild(gifElement);
        wrapper.appendChild(overlay);

        favoriteGrid.appendChild(wrapper);
    }

    return favoriteGrid;
}

function divideArrayOver12(favoritesArray) {
    const numberOfArraysNeeded = Math.ceil(favoritesArray.length / 12);
    let favoritesArrayCopy = favoritesArray.slice();
    console.log(favoritesArray);
    console.log(favoritesArrayCopy);
    let dividedFavoritesArray = [];

        for (let i = 1; i <= numberOfArraysNeeded; i++) {    
            if (i < numberOfArraysNeeded) {
                let divArr = favoritesArrayCopy.splice(0,12);
                dividedFavoritesArray.push(divArr);
            } else if (i === numberOfArraysNeeded) {
                dividedFavoritesArray.push(favoritesArrayCopy.splice(0,favoritesArrayCopy.length));
            }
        }
        console.log(dividedFavoritesArray);
    return dividedFavoritesArray;
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

async function searchFavorites(favorites) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs?api_key=${API_KEY}&ids=${favorites}`);
        const result = await response.json();
    
        return result.data;

    } catch (err) {
        console.error(err);
    }
}

let trendingContainer = document.querySelector(".main__trending__img-container");


//getting the trending GIFs

fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=20`)
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
    for (const gif of parsedGiphyResponse.data) {
        let individualDiv = document.createElement("div");
        individualDiv.classList.add("main__trending__img-container__individual-gif");

        let gifURL = gif.images.fixed_width.url;
        let currentImg = document.createElement("img");
        currentImg.classList.add("main__trending__img-container__img");
        currentImg.src = gifURL;

        //creating the purple overlay over the trending gifs
        let overlay = createOverlay(gif);
        //end of overlay


        individualDiv.addEventListener("mouseover", () => {

            overlay.classList.add("gif-overlay-display");
        });

        individualDiv.addEventListener("mouseout", () => {
            overlay.classList.remove("gif-overlay-display");
        });

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
        console.log(giphyCopy);
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
        console.log(groupsOfThreeArr);
        let index = 0;
        let activeArr = groupsOfThreeArr[index];
        console.log(activeArr);
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
            decideFavoriteDOMContent();
        } else {
            const index = favoritesArr.indexOf(gif.id);

            
            favoritesArr.splice(index, 1);
            localStorage.setItem("favorites", JSON.stringify(favoritesArr));

            heartButton.classList.remove("favorited");
            heartButton.classList.remove("fas");
            heartButton.classList.add("far");
            decideFavoriteDOMContent();
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
    e.target.src = "../img/CTA-crear-gifo-hover.svg";
});
crearGifBtn.addEventListener("mouseout", (e) => {
    e.target.src = "../img/button-crear-gifo.svg";
});

if (localStorage.getItem("darkmode") === "true") {
    crearGifBtn.src = "../img/CTA-crar-gifo-modo-noc.svg";
} else if (localStorage.getItem("darkmode") === "false") {
    crearGifBtn.src = "../img/button-crear-gifo.svg"
}