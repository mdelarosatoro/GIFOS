//get the start button
const startButton = document.querySelector(".start-button");
const videoPlayer = document.querySelector(".video");
const screenTitle = document.querySelector(".screen__title");
const screenParagraph = document.querySelector(".screen__p");
const screen = document.querySelector(".screen");
const stepOneIcon = document.querySelector(".s1");
const stepTwoIcon = document.querySelector(".s2");
const stepThreeIcon = document.querySelector(".s3");
const horizontalRule = document.querySelector(".hr");
const main = document.querySelector(".main");
const stepContainer = document.querySelector(".step-container");
const API_KEY = "Cv9QCQFlZXObceduecD5DKq5lEFtvZuY";

//create local storage array if it doesn't exist
if (localStorage.getItem("mis-gifos") === null) {
    localStorage.setItem("mis-gifos", "[]");
}

//hide the video player initially
videoPlayer.classList.add("nodisplay");


startButton.addEventListener("click", () => {
    startButton.classList.add("start-button-nodisplay");
    screenTitle.classList.add("nodisplay");
    screenParagraph.classList.add("nodisplay");

    stepOneIcon.classList.add("step-active");

    const stepOneTitle = document.createElement("h2");
    stepOneTitle.textContent = "¿Nos das acceso a tu cámara?";
    stepOneTitle.classList.add("step-one-title");

    const stepOneText = document.createElement("p");
    stepOneText.textContent = "El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO";
    stepOneText.classList.add("step-one-text");

    if (localStorage.getItem("darkmode") === "true") {
        stepOneTitle.classList.add("darkmode-text-color");
        stepOneText.classList.add("darkmode-text-color");
    }

    screen.appendChild(stepOneTitle);
    screen.appendChild(stepOneText);

    getMedia().then((stream) => {
        const recordButton = document.createElement("a");
        recordButton.textContent = "Grabar";
        recordButton.classList.add("record-button");
        if (localStorage.getItem("darkmode") === "true") {
            recordButton.classList.add("darkmode-record-button")
        }
        horizontalRule.parentNode.insertBefore(recordButton, horizontalRule.nextSibling);

        recordButton.addEventListener("click", () => {
            const recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: function() {
                    console.log('started')
                },
                });

            recorder.startRecording();

            //creating the timer
            createTimer();
            //end of timer

            recordButton.classList.add("record-button-nodisplay");
            
            finishRecordingButton = document.createElement("a");
            finishRecordingButton.textContent = "Finalizar";
            finishRecordingButton.classList.add("finish-recording-button");
            if (localStorage.getItem("darkmode") === "true") {
                finishRecordingButton.classList.add("darkmode-finish-recording-button");
            }

            finishRecordingButton.addEventListener("click", () => {
                clearInterval(sessionStorage.getItem("currentIntervalID"));
                
                //removing the timer to insert "Repetir captura"
                const timerDiv = document.querySelector(".timer-div");
                removeAllChildren(timerDiv);

                const restartRecordingButton = document.createElement("a");
                restartRecordingButton.classList.add("restart-recording-button");
                restartRecordingButton.textContent = "REPETIR CAPTURA";

                timerDiv.appendChild(restartRecordingButton);
                
                const form = new FormData();
                recorder.stopRecording(() => {
                    form.append("file", recorder.getBlob(), "myGif.gif");
                });
                
                const uploadButton = document.createElement("a");
                uploadButton.textContent = "Subir Gifo";
                uploadButton.classList.add("upload-button");
                horizontalRule.parentNode.insertBefore(uploadButton, horizontalRule.nextSibling);
                
                restartRecordingButton.addEventListener("click", (e) => {
                    e.target.remove();

                    uploadButton.classList.add("upload-button-nodisplay");
                    recordButton.classList.remove("record-button-nodisplay");
                });
                
                finishRecordingButton.classList.add("finish-recording-button-nodisplay");
                

                //UPLOAD BUTTON
                uploadButton.addEventListener("click", async () => {
                    const repeatButton = document.querySelector(".restart-recording-button");
                    repeatButton.remove();

                    stepTwoIcon.classList.remove("step-active");
                    stepThreeIcon.classList.add("step-active");

                    const overlay = document.createElement("div");
                    overlay.classList.add("overlay");
                    
                    const loader = document.createElement("img");
                    loader.src = "./img/loader.svg";
                    loader.classList.add("loader");

                    const uploadingText = document.createElement("p");
                    uploadingText.textContent = "Estamos subiendo tu GIFO";
                    uploadingText.classList.add("uploading-text");

                    overlay.appendChild(loader);
                    overlay.appendChild(uploadingText);
                    
                    screen.appendChild(overlay);

                    uploadButton.classList.add("upload-button-nodisplay");

                    const response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${API_KEY}&file=${form})}`, { method: "POST", body: form });
                    const result = await response.json();

                    //storing the gif id into local storage
                    const misGifosArr = JSON.parse(localStorage.getItem("mis-gifos"));
                    misGifosArr.unshift(result.data.id);

                    localStorage.setItem("mis-gifos", JSON.stringify(misGifosArr));

                    if (result) {
                        loader.remove();
                        uploadingText.remove();

                        const buttonDiv = document.createElement("div");
                        buttonDiv.classList.add("button-div");
                        
                        const linkAnchor = document.createElement("a");
                        const downloadButton = document.createElement("img");

                        linkAnchor.appendChild(downloadButton);
                        // linkAnchor.setAttribute("href", `https://giphy.com/gifs/${result.data.id}?api_key=${API_KEY}`);
                        // linkAnchor.setAttribute("download", "MyGif");
                        linkAnchor.classList.add("link-anchor");
                        downloadButton.src = "./img/icon-download.svg";
                        downloadButton.classList.add("download-button");
                        downloadButton.addEventListener("mouseover", () => {
                            downloadButton.src = "./img/icon-download-hover.svg"
                        });
                        downloadButton.addEventListener("mouseout", () => {
                            downloadButton.src = "./img/icon-download.svg"
                        });
                        downloadButton.addEventListener("click", async () => {
                            //agregar funcionalidad de click
                            const hiddenLink = document.createElement("a");
                            const response = await fetch(`https://api.giphy.com/v1/gifs/${result.data.id}?api_key=${API_KEY}`);
                            const results = await response.json();
                            const blobURL = await fetch(results.data.images.original.url)
                            const blobFile = await blobURL.blob();
                            
                            hiddenLink.download = "MyGif";
                            hiddenLink.href = window.URL.createObjectURL(blobFile);
                            hiddenLink.click();
                            window.URL.revokeObjectURL(blobFile);
                        });

                        const linkButton = document.createElement("img");
                        linkButton.src = "./img/icon-link-normal.svg";
                        linkButton.classList.add("link-button");
                        linkButton.addEventListener("mouseover", () => {
                            linkButton.src = "./img/icon-link-hover.svg"
                        });
                        linkButton.addEventListener("mouseout", () => {
                            linkButton.src = "./img/icon-link-normal.svg"
                        });
                        linkButton.addEventListener("click", () => {
                            //agregar funcionalidad de click
                            const inputc = document.body.appendChild(document.createElement("input"));
                            inputc.value = `https://giphy.com/gifs/${result.data.id}`;
                            inputc.focus();
                            inputc.select();
                            document.execCommand("copy");
                            inputc.parentNode.removeChild(inputc);
                            alert("URL copied.");
                        });

                        buttonDiv.appendChild(linkAnchor);
                        buttonDiv.appendChild(linkButton);


                        const tick = document.createElement("img");
                        tick.src = "./img/check.svg";
                        tick.classList.add("tick");

                        const successText = document.createElement("p");
                        successText.textContent = "GIFO subido con éxito";
                        successText.classList.add("success-text");

                        overlay.appendChild(buttonDiv);
                        overlay.appendChild(tick);
                        overlay.appendChild(successText);
                    }
                })
            })

            horizontalRule.parentNode.insertBefore(finishRecordingButton, horizontalRule.nextSibling);

        });

        stepOneIcon.classList.remove("step-active");
        stepTwoIcon.classList.add("step-active");


        screen.removeChild(stepOneTitle);
        screen.removeChild(stepOneText);

        videoPlayer.classList.remove("nodisplay");

        videoPlayer.srcObject = stream;
        videoPlayer.play();
    });
});

