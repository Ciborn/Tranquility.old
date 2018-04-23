const Discord = require('discord.js');
const config = require('./../../config.json')
module.exports = async function(bot, message, args) {
    const exactTime = process.hrtime()[1];
    if (['320933389513523220', '310296184436817930'].indexOf(message.author.id) != -1) {
        try {
            const messageContentLengthReduced = message.content.length - 6;
            const code = message.content.substr(6, messageContentLengthReduced);
            let evaled = eval(code);
            
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }
            
            message.channel.send(`Execution Time : ${Math.floor((process.hrtime()[1] - exactTime)/1000)} µs\n\`\`\`xl\n${evaled}\`\`\``);
        } catch (err) {
            message.channel.send(`An error occured.\n\`\`\`xl\n${require('util').inspect(err, false, null)}\n\`\`\``);
        }
    } else {
        const embed = new Discord.RichtEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle(`Developer Command`)
            .setColor(`RED`)
            .setDescription(`You are no allowed to use this command because you are not recognized as a developer of this bot.`);
        message.channel.send({embed});
    }
}