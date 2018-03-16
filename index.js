const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
bot.login(config.app.token);

bot.on('ready', () => {
    require('./core/events/ready')(bot);
});

bot.on('message', (message) => {
    require('./core/events/message')(bot, message);
})