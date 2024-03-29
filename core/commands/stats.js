const isEmpty = require('./../functions/utils/isEmpty');
const showProfile = require('./../functions/activity/showProfile');
const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    const sendProfile = function(bot, userId, limit, showTime, phoneMode) {
        showProfile(bot, userId, limit, showTime, phoneMode).then(embed => {
            if (typeof embed != 'string') {
                embed = embed.setColor(bot.guilds.find('id', '379115766127001600').members.find('id', userId).highestRole.color);
                message.channel.send(embed);
            } else {
                embed = embed.replace('%u', message.author.username);
                message.channel.send(embed);
            }
        }).catch(err => {
            const embed = new Discord.RichEmbed()
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setTitle('An error occured.')
                .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                .setColor('RED');
            message.channel.send(embed);
        })
    }

    if (isEmpty(args)) {
        sendProfile(bot, message.author.id, 5, false, false);
    } else {
        var user = message.author.id;
        var limit = 5;
        var errorSaid = false;
        var showTime = false;
        var phoneMode = false;
        if (args.length > 1) {
            if (args.indexOf('-l') != -1) {
                if (typeof args[args.indexOf('-l')+1] != 'undefined' && args[args.indexOf('-l')+1] != '-u' && args[args.indexOf('-l')+1].length < 3) {
                    limit = args[args.indexOf('-l')+1];
                } else {
                    if (errorSaid == false) {
                        message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
                        errorSaid = true;
                    }
                }
            }

            if (args.indexOf('-t') != -1) {
                showTime = true;
            }

            if (args.indexOf('-p') != -1) {
                phoneMode = true;
            }

            if (errorSaid == false) {
                if (args.indexOf('-a') != -1) {
                    limit = 1000;
                }
                if (args.indexOf('-u') != -1) {
                    if (args[args.indexOf('-u')+1].length > 15) {
                        if (message.mentions.members.size == 1) {
                            sendProfile(bot, message.mentions.members.first().user.id, limit, showTime, phoneMode);
                        } else {
                            bot.fetchUser(args[args.indexOf('-u')+1]).then(user => {
                                sendProfile(bot, args[args.indexOf('-u')+1], limit, showTime, phoneMode);
                            }).catch(err => {
                                message.channel.send(`Sorry **${message.author.username}**, but **${args[args.indexOf('-u')+1]}** doesn't match with a valid user.`);
                            })
                        }
                    } else {
                        if (errorSaid == false) {
                            message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
                            errorSaid = true;
                        }
                    }
                } else {
                    sendProfile(bot, message.author.id, limit, showTime, phoneMode);
                }
            }
        } else {
            if (args[0] == '-a') {
                sendProfile(bot, message.author.id, 1000, false, false);
            } else if (args[0] == '-t') {
                sendProfile(bot, message.author.id, limit, true, false);
            } else if (args[0] == '-p') {
                sendProfile(bot, message.author.id, limit, false, true);
            } else {
                if (args.indexOf('-l') != -1 || args.indexOf('-u') != -1) {
                    if (errorSaid == false) {
                        message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
                        errorSaid = true;
                    }
                } else {
                    if (message.mentions.members.size == 1) {
                        sendProfile(bot, message.mentions.members.first().user.id, limit, false);
                    } else {
                        bot.fetchUser(args[args.indexOf('-u')+1]).then(user => {
                            sendProfile(bot, args[args.indexOf('-u')+1], limit, false, false);
                        }).catch(err => {
                            message.channel.send(`Sorry **${message.author.username}**, but **${args[args.indexOf('-u')+1]}** doesn't match with a valid user.`);
                        })
                    }
                }
            }
        }
    }
}