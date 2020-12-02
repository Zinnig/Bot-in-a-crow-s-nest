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
        let inputStats = "";
        let guildStatsList = [];
        let outputList = [];
        let gList = [[]]
        function guildList(str) {
            for (i = 1; i <= inputStats.match(/#/g).length; i++) {
                name = str.slice(str.search(/#/) + 3, str.search((/( -)/)))
                if (name.search(" ") != -1) {
                    name = name.replace(" ", "")
                }
                xp = Number(str.slice(str.search(/(- )/) + 2, str.search(/( XP)/)))
                ems = Number(str.slice(str.search(/(XP - )/) + 5, str.search(/(Emeralds)/) - 1))
                joined = str.slice(str.search(/(Joined)/) + 7, str.search(/(\n)/) - 1);

                gList.push([name, xp, ems, joined])
                str = str.replace(str.slice(str.search(/#/), str.search(/(\n)/) + 1), "")
            }
            gList.shift()
            return gList
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
                            inputStats = inputStats.replace(inputStats.slice(0, 58), "")
                            inputStats = inputStats.replace(/� -/g, " Emeralds");
                            while (inputStats.search(/CHAT/) != -1) {
                                if(inputStats.search(/CHAT/) != -1){
                                    inputStats = inputStats.replace(inputStats.slice(inputStats.search(/:/) - 3, inputStats.search(/CHAT/) + 6), "\n")
                                }
                            }
                            guildStatsList = guildList(inputStats);
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
                                    console.log(outputList.length, guildStatsList.length)
                                    if(outputList.length == guildStatsList.length){
                                        let xmlGetStats = new XMLHttpRequest();
                                        xmlGetStats.open("GET", process.env.guildStatsURL);
                                        xmlGetStats.setRequestHeader("Content-Type", "application/json");
                                        xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                        xmlGetStats.setRequestHeader("versioning", false)
                                        xmlGetStats.onreadystatechange = function(){
                                            console.log(xmlGetStats.status, xmlGetStats.readyState)
                                            if(this.status == 200 && this.readyState == 4){
                                                resTextUpdateStats = JSON.parse(this.responseText);
                                                let alreadyDone = [];
                                                outputList.forEach(elem => {
                                                    let index = getIndex(resTextUpdateStats, elem[0]);
                                                    if(index > -1){
                                                        if(new Date(elem[4]).getTime() != new Date(resTextUpdateStats.data[index].dateJoined).getTime() && new Date(elem[4]).getTime() != new Date(resTextUpdateStats.data[index].lastJoin).getTime()){
                                                            console.log(elem[1], elem[4], new Date(elem[4]).getTime(), resTextUpdateStats.data[index].dateJoined, new Date(resTextUpdateStats.data[index].dateJoined).getTime())
                                                            resTextUpdateStats.data[index].currentGXP += elem[2];
                                                            resTextUpdateStats.data[index].currentEMS += elem[3];
                                                            if(elem[6] != resTextUpdateStats.data[index].ign){
                                                                resTextUpdateStats.data[index].ign == elem[1];
                                                            }
                                                            resTextUpdateStats.data[index].lastJoin = elem[4];
                                                        }else{
                                                            resTextUpdateStats.data[index].currentGXP = elem[2];
                                                            resTextUpdateStats.data[index].currentEMS = elem[3];
                                                            if(elem[6] != resTextUpdateStats.data[index].ign){
                                                                resTextUpdateStats.data[index].ign == elem[1];
                                                            }
                                                        }
                                                    }else{
                                                        gMember = new Object();
                                                        gMember.dateJoined = elem[4]
                                                        gMember.ign = elem[1]
                                                        gMember.uuid = elem[0]
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
                                                        gMember.inGuild = true
                                                        gMember.inGuildSpreadsheet = undefined;
                                                        gMember.lastJoin = elem[4];
                                                        resTextUpdateStats.data.push(gMember)
                                                    }
                                                    alreadyDone.push(elem[0])
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
                //TODO: Code needs updating.
                let xmlGuildStats = new XMLHttpRequest();
                xmlGuildStats.open("GET", process.env.guildStatsURL);
                xmlGuildStats.setRequestHeader("Content-Type", "application/json");
                xmlGuildStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlGuildStats.setRequestHeader("versioning", false)
                xmlGuildStats.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    try{
                    resTextGuildStats = JSON.parse(this.responseText);
                    timeStamp = resTextGuildStats.timestamp
                    resTextGuildStats.now.forEach(elem => {
                        f++;
                        let xmlUUIDGuildStats = new XMLHttpRequest();
                        xmlUUIDGuildStats.open("GET", "https://mc-heads.net/minecraft/profile/" + elem[0]);
                        xmlUUIDGuildStats.onreadystatechange = () => {
                            if(this.status == 200 && this.readyState == 4){
                                try{
                                    resTextUUIDGuildStats = JSON.parse(xmlUUIDGuildStats.responseText);
                                    if(index(elem[0], currentGuildStats) == -1){
                                        currentGuildStats.push([resTextUUIDGuildStats.name, elem[0],elem[1], elem[2], elem[3]])
                                    }
                                    if(resTextGuildStats.now.length >= currentGuildStats.length){
                                        let gxp = [...currentGuildStats]
                                        gxp.sort((a, b) => {
                                            return b[2] - a[2]
                                        })
                                        console.log(currentGuildStats.length, gxp.length)
                                        if(sentStats == false){
                                            if(f == gxp.length){
                                            for(property in gxp){
                                                let searchReg = new RegExp(gxp[property][0], "g")
                                                if(gxp[property][2] >= 10000000000){
                                                    if(mileStone5.search(searchReg) == -1){
                                                        mileStone5 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter5++;
                                                    }
                                                    }else if(gxp[property][2] >= 5000000000){
                                                        if(mileStone4.search(searchReg) == -1){
                                                        mileStone4 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter4++;
                                                        }
                                                    }else if(gxp[property][2] >= 1000000000){
                                                        if(mileStone3.search(searchReg) == -1){
                                                        mileStone3 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter3++;
                                                        }
                                                    }else if(gxp[property][2] >= 500000000){
                                                        if(mileStone2.search(searchReg) == -1){
                                                        mileStone2 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter2++;
                                                        }
                                                    }else if(gxp[property][2] >= 250000000){
                                                        if(mileStone1.search(searchReg) == -1){
                                                        mileStone1 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter1++;
                                                    }
                                                    }else if(gxp[property][2] < 100000000){
                                                        if(mileStone0.search(searchReg) == -1){
                                                        mileStone0 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter0++;
                                                }
                                            }
                                        }
                                        if(property == gxp.length - 1){
                                            let statsEmbed = new Discord.MessageEmbed()
                                            .setTitle("GXP (All Time)")
                                            .setColor("#7BD19F")
                                            .setFooter(`Last Update: ${(new Date(resTextGuildStats.timestamp)).toUTCString()}`)
                                            .addField(`GXP V (${counter5}) [10,000,000,000]` , "```yaml\n"+mileStone5+"```")
                                            .addField(`GXP IV (${counter4}) [5,000,000,000]`, "```yaml\n"+mileStone4+"```")
                                            .addField(`GXP III (${counter3}) [1,000,000,000]`, "```yaml\n"+mileStone3+"```")
                                            .addField(`GXP II (${counter2}) [500,000,000]`, "```yaml\n"+mileStone2+"```")
                                            .addField(`GXP I (${counter1}) [100,000,000]`, "```yaml\n"+mileStone1+"```")
                                            .addField(`No milestone (${counter0})`, "```yaml\n"+mileStone0+"```")
                                            console.table(gxp)
                                            message.channel.send(statsEmbed)
                                            sentStats = true;
                                    }
                                }
                                } 
                                }
                                    

                                }catch(e){
                                    //empty
                                }
                            }
                        };
                        xmlUUIDGuildStats.send()
                    })
                    
                    }catch(e){
                        //empty
                    }
                }
            }
            xmlGuildStats.send();
                break;
            case "em":
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