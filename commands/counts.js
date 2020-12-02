const Discord = require('discord.js');

const spreadsheet = require('../spreadsheet.js')

module.exports = {
	name: 'counts',
	description: 'Does the counts.',
	async execute(message, args) {
        if(args.length == 0){
        spreadsheet.accessSpreadsheet("counts").then(() => {
            message.channel.send("Counts speedrun has started!")
        })
    }else if(args[0] == "update"){
        spreadsheet.accessSpreadsheet("update")
    }
    }
};