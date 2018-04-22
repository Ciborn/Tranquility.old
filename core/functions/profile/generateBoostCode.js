const poolQuery = require('./../database/poolQuery');
const keygen = require('keygenerator');
const Discord = require('discord.js');
const config = require('./../../../config.json');
module.exports = async function(bot, boostData, membersArray) {
    membersArray.forEach(async function(userId) {
        const user = await bot.fetchUser(userId);

        function splitString (string, size) {
            var re = new RegExp('.{1,' + size + '}', 'g');
            return string.match(re);
        }
        const key = splitString(keygen._({forceUppercase: true, length: 30}), 6).join('-');
    
        var keyType = `${boostData.type} Boost`;
        var keyInfos = `**${boostData.duration}** of **${boostData.boost}%**`;
        await poolQuery(`INSERT INTO codes (keygen, type, data) VALUES ('${key}', 'boost', '${JSON.stringify(boostData)}')`);
    
        const embed = new Discord.RichEmbed()
            .setTitle('Key Generated')
            .setDescription(`To use your key, type **${config.app.prefix}redeem [KEY]**.\n**Key** : ${key}\n**Type** : ${keyType}\n**Informations** : ${keyInfos}`)
            .setColor('BLUE')
        user.send({embed});
    })
}