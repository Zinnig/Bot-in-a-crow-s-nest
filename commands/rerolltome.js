const Discord = require('discord.js');
const fs = require("fs");
function errorResponse(type, extraInfo){
    let errorEmbed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    switch(type){
        case "noperms":
            errorEmbed.setTitle(`You don't have the permission "${extraInfo}".`)
            break;
        case "wrongargs":
            errorEmbed.setTitle(`Invalid Arguments! Valid Arguments: ${extraInfo}`)
        case "invalidinput":
            errorEmbed.setTitle(`Ivalid Input! ${extrainfo}`);
    }
    return errorEmbed
}

module.exports = {
	name: 'rerolltome',
	description: "Removes the specific tome ID, causing it to be rerolled.",
	execute(message, args) {
        if(message.member.hasPermission("MANAGE_GUILD")){
            const id = Number(args[0]);
            if (!Number.isNaN(id)) {
                const data = JSON.parse(fs.readFileSync("../data/rewardData.json", "utf-8"));
                //splice ID from guildTomes
                const tomeIndex = data.guildTomes.findIndex(t => t.id === id);
                if (tomeIndex < 0) {
                    return message.channel.send(errorResponse("ivalidinput", `There is no tome with ID ${id}`));
                }
                data.guildTomes.splice(tomeIndex, 1);
                //remove from members
                let memberTomeIndex = 0;
                const memberIndex = data.members.findIndex(mem => {
                   const tidx = mem.previousTomes.findIndex(t => t.id === id);
                   if (tidx >= 0) {
                       memberTomeIndex = tidx;
                       return true;
                   }
                   return false;
                });
                if (memberIndex >= 0) {
                    data.members[memberIndex].previousTomes.splice(memberTomeIndex, 1);
                }
                fs.writeFileSync("../data/rewardData.json", JSON.stringify(data, null, 2));
                message.channel.send((new Discord.MessageEmbed()).setTitle("rerolltome").setDescription(`Tome **${id}** has been spliced from data, it will be rerolled soon.`));
            } else {
                message.channel.send(errorResponse("wrongargs", "``ID``"));
            }
        }else{
            message.channel.send(errorResponse("noperms", "MANAGE_GUILD"))
        }
    } 
};
