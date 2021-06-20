const utils = require('../utils.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
module.exports = {
	name: 'soulpoints',
	description: 'Lists servers with an uptime close to a mutliple of 20mins.',
	aliases: ["sp", "sps"],
	execute(message, args) {
        offset = args.length === 1 ? args[0] : 60
        let xml = new XMLHttpRequest();
        xml.open('GET', 'https://athena.wynntils.com/cache/get/serverList');
        xml.onreadystatechange = () => {
            if(xml.status == 200 && xml.readyState == 4){
                outputS = "";
                outputL = [];
                response = JSON.parse(xml.responseText);
                for (key in response.servers) {
                    //TODO fix offset
                    outputL.push([key, (1200000 - (Date.now() - response.servers[key].firstSeen)%1200000) - offset*1000, 
                    utils.setupTimeDiff((1200000 - (Date.now() - response.servers[key].firstSeen)%1200000) - offset*1000) == '' || (1200000 - (Date.now() - response.servers[key].firstSeen)%1200000) - offset*1000 -60000< 1 ? '<1min' :  utils.setupTimeDiff((1200000 - (Date.now() - response.servers[key].firstSeen)%1200000) - offset*1000), 
                    utils.setupTimeDiff((Date.now() - response.servers[key].firstSeen) +offset*1000)]);
                }
                outputL = outputL.sort((a,b) =>  {
                    return b[1] - a[1];
                })
                outputL.reverse();
                outputL.forEach(elem => {
                    outputS += `${elem[0]}: ${elem[2]}, Uptime: ≈${elem[3]}\n`
                })
                outputSplit = utils.splitString(outputS);
                outputEm = new Discord.MessageEmbed()
                .setColor('#125232')
                .setTitle('Time until next Soul Point')
                .setFooter(`Time offset: ${offset} seconds.`)
                .addField('Page 1', "```"+outputSplit[0]+"```")
                message.channel.send(outputEm).then(async message => {
                    await message.react('◀️');
                    await message.react('▶️');
                    const filter = (reaction, user) => {
                        return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id !== message.author.id;
                    }
                    const collector = message.createReactionCollector(filter, {time:60000});
                    let currentIndex = 0;
                    collector.on('collect', (reaction, user) => {
                        currentIndex = utils.changePage(message, reaction, user, '#125232', 'Time until next Soul Point', outputSplit, currentIndex, `Time offset: ${offset} seconds.`);
                    });
                    collector.on('end', collected => {
                        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    });
                });
            }
        }
        xml.send();
        
    }
};
