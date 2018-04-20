module.exports = function(string) {
    const durations = string.split(' ');
    var totalDuration = 0;

    durations.forEach(element => {
        if (element.indexOf('s') != -1) {
            totalDuration += parseInt(element.replace('s', '')) * 1000;
        } else if (element.indexOf('m') != -1) {
            totalDuration += parseInt(element.replace('m', '')) * 60000;
        } else if (element.indexOf('h') != -1) {
            totalDuration += parseInt(element.replace('h', '')) * 3600000;
        } else if (element.indexOf('d') != -1) {
            totalDuration += parseInt(element.replace('d', '')) * 86400000;
        }
    });

    return totalDuration;
}