async function getMedia() {    
    try {
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: { max: 480 }
            }
        });

        return stream
        /* use the stream */
    } catch(err) {
        /* handle the error */
        console.error(err);
    }
}

function createTimer() {
    if (!document.querySelector(".timer-div")) {
        const timerDiv = document.createElement("div");
        timerDiv.classList.add("timer-div");

        const hoursDOM = document.createElement("span");
        hoursDOM.classList.add("hours");
        hoursDOM.classList.add("timer-display");
        hoursDOM.textContent = "00";
        const minutesDOM = document.createElement("span");
        minutesDOM.classList.add("minutes");
        minutesDOM.classList.add("timer-display");
        minutesDOM.textContent = "00";
        const secondsDOM = document.createElement("span");
        secondsDOM.classList.add("hours");
        secondsDOM.classList.add("timer-display");
        secondsDOM.textContent = "00";
    
        const separator1 = document.createElement("span");
        separator1.textContent = ":";
        separator1.classList.add("timer-display");
        const separator2 = document.createElement("span");
        separator2.textContent = ":";
        separator2.classList.add("timer-display");
    
        if (localStorage.getItem("darkmode") === "true") {
            hoursDOM.classList.add("darkmode-text-color");
            minutesDOM.classList.add("darkmode-text-color");
            secondsDOM.classList.add("darkmode-text-color");
            separator1.classList.add("darkmode-text-color");
            separator2.classList.add("darkmode-text-color");
        }

        timerDiv.appendChild(hoursDOM);
        timerDiv.appendChild(separator1);
        timerDiv.appendChild(minutesDOM);
        timerDiv.appendChild(separator2);
        timerDiv.appendChild(secondsDOM);
    
        stepContainer.appendChild(timerDiv);
    
        startTimer(hoursDOM, minutesDOM, secondsDOM);
    } else if (document.querySelector(".timer-div")) {
        const timerDiv = document.querySelector(".timer-div");

        const hoursDOM = document.createElement("span");
        hoursDOM.classList.add("hours");
        hoursDOM.classList.add("timer-display");
        hoursDOM.textContent = "00";
        const minutesDOM = document.createElement("span");
        minutesDOM.classList.add("minutes");
        minutesDOM.classList.add("timer-display");
        minutesDOM.textContent = "00";
        const secondsDOM = document.createElement("span");
        secondsDOM.classList.add("hours");
        secondsDOM.classList.add("timer-display");
        secondsDOM.textContent = "00";
    
        const separator1 = document.createElement("span");
        separator1.textContent = ":";
        separator1.classList.add("timer-display");
        const separator2 = document.createElement("span");
        separator2.textContent = ":";
        separator2.classList.add("timer-display");
        
        if (localStorage.getItem("darkmode") === "true") {
            hoursDOM.classList.add("darkmode-text-color");
            minutesDOM.classList.add("darkmode-text-color");
            secondsDOM.classList.add("darkmode-text-color");
            separator1.classList.add("darkmode-text-color");
            separator2.classList.add("darkmode-text-color");
        }

        timerDiv.appendChild(hoursDOM);
        timerDiv.appendChild(separator1);
        timerDiv.appendChild(minutesDOM);
        timerDiv.appendChild(separator2);
        timerDiv.appendChild(secondsDOM);
    
        stepContainer.appendChild(timerDiv);
    
        startTimer(hoursDOM, minutesDOM, secondsDOM);
    }


}

