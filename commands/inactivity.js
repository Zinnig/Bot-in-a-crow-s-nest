const utils = require('../utils.js');
const Discord = require('discord.js');
const spreadsheet = require('../spreadsheet.js');
module.exports = {
    name: 'inactivity',
    description: 'Inactivity list exluding ppl on SL.',
    aliases: [],
    async execute(message, args) {
        if (message.member.hasPermission('MANAGE_SERVER')) {
            spreadsheet.accessSpreadsheet('updateSL').then(async guildData => {
                let guildMembers = await utils.getGuild();
                let outputObj = [];
                let output = "";
                let alreadyDone = [];
                guildMembers.forEach(elem => {
                    if (alreadyDone.indexOf(elem.uuid) == -1) {
                        try {
                            let member = guildData.data.find(user => user.uuid == elem.uuid.replace(/-/g, ""));
                            if (member == undefined) {
                                console.log(elem.name)
                                return;
                            }
                            uuid = elem.uuid;
                            utils.getPlayer(uuid).then(response => {
                                outputObj.push({
                                    "ign": response.username,
                                    "lastOnline": Date.now() - new Date(response.meta.lastJoin).getTime(),
                                    "sl": member.sl
                                });
                                outputObj.sort((a, b) => {
                                    return b.lastOnline - a.lastOnline
                                });
                                alreadyDone.push(uuid);
                                console.log(outputObj.length, guildMembers.length)
                                if (outputObj.length == guildMembers.length) {
                                    outputObj.forEach((elem, index) => {
                                        if (elem.sl == false) {
                                            output += `${index + 1}. ${elem.ign}, Last online: ${utils.setupTimeDiff(elem.lastOnline)} ago\n`
                                        }
                                        if (index == guildMembers.length - 1) {
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
                            });
                        } catch (e) {
                            console.log("WEEE WOOO");
                        }
                    }

                });
            })
        }
	},
};
