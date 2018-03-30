const computeLevel = require('./../functions/utils/computeLevel');
const poolQuery = require('./../functions/database/poolQuery');
const userIndex = require('./../functions/activity/returnProfileLead');
const config = require('./../../config.json');
const numeral = require('numeral');
const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`).then(result => {
        userIndex(message.author.id, (index, total) => {
            var rank = '';
            if (index * 100 / total <= 2) {
                rank = 'S+';
            } else if (index * 100 / total <= 5) {
                rank = 'S';
            } else if (index * 100 / total <= 10) {
                rank = 'S-';
            } else if (index * 100 / total <= 25) {
                rank = 'A';
            } else if (index * 100 / total <= 45) {
                rank = 'B';
            } else if (index * 100 / total <= 70) {
                rank = 'C';
            } else if (index * 100 / total <= 100) {
                rank = 'D';
            }

            const embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`Activity Profile`)
                .addField('Ranking', `**\`\`[${rank}]\`\`** **#${index}** / ${total}`, true)
                .addField('Ether', numeral(result[0].gold).format('0,0'), true)
                .addField('Level', computeLevel(result[0].xp)[0], true)
                .addField('Experience', `${numeral(result[0].xp).format('0,0')} XP / ${numeral(Math.floor(50 + Math.pow((computeLevel(result[0].xp)[0]+1) * 20, 1.55))).format('0,0')} XP`, true)
                .setColor(message.member.displayColor)
                .setFooter(`View detailled statistics about your activity by checking ${config.app.prefix}stats!`);
            message.channel.send({embed});
        })
    });
}