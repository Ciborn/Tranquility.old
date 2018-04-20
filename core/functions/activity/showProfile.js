const Discord = require('discord.js');
const poolQuery = require('./../database/poolQuery');
const convertDate = require('./../time/convertDate');
const isEmpty = require('./../../functions/utils/isEmpty');
const userIndex = require('./returnPlaceInLead');
module.exports = function(bot, userId, limit, showTime, phoneMode) {
    const returnData = function(userId) {
        return new Promise((resolve, reject) => {
            poolQuery(`SELECT * FROM activity WHERE userId=${userId}`).then(result => {
                resolve(result[0]);
            }).catch(err => {
                reject(err);
            })
        })
    }

    return new Promise((resolve, reject) => {
        returnData(userId).then(data => {
            if (!isEmpty(data)) {
                bot.fetchUser(userId).then(user => {
                    const msgCount = JSON.parse(data.msgCount);
    
                    // Channels
                    var channelsList = new Map();
                    var embedChannelsList = '';
                    Object.entries(msgCount.channels).forEach(element => {
                        channelsList.set(element[0], msgCount.channels[element[0]]);
                    })
                    channelsList[Symbol.iterator] = function* () {
                        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
                    }
                    var channelsListLimit = 0;
                    for (let [key, value] of channelsList) {
                        if (channelsListLimit < limit) {
                            channelsListLimit++;
                            if (phoneMode == true) {
                                if (bot.guilds.find('id', '379115766127001600').channels.find('id', key) != null) {
                                    embedChannelsList += `**#${bot.guilds.find('id', '379115766127001600').channels.find('id', key).name}** : **${value}** messages\n`;
                                } else {
                                    delete msgCount.channels[key];
                                    poolQuery(`UPDATE activity SET msgCount='${JSON.stringify(msgCount)}' WHERE userId='${userId}'`);
                                }
                            } else {
                                if (bot.guilds.find('id', '379115766127001600').channels.find('id', key) != null) {
                                    embedChannelsList += `**<#${bot.guilds.find('id', '379115766127001600').channels.find('id', key).id}>** : **${value}** messages\n`;
                                } else {
                                    delete msgCount.channels[key];
                                    poolQuery(`UPDATE activity SET msgCount='${JSON.stringify(msgCount)}' WHERE userId='${userId}'`);
                                }
                            }
                        }
                    }
    
                    // Bots Usage
                    var botsList = new Map();
                    var embedBotsList = '';
                    var botsMessagesCount = 0;
                    Object.entries(msgCount.messagesTypes.bots).forEach(element => {
                        botsList.set(element[0], msgCount.messagesTypes.bots[element[0]]);
                        botsMessagesCount += msgCount.messagesTypes.bots[element[0]];
                    })
                    botsList[Symbol.iterator] = function* () {
                        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
                    }
                    var botsListLimit = 0;
                    for (let [key, value] of botsList) {
                        if (botsListLimit < limit) {
                            botsListLimit++;
                            if (phoneMode == true) {
                                if (bot.guilds.find('id', '379115766127001600').members.find('id', key) != null) {
                                    embedBotsList += `**${bot.guilds.find('id', '379115766127001600').members.find('id', key).user.username}** : **${value}** messages\n`;
                                } else {
                                    delete msgCount.messagesTypes.bots[key];
                                    poolQuery(`UPDATE activity SET msgCount='${JSON.stringify(msgCount)}' WHERE userId='${userId}'`);
                                }
                            } else {
                                if (bot.guilds.find('id', '379115766127001600').members.find('id', key) != null) {
                                    embedBotsList += `<@${bot.guilds.find('id', '379115766127001600').members.find('id', key).id}> : **${value}** messages\n`;
                                } else {
                                    delete msgCount.messagesTypes.bots[key];
                                    poolQuery(`UPDATE activity SET msgCount='${JSON.stringify(msgCount)}' WHERE userId='${userId}'`);
                                }
                            }
                        }
                    }

                    // By Hour
                    var embedTimeList = '';
                    if (showTime == true) {
                        var timeList = new Map();
                        var timeMessagesCount = 0;
                        Object.entries(msgCount.timestamps).forEach(element => {
                            timeList.set(element[0], msgCount.timestamps[element[0]]);
                            timeMessagesCount += msgCount.timestamps[element[0]];
                        })
                        timeList[Symbol.iterator] = function* () {
                            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
                        }
                        var timeListLimit = 0;
                        for (let [key, value] of timeList) {
                            if (timeListLimit < limit) {
                                timeListLimit++;
                                const splittedDate = key.split('-');
                                embedTimeList += `\`\`${splittedDate[1]}/${splittedDate[2]}/${splittedDate[0]} ${splittedDate[3]}:00\`\` : **${value}** messages\n`;
                            }
                        }
                    }
    
                    userIndex(user.id, index => {
                        var embed = new Discord.RichEmbed()
                            .setAuthor(`#${index} - ${user.username}`, user.avatarURL)
                            .setTitle(`User Activity Statistics`)
                            .addField(`Total Message Count`, `**${msgCount.total}** messages`, true)
                            .addField(`Chatting Messages Count`, `**${msgCount.messagesTypes.chatting}** messages`, true)
                            .addField(`Bots Usage Messages Count`, `**${botsMessagesCount}** messages`, true)
                            .addField(`Most Active Channels`, embedChannelsList, true)
                            .setFooter(`Last Message sent`)
                            .setTimestamp(new Date(data.lastMsgTimestamp))
                        resolve(embed);
    
                        if (embedBotsList != '') {
                            embed.addField(`Most Used Bots`, embedBotsList, true);
                        }

                        if (embedTimeList != '') {
                            embed.addField(`Most Active Hours (UTC)`, embedTimeList, true);
                        }
                    })
                })
            } else {
                resolve(`It seems that you asked the profile of an user who didn't talked yet, **%u**. Please try again later.`);
            }
        }).catch(err => {
            reject(err);
        })
    })
}