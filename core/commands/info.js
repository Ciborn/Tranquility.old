const Discord = require('discord.js');
const config = require('./../../config.json');
module.exports = function(bot, message, args) {
    const embed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Informations on the Tranquility bot')
        .addField(`Developers`, `<@320933389513523220>\n<@310296184436817930>`, true)
        .addField(`Host`, `**Raspberry Pi 3** at **Ciborn**'s home`, true)
        .addField(`Prefix`, `**${config.app.prefix}**\n*Chosen by Nightmare, don't blame me - Ciborn*`, true)
        .setThumbnail(message.guild.iconURL)
        .setColor(`BLUE`);
    message.channel.send({embed: embed});
}