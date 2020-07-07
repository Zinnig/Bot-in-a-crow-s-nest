const Discord = require('discord.js');
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//for local testing
require('custom-env').env()
const token = process.env.token;

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
            .setDescription('This list has been discovered using a telescope!')
            .addField('Text Commands', '- %help \n - %ping \n - %war')  
            message.author.send(commandEmbed)
        }
        
    /* if(cmd === "gxpleaderboard"){
            let xml = new XMLHttpRequest();
            var mostGxpList = [];
            var mostGxpListMult = [[]];
            let resText1 = "";
            let resText2 = "";
            xml.open("GET", "https://api.wynncraft.com/public_api.php?action=statsLeaderboard&type=guild&timeframe={}");
            xml.send();
            xml.onreadystatechange = function(){
                if(this.status == 200){
                    try{
                        resText1 = JSON.parse(responseText);
                    }catch(e){}
                    putInList(resText1)
                    
                }
                
            }
            
        function getGxp(guild){
            console.log("getGXP")
            for(member in guild.members){
                contributedMember = parseInt(member.contributed);
                member = member.name
                tag = guild.prefix
                mostGxpList.push(contributedMember);
                mostGxpListMult.push([member, tag, contributedMember])
            }
        }

        function putInList(data){
            let xml1
            for(i in data.data){
                console.log("owo")
                xml1 = new XMLHttpRequest();
                xml1.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=" + data["data"][i]["name"])
                xml1.send();
                xml1.onreadystatechange = function(){
                    if(this.status == 200){
                        try{
                            resText2 = JSON.parse(responseText);
                        }catch(e){}
                        getGxp(resText2);
                    }
                }
                    mostGxpList.sort(function(a, b){

                        return b - a;
                    
                    });
                gxp10 = ""
                for (i = 0; i < 10; i++){
                gxp10 += (i+1) + ". "+ mostGxpList[i] + "\n" 
                }
                message.channel.send(gxp10);
            }};
    } */
    let list = ["Avos Temple", "Bloody Beach", "Corkus Castle", "Corkus City", "Corkus City Mine",
"Corkus City South", "Corkus Countryside", "Corkus Docks", "Corkus Forest North", 
"Corkus Forest South", "Corkus Mountain", "Corkus Outskirts", "Corkus Sea Cove", "Corkus Sea Port", 
"Durum Isles Center", "Fallen Factory", "Fallen Factory Entrance", "Legendary Island", "Southern Outpost", 
"Statue", "Corkus Abandoned Tower", "Road To Mine", "Ruined Houses", "Phineas Farm", "Lighthouse Plateau"]
let resText = "";
let missingTerrs = "";
let sent = false;
let notOwned = 0;
let i = 0;
    if(cmd === "war"){
        notOwned = 0;
        sent = false;
        /**
 * ReadyState:
 * 0 	UNSENT 	Client has been created. open() not called yet.
 * 1 	OPENED 	open() has been called.
 * 2 	HEADERS_RECEIVED 	send() has been called, and headers and status are available.
 * 3 	LOADING 	Downloading; responseText holds partial data.
 * 4 	DONE 	The operation is complete.
 * Status:
 *
 * UNSENT: 0
 * OPENED: 0
 * LOADING: 200
 * DONE: 200
 */


let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://api.wynncraft.com/public_api.php?action=territoryList");
    xmlhttp.send(); 
    xmlhttp.onreadystatechange = function(){
        if(this.status == 200){
            try{
                resText = JSON.parse(this.responseText);
            }catch(e){
                
            }

            for(property in resText.territories){
                if(list.indexOf(property) != -1){
                    i+=1;
                   if(resText.territories[property].guild != "Paladins United"){
                       regex = new RegExp(property, "g")
                       if(missingTerrs.search(regex) == -1){
                        missingTerrs += `- ${property} (${resText.territories[property].guild}) \n`
                        notOwned += 1;
                    }
                   }
                }
            }
            
    }
    try{
        if(sent == false && i >= list.length){
            if (notOwned == 0){
                terrEmbed = new Discord.RichEmbed()
                .setColor('#582370')
                .setTitle("Peace...")
                .addField("We're not missing any territories." ,"Have a box of cookies.");
                message.channel.send(terrEmbed)
                sent = true
            }else if(notOwned > 0 && notOwned <= 5){
                terrEmbed = new Discord.RichEmbed()
                    .setColor('#ffcc00')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following territories (${notOwned}):` , missingTerrs );
                    message.channel.send(terrEmbed)
                    sent = true
            }else if(notOwned > 5 && notOwned <= 10){
                terrEmbed = new Discord.RichEmbed()
                .setColor('#ff9d00')
                .setTitle("Get the man-o'-war ready!")
                .addField(`We're currently missing the following territories (${notOwned}):` , missingTerrs);
                message.channel.send(terrEmbed)
                sent = true
            }else if(notOwned > 10 && notOwned <= 15){
                terrEmbed = new Discord.RichEmbed()
                    .setColor('#ff6f00')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following territories (${notOwned}):` , missingTerrs);
                    message.channel.send(terrEmbed)
                    sent = true
            }else if(notOwned > 15){
                terrEmbed = new Discord.RichEmbed()
                    .setColor('#ff000d')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following territories (${notOwned}):` , missingTerrs );
                    message.channel.send(terrEmbed)
                    sent = true
        }
    }
        }catch(e){}
        }
        };

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
