const isEmpty = require('./../functions/utils/isEmpty');
module.exports = function(bot, message, args) {
    if (args.length >= 2) {
        var supportedUserWords = ['user', 'profile', 'player'];
        if (supportedUserWords.indexOf(args[0]) != -1) {
            require('./osu/profile')(bot, message, args);
        } else if (args.indexOf('best') != -1) {
            require('./osu/best')(bot, message, args);
        } else {
            message.channel.send(`You requested informations that I can not retrieve for now, **${message.author.username}**.`);
        }
    } else {
        message.channel.send(`Sorry **${message.author.username}**, but you did not specify enough arguments.`);
    }
}