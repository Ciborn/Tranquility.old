const poolQuery = require('./../functions/database/poolQuery');
const Discord = require('discord.js');
const isEmpty = require('./../functions/utils/isEmpty');
module.exports = function(bot, message, args) {
    var limit = 10;
    if (!isEmpty(args)) {
        if (args[0] == '-a') {
            limit = 999;
        } else {
            limit = args[0];
        }
    }
    poolQuery(`SELECT * FROM activity`).then(result => {
        var allMembers = new Map();
        var embedMembersList = '';
        result.forEach(element => {
            allMembers.set(element.userId, JSON.parse(element.msgCount).total);
        });
        
        allMembers[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }

        var membersLimit = 0;
        try {
            for (let [key, value] of allMembers) {
                if (membersLimit < limit) {
                    let badge = '';
                    if (membersLimit == 0) {
                        embedMembersList += `**Top 3**\n`;
                        badge = `:first_place:`;
                    } else if (membersLimit == 1) {
                        badge = ':second_place:'
                    } else if (membersLimit == 2) {
                        badge = ':third_place:'
                    } else if (membersLimit == 3) {
                        embedMembersList += `\n**Top 10**\n`;
                        badge = `\`\`${membersLimit+1}\`\`.`;
                    } else if (membersLimit == 10) {
                        embedMembersList += `\n`;
                        badge = `\`\`${membersLimit+1}\`\`.`;
                    } else {
                        badge = `\`\`${membersLimit+1}\`\`.`;
                    }
                    membersLimit++;
                    embedMembersList += `**${badge}** <@${key}> : **${value}** messages\n`;
                }
            }
        } catch (err) {
            const embed = new Discord.RichEmbed()
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setTitle('An error occured.')
                .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle(`${message.guild.name} Activity Leaderboard`)
            .setDescription(embedMembersList)
            .setColor('BLUE');
        message.channel.send({embed});
    }).catch(err => {

    })
}