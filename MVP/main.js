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

// Timer Settings (temporary)
const s_pomodoro = ["focus", "short"];
const l_pomodoro = ["focus", "long"];
var f_minutes = "25";
var s_minutes = "05";
var l_minutes = "15";
var seconds = "00";
var pomo_cycle = 4;

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
            document.getElementById("type").innerHTML = "to Focus";
            document.getElementById("minutes").innerHTML = f_minutes;
        } else if (type == "short") {
            document.getElementById("type").innerHTML = "for a Short Break";
            document.getElementById("minutes").innerHTML = s_minutes;
        } else if (type == "long") {
            document.getElementById("type").innerHTML = "for a Long Break";
            document.getElementById("minutes").innerHTML = l_minutes;
        }
        document.getElementById("seconds").innerHTML = seconds;
    }

    // Controls
    document.getElementById("start-button").onclick = function startTimer() {
        playAudio("media/snap.wav");
        
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
                        playAudio("media/alarm.wav");

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
                                set = l_pomodoro;
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
        }, 1); // test interval; actual interval = 1000ms = 1s

        document.getElementById("pause-button").onclick = function pauseTimer() {
            playAudio("media/snap.wav");

            hide("pause-button");
            show("resume-button");
            show("reset-button");

            paused = true;
        }

        document.getElementById("resume-button").onclick = function resumeTimer() {
            playAudio("media/snap.wav");

            hide("resume-button");
            hide("reset-button");
            show("pause-button");

            paused = false;
        }

        document.getElementById("reset-button").onclick = function resetTimer() {
            playAudio("media/snap.wav");

            hide("resume-button");
            hide("reset-button");
            show("start-button");

            paused = false;

            clearInterval(secs_interval);
            renderTimer(set[i]);
        }

        document.getElementById("skip-button").onclick = function skipTimer() {
            playAudio("media/snap.wav");

            hide("skip-button");
            show("start-button");

            pomo_log++;
            document.getElementById("pomo-log").innerHTML = pomo_log;

            pomo_count++;
            if (pomo_count < pomo_cycle) { // decide if the next break is a long break
                set = s_pomodoro;
            } else {
                set = l_pomodoro;
                pomo_cycle += pomo_cycle; // add another cycle
            }

            clearInterval(secs_interval);
            i--;
            renderTimer(set[i]);
        }
    }
    renderTimer(set[i]);
    startTimer()
}