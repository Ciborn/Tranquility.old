const Discord = require('discord.js');
const poolQuery = require('./../database/poolQuery');
const convertDate = require('./../utils/convertDate');
const userIndex = require('./returnPlaceInLead');
module.exports = function(bot, userId, limit) {
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
            bot.fetchUser(userId).then(user => {
                const msgCount = JSON.parse(data.msgCount);

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
                        embedChannelsList += `<#${bot.guilds.find('id', '379115766127001600').channels.find('id', key).id}> : **${value}** messages\n`;
                    }
                }

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
                        embedBotsList += `<@${bot.guilds.find('id', '379115766127001600').members.find('id', key).id}> : **${value}** messages\n`;
                    }
                }

                userIndex(user.id, index => {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(`#${index} - ${user.username}`, user.avatarURL)
                        .setTitle(`User Activity Profile`)
                        .addField(`Message Count`, `**${msgCount.total}** messages`, true)
                        .addField(`Chatting Messages Count`, `**${msgCount.messagesTypes.chatting}** messages`, true)
                        .addField(`Bots Messages Count`, `**${botsMessagesCount}** messages`, true)
                        .addField(`Most Active Channels`, embedChannelsList, true)
                        .addField(`Most Used Bots`, embedBotsList, true)
                        .setFooter(`Last Message sent`)
                        .setTimestamp(new Date(data.lastMsgTimestamp))
                    resolve(embed);
                })
            })
        }).catch(err => {
            reject(err);
        })
    })
}