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
"Durum Isles Center", "Fallen Factory", "Factory Entrance", "Legendary Island", "Southern Outpost", 
"Statue", "Corkus Abandoned Tower", "Road To Mine", "Ruined Houses", "Phinas Farm", "Lighthouse Plateau"]
let allyList = [
    /**ARTEMIS */
    //Kingdom Foxes
    "Kingdom Foxes" ,
    "Ombra" , 
    "I Corps" ,
    "Panic" ,
    "Fluffy Unicorns" ,
    "Project Ultimatum" ,
    "Lunatic" ,
    "Ex Nihilo" ,
    "Odysseia" ,
    "HaHaUnited" ,
    "Ram Ranch" ,
   //Imperial
    "Imperial" ,
    "Metric" ,
    "Minerva" ,
    "Terra Steel" ,
    "Kolibri" ,
    "House of Sentinels" ,
    "EPIcFORTNITEgAY" ,
    "Germany FTW" ,
    "Squad Zero" ,
    "jerf" ,
   //Phantom Hearts
    "Phantom Hearts" ,
    "Surprise" ,
    "Phantom Menace" ,
    "Fraternal Fire" ,
    "Grand Explorers" ,
   //Avicia
    "Avicia" ,
    "Invicta" ,
    "Time for Pizza" ,
    "Stud Squad" ,
    "Avocados" ,
   //HackForums
    "HackForums" ,
    "vape god" ,
    "Kingdom Furries" ,
    "HeckForums" ,
   //Paladins United
    "Paladins United" ,
    "Pirates United" ,
    "Meow" ,
    "Pirates Divided" ,
   //Titans Valor
    "Titans Valor" ,
    "Illustratus" ,
    "Seekers of Arx" ,
    "dinkle winks" ,
    "The Tempest" ,
    "Ice Babies" ,
    "Exorcism" ,
   //Emorians
    "Emorians" ,
    "Audux" ,
    "Mute Gang" ,
   //Lux Nova
    "Lux Nova" ,
    "Scat Club" ,
   //Eden
    "Eden" ,
    "Heresy" ,
   //Blue Nations United
    "Blue Nations United" ,
    "Hyacinthum" ,
    "FortniteKSI" ,
    "BlueStoneGroup" ,
    "Byzantium" ,
    "IceBlue Fantasy",
    //Empire of Sindria
    "Empire of Sindria",
    //Caeruleum Order
    "Caeruleum Order",
    //Ice Blue Team
    "IceBlue Team",
    //**Cooperating */
    "House of Sentinels",
    "Seekers of Arx",
    "The Simple Ones",
    "The Turtle Society",
    //**NEUTRAL */
    "Vindicator"

]
let FoxClaim = [
   "Cinfras Thanos Transition", 
"Path To Ozoth’s Spire Mid", 
"Canyon Path South West", 
"Canyon Mountain East", 
"Cliffside Valley", 
"Cherry Blossom Forest", 
"Eltom", 
"Path To Thanos", 
"Bandit Cave Lower", 
"Thanos Exit", 
"Thanos Exit Upper", 
"Air Temple Upper", 
"Entrance to Thesead North", 
"Durum Isles Lower", 
"Burning Airship", 
"Path To Military Base", 
"Path To Ozoth’s Spire Lower", 
"Bandit Cave Upper", 
"Canyon Path North Mid", 
"Canyon Walk Way", 
"Canyon High Path", 
"Chained House", 
"Canyon Entrance Waterfall", 
"Canyon Valley South", 
"Wizard Tower North", 
"Durum Isles Upper", 
"Burning Farm", 
"Canyon Path North West", 
"Canyon Waterfall Mid North", 
"Cliffside Waterfall", 
"Ranol’s Farm", 
"Ghostly Path", 
"Military Base Upper", 
"Canyon Mountain South", 
"Temple of the Lost East", 
"Cliffside Passage North", 
"Krolton’s Cave", 
"Thesead Suburbs", 
"Military Base", 
"Canyon Fortress", 
"Entrance to Thesead South", 
"Bandit Camp Exit", 
"Cliffside Passage", 
"Path To Ozoth’s Spire Upper", 
"Bandits Toll", 
"Entrance to Rodoroc", 
"Hive South", 
"Military Base Lower", 
"Thanos", 
"Air Temple Lower", 
"Thanos Valley West"
]
let ImpClaim = [
    "Cinfras Entrance",
"Cinfras County Mid-Upper",
"Gylia Lake North West",
"Aldorei’s River",
"Imperial Gate",
"Efelim South Plains",
"Light Forest North Entrance",
"Light Forest West Lower",
"Hobbit River",
"Abandoned Church",
"Graveyard North",
"Dark Forest Cinfras Transition",
"Cinfras County Mid-Lower",
"Aldorei Valley Lower",
"Aldorei’s Waterfall",
"Efelim South East Plains",
"Light Forest South Exit",
"Light Forest West Mid",
"Light Forest East Mid",
"Light Forest Canyon",
"Gromblins Hideout",
"Dark Forest Village",
"Corrupted Village",
"Cinfras County Lower",
"Gylia Lake North East",
"Aldorei’s North Exit",
"Corrupted Impact",
"Gylia Lake South East",
"Aldorei Lowlands",
"Efelim East Plains",
"Light Forest East Upper",
"Gylia Lake South West",
"Abandoned Tower",
"Light Forest South Entrance",
"Light Forest West Upper",
"Path to Cinfras",
"Arachnida Cave",
"Cinfras County Upper",
"Gert Camp",
"Cinfras Outskirts",
"Graveyard South",
"Jitak’s Farm",
"Aldorei Valley West Entrance",
"Cinfras’s Small Farm",
"Durum Isles East",
"Light Forest North Exit",
"Guild Hall",
"Aldorei Valley South Entrance",
"Mantis Nest",
"Aldorei Valley Upper",
"Light Forest East Lower",
"Aldorei Valley Mid",
"Banshees Cave",
"Mesquis Tower",
"Light Forest Entrance",
"Efelim Village"
]
let PhiClaim = [
    "Lost Atoll",
"Volcano Lower",
"Ragni North Entrance",
"Ragni Plains",
"Ragni North Suburbs",
"Coastal Trail",
"Volcano Upper",
"Maltic",
"Raider's Base Upper",
"Farmers Valley",
"Katoa Ranch",
"Maltic Coast"
]
let AvoClaim = [
    "Light Realm East Mid-Upper",
"Orphion's Seal Upper",
"Old Coal Mine",
"Angel Refuge",
"Plains Lake",
"Temple Island",
"Light Realm Entrance",
"Road to Corruption",
"Dragonling Nests",
"Wybel Island",
"Jofash Docks",
"Mine Base Plains",
"Ahmsord",
"Light Realm East Lower",
"Orphion's Seal",
"Frozen Fort",
"Kandon Ridge",
"Central Islands",
"Jofash Tunnel",
"Astraulus' Tower",
"Light Realm Entrance Upper",
"Sky Castle",
"Sky Island Ascent",
"Light Realm East Mid",
"Swamp Island",
"Light Realm Corruption",
"Path to Ahmsord Lower",
"Spiraling Trees",
"Path to Ahmsord Upper",
"Snail Island",
"Ahmsord Outskirts",
"Light Realm East",
"Light Realm East Upper",
"Angry Village",
"Sky Falls",
"Nesaak Transition",
"Light Realm Mushrooms"
]
let HaxClaim = [
    "Path To The Arch",
"Canyon Upper North West",
"Aldorei’s Arch",
"Rodoroc",
"Mountain Path",
"Crater Descent",
"Canyon Waterfall North",
"Active Volcano",
"Canyon Path South East",
"Canyon Lower South East",
"Molten Heights Portal",
"Canyon Survivor",
"Canyon Dropoff",
"Volcanic Slope"
]
let AnoClaim = [
    "Cliff Side of the Lost",
"Kandon Farm",
"Dernal Jungle Upper",
"Nesaak Plains Mid North West",
"Nesaak Bridge Transition",
"City of Troms",
"Valley of the Lost",
"Jungle Lower",
"Nesaak Plains South West",
"Mountain Edge",
"Kandon-Beda",
"Dernal Jungle Mid",
"Canyon Of The Lost",
"Great Bridge Jungle",
"Nesaak Plains North East",
"Twain Mansion",
"Nesaak Plains Lower North West",
"Icy Descent",
"Nesaak Village",
"Twain Lake",
"Jungle Upper",
"Jungle Mid",
"Dernal Jungle Lower",
"Cliffside Lake",
"Nesaak Plains Upper North West",
"Nesaak Plains South East",
"Great Bridge Nesaak",
"Lusuco"
]
let ErnClaim = [
    "Llevigar Farm Plains East",
"Llevigar",
"Swamp West Lower",
"Swamp East Upper",
"Swamp West Mid-Upper",
"Swamp Dark Forest Transition Upper",
"Swamp Mountain Base",
"Swamp Mountain Transition Mid-Upper",
"Quartz Mines North West",
"Road To Light Forest",
"Lone Farmstead",
"Gelibord Castle",
"Mansion of Insanity",
"Llevigar Farm Plains West",
"Llevigar Plains West Lower",
"Swamp East Lower",
"Swamp East Mid-Upper",
"Swamp Lower",
"Swamp Mountain Transition Mid",
"Quartz Mines South West",
"Gelibord Corrupted Farm",
"Fortress South",
"Llevigar Gate West",
"Leadin Fortress",
"Llevigar Entrance",
"Fleris Trail",
"Llevigar Plains East Upper",
"Swamp West Upper",
"Entrance to Olux",
"Swamp Plains Basin",
"Gelibord",
"Twisted Housing",
"Llevigar Gate East",
"Twisted Ridge",
"Llevigar Plains East Lower",
"Swamp West Mid",
"Olux",
"Quartz Mines South East",
"Tree Island",
"Swamp Dark Forest Transition Mid",
"Quartz Mines North East",
"Taproot Descent",
"Swamp Dark Forest Transition Lower",
"Fortress North",
"Orc Battlegrounds",
"Swamp Mountain Transition Lower",
"Swamp Mountain Transition Upper",
"Swamp East Mid",
"Llevigar Plains West Upper"
]
let LxaClaim = [
    "Nivla Forest Exit",
"Pigmen Ravines Entrance",
"Time Valley",
"Road to Time Valley",
"South Pigmen Ravines",
"Plains",
"Ragni East Suburbs",
"Pigmen Ravines",
"Animal Bridge",
"Maltic Plains",
"Little Wood",
"Elkurn",
"Nivla Forest Entrance",
"Road to Elkurn",
"North Nivla Forest",
"Nivla Forest Edge",
"Jungle Lake",
"South Nivla Forest",
"Elkurn Fields",
"Ragni Main Entrance",
"Nivla Forest",
"Abandoned Farm",
"Ragni"
]
let EdnClaim = [
    "Nemract Road",
"Nether Gate",
"Detlas Trail West Plains",
"Nemract Plains West",
"Corrupted Road",
"Nemract Town",
"Detlas Close Suburbs",
"Detlas Trail East Plains",
"Nemract Plains East",
"Detlas Far Suburbs",
"Detlas Suburbs",
"Mt. Wynn",
"Nether Plains Upper",
"Nemract Cathedral",
"Plains Coast",
"Ancient Nemract",
"Cathedral Harbour",
"Nether Plains Lower"
]
let EsiClaim = [
    "Desert East Lower",
"Desert West Upper",
"Mining Base Upper",
"Bremminglar",
"Mining Base Lower",
"Rymek East Upper",
"Savannah East Lower",
"Rymek West Lower",
"Desert Mid-Lower",
"Rymek East Lower",
"Almuj City",
"Rymek West Mid",
"Detlas Savannah Transition",
"Desert West Lower",
"Savannah East Upper",
"Desert East Upper",
"Desert Lower",
"Rymek East Mid",
"Rymek West Upper",
"Desert Upper",
"Ternaves",
"Savannah West Lower",
"Desert East Mid",
"Ternaves Plains Lower",
"Mummy's Tomb",
"Desert Mid-Upper",
"Savannah West Upper",
"Lion Lair",
"Abandoned Pass",
"Ternaves Plains Upper"
]
let CdrClaim = []
let IbtClaim = [
    "Path To Prison",
"Shanjugin’s River",
"Lexdale",
"Orc Road",
"Icy Island",
"Dead Island South West",
"Dead Island South East",
"Skiens Island",
"Bucie North West",
"Red Camp",
"Regular Island",
"Maro Peaks",
"Dead Island North East",
"Half Moon Island",
"Meteor Crater",
"Llevigar Farm",
"Pre-Light Forest Transition",
"Orc Lake",
"Black Magic",
"Nodguj Nation",
"Dujgon Nation",
"The Bear Zoo",
"Bucie North East",
"Corrupted Hand",
"Green Camp",
"Dead Island North West",
"Rooster Island",
"Bucie South East",
"Lexdales Prison",
"Santa's Hideout",
"Zhight Island",
"Pirate Town",
"Selchar",
"Bucie South West",
"Black Camp"
]
let IlqClaim = [
    "Mage Island"
]
let FFAList = [
//Gavel
"Cinfras", "Hive", "Qira's Battle Room", "Thesead", "Lava Lake", "Lava Lake Bridge",
"Molten Reach", "Raider's Base Lower",
//Wynn
"Detlas", "Emerald Trail", "Bob's Tomb", "Battle Tower", "Herb Cave", "Temple of Legends",
//Silent Expanse
"The Silent Road", "The Broken Road", "Worm Tunnel", "Gray Zone", "Forgotten Town", "Forest of Eyes", "Sinister Forest", "Lutho", "Paths of Sludge", "Toxic Drip", "Toxic Caves", "Gateway to Nothing", "Void Valley", "Sacrifice", "Bizarre Passage", "The Gate"
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

                }else if(allyList.indexOf(resText.territories[property].guild) == -1){
                        regex1 = new RegExp(property, "g")
                        if(missingTerrsAlly.search(regex1) == -1){
                            if(FFAList.indexOf(property) == -1){
                                if(FoxClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [Fox] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(ImpClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [Imp] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(AvoClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [AVO]${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(IbtClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [IBT] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(AnoClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [ANO] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(EsiClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [ESI] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(LxaClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [LXA] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(HaxClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [Hax] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(EdnClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [EDN] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(PhiClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [Phi] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(IlqClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [ILQ] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }else if(CdrClaim.indexOf(property) != -1){
                                    missingTerrsAlly += `- [Cdr] ${property} (${resText.territories[property].guild}) \n`
                                    notOwnedAlly += 1; 
                                }
                        }
                }
                    

                   }
                   if(FFAList.indexOf(property) != -1 && resText.territories[property].guild != "Paladins United"){
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
                    .addField(`We're currently missing the following FFAs (${notOwnedAlly}):` , missingTerrsAlly );
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
        }catch(e){}
        }
        };
        if(cmd == "subs"){
            if(args[0].match(/(Fox)/gi)){
                message.channel.send("Fox has the following subguilds: \n- [Omb] Ombra \n- [FNE] Fluorine \n- [LFX] I Corps \n- [PaN] Panic \n- [FuI] Fluffy Unicorns \n- [PxU] Project Ultimatum \n- [Mox] Lunatic \n- [Nih] Ex Nihilo \n- [Oys] Odysseia \n- [HHU] HaHaUnited \n- [RMR] Ram Ranch")
            }else if(args[0].match(/(Imp)/gi)){
                message.channel.send("Imp has the following subguilds: \n- [Met] Metric \n- [Min] Minerva \n- [KLA] Terra Steel \n- [KLI] Kolibri \n- [Snt] House of Sentinels \n- [lMP] EPIcFORTNITEgAY \n- [BKP] Germany FTW \n- [SdZ] Squad Zero \n- [jrf] jerf")
            }else if(args[0].match(/(AVO)/gi)){
                message.channel.send("AVO has the following subguilds: \n- [IVA] Invicta \n- [VFN] Time for Pizza \n- [STQ] Stud Squad \n- [JML] Avocados")
            }else if(args[0].match(/(BNU)/gi)){
                message.channel.send("BNU has the following subguilds: \n- [HCM] Hyacinthum \n- [XDF] FortniteKSI \n- [GSB] BlueStoneGroup \n- [TBE] Byzantium \n- [IBF] IceBlue Fantasy")
            }else if(args[0].match(/(EDN)/gi)){
                message.channel.send("EDN has the following subguilds: \n- [Rsy] Heresy")
            }else if(args[0].match(/(ESI)/gi)){
                message.channel.send("ESI has no subguilds.")
            }else if(args[0].match(/(Hax)/gi)){
                message.channel.send("Hax has the following subguilds: \n- [vpe] vape god \n- [KFF] Kingdom Furries \n- [Hux] HeckForums")
            }else if(args[0].match(/(LXA)/gi)){
                message.channel.send("LXA has the following subguilds: \n- [LAX] Scat Club")
            }else if(args[0].match(/(PUN)/gi)){
                message.channel.send("PUN has the following subguilds: \n- [pun] Pirates United \n- [Prr] Meow \n- [PiD] Pirates Divided")
            }else if(args[0].match(/(Phi)/gi)){
                message.channel.send("Phi has the following subguilds: \n- [FUU] Surprise \n- [UUF] Phantom Menace \n- [FFi] Fraternal Fire \n- [GrE] Grand Explorers")
            }else if(args[0].match(/(ANO)/gi)){
                message.channel.send("ANO has the following subguilds: \n- [Ius] Illustratus \n- [ARX] Seekers of Arx \n- [zeb] dinkle winks \n- [Txp] The Tempest \n- [IcB] Ice Babies \n- [xsm] Exorcism")
            }else{
                message.channel.send("The guild with this tag doesn't exist, or isn't in Artemis.")
            }
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
