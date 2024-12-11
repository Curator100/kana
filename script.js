// script.js

const apiKey = "AIzaSyDC_aqgXAhScsYg85qTTs1fQcUtgn2Z2xQ";
const sheetId = "1ITo6A2vSmu9LjrsoxtaXootEJlpJjg2h_-JaG-pR9d8";
const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

const loginForm = document.getElementById("login-form");
const modeSection = document.getElementById("mode-section");
const dataSection = document.getElementById("data-section");
const bgMusic = document.getElementById("bgMusic");

let userData = {};

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const roll = document.getElementById("roll").value;
    const password = document.getElementById("password").value;

    const response = await fetch(sheetUrl);
    const data = await response.json();
    const rows = data.values;

    const userRow = rows.find(row => row[0] === roll && row[1] === password);

    if (userRow) {
        userData = {
            name: userRow[2],
            points: parseInt(userRow[3], 10),
            task: userRow[4],
            userAverage: userRow[5],
            allAverage: userRow[6],
            curatorMessage: userRow[7],
            course: userRow[8]
        };

        document.getElementById("login-section").style.display = "none";
        modeSection.style.display = "block";
    } else {
        alert("Invalid roll or password. Please try again.");
    }
});

modeSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("mode-button")) {
        const mode = e.target.dataset.mode;
        setMode(mode);
        modeSection.style.display = "none";
        displayUserData(mode);
    }
});

function setMode(mode) {
    const modeConfig = {
        neutral: { bg: "1.jpg", music: "1.mp3", levels: ["a", "b", "c", "d", "e", "f", "g"] },
        islamic: { bg: "2.jpg", music: "2.mp3", levels: ["aa", "bb", "cc", "dd", "ee", "ff", "gg"] },
        bts: { bg: "3.jpg", music: "3.mp3", levels: ["p", "o", "i", "y", "t", "r", "e"] },
        villain: { bg: "4.jpg", music: "4.mp3", levels: ["pp", "ii", "uu", "yy", "tt", "rr", "ee"] }
    };

    const { bg, music, levels } = modeConfig[mode];

    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundSize = "3in 5in";
    document.body.style.backgroundRepeat = "repeat";
    bgMusic.src = music;
    bgMusic.play();

    userData.levelNames = levels;
}

function displayUserData(mode) {
    dataSection.style.display = "block";

    document.getElementById("user-name").textContent = userData.name;
    document.getElementById("user-points").textContent = userData.points;

    const levelIndex = getLevelIndex(userData.points);
    const currentLevel = userData.levelNames[levelIndex];
    document.getElementById("user-level").textContent = currentLevel;

    const nextLevelPoints = getNextLevelPoints(levelIndex);
    const progressValue = Math.min((userData.points / nextLevelPoints) * 100, 100);
    document.getElementById("progress").value = progressValue;

    document.getElementById("user-task").textContent = userData.task;
    document.getElementById("user-average").textContent = userData.userAverage;
    document.getElementById("all-average").textContent = userData.allAverage;
    document.getElementById("curator-message").textContent = userData.curatorMessage;
    document.getElementById("user-course").textContent = userData.course;

    document.getElementById("exam-button").addEventListener("click", () => {
        window.open("https://curator100.github.io/rugbi/", "_blank");
    });
}

function getLevelIndex(points) {
    if (points <= 100) return 0;
    if (points <= 250) return 1;
    if (points <= 500) return 2;
    if (points <= 1000) return 3;
    if (points <= 2500) return 4;
    if (points <= 5000) return 5;
    return 6;
}

function getNextLevelPoints(levelIndex) {
    const thresholds = [100, 250, 500, 1000, 2500, 5000, 10000];
    return thresholds[levelIndex];
}
