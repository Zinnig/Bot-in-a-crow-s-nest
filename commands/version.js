
const Discord = require('discord.js');

module.exports = {
	name: 'version',
	description: "Gives general info about the bot",
	execute(message, args, client) {
        const embed = new Discord.MessageEmbed();
        embed.setTitle("version");
        embed.setDescription(`**Name:** Bot in a Crow's Nest
        **Authors:** Zinnig#2769, Florian#8249
        **Uptime:** ${client.uptime}`);
        message.channel.send(embed);
    } 
};
