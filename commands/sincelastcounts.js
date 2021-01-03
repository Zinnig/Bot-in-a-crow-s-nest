const utils = require('../utils.js')

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const Discord = require('discord.js');

module.exports = {
	name: 'sincelastcounts',
	description: 'The amount of emeralds/gxp earned since the last Pillager Counts.',
	execute(message, args) {
    if(!message.member.roles.cache.some(role => role.name == "Guild Member") && !message.member.hasPermission("MANAGE_GUILD")) {message.channel.send(utils.errorResponse("notaguildmember")); return;}
        let outputStr = ""
        let xmlGetStats = new XMLHttpRequest();
        xmlGetStats.open("GET", process.env.guildStatsURL);
        xmlGetStats.setRequestHeader("Content-Type", "application/json");
        xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
        xmlGetStats.setRequestHeader("versioning", false)
        xmlGetStats.onreadystatechange = function(){  
            if(xmlGetStats.status == 200 && xmlGetStats.readyState == 4){
                try {
                    resTextStats = JSON.parse(xmlGetStats.responseText) 
                    
                    let embed = new Discord.MessageEmbed()
                    .setTitle("EMS/GXP gained since the last Pillager Counts. (Pillagers only)")
                    .setColor("#1fd0e8")
                    resTextStats.data.forEach(elem => {
                      if(elem.pillager == true && elem.inGuildSpreadsheet == true){
                        outputStr += `${elem.ign}: ${(elem.currentEMS-elem.lastCountsEMS).toLocaleString("en")} Emeralds, ${(elem.currentGXP-elem.lastCountsGXP).toLocaleString("en")} GXP\n`;
                      }
                    })
                    utils.splitString(outputStr).forEach(elem => {
                      embed.addField("Pillagers Part " + (utils.splitString(outputStr).indexOf(elem) + 1), "```" + elem + "```");
                    });
                    message.channel.send(embed);
                 } catch (e) {
                    throw e;
                }
                }
            }
        xmlGetStats.send();
        } 
	}