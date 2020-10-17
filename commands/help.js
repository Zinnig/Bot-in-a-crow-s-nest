module.exports = {
	name: 'help',
	description: 'Gives you this fancy list of commands.',
	execute(message, args) {
		message.channel.send(`*Sliding into your dms...*`)
        const commandEmbed = new Discord.RichEmbed()
            .setColor('#ffa20d')
            .setTitle('The pirated command list')
            .setDescription('This list has been discovered using a telescope!')
            .addField('Text Commands', `
            **- %help **
                Gives you this fancy list of commands.
            **- %ping **
                Returns the Ping to the API/to the bot/host.
            **- %war **
                Gives you a list of territories you can attack. They're sorted by priority.
            **- %subs GuildTagHere **
                Lists the sub guilds of the selected guild (which is in Artemis)
            **- %caniattack GuildTagHere **
                Tells you if you should attack a certain guild.
            **- %timeinguild GuildNameHere **
                Lists all players in a guild and how long they've been in it.
            ` )

        message.author.send(commandEmbed)
	},
};