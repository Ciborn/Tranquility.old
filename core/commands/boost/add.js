const isAdmin = require('./../../functions/admin/isAdmin');
const poolQuery = require('./../../functions/database/poolQuery');
const convertDate = require('./../../functions/time/convertDate');
const convertDuration = require('./../../functions/time/convertDuration');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
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
}