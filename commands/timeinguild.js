const Discord = require('discord.js')
const utils = require('../utils.js')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let sorting = ["OWNER", "CHIEF", "CAPTAIN", "RECRUITER", "RECRUIT"]
module.exports = {
	name: 'timeinguild',
	description: "Lists all players in a guild and how long they've been in it.",
	execute(message, args) {
        let timeList = [];
        let resTime = "";
        let sentTime = false;
        let ownerString = "";
        let chiefString = "";
        let strategistString = "";
        let captainString = "";
        let recruiterString = "";
        let recruitString = "";
        let e = 0;
        let input = args.join().replace(/,/g, " ");
        let now = Date.now()
        xmlTime = new XMLHttpRequest();
        xmlTime.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=" + input);
        xmlTime.onreadystatechange = function () {
            if (xmlTime.status == 200 && xmlTime.readyState == 4) {
                try {
                    resTime = JSON.parse(this.responseText);
                    if(resTime.error == 'Guild not found'){
                        message.channel.send(utils.errorResponse("guildnotfound", input)) 
                        return;
                    }
                } catch (e) {
                    //empty
                }
                for (property in resTime.members) {
                    if (utils.index(resTime.members[property].name, timeList) == -1) {
                        timeList.push([resTime.members[property].name, resTime.members[property].rank, utils.setupTimeDiff(now - Date.parse(resTime.members[property].joined))]);
                        timeList.sort(function (a, b) {
                            return sorting.indexOf(a[1]) - sorting.indexOf(b[1]);
                        });
                    }
                }
            }
            //TODO: make it work for more than 2 lists.
            if (sentTime == false) {
                for (property in timeList) {
                    e++;
                    switch (timeList[property][1]) {
                        case "OWNER":
                            ownerString = `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}`;
                            break;
                        case "CHIEF":
                            chiefString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "STRATEGIST":
                            strategistString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "CAPTAIN":
                            captainString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "RECRUITER":
                            recruiterString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "RECRUIT":
                            recruitString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                    }
                    if (e >= timeList.length) {
                        let f = 1;
                        let recruits = false;
                        let rankStrings = [chiefString, strategistString, captainString, recruiterString, recruitString];
                        let rankStringsV2 = [[], [], [], [], []]
                        let chiefStrings = 1, strategistStrings = 1, captainStrings = 1, recruiterStrings = 1, recruitStrings = 1;
                        let timeEmbed = new Discord.MessageEmbed()
                            .setTitle(`Time in the guild "${input}"`)
                            .setColor("#123456")
                            .addField("Owner", "```" + ownerString + "```")
                        for (property in rankStrings) {
                            utils.splitString(rankStrings[property]).forEach(elem => {
                                rankStringsV2[property].push([elem, property])
                            })
                            rankStringsV2[property].forEach(elem => {
                                f++;
                                switch(elem[1]){
                                    case "0":
                                        timeEmbed.addField(rankStringsV2[property].length == 1? "Chiefs" : "Chiefs Part " + chiefStrings, "```"+ elem[0] + "```");
                                        chiefStrings++;
                                        break;
                                    case "1":
                                        timeEmbed.addField(rankStringsV2[property].length == 1? "Strategists" : "Strategists Part " + strategistStrings, "```"+ elem[0] + "```");
                                        strategistStrings++;
                                        break;
                                    case "2":
                                        timeEmbed.addField(rankStringsV2[property].length == 1? "Captains" : "Captains Part " + captainStrings, "```"+ elem[0] + "```");
                                        captainStrings++;
                                        break;
                                    case "3":
                                        timeEmbed.addField(rankStringsV2[property].length == 1? "Recruiters" : "Recruiters Part " + recruiterStrings, "```"+ elem[0] + "```");
                                        recruiterStrings++;
                                        break;
                                    case "4":
                                        timeEmbed.addField(rankStringsV2[property].length == 1? "Recruits" : "Recruits Part " + recruitStrings, "```"+ elem[0] + "```");
                                        recruitStrings++;
                                        recruits = true;
                                        break;
                                }
                            })
                            if(sentTime == false && timeEmbed.fields.length == f && recruits == true){
                                message.channel.send(timeEmbed);
                                recruits = false;
                            }
                        }

                    }

                }


            }

        }
        xmlTime.send();
	},
};