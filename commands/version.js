
const Discord = require('discord.js');
const utils = require('../utils.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports = {
	name: 'version',
	description: "Gives general info about the bot",
	aliases: ["ver", "debug"],
	async execute(message, args, client) {
        const $ = cheerio.load(await fetch(`https://github.com/Zinnig/Bot-in-a-crow-s-nest`).then(r => r.text()));
        const data = $('body > div.application-main > div > main > div.container-xl > div > div > div.gutter-condensed > div.col-md-9 > div.Box > div.Box-header > div.js-details-container > div.flex-shrink-0 > ul > li > a > span > strong').text();
        const embed = new Discord.MessageEmbed()
        .setTitle(`Bot in a Crow's Nest`)
        .setDescription(`**Name:** Bot in a Crow's Nest
        **Authors:** Zinnig#2769, Florian#8249
	**Version:** 1.${data}
        **Uptime:** ${utils.setupTimeDiff(client.uptime)===''? '<1min' : utils.setupTimeDiff(client.uptime)}`);
        message.channel.send(embed);
    } 
};
