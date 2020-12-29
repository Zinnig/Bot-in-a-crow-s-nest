const fs = require('fs')
let returnStr;
function makeSubGuildString(guildTag, a) {
    returnStr = "";
    if (Object.keys(a["Subguilds"][guildTag]).length == 0) {
        returnStr = guildTag + " has no subguilds."
    } else {
        returnStr = guildTag + " has the following subguilds: \n"
        for (property in a["Subguilds"][guildTag]) {
            returnStr += `- [${a["Subguilds"][guildTag][property]}] ${property} \n`
        }
    }
    return returnStr;
	}

module.exports = {
	name: 'subs',
	description: "Lists the sub guilds of the selected guild (which is in Artemis)",
	execute(message, args) {
        if(!message.member.roles.cache.has('472859173730648065') && !message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send(utils.errorResponse("notaguildmember", ""));
            return;
        }
        fs.readFile('Allies.json', (err, data) => {
            if (err) throw err;
                allies = data
                try {
                    allyListJSON = JSON.parse(data);
                } catch (e) {
                    //empty
                }
        
        
        
        if (args[0].match(/(Fox)/gi)) {
            message.channel.send(makeSubGuildString("Fox", allyListJSON));
        } else if (args[0].match(/(Imp)/gi)) {
            message.channel.send(makeSubGuildString("Imp", allyListJSON));
        } else if (args[0].match(/(ESI)/gi)) {
            message.channel.send(makeSubGuildString("ESI", allyListJSON));
        } else if (args[0].match(/(Hax)/gi)) {
            message.channel.send(makeSubGuildString("Hax", allyListJSON));
        } else if (args[0].match(/(LXA)/gi)) {
            message.channel.send(makeSubGuildString("LXA", allyListJSON));
        } else if (args[0].match(/(PUN)/gi)) {
            message.channel.send(makeSubGuildString("PUN", allyListJSON));
        } else if (args[0].match(/(ANO)/gi)) {
            message.channel.send(makeSubGuildString("ANO", allyListJSON));
        } else if (args[0].match(/(ERN)/gi)) {
            message.channel.send(makeSubGuildString("ERN", allyListJSON));
        } else if (args[0].match(/(Phi)/gi)) {
            message.channel.send(makeSubGuildString("Phi", allyListJSON));
        }else if (args[0].match(/(ILQ)/gi)){
            message.channel.send(makeSubGuildString("ILQ", allyListJSON));
        }else if (args[0].match(/(Apa)/gi)){
            message.channel.send(makeSubGuildString("Apa", allyListJSON));
        }else if (args[0].match(/(MYC)/gi)){
            message.channel.send(makeSubGuildString("MYC", allyListJSON));
        }else if (args[0].match(/(NFR)/gi)){
            message.channel.send(makeSubGuildString("NFR", allyListJSON));
        }else if (args[0].match(/(wyy)/gi)){
            message.channel.send(makeSubGuildString("wyy", allyListJSON));
        }else if (args[0].match(/(Zri)/gi)){
            message.channel.send(makeSubGuildString("Zri", allyListJSON));
        } else {
            message.channel.send("The guild with this tag doesn't exist, or isn't in Artemis.")
        }
    })
	},
};