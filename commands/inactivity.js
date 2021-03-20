const utils = require('../utils.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const spreadsheet = require('../spreadsheet.js');
module.exports = {
	name: 'inactivity',
	description: 'Inactivity list exluding ppl on SL.',
	async execute(message, args) {
		if(message.member.hasPermission('MANAGE_SERVER')) {
            spreadsheet.accessSpreadsheet('updateSL');
            let guildMembers = await utils.getGuild();
            let guildData = await utils.getData();
            let outputObj = [];
            let output = "";
            let alreadyDone = [];
            guildMembers.forEach(elem => {
                if(alreadyDone.indexOf(elem.uuid) == -1){
                    let member = guildData.data.find(user => user.uuid == elem.uuid.replace(/-/g, ""));
                    if(member == undefined)
                        uuid = elem.uuid;
                        let xml = new XMLHttpRequest();
                        xml.open('GET', `https://api.wynncraft.com/v2/player/${uuid}/stats`);
                        xml.onreadystatechange = () => {
                            if(xml.status == 200 && xml.readyState == 4){
                                response = JSON.parse(xml.responseText);
                                outputObj.push({
                                    "ign": response.data[0].username,
                                    "lastOnline": Date.now() - new Date(response.data[0].meta.lastJoin).getTime(),
                                    "sl": member.sl
                                });
                                outputObj.sort((a, b) => {
                                    return b.lastOnline - a.lastOnline
                                });
                                alreadyDone.push(uuid);
                                if(outputObj.length == guildMembers.length){
                                    outputObj.forEach((elem, index) => {
                                        if(elem.sl == false){
                                            output += `${index+1}. ${elem.ign}, Last online: ${utils.setupTimeDiff(elem.lastOnline)} ago\n`
                                        }
                                        if(index == guildMembers.length - 1){
                                            outputSplit = utils.splitString(output);
                                            outputEmbed = new Discord.MessageEmbed()
                                            .setColor('#5632a8')
                                            .setTitle('Inactivity')
                                            .setFooter(`Rate limit remaining: ${xml.getResponseHeader('ratelimit-remaining')}/${xml.getResponseHeader('ratelimit-limit')}`);
                                            outputSplit.forEach((elem, index) => {
                                                outputEmbed.addField(`${index}`, '```\n' + elem + '```');
                                                })
                                            message.channel.send(outputEmbed);
                                        }
                                    })
                                    }
                                }
                            }
                            xml.send()
                        }
            });
        }
	},
};