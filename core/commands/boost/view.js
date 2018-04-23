const poolQuery = require('./../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const getStringDuration = require('./../../functions/time/getStringDuration');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
    const result = await poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`);
    const gotBoosts = JSON.parse(result[0].boosts);

    var currentBoosts = ``;

    if (isEmpty(gotBoosts)) {
        currentBoosts = `You do not have any boost, currently.`;
    } else {
        const returnRemainingTime = function(duration) {
            const remainingTime = getStringDuration(duration, '$d $h $m $s');
            var string = '';
            if (remainingTime[1][0] != 0) {
                string += `$dd$hh$mm$ss`;
            } else if (remainingTime[1][1] != 0) {
                string += `$hh$mm$ss`;
            } else if (remainingTime[1][2] != 0) {
                string += `$mm$ss`;
            } else {
                string += `$ss`;
            }
            return getStringDuration(duration, string.trim())[0];
        }

        for (let [key, value] of Object.entries(gotBoosts)) {
            if (key.indexOf('xp') == 0) {
                currentBoosts += `**+${key.split('_')[1]-100}%** - \`${returnRemainingTime(new Date(value).getTime() - new Date().getTime())}\` remaining - **XP Boost**\n`;
            } else if (key.indexOf('gold') == 0) {
                currentBoosts += `**+${key.split('_')[1]-100}%** - \`${returnRemainingTime(new Date(value).getTime() - new Date().getTime())}\` remaining - **Gold Boost**\n`;
            }
        }
    }
    
    const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField(`Current Boosts`, currentBoosts)
        .addField('Available Boosts', 'None for now')
        .setColor('BLUE');
    message.channel.send({embed});
    
}