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
const timer_type = ["focus", "short", "long"]
var f_minutes = "25";
var s_minutes = "05";
var l_minutes = "15";
var seconds = "00";

// Timer Script
for (var i = 0; i < timer_type.length; i++) {
    function renderTimer(type) {
        if (i == 0) {
            document.getElementById("type").innerHTML = "to Focus";
            document.getElementById("minutes").innerHTML = f_minutes;
        } else if (type == 1) {
            document.getElementById("type").innerHTML = "for a Short Break";
            document.getElementById("minutes").innerHTML = s_minutes;
        } else if (type == 2) {
            document.getElementById("type").innerHTML = "for a Long Break";
            document.getElementById("minutes").innerHTML = l_minutes;
        }
        document.getElementById("seconds").innerHTML = seconds;
    }

    renderTimer(i);

    // Controls
    document.getElementById("start-button").onclick = function startTimer() {
        playAudio("media/snap.wav");
        
        hide("start-button");
        if (i == 0) {
            show("pause-button");
        } else {
            show("skip-button");
        }

        if (i == 0) {
            var mins = parseInt(f_minutes);
        } else if (i == 1) {
            var mins = parseInt(s_minutes);
        } else if (i == 2) {
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
                    }

                    secs = 60; // reset seconds
                }
            }
        }, 10); // test interval; actual interval = 1000ms = 1s

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
            renderTimer(i);
        }
    }
    startTimer();
}