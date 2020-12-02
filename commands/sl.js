const Discord = require('discord.js');

const utils = require('../utils.js')
const spreadsheet = require('../spreadsheet.js')

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'sl',
	description: "Set/Remove a guild member's shore leave",
	execute(message, args) {
        if(message.member.hasPermission("MANAGE_GUILD")){
            let outputJSON = {};
            let reason = "";
            //sl set Username Date Reason
            let resTextGuildStats = "";
            let xmlGuildStats = new XMLHttpRequest();
            xmlGuildStats.open("GET", process.env.guildStatsURL);
            xmlGuildStats.setRequestHeader("Content-Type", "application/json");
            xmlGuildStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlGuildStats.setRequestHeader("versioning", false);
            xmlGuildStats.onreadystatechange = () => {
                if(xmlGuildStats.status == 200 && xmlGuildStats.readyState == 4){
                    try {
                        resTextGuildStats = JSON.parse(xmlGuildStats.responseText);
                        let member = resTextGuildStats.data.filter(member => member.ign == args[1])[0];
                        if(member.length == 0){
                            console.log("e")
                            message.channel.send(utils.errorResponse("guildmembernotfound", args[1]));
                            return;
                        }else{
                            switch(args[0]){
                                case "set":
                                    member.sl = true;
                                    if(Date.now() > Date.parse(args[2])){
                                        message.channel.send(utils.errorResponse("wrongdate"))
                                        return;
                                    }
                                    reason = args.splice(3).join().replace(/,/g, " ");
                                    member.slData.push({
                                        "ign": args[1],
                                        "from": Date.now(),
                                        "until": Date.parse(args[2]),
                                        "reason": reason,
                                        "active": true
                                    });
                                   
                                    outputJSON = {
                                        "data": resTextGuildStats.data,
                                        "timestamp": Date.now()
                                    };
                                    spreadsheet.accessSpreadsheet("sl", member.slData);
                                    /* 
                                    xmlStats = new XMLHttpRequest();
                                    xmlStats.open("PUT", process.env.guildStatsURL);
                                    xmlStats.setRequestHeader("Content-Type", "application/json");
                                    xmlStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlStats.setRequestHeader("versioning", false)
                                    xmlStats.send(JSON.stringify(outputJSON))  */
                                    message.channel.send(`${args[1]} is now on Shore Leave until ${new Date(args[2]).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}; for the reason: "${reason}"`)
                                    break;
                                case "remove":
                                    member.sl = false;
                                    member.slData.find(data => data.active == true)[0].active = false;
                                    outputJSON = {
                                        "data": resTextGuildStats.data,
                                        "timestamp": Date.now()
                                    };
                                    /* xmlStats = new XMLHttpRequest();
                                    xmlStats.open("PUT", process.env.guildStatsURL);
                                    xmlStats.setRequestHeader("Content-Type", "application/json");
                                    xmlStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlStats.setRequestHeader("versioning", false)
                                    xmlStats.send(JSON.stringify(outputJSON))  */
                                    break;
                                default:
                                    utils.errorResponse("wrongargs", "set, remove");
                                    break;
                            }
                        }
                        
                    } catch (e) {
                       throw e; 
                    }
                }
            }
            xmlGuildStats.send();
    }else{
        message.channel.send(utils.errorResponse("noperms", "MANAGE_GUILD"));
        return;
    }
},
};