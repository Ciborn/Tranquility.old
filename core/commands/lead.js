const poolQuery = require('./../functions/database/poolQuery');
const Discord = require('discord.js');
const isEmpty = require('./../functions/utils/isEmpty');
const objectValuesSum = require('./../functions/utils/objectValuesSum');
module.exports = async function(bot, message, args) {
    var limit = 10;
    var leadType = 'total';
    var leadTypeObject = 0;
    var typeName = 'Total Messages';
    var phoneMode = false;
    if (!isEmpty(args)) {
        if (args.indexOf('-a') != -1) {
            limit = 30;
        } else if (args.indexOf('-l') != -1) {
            if (args[args.indexOf('-l')+1] > 30) {
                limit = 30;
            } else {
                limit = args[args.indexOf('-l')+1];
            }
        }

        if (args.indexOf('-p') != -1) {
            phoneMode = true;
        }

        if (args.indexOf('-t') != -1) {
            if (typeof args[args.indexOf('-t')+2] == 'string') {
                if (args[args.indexOf('-t')+1].indexOf('c') != -1) {
                    leadType = 'c';
                    if (message.mentions.channels.size == 1) {
                        leadTypeObject = message.mentions.channels.first().id;
                        typeName = `Messages in #${message.mentions.channels.first().name}`;
                    }
                } else if (args[args.indexOf('-t')+1].indexOf('b') != -1) {
                    leadType = 'b';
                    if (message.mentions.members.size == 1) {
                        leadTypeObject = message.mentions.members.first().id;
                        typeName = `Bot Usage of ${message.mentions.members.first().user.username}`;
                    } else {
                        bot.fetchUser(args[args.indexOf('-t')+2]).then(user => {
                            leadTypeObject = user.id;
                            typeName = `Bot Usage of ${user.username}`;
                        });
                    }
                }
            } else {
                if (args[args.indexOf('-t')+1].indexOf('t') != -1) {
                    leadType = 'total';
                } else if (args[args.indexOf('-t')+1].indexOf('c') != -1) {
                    leadType = 'chat';
                    typeName = 'Total Chatting Messages';
                } else if (args[args.indexOf('-t')+1].indexOf('b') != -1) {
                    leadType = 'bots';
                    typeName = 'Total Bots Usage Messages';
                }
            }

            if (message.mentions.channels.size > 0) {
                leadType = 'c';
                leadTypeObject = message.mentions.channels.first().id;
                typeName = `Messages in #${message.mentions.channels.first().name}`;
            } else if (message.mentions.members.size > 0) {
                leadType = 'b';
                leadTypeObject = message.mentions.members.first().id;
                typeName = `Bot Usage of ${message.mentions.members.first().user.username}`;
            } else if (args[args.indexOf('-t')+1].length > 15) {
                leadType = 'b';
                const user = await bot.fetchUser(args[args.indexOf('-t')+1]);
                leadTypeObject = user.id;
                typeName = `Bot Usage of ${user.username}`;
            } else if (args[args.indexOf('-t')+1].indexOf('c') != -1) {
                leadType = 'chat';
                typeName = 'Total Chatting Messages';
            } else if (args[args.indexOf('-t')+1].indexOf('b') != -1) {
                leadType = 'bots';
                typeName = 'Total Bots Usage Messages';
            }
        }
    }

    poolQuery(`SELECT * FROM activity`).then(result => {
        var allMembers = new Map();
        var embedMembersList = '';
        result.forEach(element => {
            if (leadType == 'total') {
                allMembers.set(element.userId, JSON.parse(element.msgCount).total);
            } else if (leadType == 'chat') {
                allMembers.set(element.userId, JSON.parse(element.msgCount).messagesTypes.chatting);
            } else if (leadType == 'bots') {
                allMembers.set(element.userId, objectValuesSum(JSON.parse(element.msgCount).messagesTypes.bots));
            } else if (leadType == 'c') {
                if (JSON.parse(element.msgCount).channels[leadTypeObject] != undefined) {
                    allMembers.set(element.userId, JSON.parse(element.msgCount).channels[leadTypeObject]);
                }
            } else if (leadType == 'b') {
                if (JSON.parse(element.msgCount).messagesTypes.bots[leadTypeObject] != undefined) {
                    allMembers.set(element.userId, JSON.parse(element.msgCount).messagesTypes.bots[leadTypeObject]);
                }
            }
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
                    if (phoneMode == true) {
                        embedMembersList += `**${badge}** **${message.guild.members.find('id', key).user.username}** : **${value}** messages\n`;
                    } else {
                        embedMembersList += `**${badge}** <@${key}> : **${value}** messages\n`;
                    }
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

        if (membersLimit == 0) {
            message.channel.send(`Unfortunately **${message.author.username}**, there is nothing to show.`);
        } else {
            const embed = new Discord.RichEmbed()
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setTitle(`${message.guild.name} Activity Leaderboard | ${typeName}`)
                .setDescription(embedMembersList)
                .setColor('BLUE');
            message.channel.send({embed}).catch(err => {
                message.channel.send(`The leaderboard you asked with your args seems to be too long to send, **${message.author.username}**, please retry with a lower limit.`)
            })
        }
    }).catch(err => {

    })
}