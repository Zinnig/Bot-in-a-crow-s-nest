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
            ` )  
                
            message.author.send(commandEmbed)
        }
    let list = ["Avos Temple", "Bloody Beach", "Corkus Castle", "Corkus City", "Corkus City Mine",
"Corkus City South", "Corkus Countryside", "Corkus Docks", "Corkus Forest North", 
"Corkus Forest South", "Corkus Mountain", "Corkus Outskirts", "Corkus Sea Cove", "Corkus Sea Port", 
"Durum Isles Center", "Fallen Factory", "Factory Entrance", "Legendary Island", "Southern Outpost", 
"Statue", "Corkus Abandoned Tower", "Road To Mine", "Ruined Houses", "Phinas Farm", "Lighthouse Plateau"]
let allyList = [
/**ARTEMIS */
//Kingdom Foxes
"Kingdom Foxes",
"I Corps",
"Panic",
"Fluffy Unicorns",
"Project Ultimatum",
"Odysseia",
"HaHaUnited",
"Ram Ranch",
"BlueStoneGroup",
"Hyacinthum",
//Imperial
"Imperial",
"Metric",
"Minerva",
"Terra Steel",
"Kolibri",
"House of Sentinels",
"EPIcFORTNITEgAY",
"Germany FTW",
"Squad Zero",
"jerf",
//Avicia
"Avicia",
"Invicta",
"Time for Pizza",
"Stud Squad",
"Avocados",
"Ivory Tusk",
"Afishia",
//HackForums
"HackForums",
"vape god",
"Kingdom Furries",
"HeckForums",
"Bruh Moment",
//Paladins United
"Paladins United",
"Meow",
"Pirates Divided",
"Rat Gang",
//Titans Valor
"Titans Valor",
"Seekers of Arx",
"The Tempest",
"IceBabies",
"Exorcism",
"Tartaros",
//Emorians
"Emorians",
"Audux",
"Mute Gang",
"Toemorians",
//Lux Nova
"Lux Nova",
"Scat Club",
"Golden Hour",
"Luwu Nowo",
//Eden
"Eden",
"Heresy",
//Blue Nations United
"FortniteKSI",
"Byzantium",
"IceBlue Fantasy",
//Empire of Sindria
"Empire of Sindria",
"Sicko Mode",
//Ice Blue Team
"IceBlue Team",
//The Aquarium
"The Aquarium",
//Phantom Hearts
"Phantom Hearts",
"Surprise",
"Luna",
"Jasmine Dragons",
"Fraternal Fire",
"Gaming",
"Phantom Menace",
//*Cooperating */
"House of Sentinels",
"Seekers of Arx",
"The Simple Ones",
//**NEUTRAL */
"Vindicator",
//**OTHER ALLIES **/
"Kangronomicon"
]
let allyListTags = [
        /**ARTEMIS */
    //Kingdom Foxes
    "Fox",
    "LFX",
    "PaN",
    "FuI",
    "PxU",
    "Oys",
    "HHU",
    "RMR",
    "GSB",
    "HCM",
    //Imperial
    "Imp",
    "Met",
    "Min",
    "KLA",
    "KLI",
    "Snt",
    "lMP",
    "BKP",
    "SdZ",
    "jrf",
    //Avicia
    "AVO",
    "IVA",
    "VFN",
    "STQ",
    "JML",
    "AVF",
    "IVT",
    //HackForums
    "Hax",
    "vpe",
    "KFF",
    "Hux",
    "GJJ",
    //Paladins United
    "PUN",
    "Prr",
    "PiD",
    "RGX",
    //Titans Valor
    "ANO",
    "Arx",
    "Txp",
    "IcB",
    "xsm",
    "JNC",
    //Emorians
    "ERN",
    "uxu",
    "VCT",
    "VHT",
    //Lux Nova
    "LXA",
    "LAX",
    "GnH",
    "Luw",
    //Eden
    "EDN",
    "Rsy",
    //Blue Nations United
    "XDF",
    "TBE",
    "IBF",
    //Empire of Sindria
    "ESI",
    "SME",
    //Ice Blue Team
    "IBT",
    //The Aquarium
    "TAq",
    //Phantom Hearts
    "Phi",
    "GrE",
    "FUU",
    "Lox",
    "JsD",
    "FFi",
    "UcU",
    "UUF",
    //**Cooperating**
    "Snt",
    "ARX",
    "ILQ",
    //NEUTRAL
    "VMZ",
    //Other allies
    "Fuq"
]
let resText = "";
let missingTerrs = "";
let missingTerrsAlly = "";
let missingFFAs = "";
let sent = false;
let sent2 = false;
let sent3 = false;
let notOwned = 0;
let notOwnedAlly = 0;
let notOwnedFFA = 0;
let i = 0;

function setupTimeDiff(diff){
    days = Math.floor(diff/(24*60*60*1000))
    hours = Math.floor((diff - days*(24*60*60*1000))/(60*60*1000))
    minutes = Math.floor((diff - days*(24*60*60*1000) - hours*(60*60*1000))/(60*1000))
    seconds = Math.floor(diff - days*(24*60*60*1000) - hours*(60*60*1000) - minutes*(60*1000))/1000

    if(days == 0 && hours == 0 && minutes < 3){
        return `on Cooldown (${minutes > 0? minutes + "min:": ""}${seconds > 0? seconds + "s:": ""}s left)`
    }else{
        return `${days > 0? days +"d:": ""}${hours > 0? hours + "h:": ""}${minutes > 0? minutes +"min:": ""}${seconds > 0? seconds +"s": ""}`;
    }
}
var fs = require('fs');
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

let guildtags =
{
    "Paladins United": "PUN",
    "Kingdom Foxes": "Fox",
    "Imperial": "Imp",
    "Phantom Hearts": "Phi",
    "Lux Nova": "LXA",
    "Titans Valor": "ANO",
    "Eden": "EDN",
    "IceBlue Team": "IBT",
    "Empire of Sindria": "ESI",
    "The Aquarium": "TAq",
    "Avicia": "AVO",
    "Emorians": "ERN",
    "HackForums": "Hax",
}
let terrs;
fs.readFile("Map.json", 'utf8', function(err, data){
    if(err) throw err;
    map = data
    try{
        terrs = JSON.parse(data);
        }catch(e){}
        let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://api.wynncraft.com/public_api.php?action=territoryList");
    xmlhttp.send(); 
    xmlhttp.onreadystatechange = function(){
        if(this.status == 200){
            try{
                resText = JSON.parse(this.responseText);
            }catch(e){
                //empty
            }

            for(property in resText.territories){
                if(terrs.territories[property] == "PUN"){
                    i+=1;
                   if(resText.territories[property].guild != "Paladins United"){
                       regex = new RegExp(property, "g")
                       if(missingTerrs.search(regex) == -1){
                           if(allyList.indexOf(resText.territories[property].guild) == -1){
                                missingTerrs += `- ${property} (${resText.territories[property].guild})  \n `;
                                notOwned += 1;
                            }else if(allyList.indexOf(resText.territories[property].guild) != -1){
                                missingTerrs += `- [Ally] ${property} (${resText.territories[property].guild})  \n`;
                                notOwned += 1;
                            }
                       }
                    }
                }else if(allyList.indexOf(resText.territories[property].guild) == -1){
                    regex1 = new RegExp(property, "g")
                    if(missingTerrsAlly.search(regex1) == -1){
                        if(terrs.territories[property] != null && terrs.territories[property] != "-"){
                                missingTerrsAlly += `- [${terrs.territories[property]}] ${property} (${resText.territories[property].guild})  \n`
                                notOwnedAlly += 1; 

                        }
                    }
                
                
               }else if((terrs.territories[property] == null || terrs.territories[property] == "-") && resText.territories[property].guild != "Paladins United"){
                missingFFAs += `- ${property} (${resText.territories[property].guild}) \n`
                notOwnedFFA += 1;
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
            if(sent2 == false && i>= list.length){
                if (notOwnedAlly == 0){
                    terrAllyEmbed = new Discord.RichEmbed()
                    .setColor('#582370')
                    .setTitle("Peace for the whole alliance")
                    .addField("Our Allies are not missing any territories." ,"Have a box of cookies.");
                    message.channel.send(terrAllyEmbed)
                    sent2 = true
                }else if(notOwnedAlly > 0 && notOwnedAlly <= 5){
                    terrAllyEmbed = new Discord.RichEmbed()
                        .setColor('#ffcc00')
                        .setTitle("Get the man-o'-war ready!")
                        .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):` , missingTerrsAlly );
                        message.channel.send(terrAllyEmbed)
                        sent2 = true
                }else if(notOwnedAlly > 5 && notOwnedAlly <= 10){
                    terrAllyEmbed = new Discord.RichEmbed()
                    .setColor('#ff9d00')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):` , missingTerrsAlly);
                    message.channel.send(terrAllyEmbed)
                    sent2 = true
                }else if(notOwnedAlly > 10 && notOwnedAlly <= 15){
                    terrAllyEmbed = new Discord.RichEmbed()
                        .setColor('#ff6f00')
                        .setTitle("Get the man-o'-war ready!")
                        .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):` , missingTerrsAlly);
                        message.channel.send(terrAllyEmbed)
                        sent2 = true
                }else if(notOwnedAlly > 15){
                    terrAllyEmbed = new Discord.RichEmbed()
                        .setColor('#ff000d')
                        .setTitle("Get the man-o'-war ready!")
                        .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):` , missingTerrsAlly );
                        message.channel.send(terrAllyEmbed)
                        sent2 = true
            }
        }
        if(sent3 == false && i>= list.length){
            if (notOwnedFFA == 0){
                ffaEmbed = new Discord.RichEmbed()
                .setColor('#582370')
                .setTitle("Peace ... - and also good xp gain!")
                .addField("We're not missing any FFAs." ,"Have a box of cookies.");
                message.channel.send(ffaEmbed)
                sent3 = true
            }else if(notOwnedFFA > 0 && notOwnedFFA <= 5){
                ffaEmbed = new Discord.RichEmbed()
                    .setColor('#ffcc00')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following FFAs (${notOwnedFFA}):` , missingFFAs );
                    message.channel.send(ffaEmbed)
                    sent3 = true
            }else if(notOwnedFFA > 5 && notOwnedFFA <= 10){
                ffaEmbed = new Discord.RichEmbed()
                .setColor('#ff9d00')
                .setTitle("Get the man-o'-war ready!")
                .addField(`We're currently missing the following FFAs (${notOwnedFFA}):` , missingFFAs);
                message.channel.send(ffaEmbed)
                sent3 = true
            }else if(notOwnedFFA > 10 && notOwnedFFA <= 15){
                ffaEmbed = new Discord.RichEmbed()
                    .setColor('#ff6f00')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following FFAs (${notOwnedFFA}):` , missingFFAs);
                    message.channel.send(ffaEmbed)
                    sent3 = true
            }else if(notOwnedFFA > 15){
                ffaEmbed = new Discord.RichEmbed()
                    .setColor('#ff000d')
                    .setTitle("Get the man-o'-war ready!")
                    .addField(`We're currently missing the following FFAs (${notOwnedFFA}):` , missingFFAs );
                    message.channel.send(ffaEmbed)
                    sent3 = true
        }
        }
            }catch(e){
                console.log(e)
            }
    }

});

        }
        if(cmd == "subs"){
            if(args[0].match(/(Fox)/gi)){
                message.channel.send("Fox has the following subguilds: \n- [FNE] Fluorine \n- [LFX] I Corps \n- [PaN] Panic \n- [FuI] Fluffy Unicorns \n- [PxU] Project Ultimatum \n- [Oys] Odysseia \n- [HHU] HaHaUnited \n- [RMR] Ram Ranch \n- [GSB] BlueStoneGroup \n- [HCM] Hyacinthum ")
            }else if(args[0].match(/(Imp)/gi)){
                message.channel.send("Imp has the following subguilds: \n- [Met] Metric \n- [Min] Minerva \n- [KLA] Terra Steel \n- [KLI] Kolibri \n- [Snt] House of Sentinels \n- [lMP] EPIcFORTNITEgAY \n- [BKP] Germany FTW \n- [SdZ] Squad Zero \n- [jrf] jerf")
            }else if(args[0].match(/(AVO)/gi)){
                message.channel.send("AVO has the following subguilds: \n- [IVA] Invicta \n- [VFN] Time for Pizza \n- [STQ] Stud Squad \n- [JML] Avocados \n- [IVT] Ivory Tusk \n- [AVF] Afishia")
            }else if(args[0].match(/(BNU)/gi)){
                message.channel.send("BNU has the following subguilds: \n- [XDF] FortniteKSI\n- [TBE] Byzantium \n- [IBF] IceBlue Fantasy\n- [GSB] BlueStoneGroup \n- [HCM] Hyacinthum")
            }else if(args[0].match(/(EDN)/gi)){
                message.channel.send("EDN has the following subguilds: \n- [Rsy] Heresy")
            }else if(args[0].match(/(ESI)/gi)){
                message.channel.send("ESI has the following subguilds: \n- [SME] Sicko Mode")
            }else if(args[0].match(/(Hax)/gi)){
                message.channel.send("Hax has the following subguilds: \n- [vpe] vape god \n- [KFF] Kingdom Furries \n- [Hux] HeckForums \n- [GJJ] Bruh Moment")
            }else if(args[0].match(/(LXA)/gi)){
                message.channel.send("LXA has the following subguilds: \n- [LAX] Scat Club \n- [GnH] Golden Hour\n- [Luw] Luwu Nowo")
            }else if(args[0].match(/(PUN)/gi)){
                message.channel.send("PUN has the following subguilds: \n- [Prr] Meow \n- [PiD] Pirates Divided \n- [RGX] Rat Gang \n- [PAF] PaladinForums")
            }else if(args[0].match(/(ANO)/gi)){
                message.channel.send("ANO has the following subguilds: \n- [ARX] Seekers of Arx \n- [Txp] The Tempest \n- [IcB] Ice Babies \n- [xsm] Exorcism\n- [JNC] Tartaros")
            }else if(args[0].match(/(ERN)/gi)){
                message.channel.send("ERN has the following subguilds: \n- [uxu] Adux \n- [VCT] Mute Gang \n- [VHT] Toemorians");
            }else if(args[0].match(/(Phi)/gi)){
                message.channel.send("Phi has the following subguilds: \n- [GrE] Grand Explorers \n- [FUU] Surprise \n- [Lox] Lun \n- [JsD] Jasmine Dragons \n- [FFi] Fraternal Fire \nTechnically Sub-Guilds: \n- [UcU] Gaming \n- [UUF] Phantom Menace")
            }else{
                message.channel.send("The guild with this tag doesn't exist, or isn't in Artemis.")
            }
        }
        if(cmd == "caniattack"){
            var upperCaseNames = allyListTags.map(function(value) {
                return value.toUpperCase();
              });
            if(upperCaseNames.indexOf(args[0].toUpperCase()) == -1){
                message.channel.send("You can attack this guild, it's not in Artemis/is no subguild of a guild in Artemis.");
            }else if(upperCaseNames.indexOf(args[0].toUpperCase()) != -1){
                message.channel.send(`The guild ${allyListTags[upperCaseNames.indexOf(args[0].toUpperCase())]} (${allyList[upperCaseNames.indexOf(args[0].toUpperCase())]}) is in Artemis (or they're a subguild), you shouldn't attack it.`)
            }
        }
        /*
        function index(a, arr) {
            for (var i=0; i<arr.length; i++) {
            for (var j=0; j<arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
            }
            }
            return -1;
        }
      let resText2 = "";
        let names = [];
        let nameTime = [];
        if(cmd == "activity"){
            let xmlhttp1 = new XMLHttpRequest();
            xmlhttp1.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=Paladins%20United");
            xmlhttp1.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    try{
                        resText2 = JSON.parse(this.responseText);
                        //Getting the UUID of the IGN
                        let resTextUUID = "";
                        let dashedUUID = "";
                        let dashedUUIDs = [];
                        for(property in resText2.members){
                            let xmlUUID = new XMLHttpRequest();
                            xmlUUID.open("GET", "https://mc-heads.net/minecraft/profile/" + resText2.members[property].name);
                            xmlUUID.onreadystatechange = function(){
                                try{
                                resTextUUID = JSON.parse(this.responseText);
                                dashedUUID =  resTextUUID.id.substr(0,8)+"-"+resTextUUID.id.substr(8,4)+"-"+resTextUUID.id.substr(12,4)+"-"+resTextUUID.id.substr(16,4)+"-"+resTextUUID.id.substr(20);
                                if(dashedUUIDs.indexOf(dashedUUID) == -1){
                                    dashedUUIDs.push(dashedUUID);
                                }
                                //Getting the stats of the players.
                                let resText3 = "";
                                for(property in dashedUUIDs){
                                    if(names.indexOf(dashedUUIDs[property]) == -1){
                                        names.push(dashedUUIDs[property]);
                                }
                                    xml12 = new XMLHttpRequest();
                                    xml12.open("GET", "https://api.wynncraft.com/v2/player/" + dashedUUIDs[property]+  "/stats");
                                    xml12.onreadystatechange = function(){
                                        if(this.status == 200){
                                            try{
                                                resText3 = JSON.parse(this.responseText);
                                                if(index(resText3.data[0].username, nameTime) == -1){
                                                    nameTime.push([resText3.data[0].username, resText3.data[0].meta.lastJoin])
                                                console.table(nameTime)       
                                            }
                                            }catch(e){
                                                //empty
                                            }
                                        }
                                    }
                                    xml12.send()
                                }
                            }catch(e){
                                //empty
                            }
                            }
                            xmlUUID.send();
                        }
                        
                    }catch(e){
                        //empty
                    }
                }
                
            }
            xmlhttp1.send();

    }
    /*
    if(cmd == "say"){
        if(message.author.id == '282964164358438922'){
            message.channel.send(args.join().replace(/,/g, " "));
            message.delete()
        }
    }
    if(cmd == "join"){
        if(message.author.id == '282964164358438922'){
            message.delete();
            let vc = message.member.voiceChannel;
            vc.join()
        }
    }
        
let JSONdata;
fs.readFile('votes.json', 'utf8', function(err, data){
    if(err) throw err;
        JSONdata = data;
        });
         if(cmd == "vote"){
             console.log("before start/end: " + JSONdata)
            if(args[0] == "start"){
                args.splice(0, 1);
                let list = args;
                let title = list.join().replace(/,/g, " ");
                let colourOfVote = Math.floor(Math.random()*16777215).toString(16);
                voteEmbed = new Discord.RichEmbed()
                .setTitle(title)
                .setColor(Math.floor(Math.random()*16777215).toString(16))
                .addField("Options", "👍: yes \n 👎: no");
                message.channel.send(voteEmbed).then(function(message){
                let voteDate = JSONdata == "" ? [] : JSON.parse(JSONdata);
                let vote = new Object();
                    vote.id = message.id
                    vote.channelID = message.channel.id
                    vote.title = title
                    vote.colour = colourOfVote 
                    vote.yes = 0
                    vote.no = 0
                    voteDate.push(vote)
                let votes = JSON.stringify(voteDate)
                fs.writeFile('votes.json', votes, function(err){
                    if (err) throw err;
                    console.log("Updated File.")
                });
                    message.react('👍');
                    message.react('👎');
                    message.pin();
                });
                //TODO fix votes
            }else if(args[0] == "end"){
                console.log("jsondata: " + JSONdata)
                let json = JSONdata == "" ? [] : JSON.parse(JSONdata);
                console.log(json)
                args.splice(0, 1);
                let list = args;
                let msg = list.join().replace(/,/g, " ");
                for(property in json){
                    if(json[property].channelID != message.channel.id) return;
                    if(json[property].title.toUpperCase() == msg.toUpperCase()){
                        let voteMsg = message.fetch(json[property].id)
                        voteMsg.unpin();
                        json.slice(property);
                        message.channel.send(`The vote ${json[property].title} was ended, there were ${json[property].yes} votes for yes and ${json[property].no} votes for no; Total Votes: ${json[property].no + json[property].yes}`)
                        
                    }
                }
            } 
        }
});
let yes = 0;
let no = 0;
let alreadyreactedYes = [];
let alreadyreactedNo = [];
fs.appendFile('votes.json', "", function(err){
    if (err) throw err;
    console.log("File created!")
});
let dataJSONReact;
let data1;
client.on('messageReactionAdd', async (reaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    fs.readFile('votes.json', 'utf8', function(err, data){
        if(err) throw err;
        data1 = data;
    });
    
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
        }
        
    }
    let prob;
    if(user.id != '639956302788820993'){
    if(reaction.message.pinned){
        try{
        dataJSONReact = JSON.parse(data1);
    }catch(e){}
        console.log("data1: " + data1)
        for(property in dataJSONReact){
            if(dataJSONReact[property].id == reaction.message.id){
                prob = property;
            }

        }
    if(reaction.emoji.name == '👍'){
        reaction.message.reactions.get('👍').remove(user.id) //removing a reaction from a user.
        if(alreadyreactedYes.indexOf(user.id) == -1 && alreadyreactedNo.indexOf(user.id) == -1){
            alreadyreactedYes.push(user.id)
            yes++;
            dataJSONReact[prob].yes = yes;
        }else if(alreadyreactedNo.indexOf(user.id) != -1 && alreadyreactedYes.indexOf(user.id) == -1){
            alreadyreactedYes.push(user.id)
            alreadyreactedNo.splice(alreadyreactedNo.indexOf(user.id), 1)
            yes++;
            no--;
            dataJSONReact[prob].yes = yes;
            dataJSONReact[prob].no = no;
        }
}else if(reaction.emoji.name == '👎'){
    reaction.message.reactions.get('👎').remove(user.id) //removing a reaction from a user.
    if(alreadyreactedNo.indexOf(user.id) == -1 && alreadyreactedYes.indexOf(user.id) == -1){
        alreadyreactedNo.push(user.id)
        no++;
        dataJSONReact[prob].no = no;
    }else if(alreadyreactedYes.indexOf(user.id) != -1 && alreadyreactedNo.indexOf(user.id) == -1){
        alreadyreactedNo.push(user.id)
        alreadyreactedYes.splice(alreadyreactedYes.indexOf(user.id), 1)
        no++;
        yes--;
        dataJSONReact[prob].no = no;
        dataJSONReact[prob].yes = yes;
}
}
console.log(`yes: ${dataJSONReact[prob].yes}, no: ${dataJSONReact[prob].no}`)
fs.writeFile('votes.json', JSON.stringify(dataJSONReact), function(err){
    if (err) throw err;
    console.log("Updated File.")
});

    let edit = new Discord.RichEmbed()
    .setTitle(dataJSONReact[prob].title)
    .setColor(dataJSONReact[prob].colour.toString(16))
    .addField("Options", "👍: yes \n 👎: no")
    .setFooter(`Total Votes: ${dataJSONReact[prob].yes + dataJSONReact[prob].no}`);
    reaction.message.edit(edit)
}
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