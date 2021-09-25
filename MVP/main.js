// Audio
const alarm = new Audio("media/alarm.wav");

// Show/Hide
function show(elem) {
    document.getElementById(elem).classList.remove("hide");
    document.getElementById(elem).classList.add("show");
}

function hide(elem) {
    document.getElementById(elem).classList.remove("show");
    document.getElementById(elem).classList.add("hide");
}

// Timers
// temporary timer settings
var f_minutes = "25";
var s_minutes = "05";
var l_minutes = "15";
var seconds = "00";
var type = "focus"

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

renderTimer(type);

// Controls
document.getElementById("start-button").onclick = function startTimer() {
    hide("start-button");
    show("pause-button");

    if (type == "focus") {
        var mins = parseInt(f_minutes);
    } else if (type == "short") {
        var mins = parseInt(s_minutes);
    } else if (type == "long") {
        var mins = parseInt(l_minutes);
    }

    var secs = 60;
    document.getElementById("seconds").innerHTML = "0" + 0; // to render initial timer count

    var secs_interval = setInterval(function() {
        secs--; // decrement seconds by one
        if (secs < 10) {
            secs = "0" + secs;
        }

        document.getElementById("minutes").innerHTML = mins - 1;
        document.getElementById("seconds").innerHTML = secs;  
    
        if (secs <= 0) {
            secs = 60; // reset seconds

            mins--; // decrement minutes by one
            if (mins < 10) {
                mins = "0" + mins;
            }

            if (mins <= 0) {
                clearInterval(secs_interval);
                document.getElementById("minutes").innerHTML = mins; // to render final timer count
                alarm.play();
            }
        }
    }, 100); // test interval; actual interval = 1000ms = 1s
}

startTimer("focus");