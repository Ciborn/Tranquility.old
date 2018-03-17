const isEmpty = require('./../functions/utils/isEmpty');
const showProfile = require('./../functions/activity/showProfile');
const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    const sendProfile = function(bot, userId) {
        showProfile(bot, userId).then(embed => {
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

    if (message.mentions.members.size > 0) {
        sendProfile(bot, message.mentions.members.first().user.id);
    } else if (!isEmpty(args)) {
        bot.fetchUser(args[0]).then(user => {
            sendProfile(bot, user.id);
        }).catch(err => {
            message.channel.send(`Sorry **${message.author.username}**, but the user ID you gave doesn't match with a valid user.`);
        })
    } else {
        sendProfile(bot, message.author.id);
    }
}