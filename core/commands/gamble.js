const poolQuery = require('./../functions/database/poolQuery');
const isEmpty = require('./../functions/utils/isEmpty');
const Discord = require('discord.js');
module.exports = function(bot, message, args) {
    message.channel.send(`This command has been disabled due to unknown bugs with the database.`);

    /*if (!isEmpty(args)) {
        const sendError = function(err) {
            const embed = new Discord.RichEmbed()
                .setTitle(`An error occured`)
                .setDescription(`An error occured while sending the result of your gambling. Please report the following to <@320933389513523220>.\n\`\`\`xl${err}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        }

        poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`).then(result => {
            if (args[0] <= result[0].gold) {
                const gamble = Math.round(Math.random() * 100);
                if (gamble <= 50) {
                    poolQuery(`UPDATE profiles SET gold=${result[0].gold-parseInt(args[0])} WHERE userId='${message.author.id}'`).then(success => {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setTitle(`Gambling ${args[0]}`)
                            .setDescription(`Unfortunately, you got **${gamble}** and you lost ${args[0]}. Try again!`)
                            .setColor('RED');
                        message.channel.send({embed});
                    }).catch(err => {
                        sendError(err);
                    })
                } else {
                    poolQuery(`UPDATE profiles SET gold=${result[0].gold+parseInt(args[0])} WHERE userId='${message.author.id}'`).then(success => {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setTitle(`Gambling ${args[0]}`)
                            .setDescription(`Nice, you got **${gamble}** and won ${args[0]}! I hope you will play again!`)
                            .setColor('GREEN');
                        message.channel.send({embed});
                    }).catch(err => {
                        sendError(err);
                    })
                }
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('Not Enough Ether')
                    .setDescription(`You wanted to gamble **${args[0]}** ether, but you only have **${result[0].gold}** ether. Retry with a smaller number!`)
                    .setColor('ORANGE');
                message.channel.send({embed});
            }
        })
    } else {
        const embed = new Discord.RichEmbed()
            .setTitle('Missing Args')
            .setDescription('You need to tell me how much you want to gamble.')
            .setColor('ORANGE');
        message.channel.send({embed});
    }*/
}