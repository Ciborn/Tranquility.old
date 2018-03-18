const recognizedBots = require('./../../data/recognizedBots.json');
module.exports = function(message) {
    var response = null;
    Object.entries(recognizedBots).forEach(element => {
        if (message.content.indexOf(element[0]) == 0) {
            response = element[1];
        }
    })
    return response;
}