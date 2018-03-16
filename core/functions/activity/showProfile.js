const Discord = require('discord.js');
const poolQuery = require('./../database/poolQuery');
const convertDate = require('./../utils/convertDate');
module.exports = function(bot, userId) {
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
                const embed = new Discord.RichEmbed()
                    .setAuthor(user.username, user.avatarURL)
                    .setTitle(`User Activity Profile`)
                    .addField(`Message Count`, data.msgCount)
                    .setFooter(`Last Message sent`)
                    .setTimestamp(new Date(data.lastMsgTimestamp))
                resolve(embed);
            })
        }).catch(err => {
            reject(err);
        })
    })
}