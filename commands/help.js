const Discord = require('discord.js');
const utils = require('../utils.js');
module.exports = {
	name: 'help',
	description: 'Gives you this fancy list of commands.',
	execute(message, args) {
        message.channel.send(`*Sliding into your dms...*`)
        helpString = `**- %help **: Gives you this fancy list of commands.
            **- %ping **: Returns the Ping to the API/to the bot/host.
            **- %war **: Gives you a list of territories you can attack. They're sorted by priority.
            **- %subs GuildTagHere **: Lists the sub guilds of the selected guild (which is in Artemis)
            **- %caniattack GuildTagHere **: Tells you if you should attack a certain guild.
            **- %timeinguild GuildNameHere **: Lists all players in a guild and how long they've been in it.
            **- %userstats GuildMemberNameHere **: Returns an embed containing statistics and other information.
            **- %guildstats em/gxp **: Returns leaderboards for XP/Emeralds contributed to the guild.
            **- %sincelastcounts **: Returns an embed containing the amount of gxp/ems the Pillagers have farmed since the last counts.
            **- %soulpoints**:Returns the time until the next Soul Point for each server. (Alias: %sp and %sps)` 
        if(!message.member.hasPermission("MANAGE_GUILD")){
        const commandEmbed = new Discord.MessageEmbed()
            .setColor('#ffa20d')
            .setTitle('The pirated command list')
            .setDescription('This list has been discovered using a telescope!')
            utils.splitString(helpString).forEach((elem, index) => {
                commandEmbed.addField(`Text Commands ${index+1}`, elem)
            })

        message.author.send(commandEmbed)
        }else if(message.member.hasPermission("MANAGE_GUILD")){
            const commandEmbed = new Discord.MessageEmbed()
            .setColor('#ffa20d')
            .setTitle('The pirated command list')
            .setDescription('This list has been discovered using a telescope!')
            .addField('Admin Commands 1', `
            **- %reactionroles Role Emoji EmbedTitle (-e Description)**: Create an embed which gives you the specified role if you react with the specified emoji.
            **- %vote start/end TitleHere **: Create/End Votes
            **- %guildstats update **: Updates the guildstats (You have to attach a txt file containing the gu list.)
            **- %counts (update) **: Does the Pillager counts. (update is for updating the data by getting the data of the PUN Member Roles.)`)
            utils.splitString(helpString).forEach((elem, index) => {
                commandEmbed.addField(`Text Commands ${index+1}`, elem)
            })

        message.author.send(commandEmbed);
        }
	},
};