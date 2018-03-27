const recognizedBots = require('./../../data/recognizedBots.json');
module.exports = function(message) {
    var response = null;

    for (let [key, value] of Object.entries(recognizedBots)) {
        if (message.content.indexOf(key) == 0) {
            response = value;
        }
    }
    return response;
}