const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const NameMC = require('../namemc');
const utils = require('../utils.js');
function errorResponse(type, extraInfo){
    let errorEmbed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    switch(type){
        case "noperms":
            errorEmbed.setTitle(`You don't have the permission "${extraInfo}".`)
            break;
        case "wrongargs":
            errorEmbed.setTitle(`Invalid Arguments! Valid Arguments: ${extraInfo}`)
        case "noattachement":
            errorEmbed.setTitle(`Your message has no attachements`)
    }
    return errorEmbed
}
function getIndex(resText, uuid){
    let i = 0;
    try{
    for(i=0;uuid!=resText.data[i].uuid;i++){}
    }catch(e){
        return -1;
    }   
    return i;
}
module.exports = {
	name: 'guildstats',
	description: 'View stats of the guild.',
	execute(message, args) {
        if(!message.member.roles.cache.has('472859173730648065') && !message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send(utils.errorResponse("notaguildmember", ""));
            return;
        }
        
        let inputStats = "";
        let guildStatsList = [];
        let outputList = [];
        let gList = [[]]
        function guildList(str) {
            pattern = /#.* - .* XP - .*/g;
            ar = str.match(pattern);
            ar.forEach(elem => {
                name = elem.slice(3, elem.search(/ -/)).replace(" ", "")
                xp = elem.slice(elem.search(/- /) + 2, elem.search(/ XP/))
                emeralds = elem.slice(elem.search(/XP - /) + 5, elem.search(/(²)/))
                date = elem.slice(elem.search(/Joined/) + 7)
                gList.push([name, xp, emeralds, date]);
            })
            gList.shift();
            return gList;
        }
        switch(args[0]){
            case "update":
                if(message.member.hasPermission("MANAGE_GUILD")){
                attachmentsArray = message.attachments.array();
                if(attachmentsArray == 0) {
                    message.channel.send(errorResponse('noattachement', '')) 
                    return;
                }
                let xmlStats = new XMLHttpRequest();
                xmlStats.open("GET", attachmentsArray[0].url);
                xmlStats.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        if (this.getResponseHeader('content-type') == "text/plain") {
                            inputStats = this.responseText
                            guildStatsList = guildList(inputStats);
                            console.table(guildStatsList)
                            guildStatsList.forEach(function(elem){
                            let xmlUUIDStats = new XMLHttpRequest();
                            xmlUUIDStats.open("GET", "https://mc-heads.net/minecraft/profile/" + elem[0]);
                            xmlUUIDStats.onreadystatechange = async function(){
                            if(xmlUUIDStats.status == 204 && xmlUUIDStats.readyState == 4){
                                const possibleUsers = await NameMC.lookupName(elem[0]);
                                let uuid = possibleUsers[0].uuid.replace(/-/g, "");
                                let currentName = possibleUsers[0].currentName;
                                outputList.push([uuid, elem[0], elem[1], elem[2], elem[3], true, currentName])
                            }else if(xmlUUIDStats.status == 200 && xmlUUIDStats.readyState == 4){
                                try{
                                    resTextUUIDStats = JSON.parse(xmlUUIDStats.responseText);
                                    uuidStats = resTextUUIDStats.id;
                                    outputList.push([uuidStats, elem[0], elem[1], elem[2], elem[3]])
                                    if(outputList.length == guildStatsList.length){
                                        console.table(outputList)
                                        let xmlGetStats = new XMLHttpRequest();
                                        xmlGetStats.open("GET", process.env.guildStatsURL);
                                        xmlGetStats.setRequestHeader("Content-Type", "application/json");
                                        xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                        xmlGetStats.setRequestHeader("versioning", false)
                                        xmlGetStats.onreadystatechange = function(){
                                            if(this.status == 200 && this.readyState == 4){
                                                resTextUpdateStats = JSON.parse(this.responseText);
                                                let alreadyDone = [];
                                                outputList.forEach(elem => {
                                                    let index = getIndex(resTextUpdateStats, elem[0])
                                                    console.log(index) 
                                                    if(index > -1){
                                                        resTextUpdateStats.data[index].ign = resTextUpdateStats.data[index].ign.replace("\n", "");
                                                        if(new Date(elem[4]).getTime() != new Date(resTextUpdateStats.data[index].dateJoined).getTime()){
                                                            console.log(elem[1], elem[4], new Date(elem[4]).getTime(), resTextUpdateStats.data[index].dateJoined, new Date(resTextUpdateStats.data[index].dateJoined).getTime())
                                                            console.log("CurrentGXP: " + resTextUpdateStats.data[index].currentGXP, "other:  " + elem[2])
                                                            console.log("CurrentEMS: " + resTextUpdateStats.data[index].currentEMS, "other: " + elem[3])
                                                            if(elem[6] != resTextUpdateStats.data[index].ign){
                                                                resTextUpdateStats.data[index].ign == elem[1];
                                                            }
                                                            if(resTextUpdateStats.data[index].lastJoin == elem[4]){
                                                                resTextUpdateStats.data[index].currentGXP = Number(resTextUpdateStats.data[index].currentGXP) + (Number(elem[2])- resTextUpdateStats.data[index].alreadyAddedGXP); 
                                                                resTextUpdateStats.data[index].currentEMS = Number(resTextUpdateStats.data[index].currentEMS) + (Number(elem[3])- resTextUpdateStats.data[index].alreadyAddedEMS);
                                                                resTextUpdateStats.data[index].alreadyAddedGXP = Number(resTextUpdateStats.data[index].currentGXP);
                                                                resTextUpdateStats.data[index].alreadyAddedEMS = Number(resTextUpdateStats.data[index].currentEMS);
                                                            }else{
                                                                resTextUpdateStats.data[index].currentGXP = Number(resTextUpdateStats.data[index].currentGXP) + Number(elem[2]);
                                                                resTextUpdateStats.data[index].currentEMS = Number(resTextUpdateStats.data[index].currentEMS) + Number(elem[3]);
                                                                resTextUpdateStats.data[index].alreadyAddedGXP = Number(elem[2]);
                                                                resTextUpdateStats.data[index].alreadyAddedEMS = Number(elem[3]);
                                                                resTextUpdateStats.data[index].lastJoin = elem[4]
                                                            }
                                                            resTextUpdateStats.data[index].lastJoin = elem[4];
                                                        }else if(new Date(elem[4]).getTime() < new Date(resTextUpdateStats.data[index].dateJoined).getTime()){
                                                            console.log("timeerror", resTextUpdateStats.data[index].ign)
                                                            resTextUpdateStats.data[index].dateJoined = elem[4];
                                                            resTextUpdateStats.data[index].currentGXP = elem[2];
                                                            resTextUpdateStats.data[index].currentEMS = elem[3];
                                                            if(elem[6] != resTextUpdateStats.data[index].ign){
                                                                resTextUpdateStats.data[index].ign == elem[1];
                                                            }
                                                        }else{
                                                            if(resTextUpdateStats.data[index].lastCountsGXP > resTextUpdateStats.data[index].currentGXP){
                                                                resTextUpdateStats.data[index].currentGXP = Number(elem[2]) + Number(resTextUpdateStats.data[index].lastCountsGXP);
                                                                resTextUpdateStats.data[index].alreadyAddedGXP = Number(elem[2]);
                                                            }
                                                            if(resTextUpdateStats.data[index].lastCountsEMS > resTextUpdateStats.data[index].currentEMS){
                                                                resTextUpdateStats.data[index].currentEMS = Number(elem[3]) + Number(resTextUpdateStats.data[index].lastCountsEMS);
                                                                resTextUpdateStats.data[index].alreadyAddedGXP = Number(elem[3]);
                                                            }else{
                                                            resTextUpdateStats.data[index].currentGXP = Number(elem[2]);
                                                            resTextUpdateStats.data[index].currentEMS = Number(elem[3]);
                                                        }
                                                            if(elem[6] != resTextUpdateStats.data[index].ign){
                                                                resTextUpdateStats.data[index].ign == elem[1];
                                                            }
                                                        }
                                                    }else{
                                                        gMember = new Object();
                                                        gMember.dateJoined = elem[4];
                                                        gMember.ign = elem[1].replace("\n", "");
                                                        gMember.uuid = elem[0];
                                                        gMember.region = undefined;
                                                        gMember.sl = undefined;
                                                        gMember.slData = [];
                                                        gMember.ahh = undefined;
                                                        gMember.potsct = undefined;
                                                        gMember.pillager = undefined;
                                                        gMember.lastCountsGXP = undefined;
                                                        gMember.lastCountsEMS = undefined;
                                                        gMember.currentGXP = elem[2];
                                                        gMember.currentEMS = elem[3];
                                                        gMember.shoreTrader = undefined;
                                                        gMember.outfitter = undefined;
                                                        gMember.inGuild = true;
                                                        gMember.inGuildSpreadsheet = undefined;
                                                        gMember.lastJoin = elem[4];
                                                        gMember.alreadyAddedGXP = 0;
                                                        gMember.alreadyAddedEMS = 0;
                                                        resTextUpdateStats.data.push(gMember)
                                                    }
                                                    alreadyDone.push(elem[0]);
                                                })
                                                resTextUpdateStats.data.forEach(obj => {
                                                    if(alreadyDone.indexOf(obj.uuid) == -1){
                                                        obj.inGuild = false;
                                                    }
                                                })
                                                let guildStatsJSON = {
                                                    "data": resTextUpdateStats.data,
                                                    "timestamp": Date.now()
                                                }
                                                let xmlUpdateStats = new XMLHttpRequest();
                                                xmlUpdateStats.open("PUT", process.env.guildStatsURL);
                                                xmlUpdateStats.setRequestHeader("Content-Type", "application/json");
                                                xmlUpdateStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                                xmlUpdateStats.setRequestHeader("versioning", false)
                                                xmlUpdateStats.send(JSON.stringify(guildStatsJSON));
                                                console.log(guildStatsJSON)
                                                message.channel.send("GuildStats updated.") 
                                                } 
                                                }
                                                xmlGetStats.send();  
                                            }
                                            
                                        }catch(e){
                                            throw e;
                                        } 
                                        
                                    }
                                
                                    
                                }
                                    xmlUUIDStats.send();
                            }) 
                            
                        }
                        
                        }
                    }
                    xmlStats.send();
                }else{
                    message.channel.send(utils.errorResponse("noperms", "MANAGE_GUILD"))
                }
                break;
            case "gxp":
                let sentStats = false;
                let mileStone0 = "", mileStone1 = "", mileStone2 = "", mileStone3 = "", mileStone4 = "", mileStone5 = "";
                let counter0 = 0, counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0, counter5 = 0;
                let xmlGuildStats = new XMLHttpRequest();
                xmlGuildStats.open("GET", process.env.guildStatsURL);
                xmlGuildStats.setRequestHeader("Content-Type", "application/json");
                xmlGuildStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlGuildStats.setRequestHeader("versioning", false)
                xmlGuildStats.onreadystatechange = function(){
                    if(xmlGuildStats.status == 200 && xmlGuildStats.readyState == 4){
                        try{
                            resTextGuildStats = JSON.parse(xmlGuildStats.responseText);
                            timeStamp = resTextGuildStats.timestamp;
                            let gxp = resTextGuildStats.data.map(value => [value.ign, value.currentGXP]);
                            gxp.sort((a, b) => {
                                return b[1] - a[1];
                                })
                            if(sentStats == false){
                                    for(property in gxp){
                                        let searchReg = new RegExp(gxp[property][0], "g");
                                        if(gxp[property][1] >= 10000000000){
                                            if(mileStone5.search(searchReg) == -1){
                                                mileStone5 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                counter5++;
                                                }
                                            }else if(gxp[property][1] >= 5000000000){
                                                if(mileStone4.search(searchReg) == -1){
                                                    mileStone4 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                    counter4++;
                                                    }
                                            }else if(gxp[property][1] >= 1000000000){
                                                if(mileStone3.search(searchReg) == -1){
                                                    mileStone3 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                    counter3++;
                                                    }
                                            }else if(gxp[property][1] >= 500000000){
                                                if(mileStone2.search(searchReg) == -1){
                                                    mileStone2 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                    counter2++;
                                                    }
                                            }else if(gxp[property][1] >= 100000000){
                                                if(mileStone1.search(searchReg) == -1){
                                                    mileStone1 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                    counter1++;
                                                }
                                            }else if(gxp[property][1] < 100000000){
                                                if(mileStone0.search(searchReg) == -1){
                                                    mileStone0 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                                    counter0++;
                                                }
                                            }
                                        }
                                            if(property == gxp.length - 1){
                                                let parts = [0, 0, 0, 0, 0, 0];
                                                let partsString = ["", "", "", "", "", ""];
                                                let mileStones = [mileStone5, mileStone4, mileStone3, mileStone2, mileStone1, mileStone0];
                                                mileStones.forEach((elem, index) => {
                                                parts[index] = Math.floor(elem.length/1000);
                                                if(Math.floor(elem.length/1000) >= 1){
                                                    partsString[index] = utils.splitString(elem);
                                                }else{
                                                    partsString[index] = [elem];
                                                }
                                            });
                                                let statsEmbed = new Discord.MessageEmbed()
                                                .setTitle("GXP (All Time)")
                                                .setColor("#7BD19F")
                                                .setFooter(`Last Update: ${(new Date(resTextGuildStats.timestamp)).toUTCString()}`);
                                                partsString.forEach((elem, index)=> {
                                                    switch (index){
                                                        case 5:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`No milestone (${counter0}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`No milestone (${counter0})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 4:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`GXP I (${counter1}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`GXP I (${counter1})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 3:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`GXP II (${counter2}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`GXP II (${counter2})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 2:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`GXP III (${counter3}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`GXP III (${counter3})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 1:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`GXP IV (${counter4}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`GXP IV (${counter4})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 0:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`GXP V (${counter5}) Part ${index + 1}`, "```yaml\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`GXP V (${counter5})`, "```yaml\n"+elem+"```");
                                                            }
                                                            break;
                                                    }
                                                })
                                                message.channel.send(statsEmbed);
                                                sentStats = true;
                                        }                        
                                }

                        }catch(e){
                            throw e;
                            }
                        }
                    }
                xmlGuildStats.send();
                break;
            case "em":
                let sentStatsEM = false;
                let mileStoneEM0 = "", mileStoneEM1 = "", mileStoneEM2 = "", mileStoneEM3 = "", mileStoneEM4 = "", mileStoneEM5 = "";
                let counterEM0 = 0, counterEM1 = 0, counterEM2 = 0, counterEM3 = 0, counterEM4 = 0, counterEM5 = 0;
                let xmlGuildStatsEM = new XMLHttpRequest();
                xmlGuildStatsEM.open("GET", process.env.guildStatsURL);
                xmlGuildStatsEM.setRequestHeader("Content-Type", "application/json");
                xmlGuildStatsEM.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlGuildStatsEM.setRequestHeader("versioning", false);
                xmlGuildStatsEM.onreadystatechange = function(){
                    if(xmlGuildStatsEM.status == 200 && xmlGuildStatsEM.readyState == 4){
                        try{
                            resTextGuildStats = JSON.parse(xmlGuildStatsEM.responseText);
                            timeStamp = resTextGuildStats.timestamp;
                            let em = resTextGuildStats.data.map(value => [value.ign, value.currentEMS]);
                            em.sort((a, b) => {
                                return b[1] - a[1];
                                })
                            if(sentStatsEM == false){
                                    for(property in em){
                                        let searchReg = new RegExp(em[property][0], "g");
                                        if(em[property][1] >= 5000000){
                                            if(mileStoneEM5.search(searchReg) == -1){
                                                mileStoneEM5 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                counterEM5++;
                                                }
                                            }else if(em[property][1] >= 1000000){
                                                if(mileStoneEM4.search(searchReg) == -1){
                                                    mileStoneEM4 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                    counterEM4++;
                                                    }
                                            }else if(em[property][1] >= 500000){
                                                if(mileStoneEM3.search(searchReg) == -1){
                                                    mileStoneEM3 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                    counterEM3++;
                                                    }
                                            }else if(em[property][1] >= 100000){
                                                if(mileStoneEM1.search(searchReg) == -1){
                                                    mileStoneEM1 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                    counterEM1++;
                                                    }
                                            }else if(em[property][1] >= 50000){
                                                if(mileStoneEM1.search(searchReg) == -1){
                                                    mileStoneEM1 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                    counterEM1++;
                                                }
                                            }else if(em[property][1] < 50000){
                                                if(mileStoneEM0.search(searchReg) == -1){
                                                    mileStoneEM0 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                                    counterEM0++;
                                                }
                                            }
                                        }
                                            if(property == em.length - 1){
                                                let parts = [0, 0, 0, 0, 0, 0];
                                                let partsString = ["", "", "", "", "", ""];
                                                let mileStones = [mileStoneEM5, mileStoneEM4, mileStoneEM3, mileStoneEM2, mileStoneEM1, mileStoneEM0];
                                                mileStones.forEach((elem, index) => {
                                                parts[index] = Math.floor(elem.length/1000);
                                                if(Math.floor(elem.length/1000) >= 1){
                                                    partsString[index] = utils.splitString(elem);
                                                }else{
                                                    partsString[index] = [elem];
                                                }
                                            });
                                                let statsEmbed = new Discord.MessageEmbed()
                                                .setTitle("EM (All Time)")
                                                .setColor("#7BD19F")
                                                .setFooter(`Last Update: ${(new Date(resTextGuildStats.timestamp)).toUTCString()}`);
                                                partsString.forEach((elem, index)=> {
                                                    switch (index){
                                                        case 5:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`No milestone (${counterEM0}) Part ${index + 1}`, "```css\n"+element+"```")
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`No milestone (${counterEM0})`, "```css\n"+elem+"```")
                                                            }
                                                            break;
                                                        case 4:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`EM I (${counterEM1}) Part ${index + 1}`, "```css\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`EM I (${counterEM1})`, "```css\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 3:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`EM II (${counterEM2}) Part ${index + 1}`, "```css\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`EM II (${counterEM2})`, "```css\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 2:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`EM III (${counterEM3}) Part ${index + 1}`, "```css\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`EM III (${counterEM3})`, "```css\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 1:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`EM IV (${counterEM4}) Part ${index + 1}`, "```css\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`EM IV (${counterEM4})`, "```css\n"+elem+"```");
                                                            }
                                                            break;
                                                        case 0:
                                                            if(elem.length > 1){
                                                                elem.forEach((element, index) => {
                                                                    statsEmbed.addField(`EM V (${counterEM5}) Part ${index + 1}`, "```css\n"+element+"```");
                                                                });
                                                            }else{
                                                                statsEmbed.addField(`EM V (${counterEM5})`, "```css\n"+elem+"```");
                                                            }
                                                            break;
                                                    }
                                                })
                                                message.channel.send(statsEmbed);
                                                sentStatsEM = true;
                                        }                        
                                }

                        }catch(e){
                            throw e;
                            }
                        }
                    }
                xmlGuildStatsEM.send();
                break;
            default: 
            if(!message.member.hasPermission("MANAGE_GUILD")){
                message.channel.send(utils.errorResponse("wrongargs", "gxp, em"));
                break
            }else if(message.member.hasPermission("MANAGE_GUILD")){
                message.channel.send(utils.errorResponse("wrongargs", "update, gxp, em"));
                break;
            }
        }
    } 
};