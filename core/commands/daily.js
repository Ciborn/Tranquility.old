const Discord = require('discord.js');
const poolQuery = require('./../functions/database/poolQuery');
const Cache = require('./../classes/Cache');
const convertDate = require('./../functions/time/convertDate');
const mostImportantDuration = require('./../functions/time/mostImportantDuration');
module.exports = async function(bot, message, args) {
    const cache = new Cache();
    const result = await poolQuery(`SELECT * FROM profiles WHERE userId='${message.author.id}'`);
    if (convertDate(new Date(), '$p-$d-$y') != cache.get(message.author.id)) {
        const receivedMoney = Math.round(result[0].gold + 500 + Math.random() * 100);
        cache.set(message.author.id, `${convertDate(new Date(), '$p-$d-$y')}`);
        poolQuery(`UPDATE profiles SET gold=${receivedMoney} WHERE userId='${message.author.id}'`);
        message.channel.send(`Congratulations, **${message.author.username}**, you received **${receivedMoney - result[0].gold} Ether** as your daily reward!`)
    } else {
        message.channel.send(`You cannot receive your daily reward now, **${message.author.username}**, please wait ${mostImportantDuration(new Date(new Date().setHours(0,0,0)+86400000) - new Date().getTime())}.`);
    }
}
