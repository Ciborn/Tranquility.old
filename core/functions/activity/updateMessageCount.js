const poolQuery = require('./../database/poolQuery');
const isEmpty = require('./../utils/isEmpty');
module.exports = function(message) {
    if (message.author.bot != true) {
        poolQuery(`SELECT * FROM activity WHERE userId=${message.author.id}`).then(result => {
            if (!isEmpty(result)) {
                poolQuery(`UPDATE activity SET msgCount=${result[0].msgCount+1}, username='${message.author.username}', lastMsgId='${message.id}', lastMsgChannelId='${message.channel.id}', lastMsgTimestamp=${message.createdTimestamp} WHERE userId=${message.author.id}`);
            } else {
                poolQuery(`INSERT INTO activity (userId, username, lastMsgId, lastMsgChannelId, lastMsgTimestamp, msgCount) VALUES ('${message.author.id}', '${message.author.username}', '${message.id}', '${message.channel.id}', ${message.createdTimestamp}, 1)`);
            }
        });
    }
}