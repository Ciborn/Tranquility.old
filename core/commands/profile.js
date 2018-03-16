const isEmpty = require('./../functions/utils/isEmpty');
const showProfile = require('./../functions/activity/showProfile');
module.exports = function(bot, message, args) {
    if (message.mentions.members.size > 0) {

    } else if (!isEmpty(args)) {

    } else {
        showProfile(bot, message.author.id).then(embed => {
            embed = embed.setColor(message.member.displayColor);
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
}