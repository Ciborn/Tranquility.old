const isEmpty = require('./../functions/utils/isEmpty');
const poolQuery = require('./../functions/database/poolQuery');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
    if (['320933389513523220', '310296184436817930'].indexOf(message.author.id) != -1) {
        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
        if (!isEmpty(args)) {
            if (args[0].toLowerCase() == 'all') {
                const confirmationMessage = await message.channel.send(`Are you sure you want to reset the data of everyone, **${message.author.username}**? You won't be able to retrieve the old data back.`);
                confirmationMessage.react('✅');
                confirmationMessage.awaitReactions(filter, {time: 10000, max: 1}).then(async function(collected) {
                    if (!isEmpty(collected.array())) {
                        const processingMessage = await message.channel.send(`Deleting data...`);
                        poolQuery(`DELETE FROM activity`).then(result => {
                            processingMessage.edit(`Finished. Deleted data of **${result.affectedRows}** members.`);
                        })
                    } else {
                        message.channel.send(`**${message.author.username}**, the data deletion has been canceled.`);
                    }
                }).catch(err => {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(bot.user.username, bot.user.avatarURL)
                        .setTitle('An error occured.')
                        .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                        .setColor('RED');
                    message.channel.send({embed});
                })
            } else {
                var userId = 0;
                if (message.mentions.members.size > 0) {
                    userId = message.mentions.members.first().user.id;
                
                    const confirmationMessage = await message.channel.send(`Are you sure you want to reset the data of **${message.mentions.members.first().user.username}**, **${message.author.username}**? You won't be able to retrieve the old data back.`);
                    confirmationMessage.react('✅');
                    confirmationMessage.awaitReactions(filter, {time: 10000, max: 1}).then(async function(collected) {
                        if (!isEmpty(collected.array())) {
                            const processingMessage = await message.channel.send(`Deleting data...`);
                            poolQuery(`DELETE FROM activity WHERE userId=${message.mentions.members.first().user.id}`).then(result => {
                                processingMessage.edit(`Finished. Deleted data of **${result.affectedRows}** members.`);
                            })
                        } else {
                            message.channel.send(`**${message.author.username}**, the data deletion has been canceled.`);
                        }
                    }).catch(err => {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(bot.user.username, bot.user.avatarURL)
                            .setTitle('An error occured.')
                            .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                            .setColor('RED');
                        message.channel.send({embed});
                    })
                } else {
                    bot.fetchUser(args[0]).then(async function(user) {
                        userId = user.id;
                
                        const confirmationMessage = await message.channel.send(`Are you sure you want to reset the data of **${user.username}**, **${message.author.username}**? You won't be able to retrieve the old data back.`);
                        confirmationMessage.react('✅');
                        confirmationMessage.awaitReactions(filter, {time: 10000, max: 1}).then(async function(collected) {
                            if (!isEmpty(collected.array())) {
                                const processingMessage = await message.channel.send(`Deleting data...`);
                                poolQuery(`DELETE FROM activity WHERE userId=${userId}`).then(result => {
                                    processingMessage.edit(`Finished. Deleted data of **${result.affectedRows}** members.`);
                                })
                            } else {
                                message.channel.send(`**${message.author.username}**, the data deletion has been canceled.`);
                            }
                        }).catch(err => {
                            const embed = new Discord.RichEmbed()
                                .setAuthor(bot.user.username, bot.user.avatarURL)
                                .setTitle('An error occured.')
                                .setDescription(`Please report this error to <@320933389513523220>.\n\`\`\`${err}\`\`\``)
                                .setColor('RED');
                            message.channel.send({embed});
                        })
                    }).catch(err => {
                        message.channel.send(`Sorry **${message.author.username}**, but the user ID you gave doesn't match with a valid user.`);
                    })
                }
            }
        }
    } else {
        const embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle(`Developer Command`)
            .setColor(`RED`)
            .setDescription(`You are not allowed to use this command because you are not recognized as a developer of this bot.`);
        message.channel.send({embed});
    }
}