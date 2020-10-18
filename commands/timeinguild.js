const Discord = require('discord.js')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let sorting = ["OWNER", "CHIEF", "CAPTAIN", "RECRUITER", "RECRUIT"]
let timeList = [];
let resTime = "";
let sentTime = false;
let ownerString = "";
let chiefString = "";
let captainString = "";
let recruiterString = "";
let recruitString = "";
let e = 0;
function index(a, arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
        }
    }
    return -1;
}
function setupTimeDiff(diff) {
	years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000))
	days = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
	hours = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
	minutes = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000) - hours * (60 * 60 * 1000)) / (60 * 1000))
	//seconds = Math.floor(diff  - years*(365*24*60*60*1000) - days*(24*60*60*1000) - hours*(60*60*1000) - minutes*(60*1000))/1000

	return `${years > 0 ? years + "y:" : ""}${days > 0 ? days + "d:" : ""}${hours > 0 ? hours + "h:" : ""}${minutes > 0 ? minutes + "min" : ""}`;
}
module.exports = {
	name: 'timeinguild',
	description: "Lists all players in a guild and how long they've been in it.",
	execute(message, args) {
        let input = args.join().replace(/,/, " ");
        let now = Date.now()
        xmlTime = new XMLHttpRequest();
        xmlTime.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=" + input);
        xmlTime.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4) {
                try {
                    resTime = JSON.parse(this.responseText);
                } catch (e) {
                    //empty
                }
                for (property in resTime.members) {
                    if (index(resTime.members[property].name, timeList) == -1) {
                        timeList.push([resTime.members[property].name, resTime.members[property].rank, setupTimeDiff(now - Date.parse(resTime.members[property].joined))]);
                        timeList.sort(function (a, b) {
                            return sorting.indexOf(a[1]) - sorting.indexOf(b[1]);
                        });
                    }
                }
            }
            if (sentTime == false) {
                for (property in timeList) {
                    e++;
                    switch (timeList[property][1]) {
                        case "OWNER":
                            ownerString = `- ${timeList[0][0]} has been in the guild for ${timeList[0][2]}`;
                            break;
                        case "CHIEF":
                            chiefString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
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
                        let rankStrings = [chiefString, captainString, recruiterString, recruitString];
                        let timeEmbed = new Discord.RichEmbed()
                            .setTitle(`Time in the guild "${input}"`)
                            .setColor("#123456")
                            .addField("Owner", "```" + ownerString + "```")
                        for (property in rankStrings) {
                            if (rankStrings[property].length > 1024) {
                                let n = Math.floor(rankStrings[property].length / 1024)
                                for (i = 0; i <= n; i++) {
                                    console.log(property)
                                    timeEmbed.addField(chiefString == rankStrings[property] ?
                                        "Chiefs Part " + (i + 1) : captainString == rankStrings[property] ?
                                            "Captains Part " + (i + 1) : recruiterString == rankStrings[property] ?
                                                "Recruiters Part " + (i + 1) : recruitString == rankStrings[property] ?
                                                    "Recruits Part " + (i + 1) : "Error", chiefString == rankStrings[property] ?
                                        "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "```" : captainString == rankStrings[property] ?
                                            "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "```" : recruiterString == rankStrings[property] ?
                                                "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "```" : recruitString == rankStrings[property] ?
                                                    "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "```" : "Error");
                                }
                            } else {
                                timeEmbed.addField(chiefString == rankStrings[property] ? "Chiefs" : captainString == rankStrings[property] ? "Captains" : recruiterString == rankStrings[property] ? "Recruiters" : recruitString == rankStrings[property] ? "Recruits" : "Error", chiefString == rankStrings[property] ? "```" + chiefString + "```" : captainString == rankStrings[property] ? "```" + captainString + "```" : recruiterString == rankStrings[property] ? "```" + recruiterString + "```" : recruitString == rankStrings[property] ? "```" + recruitString + "```" : "Error");
                            }
                        }
                        if (sentTime == false) {
                            message.channel.send(timeEmbed)
                            sentTime = true;
                        }

                    }

                }


            }

        }
        xmlTime.send();
	},
};