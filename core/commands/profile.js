const computeLevel = require('./../functions/utils/computeLevel');
const poolQuery = require('./../functions/database/poolQuery');
const userIndex = require('./../functions/activity/returnProfileLead');
const isEmpty = require('./../functions/utils/isEmpty');
const config = require('./../../config.json');
const numeral = require('numeral');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
    var user = message.author.id;
    if (!isEmpty(args)) {
        if (message.mentions.members.size > 0) {
            user = message.mentions.members.first().id;
        } else if (args[0].length > 15) {
            const discordUser = await bot.fetchUser(args[0]);
            user = discordUser.id;
        }
    }

    poolQuery(`SELECT * FROM profiles WHERE userId='${user}'`).then(result => {
        userIndex(user, (index, total) => {
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

            bot.fetchUser(user).then(member => {
                const embed = new Discord.RichEmbed()
                    .setAuthor(member.username, member.avatarURL)
                    .setTitle(`Activity Profile`)
                    .addField('Ranking', `**\`\`[${rank}]\`\`** **#${index}** / ${total}`, true)
                    .addField('Ether', numeral(result[0].gold).format('0,0'), true)
                    .addField('Level', computeLevel(result[0].xp)[0], true)
                    .addField('Experience', `${numeral(result[0].xp).format('0,0')} XP / ${numeral(Math.floor(50 + Math.pow((computeLevel(result[0].xp)[0]+1) * 20, 1.55))).format('0,0')} XP **(${Math.round(10 * (100 - (computeLevel(result[0].xp)[2] * 100 / computeLevel(result[0].xp)[1]) ))/10}%)**`, true)
                    .setColor(bot.guilds.find('id', '379115766127001600').members.find('id', user).displayColor)
                    .setFooter(`View detailled statistics about your activity by checking ${config.app.prefix}stats!`);
                message.channel.send({embed});
            })
        })
    });
}