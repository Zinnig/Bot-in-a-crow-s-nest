const Discord = require('discord.js');
const client = new Discord.Client();
//for local testing
require('custom-env').env()

const token = process.env.token;

    const xpReqs = [110,
    190,
    275,
    385,
    505,
    645,
    790,
    940,
    1100,
    1370,
    1570,
    1800,
    2090,
    2400,
    2720,
    3100,
    3600,
    4150,
    4800,
    5300,
    5900,
    6750,
    7750,
    8900,
    10200,
    11650,
    13300,
    15200,
    17150,
    19600,
    22100,
    24900,
    28000,
    31500,
    35500,
    39900,
    44700,
    50000,
    55800,
    62000,
    68800,
    76400,
    84700,
    93800,
    103800,
    114800,
    126800,
    140000,
    154500,
    170300,
    187600,
    206500,
    227000,
    249500,
    274000,
    300500,
    329500,
    361000,
    395000,
    432200,
    472300,
    515800,
    562800,
    613700,
    668600,
    728000,
    792000,
    860000,
    935000,
    1040400,
    1154400,
    1282600,
    1414800,
    1567500,
    1730400,
    1837000,
    1954800,
    2077600,
    2194400,
    2325600,
    2455000,
    2645000,
    2845000,
    3141100,
    3404710,
    3782160,
    4151400,
    4604100,
    5057300,
    5533840,
    6087120,
    6685120,
    7352800,
    8080800,
    8725600,
    9578400,
    10545600,
    11585600,
    12740000,
    14418250,
    16280000,
    21196500,
    23315500,
    25649000,
    249232940]
client.login(token);

let statuses = ["online", "idle", "dnd"];
let i = 0;
let astatus;
client.on("ready", () => {
    console.log("Started...");
    setInterval(function(){
    if(i<=3){
    astatus = statuses[i]
    i++;
    client.user.setPresence({
        status: astatus,
        game: {
            name: "%help",
            type: "LISTENING"
        }
    });
    }else if(i>3){
        i = 0;
    }

    }, 1000);
    
});
client.on("message", async message => {
    const prefix = "%";

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd == "ping"){
        const msg = await message.channel.send(`Pinging...`);
        
        msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms \nAPI Latency is ${Math.round(client.ping)}ms`)
    }
    if(cmd == "help"){
        const commandEmbed = new Discord.RichEmbed()
            .setColor('#ffa20d')
            .setTitle('The pirated command list')
            .setDescription('This list has been discovered using the telescope!')
            .addField('Text Commands', '- %ping \n - %xpreq')  
            message.author.send(commandEmbed)  
        }
        
    if(cmd === "xpreq"){
        message.channel.send("```yaml \n" + xpReqs + "```")
    }
    if(cmd === "movechannel"){
        let channel = message.guild.channels.find(args[0], "channel")
        message.channel.send("Channel " + channel + " found.")
    }
    /* if(cmd == "guildtrack" && args[0] == "add"){
        await message.channel.send(getGuild(args.slice(3)));
    }
  */ 
});

client.on("voiceStateUpdate", () =>{
    const guild = client.guilds.get('463736564837777428')
    const channels = guild.channels.filter(c => c.parentID === '468697649592401920' && c.type === 'voice');

    for (const [channelID, channel] of channels) {
    for (const [memberID, member] of channel.members) {
        if(channel.id === '666379507522863104'){
        console.log("ChannelID: " + channelID + "\nMemberID: " +  memberID);
        member.setVoiceChannel('666381898343514133')
        .then(() => console.log(`Moved ${member.user.tag}.`))
        .catch(console.error);
        }
    }
}
});

   
/* function getGuild(name){
   guild = name;
   $.getJSON('https://api.wynncraft.com/public_api.php?action=onlinePlayers', onlinePlayers()).done(function() {
		console.log('online players request succeeded!');
    });

}
playerList = [];
function onlinePlayers(data){
    console.log("Start collection");
	if (!data.message) {
		$.each(data, function(wc, list){
			$.each(list, function(num, player){
				playerList[player] = wc;
			});
		});
	} else {
		console.log("Error loading online players!");
		console.log("API message: "+data.message);
	}
	playerListComplete = true;
    console.log("Collection complete");
    $.getJSON('https://api.wynncraft.com/public_api.php?action=guildStats&command=' + guild, loadStats()).done(function() {
		console.log('guild stats request succeeded!');
    
})};
function loadStats(guild){
    var onlinePlayersCount = 0;
    ranks = {
        OWNER : [],
        CHIEF: [],
        CAPTAIN: [],
        RECRUITER: [],
        RECRUIT: []
    };
    onlineranks = {
        OWNER : [],
        CHIEF: [],
        CAPTAIN: [],
        RECRUITER: [],
        RECRUIT: []
    };
    $.each(guild.members, function(num, member){
        console.log(onlinePlayersCount)
        rank = member.rank;
        join_ts = new Date(member.joined).getTime();
		join_ts--;
		do {
			join_ts++;
		}while(rank in ranks[rank]);
        ranks[rank][join_ts] = member;
    });
    var onlinePlayersString = [];
    $.each(guild.members, function(rank, member){
        if (member.name in playerList){
            rank = member.rank;
            wc = playerList[member.name];
            onlinePlayersCount++;
            join_ts = new Date(member.joined).getTime();
		    join_ts--;
		    do {
			join_ts++;
		}while(rank in onlineranks[rank]);
            onlineranks[rank][join_ts] = member;
            if(onlinePlayersCount > 0){
                onlinePlayersString.push(
                    "*",
                    member.name,
                    "[" + member.rank + "]",
                    "is on" + " " + wc,
                    "\n"
                    )
            }
        }
});
        return onlinePlayersString;
}; */
