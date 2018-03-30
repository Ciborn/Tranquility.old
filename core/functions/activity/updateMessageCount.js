const poolQuery = require('./../database/poolQuery');
const isEmpty = require('./../utils/isEmpty');
const Discord = require('discord.js');
const generateDateHour = require('./../utils/generateDateHour');
module.exports = function(message) {
    const messageData = require('./checkMessageData')(message);
    var response = null;
    var goldRewards = 2;
    if (messageData != null) {
        response = messageData.id;
        goldRewards = messageData.gold;
    }
    if (message.author.bot != true) {
        poolQuery(`SELECT * FROM activity WHERE userId=${message.author.id}`).then(result => {
            if (!isEmpty(result)) {
                const msgCount = JSON.parse(result[0].msgCount);
                var msgCountModel = {
                    total: msgCount.total+1,
                    channels: msgCount.channels,
                    messagesTypes: {
                        chatting: msgCount.messagesTypes.chatting,
                        bots: msgCount.messagesTypes.bots
                    }
                };
                if (response != null) {
                    if (msgCountModel.messagesTypes.bots[response] == null) {
                        msgCountModel.messagesTypes.bots[response] = 1;
                    } else {
                        msgCountModel.messagesTypes.bots[response]++;
                    }
                } else {
                    msgCountModel.messagesTypes.chatting++;
                }

                if (msgCountModel.channels[message.channel.id] == null) {
                    msgCountModel.channels[message.channel.id] = 1;
                } else {
                    msgCountModel.channels[message.channel.id]++;
                }

                // For old accounts
                if (typeof msgCount.timestamps == 'undefined') {
                    msgCountModel.timestamps = {};
                } else {
                    msgCountModel.timestamps = msgCount.timestamps;
                }

                if (msgCountModel.timestamps[generateDateHour(new Date())] == null) {
                    msgCountModel.timestamps[generateDateHour(new Date())] = 1;
                } else {
                    msgCountModel.timestamps[generateDateHour(new Date())]++;
                }
                poolQuery(`UPDATE activity SET msgCount='${JSON.stringify(msgCountModel)}', username='${message.author.username}', lastMsgId='${message.id}', lastMsgChannelId='${message.channel.id}', lastMsgTimestamp=${message.createdTimestamp} WHERE userId=${message.author.id}`);
            } else {
                var msgCountModel = {
                    total: 1,
                    channels: {},
                    messagesTypes: {
                        chatting: 0,
                        bots: {}
                    },
                    timestamps: {}
                };
                msgCountModel.channels[message.channel.id] = 1;
                msgCountModel.timestamps[generateDateHour(new Date())] = 1;
                if (response != null) {
                    msgCountModel.messagesTypes.bots[response] = 1;
                }
                poolQuery(`INSERT INTO activity (userId, username, lastMsgId, lastMsgChannelId, lastMsgTimestamp, msgCount) VALUES ('${message.author.id}', '${message.author.username}', '${message.id}', '${message.channel.id}', ${message.createdTimestamp}, '${JSON.stringify(msgCountModel)}')`);
            }
        });

        poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`).then(result => {
            if (isEmpty(result)) {
                poolQuery(`INSERT INTO profiles (userId, xp, gold, items, settings, lastUpdateTimestamp) VALUES ('${message.author.id}', 26, ${goldRewards}, '${JSON.stringify({})}', '${JSON.stringify({})}', ${new Date().getTime()})`);
            } else {
                var xpReward = 0;
                if (new Date().getTime() - result[0].lastUpdateTimestamp <= 4000) {
                    xpReward = 0;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 6000) {
                    xpReward = 1;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 10000) {
                    xpReward = 2;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 15000) {
                    xpReward = 4;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 20000) {
                    xpReward = 6;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 30000) {
                    xpReward = 10;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 45000) {
                    xpReward = 17;
                } else if (new Date().getTime() - result[0].lastUpdateTimestamp <= 60000) {
                    xpReward = 26;
                }
                poolQuery(`UPDATE profiles SET xp=${result[0].xp+xpReward}, gold=${result[0].gold+goldRewards}, lastUpdateTimestamp=${new Date().getTime()} WHERE userId='${message.author.id}'`);
            }
        })
    }
}