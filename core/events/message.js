const config = require('./../../config.json');
const Discord = require('discord.js');
module.exports = async function(bot, message) {
    if (message.content.indexOf(config.app.prefix) == 0) {
        if (message.content.indexOf('/') != -1 || message.content.indexOf('\\') != -1) {
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

    require('./../functions/activity/updateMessageCount')(message);
}