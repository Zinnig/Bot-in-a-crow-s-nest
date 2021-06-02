const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const utils = require('../utils.js');
var fs = require('fs')

module.exports = {
	name: 'userstats',
	description: 'Outputs the personal stats (gxp/wars) of a guild member.',
	execute(message, args) {
        if(!message.member.roles.cache.has('472859173730648065') && !message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send(utils.errorResponse("notaguildmember", ""));
            return;
        }
        let sent = false;
        function getMilestoneRank(amount, type){
            let gxp = {
                "V": 10000000000,
                "IV": 5000000000,
                "III": 1000000000,
                "II": 500000000,
                "I": 100000000
            }
            let ems = {
                "V": 5000000,
                "IV": 1000000,
                "III": 500000, 
                "II": 250000,
                "I": 50000
            }
            switch(type){
                case "GXP":
                    if(amount < 100000000){
                        return [null, gxp["I"] - amount];
                    }
                    for(x in gxp){
                            if(x != "V" && amount <= 10000000000){
                                switch(x){
                                    case "IV":
                                    if(amount >= gxp[x]){
                                        return [x, gxp["V"] - amount]
                                    }
                                case "III":
                                    if(amount >= gxp[x]){
                                        return [x, gxp["IV"] - amount]
                                    }
                                case "II":
                                    if(amount >= gxp[x]){
                                        return [x, gxp["III"] - amount]
                                    }
                                case "I":
                                    if(amount >= gxp[x]){
                                        return [x, gxp["II"] - amount]
                                    }
                                }   
                            }else if(x == "V" && amount > 10000000000){
                                return [x, "Max milestone reached"]
                            }
                            
                    }
                    return;
                case "EMS":
                    if(amount < 50000){
                        return [null,  ems["I"] - amount];
                    }else if(amount == undefined){
                        return [null, 0]
                    }
                    for(x in ems){
                        if(x != "V" && amount <= 5000000){
                            switch(x){
                                case "IV":
                                    if(amount >= ems[x]){
                                        return [x, ems["V"] - amount]
                                    }
                                case "III":
                                    if(amount >= ems[x]){
                                        return [x, ems["IV"] - amount]
                                    }
                                case "II":
                                    if(amount >= ems[x]){
                                        return [x, ems["III"] - amount]
                                    }
                                case "I":
                                    if(amount >= ems[x]){
                                        return [x, ems["II"] - amount]
                                    }
                                    
                            } 
                        }else if(x == "V" && amount > 5000000){
                            return [x, "Max milestone reached"]
                        }
                    }
                    return;
            }

        }
        if(args.length == 1){
            let xmlUUID = new XMLHttpRequest();
            xmlUUID.open('GET', 'https://mc-heads.net/minecraft/profile/' + args[0])
            xmlUUID.onreadystatechange = () => {
                if(xmlUUID.status == 200 && xmlUUID.readyState == 4){
                    try {
                        resTextUUID = JSON.parse(xmlUUID.responseText);
                        utils.getData().then((response) => {
                            utils.getGuild().then((members) => {
                        guildStats = response.data;
                        member = guildStats.find(member => member.uuid == resTextUUID.id);
                        guildMember = members.find(member => member.uuid.replace(/-/g, "") == resTextUUID.id);
                        gxp = getMilestoneRank(member.currentGXP, "GXP");
                        ems = getMilestoneRank(member.currentEMS, "EMS");
                        let statsEmbed = new Discord.MessageEmbed()
                        .setColor('#8000FF')
                        .setTitle(`${resTextUUID.name}'s stats`)
                        .addField('Stats', '```ml\n' + `General Information:\n- IGN: ${member.ign}\n- Date joined: ${member.dateJoined}\n- Region: ${member.region}\n- Ingame Rank: ${guildMember.rank}\n- Shore Leave: ${member.sl}\n\nRoles:\n${member.ahh == true? '- AHH \n': ""}${member.pillager == true? '- Pillager \n' : ""}${member.potsct == true? '- PPOTSCT \n': ""}\nMilestones:\n- GXP ${gxp[0] == null? "0":gxp[0]}: ${Number(member.currentGXP).toLocaleString("en")} (${gxp[1].toLocaleString("en") == "Max milestone reached" ?  "Max milestone reached, overflow: " + (Number(member.currentGXP) - 10000000000).toLocaleString("en"):gxp[1].toLocaleString("en") + ' left to reach the next milestone'})\n- EMS ${ems[0] == null?"0":ems[0]}: ${Number(member.currentEMS).toLocaleString("en")} (${ems[1].toLocaleString("en") == "Max milestone reached" ? "Max milestone reached, overflow: " + (Number(member.currentEMS) - 5000000).toLocaleString("en"):ems[1].toLocaleString("en") + ' left to reach the next milestone'})\n` + '```')
                        .setFooter(`Last updated: ${new Date(response.timestamp).toUTCString()}(${utils.setupTimeDiff(Date.now() - response.timestamp)} ago)`)
                        message.channel.send(statsEmbed);
                        })
                    })
                        /* let xmlGetStats = new XMLHttpRequest();
                        xmlGetStats.open("GET", process.env.guildStatsURL);
                        xmlGetStats.setRequestHeader("Content-Type", "application/json");
                        xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                        xmlGetStats.setRequestHeader("versioning", false)
                        xmlGetStats.onreadystatechange = function(){
                            if(xmlGetStats.status == 200 && xmlGetStats.readyState == 4){
                                try {
                                    resTextStats = JSON.parse(xmlGetStats.responseText)
                                    let xmlGuild = new XMLHttpRequest();
                                    xmlGuild.open('GET', 'https://api.wynncraft.com/public_api.php?action=guildStats&command=Paladins%20United');
                                    xmlGuild.onreadystatechange = () => {
                                        if(xmlGuild.status == 200 && xmlGuild.readyState == 4){
                                        try {
                                            resTextGuild = JSON.parse(xmlGuild.responseText);
                                            let dashedUUID = resTextUUID.id.substr(0,8)+"-"+resTextUUID.id.substr(8,4)+"-"+resTextUUID.id.substr(12,4)+"-"+resTextUUID.id.substr(16,4)+"-"+resTextUUID.id.substr(20);
                                            for(w=0;resTextGuild.members[w].uuid != dashedUUID;w++){}
                                            for(i=0;resTextStats.data[i].uuid != resTextUUID.id;i++);
                                            gxp = getMilestoneRank(resTextStats.data[i].currentGXP, "GXP");
                                            ems = getMilestoneRank(resTextStats.data[i].currentEMS, "EMS");
                                            let statsEmbed = new Discord.MessageEmbed()
                                            .setColor('#8000FF')
                                            .setTitle(`${resTextUUID.name}'s stats`)
                                            .addField('Stats', '```ml\n' + `General Information:\n- IGN: ${resTextStats.data[i].ign}\n- Date joined: ${resTextStats.data[i].dateJoined}\n- Region: ${resTextStats.data[i].region}\n- Ingame Rank: ${resTextGuild.members[w].rank}\n- Shore Leave: ${resTextStats.data[i].sl}\n\nRoles:\n${resTextStats.data[i].ahh == true? '- AHH \n': ""}${resTextStats.data[i].pillager == true? '- Pillager \n' : ""}${resTextStats.data[i].potsct == true? '- PPOTSCT \n': ""}\nMilestones:\n- GXP ${gxp[0] == null? "0":gxp[0]}: ${Number(resTextStats.data[i].currentGXP).toLocaleString("en")} (${gxp[1].toLocaleString("en") == "Max milestone reached" ?  "Max milestone reached, overflow: " + (Number(resTextStats.data[i].currentGXP) - 10000000000).toLocaleString("en"):gxp[1].toLocaleString("en") + ' left to reach the next milestone'})\n- EMS ${ems[0] == null?"0":ems[0]}: ${Number(resTextStats.data[i].currentEMS).toLocaleString("en")} (${ems[1].toLocaleString("en") == "Max milestone reached" ? "Max milestone reached, overflow: " + (Number(resTextStats.data[i].currentEMS) - 5000000).toLocaleString("en"):ems[1].toLocaleString("en") + ' left to reach the next milestone'})\n` + '```')
                                            .setFooter(`Last updated: ${new Date(resTextStats.timestamp).toUTCString()}(${utils.setupTimeDiff(Date.now() - resTextStats.timestamp)} ago)`)
                                            message.channel.send(statsEmbed);
                                        } catch (e) {
                                            throw e;
                                        }
                                    }
                                    }
                                    xmlGuild.send();
                                    
                                } catch (e) {
                                    throw e;
                                    }
                                }
                            }
                            xmlGetStats.send();
                            */
                        } catch (e) {
                            throw e;
                        } 
                }else if(xmlUUID.status == "" && sent == false && xmlUUID.readyState == 4){
                    message.channel.send(utils.errorResponse("namenotfound", args[0]))
                    sent = true;
                }
            }
            xmlUUID.send();
        }
        
	},
};