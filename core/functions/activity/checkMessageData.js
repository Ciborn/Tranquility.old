const recognizedBots = require('./../../data/recognizedBots.json');
module.exports = function(message) {
    var response = null;
    Object.keys(recognizedBots).forEach(element => {
        if (message.content.indexOf(element) == 0) {
            response = recognizedBots[element];
        }
    })
    return response;
}