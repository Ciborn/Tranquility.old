const isEmpty = require('./../functions/utils/isEmpty');
const showProfile = require('./../functions/activity/showProfile');
const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    const sendProfile = function(bot, userId, limit) {
        showProfile(bot, userId, limit).then(embed => {
            embed = embed.setColor(bot.guilds.find('id', '379115766127001600').members.find('id', userId).highestRole.color);
            message.channel.send(embed);
        }).catch(err => {
            const embed = new Discord.RichEmbed()
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setTitle('An error occured.')
                .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        })
    }

    if (isEmpty(args)) {
        sendProfile(bot, message.author.id, 5);
    } else {
        if (args.length == 1) {
            if (args[0] == '-a') {
                sendProfile(bot, message.author.id, 1000);
            } else if (message.mentions.members.size == 1) {
                sendProfile(bot, message.mentions.members.first().user.id, 5);
            } else {
                bot.fetchUser(args[0]).then(user => {
                    sendProfile(bot, user.id, 5);
                }).catch(err => {
                    message.channel.send(`Sorry **${message.author.username}**, but the user ID you gave doesn't match with a valid user.`);
                })
            }
        } else if (args.length == 2) {
            if (args.indexOf('-l') != -1) {
                if (typeof parseInt(args[args.indexOf('-l')+1]) == 'number') {
                    sendProfile(bot, message.author.id, parseInt(args[args.indexOf('-l')+1]));
                }
            }
        } else if (args.length == 3) {
            var limit = 5;
            if (args.indexOf('-a') != -1) {
                limit = 1000;

                if (args.indexOf('-u') != -1) {
                    if (message.mentions.members.size == 1) {
                        sendProfile(bot, message.mentions.members.first().user.id, limit);
                    } else {
                        bot.fetchUser(args[args.indexOf('-u')+1]).then(user => {
                            sendProfile(bot, args[args.indexOf('-u')+1], limit);
                        }).catch(err => {
                            message.channel.send(`Sorry **${message.author.username}**, but **${args[args.indexOf('-u')+1]}** doesn't match with a valid user.`);
                        })
                    }
                } else {
                    message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
                }
            } else {
                message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
            }
        } else if (args.length == 4) {
            var limit = 5;
            if (args.indexOf("-l") != -1) {
                if (typeof parseInt(args.indexOf('-l')+1) == 'number') {
                    limit = args[args.indexOf('-l')+1];
                }

                if (args.indexOf('-u') != -1) {
                    if (message.mentions.members.size == 1) {
                        sendProfile(bot, message.mentions.members.first().user.id, limit);
                    } else {
                        bot.fetchUser(args[args.indexOf('-u')+1]).then(user => {
                            sendProfile(bot, args[args.indexOf('-u')+1], limit);
                        }).catch(err => {
                            message.channel.send(`Sorry **${message.author.username}**, but **${args[args.indexOf('-u')+1]}** doesn't match with a valid user.`);
                        })
                    }
                } else {
                    message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
                }
            } else {
                message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
            }
        } else {
            message.channel.send(`It seems that there is a problem with your args, **${message.author.username}**. Please review them before retrying.`);
        }
    }
}