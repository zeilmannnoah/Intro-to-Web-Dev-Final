"use strict";
let stoplightImg = document.getElementById("stoplight"),
    display = document.getElementById("display");

stoplightImg.addEventListener("click", function() {
    if (this.getAttribute("data-light") === "stop"){
        this.setAttribute("src", "../resources/imgs/traffic-light-slow.png");
        this.setAttribute("data-light", "slow");
    }
    else if (this.getAttribute("data-light") === "slow"){
        this.setAttribute("src", "../resources/imgs/traffic-light-go.png");
        this.setAttribute("data-light", "go");
    }
    else {
        this.setAttribute("src", "../resources/imgs/traffic-light-stop.png");
        this.setAttribute("data-light", "stop");
    }
}, false);

display.src = "about:blank";
display.addEventListener("load", function() {
    let css = document.getElementById("mainCss").cloneNode();

    this.contentDocument.head.appendChild(css);
    this.contentDocument.body.classList.add("background-img");
}, false);