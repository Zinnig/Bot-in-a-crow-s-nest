const Discord = require('discord.js');
const utils = require('../utils.js');
const fs = require('fs');
module.exports = {
	name: 'reactionroles',
	description: "React with the emoji to get the role.",
	execute(message, args) {
        if(message.member.hasPermission("MANAGE_GUILD")){    
            let arr = args.toString().split('+');
            let reactionEmbed = new Discord.MessageEmbed()
            .setColor('#ABCDEF');
            arr.forEach(elem => {
                split = elem.split(',');
                title = split.slice(2).toString().search(/-e/) == -1 ? split.slice(2).toString().replace(/,/g, " ") : split.slice(2).toString().substr(0, split.slice(2).toString().search(/-e/)).replace(/,/g, " ");
                desc = split.slice(2).toString().substr(split.slice(2).toString().search(/-e/) + 2).replace(/%e/g, split[1]).replace(/,/g, " ");
                reactionEmbed.addField(title, desc);
            })
                
            message.channel.send(reactionEmbed).then(async message => {
                let data = await utils.getRRData();
                let id = message.id
                let msg = {
                    [id]: []
                }
                arr.forEach(elem => {
                    split = elem.split(',');
                    message.react(split[1].replace(">", ""));
                    msg[id].push({"emoji": split[1],"role": split[0]});
                })
                data.data.push(msg)
                fs.writeFile("data/rrData.json", JSON.stringify(data), (err) => {
                    if (err) throw err;
                    console.log("Saved!");
                });
            });
        }
    }
};