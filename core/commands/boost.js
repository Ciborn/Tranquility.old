const Discord = require('discord.js');
const isAdmin = require('./../functions/admin/isAdmin');
const isEmpty = require('./../functions/utils/isEmpty');
const poolQuery = require('./../functions/database/poolQuery');
const convertDate = require('./../functions/time/convertDate');
const convertDuration = require('./../functions/time/convertDuration');
const mostImportantDuration = require('./../functions/time/mostImportantDuration');
const getStringDuration = require('./../functions/time/getStringDuration');
module.exports = async function(bot, message, args) {
    if (!isEmpty(args)) {
        if (args[0].indexOf('buy') != -1) {

        } else if (args[0].indexOf('add') != -1) {
            if (isAdmin(message.author.id)) {
                const supportedBoosts = ['xp', 'gold'];

                if (message.mentions.members.size == 1) {
                    args[1] = message.mentions.members.first().id;
                }

                if (supportedBoosts.indexOf(args[2]) != -1) {
                    const result = await poolQuery(`SELECT * FROM profiles WHERE userId='${args[1]}'`);
                    var gotBoosts = JSON.parse(result[0].boosts);
                    gotBoosts[`${args[2]}_${args[3]}`] = gotBoosts[`${args[2]}_${args[3]}`] != undefined ? gotBoosts[`${args[2]}_${args[3]}`] + parseInt(convertDuration(args[4])) : new Date().getTime() + parseInt(convertDuration(args[4]));
                    poolQuery(`UPDATE profiles SET boosts='${JSON.stringify(gotBoosts)}' WHERE userId='${args[1]}'`).then(succeed => {
                        const embed = new Discord.RichEmbed()
                            .setTitle('Boost Successfully Given')
                            .setDescription(`A **${args[2]}** boost of **${args[3]}**%, ending **${convertDate(new Date(new Date().getTime() + parseInt(convertDuration(args[4]))), '$p/$d/$y $h:$m')} UTC** has been given to the user **${args[1]}**.`)
                            .setFooter(message.author.username, message.author.avatarURL)
                            .setColor('GREEN');
                        message.channel.send({embed});
                    }).catch(err => {
                        throw err;
                    });
                }
            } else {
                message.channel.send(`You are not part of the development team of Tranquility, **${message.author.username}**.`);
            }
        } else {
            message.channel.send(`There is a problem with your args, **${message.author.username}**.`);
        }
    } else {
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
}