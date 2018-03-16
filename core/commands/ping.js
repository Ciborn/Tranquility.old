const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    const embed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .addField('WebSocket Heartbeat', `${Math.floor(bot.ping)} ms`, true)
        .addField('Host Ping', `Computing...`, true)
        .setColor('BLUE');
    message.channel.send({embed}).then(function(newMessage) {
        const ping = newMessage.createdTimestamp - message.createdTimestamp;
        const embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .addField('WebSocket Heartbeat', `${Math.floor(bot.ping)} ms`, true)
            .addField('Host Ping', `${ping} ms`, true)
            .setColor('BLUE');
        newMessage.edit({embed});
    }).catch(function(error) {
        const embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle('An error occured.')
            .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${error}\`\`\``)
            .setColor('RED');
        message.channel.send({embed});
    })
}