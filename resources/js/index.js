"use strict";
let parentLight = document.getElementById("parentLight"),
    display = document.getElementById("display"),
    playing = false,
    winningCar;

display.src = "about:blank";
display.addEventListener("load", function() {
    let css = document.getElementById("mainCss").cloneNode(),
        lightPole = document.createElement("div"),
        childLight = parentLight.cloneNode(),
        car1 = document.createElement("img"),
        car2 = car1.cloneNode(),
        flag1 = document.createElement("img"),
        flag2 = flag1.cloneNode();

    this.contentDocument.head.appendChild(css);
    this.contentDocument.body.classList.add("background-img");

    car1.setAttribute("src", "../resources/imgs/car-1.png");
    car1.setAttribute("alt", "car 1");
    car1.setAttribute("id", "car1");
    car1.classList.add("cars");
    car2.setAttribute("src", "../resources/imgs/car-2.png");
    car2.setAttribute("alt", "car 2");
    car2.setAttribute("id", "car2");
    car2.classList.add("cars");

    childLight.setAttribute("id", "childLight");
    lightPole.setAttribute("id", "pole");


    flag1.setAttribute("src", "../resources/imgs/flag.png");
    flag1.setAttribute("alt", "Finish Line");
    flag1.setAttribute("id", "flag1");
    flag1.classList.add("flags");
    flag2.setAttribute("src", "../resources/imgs/flag.png");
    flag1.setAttribute("alt", "Finish Line");
    flag2.setAttribute("id", "flag2");
    flag2.classList.add("flags");

    lightPole.appendChild(childLight);
    this.contentDocument.body.appendChild(car1);
    this.contentDocument.body.appendChild(car2);
    this.contentDocument.body.appendChild(flag1);
    this.contentDocument.body.appendChild(flag2);
    this.contentDocument.body.appendChild(lightPole);

    parentLight.addEventListener("click", startCount, false);
}, false);

function nextLight(element) {
    if (element.getAttribute("data-light") === "stop"){
        element.setAttribute("src", "../resources/imgs/traffic-light-slow.png");
        element.setAttribute("alt", "slow");
        element.setAttribute("data-light", "slow");
    }
    else if (element.getAttribute("data-light") === "slow"){
        element.setAttribute("src", "../resources/imgs/traffic-light-go.png");
        element.setAttribute("alt", "go");
        element.setAttribute("data-light", "go");
    }
    else {
        element.setAttribute("src", "../resources/imgs/traffic-light-stop.png");
        element.setAttribute("alt", "stop");
        element.setAttribute("data-light", "stop");
    }
}

function raceCars(car1, car2, finishLine) {
    window.setTimeout(function () {
        if (car1.offsetLeft <= finishLine || car2.offsetLeft <= finishLine) {
            car1.style.left = car1.offsetLeft + Math.floor((Math.random() * 10) + 1);
            car2.style.left = car2.offsetLeft + Math.floor((Math.random() * 10) + 1);
            raceCars(car1, car2, finishLine);
        }
        else {
            if (playing) {
                winner(car1, car2, finishLine);
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
    }, 10);

}

function newGame() {
    parentLight.removeEventListener("click", newGame);
    display.src = "about:blank";
}

function winner(car1, car2, finishLine) {
    let flags = display.contentDocument.querySelectorAll(".flags");

    flags[0].classList.add("rotate");
    flags[1].classList.add("rotate");

    flagLoop();
    playing = false;
    parentLight.removeEventListener("click", startCount);
    parentLight.addEventListener("click", newGame, false);
    nextLight(parentLight);
    nextLight(display.contentDocument.getElementById("childLight"));

    if (car1 >= finishLine && car2 >= finishLine) {
        winningCar = "both";
    }
    else if (car1 >= finishLine){
        winningCar = "car1";
    }
    else {
        winningCar = "car2";
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

function startCount() {
    let childLight = display.contentDocument.getElementById("childLight"),
        car1 = display.contentDocument.getElementById("car1"),
        car2 = display.contentDocument.getElementById("car2"),
        finishLine = display.contentDocument.getElementById("flag1").offsetLeft;

    finishLine -= (finishLine * .12);

    if (!playing) {
        playing = true;

        for (let i=0; i<2; i++) {
            window.setTimeout(function () {
                nextLight(parentLight);
                nextLight(childLight);
                if (i === 1) {
                    raceCars(car1, car2, finishLine);
                }
            }, 1500 * (i+1));
        }
    }
}