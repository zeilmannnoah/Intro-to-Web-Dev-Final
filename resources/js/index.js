"use strict";
var lightsList = document.querySelectorAll(".parentLights"),
    display = document.getElementById("display"),
    car1Display = document.getElementById("car1-display"),
    car2Display = document.getElementById("car2-display"),
    tieDisplay = document.getElementById("tie-display"),
    textDisplay = document.getElementById("text-display"),
    restartButton = document.getElementById("button"),
    playing = false,
    winningCar = null,
    parentLights = {
        stop: lightsList[0],
        slow: lightsList[1],
        go: lightsList[2],
        intervalId: null,
    };

restartButton.addEventListener("click", function() {
    restartButton.disabled = true;
    display.src = "about:blank";
    car1Display.classList.add("d-none");
    car2Display.classList.add("d-none");
    tieDisplay.classList.add("d-none");
    textDisplay.classList.add("d-none");
    textDisplay.innerHTML = "";
    winningCar = null;
});

display.src = "about:blank";
display.addEventListener("load", function() {
    var css = document.getElementById("mainCss").cloneNode(),
        bootstrap = document.getElementById("bootstrap").cloneNode(),
        lightPole = document.createElement("div"),
        car1 = document.createElement("img"),
        car2 = car1.cloneNode(),
        flag1 = document.createElement("img"),
        flag2 = flag1.cloneNode(),
        childLights = {
            stop: parentLights.stop.cloneNode(),
            slow: parentLights.slow.cloneNode(),
            go: parentLights.go.cloneNode(),
        };

    this.contentDocument.head.appendChild(css);
    this.contentDocument.head.appendChild(bootstrap);
    this.contentDocument.body.classList.add("background-img");
    parentLights.childLights = childLights;

    car1.setAttribute("src", "./resources/imgs/car-1.png");
    car1.setAttribute("alt", "car 1");
    car1.setAttribute("id", "car1");
    car1.classList.add("cars");
    car2.setAttribute("src", "./resources/imgs/car-2.png");
    car2.setAttribute("alt", "car 2");
    car2.setAttribute("id", "car2");
    car2.classList.add("cars");

    childLights.stop.classList.add("childLights");
    childLights.slow.classList.add("childLights", "d-none");
    childLights.go.classList.add("childLights", "d-none");
    childLights.stop.classList.remove("parentLights");
    childLights.slow.classList.remove("parentLights");
    childLights.go.classList.remove("parentLights");

    lightPole.setAttribute("id", "pole");


    flag1.setAttribute("src", "./resources/imgs/flag.png");
    flag1.setAttribute("alt", "Finish Line");
    flag1.setAttribute("id", "flag1");
    flag1.classList.add("flags");
    flag2.setAttribute("src", "./resources/imgs/flag.png");
    flag1.setAttribute("alt", "Finish Line");
    flag2.setAttribute("id", "flag2");
    flag2.classList.add("flags");

    lightPole.appendChild(childLights.stop);
    lightPole.appendChild(childLights.slow);
    lightPole.appendChild(childLights.go);
    this.contentDocument.body.appendChild(car1);
    this.contentDocument.body.appendChild(car2);
    this.contentDocument.body.appendChild(flag1);
    this.contentDocument.body.appendChild(flag2);
    this.contentDocument.body.appendChild(lightPole);

    parentLights.stop.addEventListener("click", function() {
        var raceObj = {
                car1: car1,
                car2: car2,
                finishLine: flag1.offsetLeft - flag1.offsetLeft * .12
            };
        if (!playing) {
            playing = true;

            startRace(parentLights, childLights, raceObj);
        }
    }, false);
}, false);

function startRace(parentLights, childLights, raceObj) {
    window.setTimeout(function() {
        if (!parentLights.stop.classList.contains("d-none")){
            parentLights.slow.classList.remove("d-none");
            parentLights.stop.classList.add("d-none");
            childLights.slow.classList.remove("d-none");
            childLights.stop.classList.add("d-none");
            startRace(parentLights, childLights, raceObj)
        }
        else if (!parentLights.slow.classList.contains("d-none")){
            parentLights.go.classList.remove("d-none");
            parentLights.slow.classList.add("d-none");
            childLights.go.classList.remove("d-none");
            childLights.slow.classList.add("d-none");
            raceCars(raceObj.car1, raceObj.car2, raceObj.finishLine);
        }
    }, 1500);
}

function raceCars(car1, car2, finishLine) {
    window.setTimeout(function () {
        if (car1.offsetLeft <= finishLine && car2.offsetLeft <= finishLine) {
            car1.style.left = car1.offsetLeft + Math.floor((Math.random() * 10) + 1);
            car2.style.left = car2.offsetLeft + Math.floor((Math.random() * 10) + 1);
            raceCars(car1, car2, finishLine);
        }
        else {
            if (playing) {
                if (!winningCar) {
                    winner(car1, car2, finishLine);
                }
            }
            if (car1.offsetLeft <= display.offsetWidth || car2.offsetLeft <= display.offsetWidth) {
                if (winningCar === "car1") {
                    car1.style.left += car1.offsetLeft + 10;
                    car2.style.left += car2.offsetLeft + 5;
                }
                else if (winningCar === "car2") {
                    car2.style.left = car2.offsetLeft + 10;
                    car1.style.left = car1.offsetLeft + 5;
                }
                else {
                    car1.style.left = car1.offsetLeft + 10;
                    car2.style.left = car2.offsetLeft + 10;
                }
                raceCars(car1, car2, finishLine);
            }
        }
    }, 20);

}

function winner(car1, car2, finishLine) {
    var flags = display.contentDocument.querySelectorAll(".flags"),
        newStop = parentLights.stop.cloneNode();

    flags[0].classList.add("rotate");
    flags[1].classList.add("rotate");

    playing = false;
    restartButton.disabled = false;
    flagLoop();

    parentLights.stop.parentNode.replaceChild(newStop, parentLights.stop);
    parentLights.stop = newStop;

    parentLights.stop.classList.remove("d-none");
    parentLights.go.classList.add("d-none");
    parentLights.childLights.stop.classList.remove("d-none");
    parentLights.childLights.go.classList.add("d-none");

    if (car1.offsetLeft >= finishLine && car2.offsetLeft >= finishLine) {
        winningCar = [car1, car2];
        tieDisplay.classList.remove("d-none");
    }
    else if (car1.offsetLeft >= finishLine){
        winningCar = car1;
        textDisplay.innerHTML = "Red Car<br>Wins!";
        car1Display.classList.remove("d-none");
        textDisplay.classList.remove("d-none");
    }
    else {
        winningCar = car2;
        textDisplay.innerHTML = "Yellow Car<br>Wins!";
        car2Display.classList.remove("d-none");
        textDisplay.classList.remove("d-none");
    }

    function flagLoop() {
        window.setTimeout(function() {
            if (!playing) {
                flags.forEach(function(flag) {
                    flag.classList.toggle("rotate");
                });
                flagLoop();
            }
        }, 1000);
    }
}