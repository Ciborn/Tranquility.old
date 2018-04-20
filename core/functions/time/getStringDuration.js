module.exports = function(duration, string) {
    var totalDuration = duration;
    if (string.indexOf('$d') != -1) {
        var days = 0;
        while (totalDuration / 86400000 >= 1) {
            days++;
            totalDuration -= 86400000;
        }
        string = string.replace('$d', days);
    }

    if (string.indexOf('$h') != -1) {
        var hours = 0;
        while (totalDuration / 3600000 >= 1) {
            hours++;
            totalDuration -= 3600000;
        }
        string = string.replace('$h', hours);
    }

    if (string.indexOf('$m') != -1) {
        var minutes = 0;
        while (totalDuration / 60000 >= 1) {
            minutes++;
            totalDuration -= 60000;
        }
        string = string.replace('$m', minutes);
    }

    if (string.indexOf('$s') != -1) {
        var seconds = 0;
        while (totalDuration / 1000 >= 1) {
            seconds++;
            totalDuration -= 1000;
        }
        string = string.replace('$s', seconds);
    }

    return [string, [days, hours, minutes, seconds]];
}