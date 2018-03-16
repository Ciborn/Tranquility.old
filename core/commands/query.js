const poolQuery = require('./../functions/database/poolQuery');
const util = require('util');
module.exports = function(bot, message, args) {
    if (['320933389513523220', '310296184436817930'].indexOf(message.author.id) != -1) {
        try {
            messageContentLengthReduced = message.content.length - 8;
            poolQuery(message.content.substr(8, messageContentLengthReduced)).then(result => {
                message.channel.send(util.inspect(result, false, null), {code:"xl"});
            }).catch(err => {
                message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
            })
        } catch (err) {
            message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
        }
    } else {
        const embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle(`Developer Command`)
            .setColor(`RED`)
            .setDescription(`You are not allowed to use this command because you are not recognized as a developer of this bot.`);
        message.channel.send({embed});
    }
}