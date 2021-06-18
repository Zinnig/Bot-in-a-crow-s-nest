module.exports = {
	name: 'ping',
	description: 'Returns the Ping to the API/to the bot/host.',
	async execute(message, args, client) {
		const msg = await message.channel.send(`Pinging...`);
        msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms \nAPI Latency is ${Math.round(client.ws.ping)}ms`)
	},
};
