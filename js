const gameArea = document.getElementById("gameArea");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startGame");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const secret = document.getElementById("secret");
const lockedText = document.getElementById("lockedText");
const gameInstruction = document.querySelector(".game-instruction");


/* GAME SETTINGS */

const targetScore = 1111;

let score = 0;
let time = 90;
let gameRunning = false;

let gameTimer = null;
let carTimer = null;
let specialTimer = null;

let specialCarSpawned = false;


/* FIX THE TEXT FROM THE HTML */

gameInstruction.innerHTML =
    "Tienes 90 segundos.<br>Atrapa todos los autos que puedas.";

timerDisplay.textContent = "90";
scoreDisplay.textContent = "0";


/* VEHICLE POINTS */

const vehicleTypes = [
    {
        type: "silver",
        points: 15,
        chance: 34
    },

    {
        type: "black",
        points: 25,
        chance: 25
    },

    {
        type: "pink",
        points: 40,
        chance: 15
    },

    {
        type: "burgundy",
        points: 60,
        chance: 10
    },

    {
        type: "motorcycle",
        points: 111,
        chance: 30
    }
];


/* START BUTTON */

startButton.addEventListener("click", startGame);


function startGame() {

    /* Reset everything */

    clearInterval(gameTimer);
    clearTimeout(carTimer);
    clearTimeout(specialTimer);

    score = 0;
    time = 90;
    gameRunning = true;
    specialCarSpawned = false;

    scoreDisplay.textContent = "0";
    timerDisplay.textContent = "90";

    startScreen.classList.add("hidden");


    /* Start creating cars */

    createVehicle();


    /* Start timer */

    gameTimer = setInterval(function () {

        time--;

        timerDisplay.textContent = time;

        if (time <= 0) {
            endGame();
        }

    }, 1000);


    /* Special car appears later */

    specialTimer = setTimeout(function () {

        if (gameRunning) {
            createSpecialCar();
        }

    }, 30000);
}


/* CREATE NORMAL CAR */

function createVehicle() {

    if (!gameRunning) {
        return;
    }


    const vehicle = document.createElement("div");

    const vehicleType = chooseVehicle();

    const lane = Math.floor(Math.random() * 5) + 1;


    vehicle.classList.add(
        "game-car",
        vehicleType.type,
        "lane-" + lane
    );


    /* Add motorcycle people */

    if (vehicleType.type === "motorcycle") {
        createMotorcyclePeople(vehicle);
    }


    gameArea.appendChild(vehicle);


    /* CLICK */

    vehicle.addEventListener("click", function () {

        catchVehicle(
            vehicle,
            vehicleType.points
        );

    });


    /* Remove after crossing */

    vehicle.addEventListener("animationend", function () {

        vehicle.remove();

    });


    /* Create another car */

    carTimer = setTimeout(function () {

        createVehicle();

    }, 500);
}


/* CHOOSE RANDOM VEHICLE */

function chooseVehicle() {

    const random = Math.random() * 100;

    let total = 0;


    for (let i = 0; i < vehicleTypes.length; i++) {

        total += vehicleTypes[i].chance;

        if (random <= total) {
            return vehicleTypes[i];
        }
    }


    return vehicleTypes[0];
}


/* MOTORCYCLE PEOPLE */

function createMotorcyclePeople(motorcycle) {

    const driver = document.createElement("span");
    const passenger = document.createElement("span");


    driver.classList.add("driver");
    passenger.classList.add("passenger");


    motorcycle.appendChild(driver);
    motorcycle.appendChild(passenger);
}


/* CLICK A VEHICLE */

function catchVehicle(vehicle, points) {

    if (!gameRunning) {
        return;
    }


    score += points;

    vehicle.remove();


    /* Check secret score */

    if (score >= targetScore) {

        score = targetScore;

        winGame();

        return;
    }


    scoreDisplay.textContent = score;
}


/* SPECIAL CAR */

function createSpecialCar() {

    if (!gameRunning || specialCarSpawned) {
        return;
    }


    specialCarSpawned = true;


    const specialCar = document.createElement("div");

    const lane = Math.floor(Math.random() * 5) + 1;


    specialCar.classList.add(
        "game-car",
        "special",
        "lane-" + lane
    );


    gameArea.appendChild(specialCar);


    /* SPECIAL CAR = INSTANT WIN */

    specialCar.addEventListener("click", function () {

        specialCar.remove();

        winGame();

    });


    /* Remove if he misses it */

    specialCar.addEventListener("animationend", function () {

        specialCar.remove();

    });
}


/* GAME OVER */

function endGame() {

    gameRunning = false;


    clearInterval(gameTimer);
    clearTimeout(carTimer);
    clearTimeout(specialTimer);


    /* Remove cars */

    document
        .querySelectorAll(".game-car")
        .forEach(function (vehicle) {

            vehicle.remove();

        });


    startScreen.classList.remove("hidden");


    startScreen.querySelector("p").textContent =
        "TIEMPO AGOTADO";
}


/* WIN */

function winGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearInterval(gameTimer);
    clearTimeout(carTimer);
    clearTimeout(specialTimer);


    /* Remove every vehicle */

    document
        .querySelectorAll(".game-car")
        .forEach(function (vehicle) {

            vehicle.remove();

        });


    /* NOW the secret number appears */

    score = targetScore;

    scoreDisplay.textContent = "11:11";


    createWinScreen();
}


/* WIN SCREEN */

function createWinScreen() {

    const winScreen = document.createElement("div");


    winScreen.classList.add("win-screen");


    winScreen.innerHTML = `
        <div class="win-box">

            <div class="win-number">
                11:11
            </div>

            <div class="win-title">
                LO LOGRASTE †
            </div>

            <p class="win-message">
                Sabía que podías hacerlo.
                <br><br>
                Pero ahora viene la parte importante...
            </p>

            <button class="prize-button" type="button">
                IR AL PREMIO †
            </button>

        </div>
    `;


    document.body.appendChild(winScreen);


    /* Confetti */

    createConfetti(winScreen);


    /* Animate screen */

    requestAnimationFrame(function () {

        winScreen.classList.add("show");

    });


    /* Prize button */

    const prizeButton =
        winScreen.querySelector(".prize-button");


    prizeButton.addEventListener("click", function () {

        winScreen.remove();


        secret.classList.add("unlocked");


        lockedText.textContent =
            "DESBLOQUEADO — SOLO PARA TI †";


       document.querySelector(".letter").classList.add("unlocked");
secret.scrollIntoView({ behavior: "smooth" });

    });
}


/* CONFETTI */

function createConfetti(container) {

    const colors = [
        "#ffb6d9",
        "#7e2438",
        "#eeeeee",
        "#777777"
    ];


    for (let i = 0; i < 80; i++) {

        const piece = document.createElement("span");


        piece.classList.add("confetti");


        piece.style.left =
            Math.random() * 100 + "%";


        piece.style.background =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];


        piece.style.animationDelay =
            Math.random() * 1.5 + "s";


        container.appendChild(piece);
    }
}
