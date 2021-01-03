const Discord = require('discord.js');

const spreadsheet = require('../spreadsheet.js')

module.exports = {
	name: 'counts',
	description: 'Does the counts.',
	async execute(message, args) {
        if(!message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send(utils.errorResponse("noperms", "MANAGE_GUILD"));
            return;
        }
        if(args.length == 0){
        spreadsheet.accessSpreadsheet("counts").then(() => {
            message.channel.send("Counts speedrun has started!")
        })
    }else if(args[0] == "update"){
        spreadsheet.accessSpreadsheet("update");
        message.channel.send("Guildstats have been updated from the spreadsheet.")
    }
    }
};