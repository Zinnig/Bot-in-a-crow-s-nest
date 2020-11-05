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
        fs.readFile('Allies.json', (err, data) => {
            if (err) throw err;
                allies = data
                try {
                    allyListJSON = JSON.parse(data);
                } catch (e) {
                    //empty
                }
        
        
        
        if (args[0].match(/(Fox)/gi)) {
            message.channel.send(makeSubGuildString("Fox", allyListJSON))
        } else if (args[0].match(/(Imp)/gi)) {
            message.channel.send(makeSubGuildString("Imp", allyListJSON))
        } else if (args[0].match(/(AVO)/gi)) {
            message.channel.send(makeSubGuildString("AVO", allyListJSON))
        } else if (args[0].match(/(BNU)/gi)) {
            message.channel.send(makeSubGuildString("BNU", allyListJSON))
        } else if (args[0].match(/(ESI)/gi)) {
            message.channel.send(makeSubGuildString("ESI", allyListJSON))
        } else if (args[0].match(/(Hax)/gi)) {
            message.channel.send(makeSubGuildString("Hax", allyListJSON))
        } else if (args[0].match(/(LXA)/gi)) {
            message.channel.send(makeSubGuildString("LXA", allyListJSON))
        } else if (args[0].match(/(PUN)/gi)) {
            message.channel.send(makeSubGuildString("PUN", allyListJSON))
        } else if (args[0].match(/(ANO)/gi)) {
            message.channel.send(makeSubGuildString("ANO", allyListJSON))
        } else if (args[0].match(/(ERN)/gi)) {
            message.channel.send(makeSubGuildString("ERN", allyListJSON))
        } else if (args[0].match(/(Phi)/gi)) {
            message.channel.send(makeSubGuildString("Phi", allyListJSON))
        }else if (args[0].match(/(TNL)/gi)){
            message.channel.send(makeSubGuildString("TNL", allyListJSON))
        } else {
            message.channel.send("The guild with this tag doesn't exist, or isn't in Artemis.")
        }
    })
	},
};