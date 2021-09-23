// Audio
var alarm = new Audio("media/alarm.wav");

// Show/Hide Elements
function show(element) {
    x = document.getElementById(element);
    x.className = "show";
}

function hide(element) {
    x = document.getElementById(element);
    x.className = "hide";
}

// Settings
var timerData = {
    "focus duration": 25 // placeholder value
}

// Timers
var seconds = "00"

function renderFocusTimer() {
    document.getElementById("minutes").innerHTML = timerData["focus duration"];
    document.getElementById("seconds").innerHTML = seconds;
}

renderFocusTimer()

// Controls
function startTimer() {
    hide("start-button");
    show("pause-button");

    mins = 25; // placeholder value
    secs = 60;
    
    var mins_interval = setInterval(function() {
        mins--; // Decrement by 1
        document.getElementById("minutes").innerHTML = mins;
    }, 6000); // testing value, real value = 60000

    var secs_interval = setInterval(function() {
        secs--; // Decrement by 1
        if (secs < 10) {
            secs = "0" + (secs)
        }
        document.getElementById("seconds").innerHTML = secs;

        if (secs <= 0) {
            if (mins <= 0) {
                alarm.play()
                clearInterval(mins_interval);
                clearInterval(secs_interval);
            }
            secs = 60;
        }
    }, 100); // testing value, real value = 1000
}

function pauseTimer() {
    hide("pause-button");
    show("resume-button");
    show("reset-button");
}

function resumeTimer() {
    hide("resume-button");
    hide("reset-button");
    show("pause-button");
}

function resetTimer() {
    hide("resume-button");
    hide("reset-button");
    show("start-button");
}