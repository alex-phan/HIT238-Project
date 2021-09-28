// Audio
function playAudio(file) { // allow audio to overlap
    audio = new Audio(file);
    audio.addEventListener("ended", function() {
        document.removeChild(this);
    }, false);
    audio.play();
}

// Show/Hide
function show(elem) {
    document.getElementById(elem).classList.remove("hide");
    document.getElementById(elem).classList.add("show");
}

function hide(elem) {
    document.getElementById(elem).classList.remove("show");
    document.getElementById(elem).classList.add("hide");
}

// Enforce Input Minimum
function enforceMin(elem) {
    document.getElementById(elem).addEventListener("change", function() {
        if (this.value < this.min) {
            this.value = this.min
        }
    })
}

enforceMin("focus-duration");
enforceMin("short-duration");
enforceMin("long-duration");
enforceMin("long-interval");
enforceMin("timer-speed");

// Local Storage
function updateSettings() {
    f_duration = document.getElementById("focus-duration").value;
    s_duration = document.getElementById("short-duration").value;
    l_duration = document.getElementById("long-duration").value;
    l_interval = document.getElementById("long-interval").value;
    speed = document.getElementById("timer-speed").value;

    const timer_settings = {
        f_duration: f_duration,
        s_duration: s_duration,
        l_duration: l_duration,
        l_interval: l_interval,
        speed: speed,
    }

    localStorage.setItem("custom-settings", JSON.stringify(timer_settings));
}

function applySettings() {
    location.reload();
    updateSettings();
}

var get_data = JSON.parse(localStorage.getItem("custom-settings"));

document.getElementById("focus-duration").defaultValue = get_data.f_duration;
document.getElementById("short-duration").defaultValue = get_data.s_duration;
document.getElementById("long-duration").defaultValue = get_data.l_duration;
document.getElementById("long-interval").defaultValue = get_data.l_interval;
document.getElementById("timer-speed").defaultValue = get_data.speed;

// Timer Settings
function formatTimer(val) { // correct timer formatting to two digits
    if (val < 10) {
        val = "0" + val;
    }

    return val;
}

const s_pomodoro = ["focus", "short"];
const l_pomodoro = ["focus", "long"];
var f_minutes = formatTimer(get_data.f_duration);
var s_minutes = formatTimer(get_data.s_duration);
var l_minutes = formatTimer(get_data.l_duration);
var seconds = "00";
var pomo_cycle = parseInt(get_data.l_interval);

// Dev Tools
var timer_speed = parseInt(get_data.speed);

// Timer Script
var pomo_log = 0; // record how many pomodoros have elapsed
document.getElementById("pomo-log").innerHTML = pomo_log;

var pomo_count = 1;
var set;
if (pomo_count !== pomo_cycle) { // determine starting set
    set = s_pomodoro;
} else {
    set = l_pomodoro;
}

let i = 0;
while (set[i]) {
    function renderTimer(type) {
        if (type == "focus") {
            document.getElementById("timer-type").innerHTML = "to Focus";
            document.getElementById("minutes").innerHTML = f_minutes;
        } else if (type == "short") {
            document.getElementById("timer-type").innerHTML = "for a Short Break";
            document.getElementById("minutes").innerHTML = s_minutes;
        } else if (type == "long") {
            document.getElementById("timer-type").innerHTML = "for a Long Break";
            document.getElementById("minutes").innerHTML = l_minutes;
        }
        document.getElementById("seconds").innerHTML = seconds;
    }
    
    document.getElementById("start-button").onclick = function startTimer() {
        playAudio("media/sounds/snap.wav");
        
        hide("start-button");
        if (set[i] == "focus") {
            show("pause-button");
        } else {
            show("skip-button");
        }
    
        if (set[i] == "focus") {
            var mins = parseInt(f_minutes);
        } else if (set[i] == "short") {
            var mins = parseInt(s_minutes);
        } else if (set[i] == "long") {
            var mins = parseInt(l_minutes);
        }
        var secs = 60;
        document.getElementById("seconds").innerHTML = "0" + 0; // render 60 as 00
    
        var paused = false;
        var secs_interval = setInterval(function() {
            if (!paused) {
                if (secs == 60) {
                    mins--; // decrement minutes by one
                    if (mins < 10) {
                        mins = "0" + mins; // correct the formatting
                    }
                    document.getElementById("minutes").innerHTML = mins;
                }
    
                secs--; // decrement seconds by one
                if (secs < 10) {
                    secs = "0" + secs; // correct the formatting
                }
                document.getElementById("seconds").innerHTML = secs;
                
                if (secs <= 0) {
                    if (mins <= 0) {
                        playAudio("media/sounds/alarm.wav");
    
                        clearInterval(secs_interval);
    
                        if (i + 1 < set.length) {
                            i++; // go to next timer
                        } else {
                            i--; // go to previous timer
                        }
    
                        renderTimer(set[i]);
                        
                        if (set[i] == "focus") {
                            hide("skip-button");
                            show("start-button");
    
                            pomo_log++;
                            document.getElementById("pomo-log").innerHTML = pomo_log;
    
                            pomo_count++;
                            if (pomo_count < pomo_cycle) { // decide if the next break is a long break
                                set = s_pomodoro;
                            } else {
                                set = l_pomodoro; // next break is a long break
                                pomo_cycle += pomo_cycle; // add another cycle
                            }
                        } else {
                            hide("pause-button");
                            show("start-button");
                        }
                    }
                    
                    secs = 60; // reset seconds
                }
            }
        }, timer_speed);
    
        document.getElementById("pause-button").onclick = function pauseTimer() {
            playAudio("media/sounds/snap.wav");
    
            hide("pause-button");
            show("resume-button");
            show("reset-button");
    
            paused = true;
        }
    
        document.getElementById("resume-button").onclick = function resumeTimer() {
            playAudio("media/sounds/snap.wav");
    
            hide("resume-button");
            hide("reset-button");
            show("pause-button");
    
            paused = false;
        }
    
        document.getElementById("reset-button").onclick = function resetTimer() {
            playAudio("media/sounds/snap.wav");
    
            hide("resume-button");
            hide("reset-button");
            show("start-button");
    
            paused = false;
    
            clearInterval(secs_interval);
            renderTimer(set[i]);
        }
    
        document.getElementById("skip-button").onclick = function skipTimer() {
            playAudio("media/sounds/snap.wav");
    
            hide("skip-button");
            show("start-button");
    
            pomo_log++;
            document.getElementById("pomo-log").innerHTML = pomo_log;
    
            pomo_count++;
            if (pomo_count < pomo_cycle) { // decide if the next break is a long break
                set = s_pomodoro;
            } else {
                set = l_pomodoro; // next break is a long break
                pomo_cycle += pomo_cycle; // add another cycle
            }
    
            clearInterval(secs_interval);
            i--;
            renderTimer(set[i]);
        }
    }

    renderTimer(set[i]);
    startTimer();
}