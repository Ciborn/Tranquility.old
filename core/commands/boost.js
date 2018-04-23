const isEmpty = require('./../functions/utils/isEmpty');
module.exports = async function(bot, message, args) {
    if (!isEmpty(args)) {
        if (args[0].indexOf('buy') != -1) {

        } else if (args[0].indexOf('add') != -1) {
            require('./boost/add')(bot, message, args);
        } else {
            message.channel.send(`There is a problem with your args, **${message.author.username}**.`);
        }
    } else {
        require('./boost/view')(bot, message, args);
    }
}