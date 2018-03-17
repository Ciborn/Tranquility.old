const Discord = require('discord.js');
const config = require('./../../config.json');
module.exports = function(bot, message, args) {
    var embed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle(`Bot Help Page`)
        .addField(`General`, `**${config.app.prefix}lead** : Show server activity leaderboard\n**${config.app.prefix}profile** : Show user activity informations`)
        .addField(`Other`, `**${config.app.prefix}help** : Bot Help Page\n**${config.app.prefix}info** : Informations on the bot\n**${config.app.prefix}ping** : Show bot latency`)
        .setColor('BLUE');
    if (['320933389513523220', '310296184436817930'].indexOf(message.author.id) != -1) {
        embed.addField(`Admin`, `**${config.app.prefix}eval** : Evaluate node.js code\n**${config.app.prefix}query** : Query the database\n**${config.app.prefix}reset** : Reset activity user's profile`);
    }
    message.channel.send({embed});
}