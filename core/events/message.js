const config = require('./../../config.json');
const Discord = require('discord.js');
module.exports = async function(bot, message) {
    var allowedAccess = true;
    if (['320933389513523220', '310296184436817930'].indexOf(message.author.id) != -1) {
        allowedAccess = true;
    } else if (message.content.indexOf('/') != -1 || message.content.indexOf('\\') != -1) {
        allowedAccess = false;
    }
    if (message.content.indexOf(config.app.prefix) == 0) {
        if (allowedAccess == false) {
            message.channel.send(`**${message.author.username}**, your message has invalid characters. Please retry without them.`);
        } else {
            const args = message.content.slice(config.app.prefix).trim().split(/ +/g);
            const command = args.shift().toLowerCase().replace(config.app.prefix, '');
            try {
                require(`./../commands/${command}`)(bot, message, args);
            } catch (err) {
                if (message.author.id == '320933389513523220') {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(bot.user.username, bot.user.avatarURL)
                        .setTitle('An error occured.')
                        .setDescription(`pls fix that shitty dev\n\`\`\`${err}\`\`\``)
                        .setColor('RED');
                    message.channel.send({embed});
                }
            }
        }
    }

    if (message.guild.id == '379115766127001600') {
        require('./../functions/activity/updateMessageCount')(message);
    }
}