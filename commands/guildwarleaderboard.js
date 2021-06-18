const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const utils = require('../utils.js');
module.exports = {
	name: 'guildwarleaderboard',
	description: 'Returns a sorted list with guilds ranked by their war count.',
	aliases: ["gwl"],
	execute(message, args) {
        let result = ""
		let xml = new XMLHttpRequest();
        xml.open('GET', 'https://api.wynncraft.com/public_api.php?action=statsLeaderboard&type=guild&timeframe=alltime');
        xml.onreadystatechange = () => {
            if(xml.status == 200 && xml.readyState == 4){
                response = JSON.parse(xml.responseText);

                response.data.sort((a,b) => {
                    if(typeof(a.warCount) === 'undefined'){
                        a.warCount = 0;
                    }else if(typeof(b.warCount) === 'undefined'){
                        b.warCount = 0;
                    }
                        return b.warCount - a.warCount;
                })
                i = 0;
                outputSplit = ["", "", "", ""];
                response.data.forEach((elem, index) => {
                    if(index % 25 !== 0 || index == 0){
                        outputSplit[i] += `${index+1}. ${elem.name} [${elem.prefix}]: ${elem.warCount}\n`;
                    }else{
                        i++;
                        outputSplit[i] += `${index+1}. ${elem.name} [${elem.prefix}]: ${elem.warCount}\n`;
                    }
                })
                let embed = new Discord.MessageEmbed()
                .setColor('#123122')
                .setTitle('Guild-War-Leaderboard');
                embed.addField(`Page 1`, "```\n"+outputSplit[0]+"\n```");
                message.channel.send(embed).then(async message => {
                    await message.react('◀️');
                    await message.react('▶️');
                    const filter = (reaction, user) => {
                        return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id !== message.author.id;
                    }
                    const collector = message.createReactionCollector(filter, {time:60000});
                    let currentIndex = 0;
                    collector.on('collect', (reaction, user) => {
                        currentIndex = utils.changePage(message, reaction, user, '#123122', 'Guild-War-Leaderboard', outputSplit, currentIndex, null);
                        console.log(currentIndex)
                    })
                    collector.on('end', collected => {
                        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    })
                })
            }
        }
        xml.send();
	},
};