function startTimer(hoursDOM, minutesDOM, secondsDOM) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    let intervalID = setInterval(() => {
        seconds++;
        if (seconds < 10) {
            secondsDOM.textContent = "0" + seconds.toString();
        } else if (seconds >= 10 && seconds < 60) {
            secondsDOM.textContent = seconds.toString();
        } else if (seconds === 60) {
            seconds = 0;
            secondsDOM.textContent = "0" + seconds.toString();
            minutes++;
            if (minutes < 10) {
                minutesDOM.textContent = "0" + minutes.toString();
            } else if (minutes >= 10 && minutes < 60) {
                minutesDOM.textContent = minutes.toString();
            } else if (minutes === 60) {
                minutes = 0;
                minutesDOM.textContent = "0" + minutes.toString();
                hours++;
                if (hours < 10) {
                    hoursDOM.textContent = "0" + hours.toString();
                } else if (hours >= 10) {
                    hoursDOM.textContent = hours.toString();
                }
            }
        }
    }, 1000);

    sessionStorage.setItem("currentIntervalID", intervalID.toString());
}

function removeAllChildren(parent) {
    while(parent.firstElementChild) {
        parent.firstElementChild.remove();
    }
}


const crearGifBtn = document.querySelector(".create-gif-button");
crearGifBtn.addEventListener("mouseover", (e) => {
    e.target.src = "./img/CTA-crear-gifo-hover.svg";
});
crearGifBtn.addEventListener("mouseout", (e) => {
    e.target.src = "./img/CTA-crear-gifo-active.svg";
});
