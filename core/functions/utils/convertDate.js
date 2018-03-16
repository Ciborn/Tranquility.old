// Convertir une date en heure lisible par un humain, UTC
// v1.0

module.exports = function(date, string) {
    if (string.indexOf('$n') != -1) {
        var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        string = string.replace('$n', `${days[date.getDay()]}`)
    }

    if (string.indexOf('$d') != -1) {
        string = string.replace('$d', date.getDate())
    }

    if (string.indexOf('$o') != -1) {
        var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        string = string.replace('$o', months[date.getMonth()])
    }

    if (string.indexOf('$y') != -1) {
        string = string.replace('$y', date.getFullYear())
    }
    
    if (string.indexOf('$h') != -1) {
        var stringAdd = '';
        if (date.getUTCHours().toString().length == 1) {
            stringAdd += '0';
        }
        stringAdd += date.getUTCHours();
        string = string.replace('$h', stringAdd);
    }
    
    if (string.indexOf('$m') != -1) {
        var stringAdd = '';
        if (date.getUTCMinutes().toString().length == 1) {
            stringAdd += '0';
        }
        stringAdd += date.getUTCMinutes();
        string = string.replace('$m', stringAdd);
    }
    
    if (string.indexOf('$s') != -1) {
        var stringAdd = '';
        if (date.getUTCSeconds().toString().length == 1) {
            stringAdd += '0';
        }
        stringAdd += date.getUTCSeconds();
        string = string.replace('$s', stringAdd);
    }
    
    return string;
}