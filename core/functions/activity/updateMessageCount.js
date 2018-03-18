const poolQuery = require('./../database/poolQuery');
const isEmpty = require('./../utils/isEmpty');
const Discord = require('discord.js');
const generateDateHour = require('./../utils/generateDateHour');
module.exports = function(message) {
    const response = require('./checkMessageData')(message);
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
    }
}