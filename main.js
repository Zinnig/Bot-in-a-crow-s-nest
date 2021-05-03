const Discord = require('discord.js');
const utils = require('./utils.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
//for local testing
require('custom-env').env()
const token = process.env.token;
const prefix = process.env.prefix;

client.login(token);
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.on("ready", () => {
    console.log("Started...");
    client.user.setPresence({
        status: 'online',
        activity: {
            name: `${prefix}help`,
            type: "LISTENING"
        }
    });
});

function index(a, arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
        }
    }
    return -1;
}
process.on('unhandledRejection', async error => {
    let me = await client.users.fetch('282964164358438922');
    me.send(`Unhandled promise rejection: \n${error.stack}`);
});
client.on("message", async message => {   
    if (message.author.bot) return;
    if (!message.guild) return;
   // if (!message.content.startsWith(prefix) && message.type !== 'GUILD_MEMBER_JOIN' /*&& message.content.indexOf('<@&472859173730648065>') == -1*/) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    //check if message is in #welcome
    if (message.channel.id === "514453846676996097" && message.type === "GUILD_MEMBER_JOIN") {
        message.react("✔️")
            .then(() => message.react("✅"))
            .then(() => message.react("☑️"))
            .catch(() => console.log(`Failed to assign all emojis to the join message of ${message.author.tag}`));
        }
    if(message.channel.id === '346392052046757888' && message.content.indexOf('<@&472859173730648065>') !== -1){
        message.react('👍')
            .then(() => message.react('753502162079711293'))
            .then(() => message.react('👎'));
        if(message.content.search(/'/g) !== -1){
            start = message.content.search(/>/);
            pos = message.content.search(/'/);
            ign = message.content.substring(start+2, pos);
            let player = await utils.getPlayer(ign);
            if(player == undefined) message.channel.send(`The stats of the player **${ign}** couldn't be found!`);
            let embed = new Discord.MessageEmbed()
            .setColor(Math.floor(Math.random()*16777215).toString(16))
            .setTitle(player.meta.tag.value === null ? player.username :`[${player.meta.tag.value}] ${player.username}`)
            .setDescription(player.meta.location.online ? `Online on ${player.meta.location.server}`:'Offline')
            .addFields(
                {name: 'Total Playtime', value:`${Math.floor(player.meta.playtime/60*4.7)}h`, inline: false},
                {name: 'Average Daily Playtime', value: `${(((player.meta.playtime/60*4.7)/((Date.now()-Date.parse(player.meta.firstJoin))/86400000))).toFixed(2)}h`, inline: false},
                {name: 'Highest Combat Level', value: await utils.getHighestClass(player), inline: false}
                )
            .setTimestamp();
            message.channel.send(embed)
        }
    }

    switch(cmd){
        case "ping":
            client.commands.get('ping').execute(message, args, client.ws.ping);
            break;
        case "help":
            client.commands.get('help').execute(message, args);
            break;
        case "war":
            client.commands.get('war').execute(message, args);
            break;
        case "subs":
            client.commands.get('subs').execute(message, args);
            break;
        case "caniattack":
            client.commands.get('caniattack').execute(message, args);
            break;
        case "timeinguild":
            client.commands.get('timeinguild').execute(message, args);
            break;
        case "reactionroles":
            client.commands.get('reactionroles').execute(message, args);
            break;
        case "vote":
            client.commands.get('vote').execute(message, args);
            break;
        case "guildstats":
            client.commands.get('guildstats').execute(message, args);
            break;
        case "userstats":
            client.commands.get('userstats').execute(message, args);
            break;
        case "counts":
            client.commands.get('counts').execute(message, args);
            break;
        case "sincelastcounts":
            client.commands.get('sincelastcounts').execute(message, args);
            break;
        case "sl":
            client.commands.get('sl').execute(message, args);
            break;
        case "inactivity":
            client.commands.get('inactivity').execute(message, args);
            break;
        case "sp":
        case "sps":
        case "soulpoints":
            client.commands.get('soulpoints').execute(message, args);
            break;
        case "edit":
            client.commands.get('edit').execute(message, args, client);
            break;
        case "guildwarleaderboard":
        case "gwl":
            client.commands.get('guildwarleaderboard').execute(message, args);
            break;
        default:
            if(message.content.startsWith(prefix)){
                unknownCommandEmbed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Unknown Command!")
                .setDescription(`Try ${prefix}help for a command list.`);
                message.channel.send(unknownCommandEmbed);
            }
            break;
    }
    
}); 
client.on("raw", async packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    let msg = await client.channels.cache.get(packet.d.channel_id).messages.fetch(packet.d.message_id);
    if(!(msg.author.id == '639956302788820993' || msg.author == '761658848217137222' || msg.system === true)) return; 
    if(packet.t == 'MESSAGE_REACTION_ADD'){
        if(packet.d.user_id == client.user.id) return;
        if(packet.d.channel_id == "514453846676996097") {
            //get user
            guild = client.guilds.cache.get(packet.d.guild_id);
            guild.members.fetch(msg.author.id).then(author => {
                switch (packet.d.emoji.name) {
                    case "✔️":
                        author.roles.add("513527251674071040"); //Stowaways
                        break;
                    case "✅":
                        author.roles.add("472859173730648065"); //Guild Member
                        break;
                    case "☑️":
                        author.roles.add("513527246703820800"); //Brethren of the Coast
                        break;
                    default:
                        break;
                }
                return;
        })
        }
        if(packet.d.emoji.name == '👍' || packet.d.emoji.name == '👎') {
            let xmlVoteRaw = new XMLHttpRequest();
            xmlVoteRaw.open("GET", process.env.voteURL)
            xmlVoteRaw.setRequestHeader("Content-Type", "application/json");
            xmlVoteRaw.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlVoteRaw.setRequestHeader("versioning", false)
            xmlVoteRaw.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        try{
                            let resTextVoteRaw = JSON.parse(this.responseText)
                            let voteArray = resTextVoteRaw.data[index(packet.d.message_id, resTextVoteRaw.data)];
                            let yes = voteArray[4];
                            let no = voteArray[5]
                                if(packet.d.emoji.name == '👍'){
                                msg.reactions.resolve('👍').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if(voteArray[6].indexOf(packet.d.user_id) == -1 && voteArray[7].indexOf(packet.d.user_id) == -1){
                                    voteArray[6].push(packet.d.user_id)
                                    yes++;
                                    voteArray[4] = yes;
                                }else if(voteArray[7].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[6].push(packet.d.user_id)
                                    voteArray[7].splice(voteArray[7].indexOf(packet.d.user_id), 1)
                                    yes++; 
                                    no--;
                                    voteArray[4] = yes;
                                    voteArray[5] = no;
                                }
                                    let xmlVotePUT = new XMLHttpRequest();
                                    xmlVotePUT.open("PUT", process.env.voteURL)
                                    xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                    xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlVotePUT.setRequestHeader("versioning", false)
                                    xmlVotePUT.send(JSON.stringify(resTextVoteRaw))
                                    let edit = new Discord.MessageEmbed()
                                    .setTitle(voteArray[2])
                                    .setColor(voteArray[3])
                                    .addField("Options", "👍: yes \n 👎: no")
                                    .setFooter(`Total Votes: ${voteArray[4] + voteArray[5]}`);
                                    msg.edit(edit)
                            }else if(packet.d.emoji.name == '👎'){
                                msg.reactions.resolve('👎').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if(voteArray[7].indexOf(packet.d.user_id) == -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[7].push(packet.d.user_id)
                                    no++;
                                    voteArray[5] = no;
                                }else if(voteArray[6].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[7].push(packet.d.user_id)
                                    voteArray[6].splice(voteArray[6].indexOf(packet.d.user_id), 1)
                                    no++;
                                    yes--;
                                    voteArray[5] = no;
                                    voteArray[4] = yes;
                                    }
                                    xmlVotePUT.open("PUT", process.env.voteURL)
                                    xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                    xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlVotePUT.setRequestHeader("versioning", false)
                                    xmlVotePUT.send(JSON.stringify(resTextVoteRaw)) 
                                    let edit = new Discord.MessageEmbed()
                                    .setTitle(voteArray[2])
                                    .setColor(voteArray[3])
                                    .addField("Options", "👍: yes \n 👎: no")
                                    .setFooter(`Total Votes: ${voteArray[4] + voteArray[5]}`);
                                    msg.edit(edit)
                                }
                        }catch(e){
                            //empty
                        }
                    }
                }
            xmlVoteRaw.send()
           
        }else{
            let guild = client.guilds.cache.get(packet.d.guild_id);
            let rrData = await utils.getRRData();
            let obj = rrData.data.find(n => Object.keys(n).includes(packet.d.message_id));
            let emoRol = obj[packet.d.message_id].find(i => i.emoji === packet.d.emoji.name ||i.emoji === `<:${packet.d.emoji.name}:${packet.d.emoji.id}>`);
                guild.members.fetch(packet.d.user_id).then(member => {
                    member.roles.add(emoRol.role.replace("<@&", "").replace(">", ""));
                });
    } 
    }else if(packet.t == 'MESSAGE_REACTION_REMOVE'){
        if(packet.d.user_id == client.id) return;
        let guild = client.guilds.cache.get(packet.d.guild_id);
        let rrData = await utils.getRRData();
        let obj = rrData.data.find(n => Object.keys(n).includes(packet.d.message_id));
            let emoRol = obj[packet.d.message_id].find(i => i.emoji === packet.d.emoji.name ||i.emoji === `<:${packet.d.emoji.name}:${packet.d.emoji.id}>`);
                guild.members.fetch(packet.d.user_id).then(member => {
                    member.roles.remove(emoRol.role.replace("<@&", "").replace(">", ""));
                });
    }
})
client.on("voiceStateUpdate", () => {
    const guild = client.guilds.cache.get('463736564837777428')
    const channels = guild.channels.cache.filter(c => c.parentID === '468697649592401920' && c.type === 'voice');

    for (const [channelID, channel] of channels) {
        for (const [memberID, member] of channel.members) {
            if (channel.id === '666379507522863104') {
                console.log("ChannelID: " + channelID + "\nMemberID: " + memberID);
                member.voice.setChannel('666381898343514133')
                    .then(() => console.log(`Moved ${member.user.tag}.`))
                    .catch(console.error);
            }
        }
    }
})