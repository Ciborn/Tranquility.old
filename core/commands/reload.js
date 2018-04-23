const isAdmin = require('./../functions/admin/isAdmin');
exports.run = (client, message, args) => {
    if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  };

module.exports = function(bot, message, args) {
    if (isAdmin(message.author.id)) {
        if (!args || args.size < 1) {
            message.channel.send(`There is a problem in the args, **${message.author.username}**.`);
        } else {
            delete require.cache[require.resolve(`./${args[0]}.js`)];
            message.channel.send(`The command **${args[0]}** has been reloaded, **${message.author.username}**.`);
        }
    } else {
        message.channel.send(`You need to be a developer to use this command, **${message.author.username}**.`);
    }
}