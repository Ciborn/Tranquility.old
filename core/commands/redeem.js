const isEmpty = require('./../functions/utils/isEmpty');
const poolQuery = require('./../functions/database/poolQuery');
const convertDuration = require('./../functions/time/convertDuration');
module.exports = async function(bot, message, args) {
    if (!isEmpty(args)) {
        poolQuery(`SELECT * FROM codes WHERE keygen='${args[0]}'`).then(async function(data) {
            if (data[0].type == 'boost') {
                const profile = await poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`);
                var boosts = JSON.parse(profile[0].boosts);
                var boostData = JSON.parse(data[0].data);
                var duration = convertDuration(boostData.duration);
                boosts[`${boostData.type}_${boostData.boost}`] = boosts[`${boostData.type}_${boostData.boost}`] == undefined ? new Date().getTime() + duration : boosts[`${boostData.type}_${boostData.boost}`] + duration;
                try {
                    await poolQuery(`DELETE FROM codes WHERE keygen='${data[0].keygen}'`);
                    message.channel.send(`Your key has been successfully redeemed, **${message.author.username}**.`);
                } catch(err) {
                    message.channel.send(`Sorry **${message.author.username}**, but an error occured while updating your status.`);
                }

                
                await poolQuery(`UPDATE profiles SET boosts='${JSON.stringify(boosts)}' WHERE userId='${message.author.id}'`).catch(err => {
                    console.log(err);
                })
            } else {
                message.channel.send(`This type of key is not supported yet.`);
            }
        }).catch(err => {
            message.channel.send(`Sorry **${message.author.username}**, but your key has not been found. Make sure it is correct.`);
        })
    } else {
        message.channel.send(`There is a problem with your args, **${message.author.username}**.`);
    }
}