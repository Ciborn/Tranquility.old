const Discord = require('discord.js');
const poolQuery = require('./../functions/database/poolQuery');
module.exports = async function(bot, message, args) {
    if (args.length == 2) {
        if (message.mentions.members.size == 1) {
            args[0] = message.mentions.members.first().id;
            const resultSender = await poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`);
            const resultReceiver = await poolQuery(`SELECT * FROM profiles WHERE userId='${args[0]}'`);

            args[1] = args[1] < 0 ? args[1] * -1 : args[1];

            if (resultSender[0].gold >= args[1]) {
                if (message.author.id != args[0]) {
                    try {
                        await poolQuery(`UPDATE profiles SET gold=${resultSender[0].gold - parseInt(args[1])} WHERE userId='${message.author.id}'`);
                        await poolQuery(`UPDATE profiles SET gold=${resultReceiver[0].gold + parseInt(args[1])} WHERE userId='${args[0]}'`);
    
                        message.channel.send(`**${args[1]} Ether** have been successfully transfered from **${message.author.username}** to **${message.mentions.members.first().user.username}**.`);
                    } catch(err) {
                        message.channel.send(`Sorry, but an error occured while transferring your money, **${message.author.username}**.`);
                    }
                } else {
                    message.channel.send(`You cannot give money to yourself, **${message.author.username}**.`);
                }
            } else {
                message.channel.send(`You do not have enough ether to transfer to ${message.mentions.members.first().user.username}, **${message.author.username}**.`);
            }
        } else {
            message.channel.send(`There is a problem with your args, **${message.author.username}**.`);
        }
    } else {
        message.channel.send(`There is a problem with your args, **${message.author.username}**.`);
    }
}