
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
    }
    return errorEmbed
}

module.exports = {
	name: 'reservetome',
	description: "Mark the next tomes to be given out on a custom rule.",
	aliases: [],
	execute(message, args) {
        if(message.member.hasPermission("MANAGE_GUILD")){
            let amount = Number(args[0]);
            if (Number.isNaN(amount)) {
                amount = 1;
            }
            const data = JSON.parse(fs.readFileSync("../data/rewardData.json", "utf-8"));
            data.tomesReserved += amount;
            fs.writeFileSync("../data/rewardData.json", JSON.stringify(data, null, 2));
            message.channel.send((new Discord.MessageEmbed()).setTitle("reserveTome").setDescription(`**${amount}** tomes have been marked to be off-rule`));
        }else{
            message.channel.send(errorResponse("noperms", "MANAGE_GUILD"))
        }
    } 
};
