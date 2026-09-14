import {
    startShift
} from "./games/shift.js";

import {
    startOneClue
} from "./games/oneclue.js";

import {
    startRemember
} from "./games/remember.js";

import {
    startThirty
} from "./games/thirty.js";


const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const statsScreen = document.getElementById("statsScreen");
const gameContainer = document.getElementById("gameContainer");

const todayLabel = document.getElementById("todayLabel");
const streakNumber = document.getElementById("streakNumber");

const themeButton = document.getElementById("themeButton");
const statsButton = document.getElementById("statsButton");


/* =========================
   DATE
========================= */

export function getTodayKey() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}


function updateDate() {

    const now = new Date();

    todayLabel.textContent =
        now.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        ).toUpperCase();
}


/* =========================
   DAILY RANDOM
========================= */

export function dailyRandom(seed) {

    let value = seed;

    value = Math.sin(value) * 10000;

    return value - Math.floor(value);
}


export function dateSeed(offset = 0) {

    const date = new Date();

    date.setDate(date.getDate() + offset);

    const key =
        date.getFullYear() * 10000 +
        (date.getMonth() + 1) * 100 +
        date.getDate();

    return key;
}


/* =========================
   STORAGE
========================= */

function getCompleted() {

    const key = `ftf-${getTodayKey()}`;

    return JSON.parse(
        localStorage.getItem(key) || "{}"
    );
}


export function markCompleted(game, score = 0) {

    const key = `ftf-${getTodayKey()}`;

    const data = getCompleted();

    data[game] = {
        completed: true,
        score
    };

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

    updateHome();

    updateStreak();
}


export function hasCompleted(game) {

    const data = getCompleted();

    return Boolean(
        data[game]?.completed
    );
}


/* =========================
   STREAK
========================= */

function updateStreak() {

    let streak = 0;

    for (let i = 0; i < 1000; i++) {

        const date = new Date();

        date.setDate(
            date.getDate() - i
        );

        const key =
            `ftf-${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}-${String(
                date.getDate()
            ).padStart(2, "0")}`;

        const games =
            JSON.parse(
                localStorage.getItem(key) || "{}"
            );

        const completed =
            ["shift", "oneclue", "remember", "thirty"]
                .every(game => games[game]?.completed);

        if (!completed) {
            break;
        }

        streak++;
    }

    localStorage.setItem(
        "ftf-streak",
        streak
    );

    streakNumber.textContent = streak;
}


function loadStreak() {

    const streak =
        Number(
            localStorage.getItem("ftf-streak") || 0
        );

    streakNumber.textContent = streak;
}


/* =========================
   HOME
========================= */

export function showHome() {

    homeScreen.classList.add("active");

    gameScreen.classList.remove("active");

    statsScreen.classList.remove("active");

    updateHome();
}


function updateHome() {

    const games = [
        "shift",
        "oneclue",
        "remember",
        "thirty"
    ];

    games.forEach(game => {

        const card =
            document.querySelector(
                `.${game === "oneclue"
                    ? "clue-card"
                    : game === "remember"
                        ? "remember-card"
                        : game === "thirty"
                            ? "seconds-card"
                            : "shift-card"}`
            );

        if (hasCompleted(game)) {
            card.classList.add("is-completed");
        } else {
            card.classList.remove("is-completed");
        }
    });
}


/* =========================
   GAME ROUTER
========================= */

export function openGame(game) {

    homeScreen.classList.remove("active");

    statsScreen.classList.remove("active");

    gameScreen.classList.add("active");

    gameContainer.innerHTML = "";

    if (game === "shift") {
        startShift(gameContainer);
    }

    if (game === "oneclue") {
        startOneClue(gameContainer);
    }

    if (game === "remember") {
        startRemember(gameContainer);
    }

    if (game === "thirty") {
        startThirty(gameContainer);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   STATS
========================= */

function openStats() {

    homeScreen.classList.remove("active");

    gameScreen.classList.remove("active");

    statsScreen.classList.add("active");

    updateStats();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function updateStats() {

    let played = 0;
    let completed = 0;
    let perfect = 0;
    let score = 0;

    for (let key in localStorage) {

        if (!key.startsWith("ftf-")) {
            continue;
        }

        if (key === "ftf-streak") {
            continue;
        }

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(key)
                );

            const games = [
                "shift",
                "oneclue",
                "remember",
                "thirty"
            ];

            let dayComplete = true;

            games.forEach(game => {

                if (data[game]) {

                    played++;

                    if (data[game].completed) {
                        completed++;
                    }

                    score +=
                        Number(
                            data[game].score || 0
                        );

                } else {

                    dayComplete = false;

                }

            });

            if (dayComplete) {
                perfect++;
            }

        } catch {
            // Ignore malformed localStorage entries.
        }
    }

    document.getElementById("gamesPlayed").textContent = played;

    document.getElementById("gamesCompleted").textContent =
        completed;

    document.getElementById("perfectDays").textContent =
        perfect;

    document.getElementById("totalScore").textContent =
        score;

    document.getElementById("statsStreak").textContent =
        localStorage.getItem("ftf-streak") || 0;
}


/* =========================
   THEME
========================= */

function loadTheme() {

    const theme =
        localStorage.getItem("ftf-theme");

    if (theme === "dark") {

        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );

        themeButton.textContent = "☾";

    } else {

        themeButton.textContent = "☼";

    }
}


themeButton.addEventListener(
    "click",
    () => {

        const dark =
            document.documentElement
                .getAttribute("data-theme") === "dark";

        if (dark) {

            document.documentElement
                .removeAttribute("data-theme");

            localStorage.setItem(
                "ftf-theme",
                "light"
            );

            themeButton.textContent = "☼";

        } else {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

            localStorage.setItem(
                "ftf-theme",
                "dark"
            );

            themeButton.textContent = "☾";

        }
    }
);


statsButton.addEventListener(
    "click",
    openStats
);


/* =========================
   INIT
========================= */

updateDate();

loadTheme();

loadStreak();

updateHome();


window.showHome = showHome;
window.openGame = openGame;
