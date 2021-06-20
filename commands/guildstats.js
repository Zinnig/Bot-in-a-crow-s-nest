const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const NameMC = require('../namemc');
const utils = require('../utils.js');
const fs = require('fs');
function errorResponse(type, extraInfo) {
    let errorEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
    switch (type) {
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
function getIndex(resText, uuid) {
    let i = 0;
    try {
        for (i = 0; uuid != resText.data[i].uuid; i++) { }
    } catch (e) {
        return -1;
    }
    return i;
}
module.exports = {
    name: 'guildstats',
    description: 'View stats of the guild.',
    aliases: [],
    execute(message, args) {
        if(args[0] !== "AutoUpdate"){
            if (!message.member.roles.cache.has('472859173730648065') && !message.member.hasPermission("MANAGE_GUILD")) {
                console.log(message.member)
                message.channel.send(utils.errorResponse("notaguildmember", ""));
                return;
            }
        }
        function getGuild() {
            return new Promise(resolve => {
                xml = new XMLHttpRequest();
                xml.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=Paladins%20United");
                xml.onreadystatechange = () => {
                    if (xml.status == 200 && xml.readyState == 4) {
                        response = JSON.parse(xml.responseText);
                        resolve(response.members);
                    }
                }
                xml.send();
            })
        }
        function getData() {
            return new Promise(resolve => {
                fs.readFile("data/guildStats.json", (err, data) => {
                    if (err) return;
                    try {
                        guildStats = JSON.parse(data);
                        resolve(guildStats);
                    } catch (error) {
                        resolve(null);
                    }
                })
            })
        }
        switch (args[0]) {
            case "update":
                if (message.member.hasPermission("MANAGE_GUILD")) {
                    let guildMembers, guildStats;
                    getGuild().then((response) => {
                        guildMembers = response
                        getData().then((response1) => {
                            guildStats = response1.data;
                            guildMembers.forEach(elem => {
                                let member = guildStats.find(user => user.uuid == elem.uuid.replace(/-/g, ""));
                                console.log("before: " + guildStats.length);
                                if (!(member == undefined)) {
                                    if (member.dateJoined.includes("/") || new Date(member.dateJoined).getUTCMilliseconds() == 0) {
                                        console.log("e")
                                        let date1 = new Date(elem.joined);
                                        let dateString = `${date1.getUTCMonth() + 1}/${date1.getUTCDate()}/${date1.getUTCFullYear()}`;
                                        let date = new Date(dateString);
                                        let dateJoin = new Date(member.dateJoined + " GMT");
                                        let joinDate = `${dateJoin.getUTCMonth() + 1}/${dateJoin.getUTCDate()}/${dateJoin.getUTCFullYear()}`;
                                        let joinedDate = new Date(joinDate);
                                        let dateLastJoin = new Date(member.lastJoin);
                                        let lastJoinDate = `${dateLastJoin.getUTCMonth() + 1}/${dateLastJoin.getUTCDate()}/${dateLastJoin.getUTCFullYear()}`;
                                        let lastJoinedDate = new Date(lastJoinDate);
                                        if (date.getTime() == joinedDate.getTime()) {
                                            member.currentGXP = elem.contributed;
                                            console.log("date=dateJoined")
                                        } else if (date.getTime() == lastJoinedDate.getTime() && date.getTime() != joinedDate.getTime()) {
                                            member.currentGXP = member.currentGXP + (elem.contributed - member.alreadyAddedGXP);
                                            member.alreadyAddedGXP = elem.contributed
                                        } else {
                                            member.currentGXP = member.currentGXP + elem.contributed;
                                            member.alreadyAddedGXP = elem.contributed;
                                            member.lastJoin = elem.joined;
                                        }
                                    } else {
                                        console.log(member.ign)
                                        let date = new Date(elem.joined);
                                        if (date == new Date(member.dateJoined)) {
                                            member.currentGXP = elem.contributed;
                                        } else if (date == new Date(member.lastJoin) && date != new Date(member.dateJoined)) {
                                            member.currentGXP = member.currentGXP + (elem.contributed - member.alreadyAddedGXP);
                                            member.alreadyAddedGXP = elem.contributed
                                        } else {
                                            member.currentGXP = member.currentGXP + elem.contributed;
                                            member.alreadyAddedGXP = elem.contributed;
                                            member.lastJoin = elem.joined;
                                        }

                                    }
                                } else if (member == undefined) {
                                    console.log("new Member: " + elem.name)
                                    gMember = new Object();
                                    gMember.dateJoined = elem.joined;
                                    gMember.ign = elem.name;
                                    gMember.uuid = elem.uuid.replace(/-/g, "");
                                    gMember.region = undefined;
                                    gMember.sl = undefined;
                                    gMember.slData = [];
                                    gMember.ahh = undefined;
                                    gMember.potsct = undefined;
                                    gMember.pillager = undefined;
                                    gMember.lastCountsGXP = undefined;
                                    gMember.currentGXP = elem.contributed;
                                    gMember.shoreTrader = undefined;
                                    gMember.outfitter = undefined;
                                    gMember.inGuild = true;
                                    gMember.inGuildSpreadsheet = undefined;
                                    gMember.lastJoin = elem.joined;
                                    gMember.alreadyAddedGXP = 0;
                                    guildStats.push(gMember);
                                }
                            })
                            let stats = {
                                "data": guildStats,
                                "timestamp": Date.now()
                            };
                            fs.writeFile("data/guildStats.json", JSON.stringify(stats), (err) => {
                                if (err) throw err;
                                console.log("Saved!");
                                console.log(stats.data.length);
                            });
                        });
                    });
                } else {
                    message.channel.send(utils.errorResponse("noperms", "MANAGE_GUILD"))
                }
                break;
            case "gxp":
                let sentStats = false;
                let mileStone0 = "", mileStone1 = "", mileStone2 = "", mileStone3 = "", mileStone4 = "", mileStone5 = "";
                let counter0 = 0, counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0, counter5 = 0;
                getData().then(guildStats => {
                    timeStamp = guildStats.timestamp;
                    let gxp;
                    if (args.toString().search(/-all/) === -1) {
                        guildStatsFilter = guildStats.data.filter(value => value.inGuildSpreadsheet)
                        gxp = guildStatsFilter.map(value => [value.ign, value.currentGXP == undefined ? 0 : Number(value.currentGXP)]);
                    } else {
                        gxp = guildStats.data.map(value => [value.ign, value.currentGXP == undefined ? 0 : Number(value.currentGXP)]);
                    }
                    gxp.sort((a, b) => {
                        return b[1] - a[1];
                    })
                    if (sentStats == false) {
                        for (property in gxp) {
                            let searchReg = new RegExp(gxp[property][0], "g");
                            if (gxp[property][1] >= 10000000000) {
                                if (mileStone5.search(searchReg) == -1) {
                                    mileStone5 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter5++;
                                }
                            } else if (gxp[property][1] >= 5000000000) {
                                if (mileStone4.search(searchReg) == -1) {
                                    mileStone4 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter4++;
                                }
                            } else if (gxp[property][1] >= 1000000000) {
                                if (mileStone3.search(searchReg) == -1) {
                                    mileStone3 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter3++;
                                }
                            } else if (gxp[property][1] >= 500000000) {
                                if (mileStone2.search(searchReg) == -1) {
                                    mileStone2 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter2++;
                                }
                            } else if (gxp[property][1] >= 100000000) {
                                if (mileStone1.search(searchReg) == -1) {
                                    mileStone1 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter1++;
                                }
                            } else if (gxp[property][1] < 100000000) {
                                if (mileStone0.search(searchReg) == -1) {
                                    mileStone0 += `- ${gxp[property][0]}: ${gxp[property][1].toLocaleString("en")} GXP \n`;
                                    counter0++;
                                }
                            }
                        }
                        if (property == gxp.length - 1) {
                            let parts = [0, 0, 0, 0, 0, 0];
                            let partsString = ["", "", "", "", "", ""];
                            let mileStones = [mileStone5, mileStone4, mileStone3, mileStone2, mileStone1, mileStone0];
                            mileStones.forEach((elem, index) => {
                                parts[index] = Math.floor(elem.length / 1000);
                                if (Math.floor(elem.length / 1000) >= 1) {
                                    partsString[index] = utils.splitString(elem);
                                } else {
                                    partsString[index] = [elem];
                                }
                            });
                            let statsEmbed = new Discord.MessageEmbed()
                                .setTitle("GXP (All Time)")
                                .setColor("#7BD19F")
                                .setFooter(`Last Update: ${(new Date(timeStamp)).toUTCString()}`);
                            partsString.forEach((elem, index) => {
                                switch (index) {
                                    case 5:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`No milestone (${counter0}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`No milestone (${counter0})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                    case 4:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`GXP I (${counter1}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`GXP I (${counter1})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                    case 3:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`GXP II (${counter2}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`GXP II (${counter2})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                    case 2:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`GXP III (${counter3}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`GXP III (${counter3})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                    case 1:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`GXP IV (${counter4}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`GXP IV (${counter4})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                    case 0:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`GXP V (${counter5}) Part ${index + 1}`, "```yaml\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`GXP V (${counter5})`, "```yaml\n" + elem + "```");
                                        }
                                        break;
                                }
                            })
                            message.channel.send(statsEmbed);
                            sentStats = true;
                        }
                    }
                })
                break;
            case "em":
                let sentStatsEM = false;
                let mileStoneEM0 = "", mileStoneEM1 = "", mileStoneEM2 = "", mileStoneEM3 = "", mileStoneEM4 = "", mileStoneEM5 = "";
                let counterEM0 = 0, counterEM1 = 0, counterEM2 = 0, counterEM3 = 0, counterEM4 = 0, counterEM5 = 0;
                utils.getData().then(guildStats => {
                    timeStamp = guildStats.timestamp;
                    let em;
                    if (args.toString().search(/-all/) === -1) {
                        guildStatsFilter = guildStats.data.filter(value => value.inGuildSpreadsheet)
                        em = guildStatsFilter.map(value => [value.ign, value.currentEMS == undefined ? 0 : Number(value.currentGXP)]);
                    } else {
                        em = guildStats.data.map(value => [value.ign, value.currentEMS == undefined ? 0 : Number(value.currentGXP)]);
                    }
                    em.sort((a, b) => {
                        return b[1] - a[1];
                    })
                    if (sentStatsEM == false) {
                        for (property in em) {
                            let searchReg = new RegExp(em[property][0], "g");
                            if (em[property][1] >= 5000000) {
                                if (mileStoneEM5.search(searchReg) == -1) {
                                    mileStoneEM5 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM5++;
                                }
                            } else if (em[property][1] >= 1000000) {
                                if (mileStoneEM4.search(searchReg) == -1) {
                                    mileStoneEM4 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM4++;
                                }
                            } else if (em[property][1] >= 500000) {
                                if (mileStoneEM3.search(searchReg) == -1) {
                                    mileStoneEM3 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM3++;
                                }
                            } else if (em[property][1] >= 250000) {
                                if (mileStoneEM2.search(searchReg) == -1) {
                                    mileStoneEM2 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM2++;
                                }
                            } else if (em[property][1] >= 50000) {
                                if (mileStoneEM1.search(searchReg) == -1) {
                                    mileStoneEM1 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM1++;
                                }
                            } else if (em[property][1] < 50000) {
                                if (mileStoneEM0.search(searchReg) == -1) {
                                    mileStoneEM0 += `- ${em[property][0]}: ${em[property][1].toLocaleString("en")} EMS \n`;
                                    counterEM0++;
                                }
                            }
                        }
                        if (property == em.length - 1) {
                            let parts = [0, 0, 0, 0, 0, 0];
                            let partsString = ["", "", "", "", "", ""];
                            let mileStones = [mileStoneEM5, mileStoneEM4, mileStoneEM3, mileStoneEM2, mileStoneEM1, mileStoneEM0];
                            mileStones.forEach((elem, index) => {
                                parts[index] = Math.floor(elem.length / 1000);
                                if (Math.floor(elem.length / 1000) >= 1) {
                                    partsString[index] = utils.splitString(elem);
                                } else {
                                    partsString[index] = [elem];
                                }
                            });
                            let statsEmbed = new Discord.MessageEmbed()
                                .setTitle("EM (All Time)")
                                .setColor("#7BD19F")
                                .setFooter(`Last Update: ${(new Date(timeStamp)).toUTCString()}`);
                            partsString.forEach((elem, index) => {
                                switch (index) {
                                    case 5:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`No milestone (${counterEM0}) Part ${index + 1}`, "```css\n" + element + "```")
                                            });
                                        } else {
                                            statsEmbed.addField(`No milestone (${counterEM0})`, "```css\n" + elem + "```")
                                        }
                                        break;
                                    case 4:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`EM I (${counterEM1}) Part ${index + 1}`, "```css\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`EM I (${counterEM1})`, "```css\n" + elem + "```");
                                        }
                                        break;
                                    case 3:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`EM II (${counterEM2}) Part ${index + 1}`, "```css\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`EM II (${counterEM2})`, "```css\n" + elem + "```");
                                        }
                                        break;
                                    case 2:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`EM III (${counterEM3}) Part ${index + 1}`, "```css\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`EM III (${counterEM3})`, "```css\n" + elem + "```");
                                        }
                                        break;
                                    case 1:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`EM IV (${counterEM4}) Part ${index + 1}`, "```css\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`EM IV (${counterEM4})`, "```css\n" + elem + "```");
                                        }
                                        break;
                                    case 0:
                                        if (elem.length > 1) {
                                            elem.forEach((element, index) => {
                                                statsEmbed.addField(`EM V (${counterEM5}) Part ${index + 1}`, "```css\n" + element + "```");
                                            });
                                        } else {
                                            statsEmbed.addField(`EM V (${counterEM5})`, "```css\n" + elem + "```");
                                        }
                                        break;
                                }
                            })
                            message.channel.send(statsEmbed);
                            sentStatsEM = true;
                        }
                    }
                })
                break;
            case "AutoUpdate":
                console.log("HEWWWOOoo")
                if (message === null) {
                    let guildMembers, guildStats;
                    getGuild().then((response) => {
                        guildMembers = response
                        getData().then((response1) => {
                            guildStats = response1.data;
                            guildMembers.forEach(elem => {
                                let member = guildStats.find(user => user.uuid == elem.uuid.replace(/-/g, ""));
                                console.log("before: " + guildStats.length);
                                if (!(member == undefined)) {
                                    if (member.dateJoined.includes("/") || new Date(member.dateJoined).getUTCMilliseconds() == 0) {
                                        console.log("e")
                                        let date1 = new Date(elem.joined);
                                        let dateString = `${date1.getUTCMonth() + 1}/${date1.getUTCDate()}/${date1.getUTCFullYear()}`;
                                        let date = new Date(dateString);
                                        let dateJoin = new Date(member.dateJoined + " GMT");
                                        let joinDate = `${dateJoin.getUTCMonth() + 1}/${dateJoin.getUTCDate()}/${dateJoin.getUTCFullYear()}`;
                                        let joinedDate = new Date(joinDate);
                                        let dateLastJoin = new Date(member.lastJoin);
                                        let lastJoinDate = `${dateLastJoin.getUTCMonth() + 1}/${dateLastJoin.getUTCDate()}/${dateLastJoin.getUTCFullYear()}`;
                                        let lastJoinedDate = new Date(lastJoinDate);
                                        member.xpData == undefined ? member.xpData = [[member.currentGXP, Date.now()]]:member.xpData.push([member.currentGXP, Date.now()]); 
                                        if (date.getTime() == joinedDate.getTime()) {
                                            member.currentGXP = elem.contributed;
                                            console.log("date=dateJoined")
                                        } else if (date.getTime() == lastJoinedDate.getTime() && date.getTime() != joinedDate.getTime()) {
                                            member.currentGXP = member.currentGXP + (elem.contributed - member.alreadyAddedGXP);
                                            member.alreadyAddedGXP = elem.contributed
                                            member.xpData == undefined ? member.xpData = [[member.currentGXP, Date.now()]]:member.xpData.push([member.currentGXP, Date.now()]); 
                                        } else {
                                            member.currentGXP = member.currentGXP + elem.contributed;
                                            member.alreadyAddedGXP = elem.contributed;
                                            member.lastJoin = elem.joined;
                                            member.xpData == undefined ? member.xpData = [[member.currentGXP, Date.now()]]:member.xpData.push([member.currentGXP, Date.now()]);
                                        }
                                    } else {
                                        console.log(member.ign)
                                        let date = new Date(elem.joined);
                                        if (date == new Date(member.dateJoined)) {
                                            member.currentGXP = elem.contributed;
                                        } else if (date == new Date(member.lastJoin) && date != new Date(member.dateJoined)) {
                                            member.currentGXP = member.currentGXP + (elem.contributed - member.alreadyAddedGXP);
                                            member.alreadyAddedGXP = elem.contributed
                                            member.xpData == undefined ? member.xpData = [[member.currentGXP, Date.now()]]:member.xpData.push([member.currentGXP, Date.now()]);
                                        } else {
                                            member.currentGXP = member.currentGXP + elem.contributed;
                                            member.alreadyAddedGXP = elem.contributed;
                                            member.lastJoin = elem.joined;
                                            member.xpData == undefined ? member.xpData = [[member.currentGXP, Date.now()]]:member.xpData.push([member.currentGXP, Date.now()]);
                                        }

                                    }
                                } else if (member == undefined) {
                                    console.log("new Member: " + elem.name)
                                    gMember = new Object();
                                    gMember.dateJoined = elem.joined;
                                    gMember.ign = elem.name;
                                    gMember.uuid = elem.uuid.replace(/-/g, "");
                                    gMember.region = undefined;
                                    gMember.sl = undefined;
                                    gMember.slData = [];
                                    gMember.ahh = undefined;
                                    gMember.potsct = undefined;
                                    gMember.pillager = undefined;
                                    gMember.lastCountsGXP = undefined;
                                    gMember.currentGXP = elem.contributed;
                                    gMember.xpData = [];
                                    gMember.shoreTrader = undefined;
                                    gMember.outfitter = undefined;
                                    gMember.inGuild = true;
                                    gMember.inGuildSpreadsheet = undefined;
                                    gMember.lastJoin = elem.joined;
                                    gMember.alreadyAddedGXP = 0;
                                    guildStats.push(gMember);
                                }
                            })
                            let stats = {
                                "data": guildStats,
                                "timestamp": Date.now()
                            };
                            fs.writeFile("data/guildStats.json", JSON.stringify(stats), (err) => {
                                if (err) throw err;
                                console.log("Saved!");
                                console.log(stats.data.length);
                            });
                        });
                    });
                }
                break;
            default:
                if (!message.member.hasPermission("MANAGE_GUILD")) {
                    message.channel.send(utils.errorResponse("wrongargs", "gxp, em"));
                    break
                } else if (message.member.hasPermission("MANAGE_GUILD")) {
                    message.channel.send(utils.errorResponse("wrongargs", "update, gxp, em"));
                    break;
                }
        }
    }
};
