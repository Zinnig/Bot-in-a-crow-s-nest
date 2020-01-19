const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.token;
var $ = require('jquery');

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
});
client.on("voiceStateUpdate", () =>{
    const guild = client.guilds.get('463736564837777428')
    const channels = guild.channels.filter(c => c.parentID === '468697649592401920' && c.type === 'voice');

    for (const [channelID, channel] of channels) {
    for (const [memberID, member] of channel.members) {
        if(channel.id === '666379507522863104'){
        member.setVoiceChannel('666381898343514133')
        .then(() => console.log(`Moved ${member.user.tag}.`))
        .catch(console.error);
        }
    }
}
});

//     if(cmd == "guildtrack" && args[0] == "add"){
//         await message.channel.send(getGuild(args.slice(3)));
//     }
//     if(cmd == "help"){
//         let commandlist = "``` guildtrack add \n - guildtrack remove```";
//         message.channel.send("Sent you a message containing a list of the commands");
//         message.author.send(commandlist);
//     }
// })
// function getGuild(name){
//    guild = name;
//    $.getJSON('https://api.wynncraft.com/public_api.php?action=onlinePlayers', onlinePlayers()).done(function() {
// 		console.log('online players request succeeded!');
//     });

// }
// playerList = [];
// function onlinePlayers(data){
//     console.log("Start collection");
// 	if (!data.message) {
// 		$.each(data, function(wc, list){
// 			$.each(list, function(num, player){
// 				playerList[player] = wc;
// 			});
// 		});
// 	} else {
// 		console.log("Error loading online players!");
// 		console.log("API message: "+data.message);
// 	}
// 	playerListComplete = true;
//     console.log("Collection complete");
//     $.getJSON('https://api.wynncraft.com/public_api.php?action=guildStats&command=' + guild, loadStats()).done(function() {
// 		console.log('guild stats request succeeded!');
    
// })};
// function loadStats(guild){
//     var onlinePlayersCount = 0;
//     ranks = {
//         OWNER : [],
//         CHIEF: [],
//         CAPTAIN: [],
//         RECRUITER: [],
//         RECRUIT: []
//     };
//     onlineranks = {
//         OWNER : [],
//         CHIEF: [],
//         CAPTAIN: [],
//         RECRUITER: [],
//         RECRUIT: []
//     };
//     $.each(guild.members, function(num, member){
//         console.log(onlinePlayersCount)
//         rank = member.rank;
//         join_ts = new Date(member.joined).getTime();
// 		join_ts--;
// 		do {
// 			join_ts++;
// 		}while(rank in ranks[rank]);
//         ranks[rank][join_ts] = member;
//     });
//     var onlinePlayersString = [];
//     $.each(guild.members, function(rank, member){
//         if (member.name in playerList){
//             rank = member.rank;
//             wc = playerList[member.name];
//             onlinePlayersCount++;
//             join_ts = new Date(member.joined).getTime();
// 		    join_ts--;
// 		    do {
// 			join_ts++;
// 		}while(rank in onlineranks[rank]);
//             onlineranks[rank][join_ts] = member;
//             if(onlinePlayersCount > 0){
//                 onlinePlayersString.push(
//                     "*",
//                     member.name,
//                     "[" + member.rank + "]",
//                     "is on" + " " + wc,
//                     "\n"
//                     )
//             }
//         }
// });
//         return onlinePlayersString;
// };
