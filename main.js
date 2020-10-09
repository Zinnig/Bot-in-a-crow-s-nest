const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
//for local testing
require('custom-env').env()
const token = process.env.token;

client.login(token);

let statuses = ["online", "idle", "dnd"];
let i = 0;
let astatus;
client.on("ready", () => {
    console.log("Started...");
    setInterval(function () {
        if (i <= 3) {
            astatus = statuses[i]
            i++;
            client.user.setPresence({
                status: astatus,
                game: {
                    name: "%help",
                    type: "LISTENING"
                }
            });
        } else if (i > 3) {
            i = 0;
        }

    }, 1000);

});
function index(a, arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
        }
    }
    return -1;
}
client.on("message", async message => {
    const prefix = process.env.prefix;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

function errorResponse(type, extraInfo){
    let errorEmbed = new Discord.RichEmbed()
    .setColor("#ff0000")
    switch(type){
        case "noperms":
            errorEmbed.setTitle(`You don't have the permission "${extraInfo}".`)
            break;
        case "wrongargs":
            errorEmbed.setTitle(`Invalid Arguments! Valid Arguments: ${extraInfo}`)
    }
    return errorEmbed
}
    if (cmd == "ping") {
        const msg = await message.channel.send(`Pinging...`);

        msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms \nAPI Latency is ${Math.round(client.ping)}ms`)
    }
    if (cmd == "help") {
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
    }
    let list = ["Avos Temple", "Bloody Beach", "Corkus Castle", "Corkus City", "Corkus City Mine",
        "Corkus City South", "Corkus Countryside", "Corkus Docks", "Corkus Forest North",
        "Corkus Forest South", "Corkus Mountain", "Corkus Outskirts", "Corkus Sea Cove", "Corkus Sea Port",
        "Durum Isles Center", "Fallen Factory", "Factory Entrance", "Legendary Island", "Southern Outpost",
        "Statue", "Corkus Abandoned Tower", "Road To Mine", "Ruined Houses", "Phinas Farm", "Lighthouse Plateau"]
    let allyListJSON = {
        "Artemis":{
            "Paladins United": "PUN",
            "Kingdom Foxes": "Fox",
            "Imperial": "Imp",
            "Phantom Hearts": "Phi",
            "Lux Nova": "LXA",
            "Titans Valor": "ANO",
            "IceBlue Team": "IBT",
            "Empire of Sindria": "ESI",
            "The Aquarium": "TAq",
            "Avicia": "AVO",
            "Emorians": "ERN",
            "HackForums": "Hax",
            "TheNoLifes": "TNL"
        },
        "Cooperating":{
            "House of Sentinels": "Snt",
            "The Simple Ones": "ILQ",
        },
        "Neutral":{
            "Vindicator": "VMZ",
        },
        "Other Allies":{
            "Kangronomicon": "Fuq",
        },
        "Subguilds":{
            "PUN": {
                "Meow": "Prr",
                "Pirates Divided": "PiD",
                "Rat Gang": "RGX",
            },
            "Fox": {
                "Ombra": "Omb",
                "Fluorine": "FNE",
                "I Corps": "LFX",
                "Panic": "PaN",
                "Fluffy Unicorns": "FuI",
                "Project Ultimatum": "PxU",
                "Lunatic": "Mox",
                "Ex Nihilo": "Nih",
                "Odysseia": "Oys",
                "HaHaUnited": "HHU",
                "Ram Ranch": "RMR",
            },
            "Imp": {
                "Metric": "Met",
                "Minerva": "Min",
                "Terra Steel": "KLA",
                "Kolibri": "KLI",
                "House of Sentinels": "Snt",
                "EPIcFORTNITEgAY": "lMP",
                "Germany FTW": "BKP",
                "Squad Zero": "SdZ",
                "jerf": "jrf",
            },
            "Phi":{
                "Grand Explorers": "GrE",
                "Surprise": "FUU",
                "Luna": "Lox",
                "Jasmine Dragons": "JsD",
                "Fraternal Fire": "FFi",
                "Gaming": "UcU",
                "Phantom Menace": "UUF",
            },
            "LXA": {
                "Join Lux Nova": "JXA",
                "Luwu Nowo": "Luw",
            },
            "ANO": {
                "Tartaros": "JNC",
                "Seekers of Arx": "ARX",
                "The Tempest": "Txp",
                "Ice Babies": "IcB",
                "Exorcism": "xsm",
                "Avorians": "AVM",
            },
            "BNU": {
                "Fantom Dreams": "FII",
                "Hyacinthum": "HCM",
                "FortniteKSI": "XDF",
                "BlueStoneGroup": "GSB",
                "Byzantium": "TBE",
                "IceBlue Fantasy": "IBF",
                "hacsckgoruem": "tej",
    
            },
            "ESI": {},
            "TAq": {},
            "AVO": {
                "Invicta": "IVA",
                "Time for Pizza": "VFN",
                "Stud Squad": "STQ",
                "Avocados": "JML",
                "Afishia": "AVF",
                "Ivory Tusk": "IVT",
            },
            "ERN": {
                "Audux": "uxu",
                "Mute Gang": "VCT",
                "Toemorians": "VHT"
            },
            "Hax": {
                "vape god": "vpe",
                "Kingdom Furries": "KFF",
                "HeckForums": "Hux",
                "Bruh Moment": "GJJ",
                "BoatForums": "Btx",
            },
            "TNL":{}
        }
    }

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

    function setupTimeDiff(diff) {
        years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000))
        days = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
        hours = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        minutes = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000) - hours * (60 * 60 * 1000)) / (60 * 1000))
        //seconds = Math.floor(diff  - years*(365*24*60*60*1000) - days*(24*60*60*1000) - hours*(60*60*1000) - minutes*(60*1000))/1000

        return `${years > 0 ? years + "y:" : ""}${days > 0 ? days + "d:" : ""}${hours > 0 ? hours + "h:" : ""}${minutes > 0 ? minutes + "min" : ""}`;
    }
    let output = [];
    let includeList = ["Artemis", "Cooperating", "Neutral", "Other Allies"]
    function makeAllyList() {
        includeList.forEach(function (elem) {
            for (property2 in allyListJSON[elem]) {
                if (output.indexOf(property2) == -1) {
                    output.push(property2)
                }
            }
        })
        for (property in allyListJSON["Subguilds"]) {
            for (property3 in allyListJSON["Subguilds"][property]) {
                output.push(property3)
            }
        }
        return output;
    }

    if (cmd === "war") {
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

        let terrs;
        fs.readFile("Map.json", 'utf8', function (err, data) {
            if (err) throw err;
            map = data
            try {
                terrs = JSON.parse(data);
            } catch (e) {
                //empty
            }
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "https://api.wynncraft.com/public_api.php?action=territoryList");
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (this.status == 200) {
                    try {
                        resText = JSON.parse(this.responseText);

                    } catch (e) {
                        //empty
                    }
                    let allyList = makeAllyList();
                    for (property in resText.territories) {
                        if (terrs.territories[property] == "PUN") {
                            i += 1;
                            if (resText.territories[property].guild != "Paladins United") {
                                regex = new RegExp(property, "g")
                                if (missingTerrs.search(regex) == -1) {
                                    if (allyList.indexOf(resText.territories[property].guild) == -1) {
                                        missingTerrs += `- ${property} (${resText.territories[property].guild})  \n `;
                                        notOwned += 1;
                                    } else if (allyList.indexOf(resText.territories[property].guild) != -1) {
                                        missingTerrs += `- [Ally] ${property} (${resText.territories[property].guild})  \n`;
                                        notOwned += 1;
                                    }
                                }
                            }
                        } else if (allyList.indexOf(resText.territories[property].guild) == -1 && terrs.territories[property] != null && terrs.territories[property] != "-") {
                            regex1 = new RegExp(property, "g")
                            if (missingTerrsAlly.search(regex1) == -1) {
                                missingTerrsAlly += `- [${terrs.territories[property]}] ${property} (${resText.territories[property].guild})  \n`
                                notOwnedAlly += 1;
                            }


                        } else if ((terrs.territories[property] == null || terrs.territories[property] == "-") && resText.territories[property].guild != "Paladins United") {
                            missingFFAs += `- ${property} (${resText.territories[property].guild}) \n`
                            notOwnedFFA += 1;
                        }
                    }
                }
                try {
                    if (sent == false && i >= list.length) {
                        if (notOwned == 0) {
                            terrEmbed = new Discord.RichEmbed()
                                .setColor('#582370')
                                .setTitle("Peace...")
                                .addField("We're not missing any territories.", "Have a box of cookies.");
                            message.channel.send(terrEmbed)
                            sent = true
                        } else if (notOwned > 0 && notOwned <= 5) {
                            terrEmbed = new Discord.RichEmbed()
                                .setColor('#ffcc00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following territories (${notOwned}):`, missingTerrs);
                            message.channel.send(terrEmbed)
                            sent = true
                        } else if (notOwned > 5 && notOwned <= 10) {
                            terrEmbed = new Discord.RichEmbed()
                                .setColor('#ff9d00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following territories (${notOwned}):`, missingTerrs);
                            message.channel.send(terrEmbed)
                            sent = true
                        } else if (notOwned > 10 && notOwned <= 15) {
                            terrEmbed = new Discord.RichEmbed()
                                .setColor('#ff6f00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following territories (${notOwned}):`, missingTerrs);
                            message.channel.send(terrEmbed)
                            sent = true
                        } else if (notOwned > 15) {
                            terrEmbed = new Discord.RichEmbed()
                                .setColor('#ff000d')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following territories (${notOwned}):`, missingTerrs);
                            message.channel.send(terrEmbed)
                            sent = true
                        }
                    }
                    if (sent2 == false && i >= list.length) {
                        if (notOwnedAlly == 0) {
                            terrAllyEmbed = new Discord.RichEmbed()
                                .setColor('#582370')
                                .setTitle("Peace for the whole alliance")
                                .addField("Our Allies are not missing any territories.", "Have a box of cookies.");
                            message.channel.send(terrAllyEmbed)
                            sent2 = true
                        } else if (notOwnedAlly > 0 && notOwnedAlly <= 5) {
                            terrAllyEmbed = new Discord.RichEmbed()
                                .setColor('#ffcc00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):`, missingTerrsAlly);
                            message.channel.send(terrAllyEmbed)
                            sent2 = true
                        } else if (notOwnedAlly > 5 && notOwnedAlly <= 10) {
                            terrAllyEmbed = new Discord.RichEmbed()
                                .setColor('#ff9d00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):`, missingTerrsAlly);
                            message.channel.send(terrAllyEmbed)
                            sent2 = true
                        } else if (notOwnedAlly > 10 && notOwnedAlly <= 15) {
                            terrAllyEmbed = new Discord.RichEmbed()
                                .setColor('#ff6f00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):`, missingTerrsAlly);
                            message.channel.send(terrAllyEmbed)
                            sent2 = true
                        } else if (notOwnedAlly > 15) {
                            terrAllyEmbed = new Discord.RichEmbed()
                                .setColor('#ff000d')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):`, missingTerrsAlly);
                            message.channel.send(terrAllyEmbed)
                            sent2 = true
                        }
                    }
                    if (sent3 == false && i >= list.length) {
                        if (notOwnedFFA == 0) {
                            ffaEmbed = new Discord.RichEmbed()
                                .setColor('#582370')
                                .setTitle("Peace ... - and also good xp gain!")
                                .addField("We're not missing any FFAs.", "Have a box of cookies.");
                            message.channel.send(ffaEmbed)
                            sent3 = true
                        } else if (notOwnedFFA > 0 && notOwnedFFA <= 5) {
                            ffaEmbed = new Discord.RichEmbed()
                                .setColor('#ffcc00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following FFAs (${notOwnedFFA}):`, missingFFAs);
                            message.channel.send(ffaEmbed)
                            sent3 = true
                        } else if (notOwnedFFA > 5 && notOwnedFFA <= 10) {
                            ffaEmbed = new Discord.RichEmbed()
                                .setColor('#ff9d00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following FFAs (${notOwnedFFA}):`, missingFFAs);
                            message.channel.send(ffaEmbed)
                            sent3 = true
                        } else if (notOwnedFFA > 10 && notOwnedFFA <= 15) {
                            ffaEmbed = new Discord.RichEmbed()
                                .setColor('#ff6f00')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following FFAs (${notOwnedFFA}):`, missingFFAs);
                            message.channel.send(ffaEmbed)
                            sent3 = true
                        } else if (notOwnedFFA > 15) {
                            ffaEmbed = new Discord.RichEmbed()
                                .setColor('#ff000d')
                                .setTitle("Get the man-o'-war ready!")
                                .addField(`We're currently missing the following FFAs (${notOwnedFFA}):`, missingFFAs);
                            message.channel.send(ffaEmbed)
                            sent3 = true
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }

        });

    }
    let returnStr;
    function makeSubGuildString(guildTag, a) {
        returnStr = "";
        if (Object.keys(a["Subguilds"][guildTag]).length == 0) {
            returnStr = guildTag + " has no subguilds."
        } else {
            returnStr = guildTag + " has the following subguilds: \n"
            for (property in a["Subguilds"][guildTag]) {
                returnStr += `- [${a["Subguilds"][guildTag][property]}] ${property} \n`
            }
        }
        return returnStr;
    }
    if (cmd == "subs") {
        if (args[0].match(/(Fox)/gi)) {
            message.channel.send(makeSubGuildString("Fox", allyListJSON))
        } else if (args[0].match(/(Imp)/gi)) {
            message.channel.send(makeSubGuildString("Imp", allyListJSON))
        } else if (args[0].match(/(AVO)/gi)) {
            message.channel.send(makeSubGuildString("AVO", allyListJSON))
        } else if (args[0].match(/(BNU)/gi)) {
            message.channel.send(makeSubGuildString("BNU", allyListJSON))
        } else if (args[0].match(/(ESI)/gi)) {
            message.channel.send(makeSubGuildString("ESI", allyListJSON))
        } else if (args[0].match(/(Hax)/gi)) {
            message.channel.send(makeSubGuildString("Hax", allyListJSON))
        } else if (args[0].match(/(LXA)/gi)) {
            message.channel.send(makeSubGuildString("LXA", allyListJSON))
        } else if (args[0].match(/(PUN)/gi)) {
            message.channel.send(makeSubGuildString("PUN", allyListJSON))
        } else if (args[0].match(/(ANO)/gi)) {
            message.channel.send(makeSubGuildString("ANO", allyListJSON))
        } else if (args[0].match(/(ERN)/gi)) {
            message.channel.send(makeSubGuildString("ERN", allyListJSON))
        } else if (args[0].match(/(Phi)/gi)) {
            message.channel.send(makeSubGuildString("Phi", allyListJSON))
        }else if (args[0].match(/(TNL)/gi)){
            message.channel.send(makeSubGuildString("TNL", allyListJSON))
        } else {
            message.channel.send("The guild with this tag doesn't exist, or isn't in Artemis.")
        }
    }
    let output1 = [];
    let listA = ["Artemis", "Cooperating", "Neutral", "Other Allies"]
    function makeAllyTagList() {
        listA.forEach(function (elem) {
            for (property in allyListJSON[elem]) {
                output1.push(allyListJSON[elem][property])
            }
        })
        for (property2 in allyListJSON["Subguilds"]) {
            for (property3 in allyListJSON["Subguilds"][property2])
                output1.push(allyListJSON["Subguilds"][property2][property3])
        }
        return output1
    }
    if (cmd == "caniattack") {
        let allyListTags = makeAllyTagList();
        allyList = makeAllyList();
        var upperCaseNames = allyListTags.map(function (value) {
            return value.toUpperCase();
        });
        if (upperCaseNames.indexOf(args[0].toUpperCase()) == -1) {
            message.channel.send("You can attack this guild, it's not in Artemis/is no subguild of a guild in Artemis.");
        } else if (upperCaseNames.indexOf(args[0].toUpperCase()) != -1) {
            message.channel.send(`The guild ${allyListTags[upperCaseNames.indexOf(args[0].toUpperCase())]} (${allyList[upperCaseNames.indexOf(args[0].toUpperCase())]}) is in Artemis (or they're a subguild), you shouldn't attack it.`)
        }
    }
    let sorting = ["OWNER", "CHIEF", "CAPTAIN", "RECRUITER", "RECRUIT"]
    let timeList = [];
    let resTime = "";
    let sentTime = false;
    let ownerString = "";
    let chiefString = "";
    let captainString = "";
    let recruiterString = "";
    let recruitString = "";
    let e = 0;
    if (cmd == "timeinguild") {
        let input = args.join().replace(/,/, " ");
        let now = Date.now()
        xmlTime = new XMLHttpRequest();
        xmlTime.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=" + input);
        xmlTime.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4) {
                try {
                    resTime = JSON.parse(this.responseText);
                } catch (e) {
                    //empty
                }
                for (property in resTime.members) {
                    if (index(resTime.members[property].name, timeList) == -1) {
                        timeList.push([resTime.members[property].name, resTime.members[property].rank, setupTimeDiff(now - Date.parse(resTime.members[property].joined))]);
                        timeList.sort(function (a, b) {
                            return sorting.indexOf(a[1]) - sorting.indexOf(b[1]);
                        });
                    }
                }
            }
            if (sentTime == false) {
                for (property in timeList) {
                    e++;
                    switch (timeList[property][1]) {
                        case "OWNER":
                            ownerString = `- ${timeList[0][0]} has been in the guild for ${timeList[0][2]}`;
                            break;
                        case "CHIEF":
                            chiefString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "CAPTAIN":
                            captainString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "RECRUITER":
                            recruiterString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                        case "RECRUIT":
                            recruitString += `- ${timeList[property][0]} has been in the guild for ${timeList[property][2]}\n`;
                            break;
                    }
                    if (e >= timeList.length) {
                        let rankStrings = [chiefString, captainString, recruiterString, recruitString];
                        let timeEmbed = new Discord.RichEmbed()
                            .setTitle(`Time in the guild "${input}"`)
                            .setColor("#123456")
                            .addField("Owner", "```" + ownerString + "```")
                        for (property in rankStrings) {
                            if (rankStrings[property].length > 1024) {
                                let n = Math.floor(rankStrings[property].length / 1024)
                                for (i = 0; i <= n; i++) {
                                    timeEmbed.addField(chiefString == rankStrings[property] ?
                                        "Chiefs Part " + (i + 1) : captainString == rankStrings[property] ?
                                            "Captains Part " + (i + 1) : recruiterString == rankStrings[property] ?
                                                "Recruiters Part " + (i + 1) : recruitString == rankStrings[property] ?
                                                    "Recruits Part " + (i + 1) : "Error", chiefString == rankStrings[property] ?
                                        "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "```" : captainString == rankStrings[property] ?
                                            "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "``` " : recruiterString == rankStrings[property] ?
                                                "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "``` " : recruitString == rankStrings[property] ?
                                                    "```" + rankStrings[property].substr(rankStrings[property].indexOf("-", rankStrings[property].lastIndexOf("\n", (i) * 1024)), rankStrings[property].lastIndexOf("\n", (i + 1) * 1024)) + "``` " : "Error");
                                }
                            } else {
                                timeEmbed.addField(chiefString == rankStrings[property] ? "Chiefs" : captainString == rankStrings[property] ? "Captains" : recruiterString == rankStrings[property] ? "Recruiters" : recruitString == rankStrings[property] ? "Recruits" : "Error", chiefString == rankStrings[property] ? "```" + chiefString + "```" : captainString == rankStrings[property] ? "```" + captainString + "```" : recruiterString == rankStrings[property] ? "```" + recruiterString + "```" : recruitString == rankStrings[property] ? "```" + recruitString + "```" : "Error");
                            }
                        }
                        if (sentTime == false) {
                            message.channel.send(timeEmbed)
                            sentTime = true;
                        }

                    }

                }


            }

        }
        xmlTime.send();
    }

  /* 
    //RoleName, Emoji, Title ... (with spaces)
    if(cmd == "reactionroles"){ 
        if(args.length < 3) message.channel.send(errorResponse("wrongargs", "MANAGE_GUILD"))
        if(message.member.hasPermission("MANAGE_GUILD")){
            let reactionEmbed = new Discord.RichEmbed()
            .setColor("#ABCDEF")
            .setTitle(args.slice(2).toString().replace(/,/g, " "))
            .setDescription(args[1])
            message.channel.send(reactionEmbed).then((message) => {
                message.react(args[1].replace(">", ""))
                let xmlReactionGET = new XMLHttpRequest();
                xmlReactionGET.open("GET", process.env.reactionURL)
                xmlReactionGET.setRequestHeader("Content-Type", "application/json");
                xmlReactionGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlReactionGET.setRequestHeader("versioning", false)
                xmlReactionGET.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        try{
                            resTextReaction = JSON.parse(this.responseText);
                            resTextReaction.data.push([message.id, args[1], args[0]])
                            let xmlReaction = new XMLHttpRequest();
                            xmlReaction.open("PUT", process.env.reactionURL)
                            xmlReaction.setRequestHeader("Content-Type", "application/json");
                            xmlReaction.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                            xmlReaction.setRequestHeader("versioning", false)
                            xmlReaction.send(JSON.stringify(resTextReaction))  
                        }catch(e){
                            throw e
                        }
                    }
                }

                xmlReactionGET.send();
                
            })
            

        }
    }

    
    let gList = [[]]
    function guildList(str) {
        for (i = 1; i <= inputStats.match(/#/g).length; i++) {
            name = str.slice(str.search(/#/) + 3, str.search((/( -)/)))
            if (name.search(" ") != -1) {
                name = name.replace(" ", "")
            }
            xp = Number(str.slice(str.search(/(- )/) + 2, str.search(/( XP)/)))
            ems = Number(str.slice(str.search(/(XP - )/) + 5, str.search(/(Emeralds)/) - 1))
            joined = str.slice(str.search(/(Joined)/) + 7, str.search(/(\n)/) - 1)

            gList.push([name, xp, ems, joined])
            str = str.replace(str.slice(str.search(/#/), str.search(/(\n)/) + 1), "")
        }
        gList.shift()
        return gList
    }
    let inputStats = "";
    let guildStatsList = [];
    let outputList = [];
    let currentGuildStats = [];
    let mileStone5 = "";
    let mileStone4 = "";
    let mileStone3 = "";
    let mileStone2 = "";
    let mileStone1 = "";
    let mileStone0 = "";
    let counter5 = 0;
    let counter4 = 0;
    let counter3 = 0;
    let counter2 = 0;
    let counter1 = 0;
    let counter0 = 0;
    let sentStats = false;
    let f = 0;
    let timestamp;
    if (cmd == "guildstats") {
        if (args[0] == "update") {
            if(message.member.hasPermission("MANAGE_GUILD")){
            attachmentsArray = message.attachments.array();
            let xmlStats = new XMLHttpRequest();
            xmlStats.open("GET", attachmentsArray[0].url);
            xmlStats.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.getResponseHeader('content-type') == "text/plain") {
                        inputStats = this.responseText
                        inputStats = inputStats.replace(inputStats.slice(0, 58), "")
                        inputStats = inputStats.replace(/� -/g, " Emeralds");

                        while (inputStats.search(/CHAT/) != -1) {
                            if(inputStats.search(/CHAT/) != -1){
                                inputStats = inputStats.replace(inputStats.slice(inputStats.search(/:/) - 3, inputStats.search(/CHAT/) + 6), "\n")
                            }
                        }
                        guildStatsList = guildList(inputStats);
                        guildStatsList.forEach(function(elem){
                            let xmlUUIDStats = new XMLHttpRequest();
                            xmlUUIDStats.open("GET", "https://mc-heads.net/minecraft/profile/" + elem[0]);
                            xmlUUIDStats.onreadystatechange = function(){
                                if(this.status == 200 && this.readyState == 4){
                                try{
                                    resTextUUIDStats = JSON.parse(this.responseText);
                                    uuidStats = resTextUUIDStats.id;
                                    outputList.push([uuidStats, elem[1], elem[2], elem[3]])
                                    if(outputList.length == guildStatsList.length){
                                        let xmlGetStats = new XMLHttpRequest();
                                        xmlGetStats.open("GET", process.env.guildStatsURL);
                                        xmlGetStats.setRequestHeader("Content-Type", "application/json");
                                        xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                        xmlGetStats.setRequestHeader("versioning", false)
                                        xmlGetStats.onreadystatechange = function(){
                                            if(this.status == 200 && this.readyState == 4){
                                                resTextUpdateStats = JSON.parse(this.responseText);
                                                for(property in resTextUpdateStats.now){
                                                    if(resTextUpdateStats.now[property][3] != outputList[index(resTextUpdateStats.now[property][0], outputList)][3]){
                                                        outputList[index(resTextUpdateStats.now[property][0], outputList)][1] += resTextUpdateStats.now[property][1];
                                                        outputList[index(resTextUpdateStats.now[property][0], outputList)][2] += resTextUpdateStats.now[property][2];
                                                    }
                                                }
                                                let guildStatsJSON = {
                                                    "now": outputList,
                                                    "lastCounts": resTextUpdateStats.lastCounts,
                                                    "timestamp": Date.now()
                                                }
                                                let xmlUpdateStats = new XMLHttpRequest();
                                                xmlUpdateStats.open("PUT", process.env.guildStatsURL);
                                                xmlUpdateStats.setRequestHeader("Content-Type", "application/json");
                                                xmlUpdateStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                                xmlUpdateStats.setRequestHeader("versioning", false)
                                                xmlUpdateStats.send(JSON.stringify(guildStatsJSON));
                                                xmlUpdateStats.onreadystatechange = function(){
                                                    console.log(this.status)
                                               
                                            }
                                        }
                                         }
                                         xmlGetStats.send();
                                    }
                                }catch(e){
                                    //empty
                                }
                            }
                            
                        }
                            xmlUUIDStats.send();
                    })
                    
                }
                
                }
            }
            xmlStats.send();

           
        }else{
            message.channel.send(errorResponse("noperms", "MANAGE_GUILD"))
        }
        
        }else if(args[0] == "em" || args[0] == "gxp"){
            let xmlGuildStats = new XMLHttpRequest();
            xmlGuildStats.open("GET", process.env.guildStatsURL);
            xmlGuildStats.setRequestHeader("Content-Type", "application/json");
            xmlGuildStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlGuildStats.setRequestHeader("versioning", false)
            xmlGuildStats.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    try{
                    resTextGuildStats = JSON.parse(this.responseText);
                    timeStamp = resTextGuildStats.timestamp
                    resTextGuildStats.now.forEach(elem => {
                        f++;
                        let xmlUUIDGuildStats = new XMLHttpRequest();
                        xmlUUIDGuildStats.open("GET", "https://mc-heads.net/minecraft/profile/" + elem[0]);
                        xmlUUIDGuildStats.onreadystatechange = () => {
                            if(this.status == 200 && this.readyState == 4){
                                try{
                                    resTextUUIDGuildStats = JSON.parse(xmlUUIDGuildStats.responseText);
                                    if(index(elem[0], currentGuildStats) == -1){
                                        currentGuildStats.push([resTextUUIDGuildStats.name, elem[0],elem[1], elem[2], elem[3]])
                                    }
                                    if(resTextGuildStats.now.length >= currentGuildStats.length){
                                    if(args[0] == "em"){
                                        let ems = [...currentGuildStats]
                                        ems.sort((a, b) => {
                                            return b[3] - a[3]
                                        })
                                        if(sentStats == false){
                                            if(f == ems.length){
                                        for(property in ems){
                                            let searchReg = new RegExp(ems[property][0], "g")
                                            
                                            if(ems[property][3] >= 5000000){
                                                if(mileStone5.search(searchReg) == -1){
                                                    mileStone5 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter5++;
                                                }
                                                }else if(ems[property][3] >=1000000){
                                                    if(mileStone4.search(searchReg) == -1){
                                                    mileStone4 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter4++;
                                                    }
                                                }else if(ems[property][3] >= 500000){
                                                    if(mileStone3.search(searchReg) == -1){
                                                    mileStone3 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter3++;
                                                    }
                                                }else if(ems[property][3] >= 250000){
                                                    if(mileStone2.search(searchReg) == -1){
                                                    mileStone2 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter2++;
                                                    }
                                                }else if(ems[property][3] >= 50000){
                                                    if(mileStone1.search(searchReg) == -1){
                                                    mileStone1 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter1++;
                                                }
                                                }else if(ems[property][3] < 50000){
                                                    if(mileStone0.search(searchReg) == -1){
                                                    mileStone0 += `- ${ems[property][0]}: ${ems[property][3].toLocaleString("en")} emeralds \n`
                                                    counter0++;
                                            }
                                        }
                                        }
                                        if(property == ems.length - 1){
                                            let statsEmbed = new Discord.RichEmbed()
                                            .setTitle("Emeralds (All Time)")
                                            .setColor("#50D343")
                                            .setFooter(`Last Update: ${(new Date(resTextGuildStats.timestamp)).toUTCString()}`)
                                            .addField(`EM V (${counter5}) [5,000,000]` , "```css\n"+mileStone5+"```")
                                            .addField(`EM IV (${counter4}) [1,000,000]`, "```css\n"+mileStone4+"```")
                                            .addField(`EM III (${counter3}) [500,000]`, "```css\n"+mileStone3+"```")
                                            .addField(`EM II (${counter2}) [250,000]`, "```css\n"+mileStone2+"```")
                                            .addField(`EM I (${counter1}) [50,000]`, "```css\n"+mileStone1+"```")
                                            .addField(`No milestone (${counter0})`, "```css\n"+mileStone0+"```")
                                            message.channel.send(statsEmbed)
                                            sentStats = true;
                                        }
                                    }
                                }
                                    }else if(args[0] == "gxp"){
                                        let gxp = [...currentGuildStats]
                                        gxp.sort((a, b) => {
                                            return b[2] - a[2]
                                        })
                                        console.log(currentGuildStats.length, gxp.length)
                                        if(sentStats == false){
                                            if(f == gxp.length){
                                            for(property in gxp){
                                                let searchReg = new RegExp(gxp[property][0], "g")
                                                if(gxp[property][2] >= 10000000000){
                                                    if(mileStone5.search(searchReg) == -1){
                                                        mileStone5 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter5++;
                                                    }
                                                    }else if(gxp[property][2] >= 5000000000){
                                                        if(mileStone4.search(searchReg) == -1){
                                                        mileStone4 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter4++;
                                                        }
                                                    }else if(gxp[property][2] >= 1000000000){
                                                        if(mileStone3.search(searchReg) == -1){
                                                        mileStone3 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter3++;
                                                        }
                                                    }else if(gxp[property][2] >= 500000000){
                                                        if(mileStone2.search(searchReg) == -1){
                                                        mileStone2 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter2++;
                                                        }
                                                    }else if(gxp[property][2] >= 250000000){
                                                        if(mileStone1.search(searchReg) == -1){
                                                        mileStone1 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter1++;
                                                    }
                                                    }else if(gxp[property][2] < 100000000){
                                                        if(mileStone0.search(searchReg) == -1){
                                                        mileStone0 += `- ${gxp[property][0]}: ${gxp[property][2].toLocaleString("en")} GXP \n`
                                                        counter0++;
                                                }
                                            }
                                        }
                                        if(property == gxp.length - 1){
                                            let statsEmbed = new Discord.RichEmbed()
                                            .setTitle("GXP (All Time)")
                                            .setColor("#7BD19F")
                                            .setFooter(`Last Update: ${(new Date(resTextGuildStats.timestamp)).toUTCString()}`)
                                            .addField(`GXP V (${counter5}) [10,000,000,000]` , "```yaml\n"+mileStone5+"```")
                                            .addField(`GXP IV (${counter4}) [5,000,000,000]`, "```yaml\n"+mileStone4+"```")
                                            .addField(`GXP III (${counter3}) [1,000,000,000]`, "```yaml\n"+mileStone3+"```")
                                            .addField(`GXP II (${counter2}) [500,000,000]`, "```yaml\n"+mileStone2+"```")
                                            .addField(`GXP I (${counter1}) [100,000,000]`, "```yaml\n"+mileStone1+"```")
                                            .addField(`No milestone (${counter0})`, "```yaml\n"+mileStone0+"```")
                                            console.table(gxp)
                                            message.channel.send(statsEmbed)
                                            sentStats = true;
                                    }
                                }
                                    }
                                } 
                                }
                                    

                                }catch(e){
                                    //empty
                                }
                            }
                        };
                        xmlUUIDGuildStats.send()
                    })
                    
                    }catch(e){
                        //empty
                    }
                }
            }
            xmlGuildStats.send();
        }else{
            message.channel.send(errorResponse("wrongargs", "em, gxp, update"))
        }
    }
    if(cmd == "setlastcounts"){
        if(message.member.hasPermission("MANAGE_GUILD")){
            attachmentsArray = message.attachments.array();
            let xmlSetLast = new XMLHttpRequest();
            xmlSetLast.open("GET", attachmentsArray[0].url);
            xmlSetLast.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.getResponseHeader('content-type') == "text/plain") {
                        inputStats = this.responseText
                        inputStats = inputStats.replace(inputStats.slice(0, 58), "")
                        inputStats = inputStats.replace(/� -/g, " Emeralds");

                        while (inputStats.search(/CHAT/) != -1) {
                            if(inputStats.search(/CHAT/) != -1){
                                inputStats = inputStats.replace(inputStats.slice(inputStats.search(/:/) - 3, inputStats.search(/CHAT/) + 6), "\n")
                            }
                        }
                        guildLastList = guildList(inputStats);
                        guildLastList.forEach(function(elem){
                            let xmlUUIDLast = new XMLHttpRequest();
                            xmlUUIDLast.open("GET", "https://mc-heads.net/minecraft/profile/" + elem[0]);
                            xmlUUIDLast.onreadystatechange = function(){
                                if(this.status == 200 && this.readyState == 4){
                                try{
                                    resTextUUIDStats = JSON.parse(this.responseText);
                                    uuidLast = resTextUUIDStats.id;
                                    outputList.push([uuidLast, elem[1], elem[2], elem[3]])
                                    if(outputList.length == guildLastList.length){
                                        let xmlGetLast = new XMLHttpRequest();
                                        xmlGetLast.open("GET", process.env.guildStatsURL);
                                        xmlGetLast.setRequestHeader("Content-Type", "application/json");
                                        xmlGetLast.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                        xmlGetLast.setRequestHeader("versioning", false)
                                        xmlGetLast.onreadystatechange = function(){
                                            if(this.status == 200 && this.readyState == 4){
                                                resTextUpdateLast = JSON.parse(this.responseText);
                                                for(property in resTextUpdateLast.now){
                                                    if(resTextUpdateLast.now[property][3] != outputList[index(resTextUpdateLast.now[property][0], outputList)][3]){
                                                        outputList[index(resTextUpdateLast.now[property][0], outputList)][1] += resTextUpdateLast.now[property][1];
                                                        outputList[index(resTextUpdateLast.now[property][0], outputList)][2] += resTextUpdateLast.now[property][2];
                                                    }
                                                }
                                                let guildLastJSON = {
                                                    "now": resTextUpdateLast.now,
                                                    "lastCounts": outputList,
                                                    "timestamp": Date.now()
                                                }
                                                let xmlUpdateLast = new XMLHttpRequest();
                                                xmlUpdateLast.open("PUT", process.env.guildStatsURL);
                                                xmlUpdateLast.setRequestHeader("Content-Type", "application/json");
                                                xmlUpdateLast.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                                xmlUpdateLast.setRequestHeader("versioning", false)
                                                xmlUpdateLast.send(JSON.stringify(guildLastJSON));
                                                xmlUpdateLast.onreadystatechange = function(){
                                                    console.log(this.status)
                                               
                                            }
                                        }
                                         }
                                         xmlGetLast.send();
                                    }
                                }catch(e){
                                    //empty
                                }
                            }
                            
                        }
                            xmlUUIDLast.send();
                    })
                    
                }
                
                }
            }
            xmlSetLast.send();

           
        }else{
            message.channel.send(errorResponse("noperms", "MANAGE_GUILD"))
        }
    }
    let outputSinceLast = "";
    let g = 0;
    let nowList = [];
    if(cmd == "sincelastcounts"){        
        let xmlGetCounts = new XMLHttpRequest();
            xmlGetCounts.open("GET", process.env.guildStatsURL);
            xmlGetCounts.setRequestHeader("Content-Type", "application/json");
            xmlGetCounts.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlGetCounts.setRequestHeader("versioning", false)
            xmlGetCounts.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    try{
                    resTextCounts = JSON.parse(this.responseText);
                        for(property in resTextCounts.now){   
                            let xmlUUIDCounts = new XMLHttpRequest();
                            xmlUUIDCounts.open("GET", "https://mc-heads.net/minecraft/profile/" + resTextCounts.now[property][0])
                            xmlUUIDCounts.onreadystatechange = () => {
                                if(xmlUUIDCounts.status == 200 && xmlUUIDCounts.readyState == 4){
                                    try {
                                        console.log(property, g)
                                        let resTextUUIDCounts = JSON.parse(xmlUUIDCounts.responseText)
                                        if(index(resTextUUIDCounts.name, nowList) == -1){
                                            nowList.push(resTextUUIDCounts.name, resTextCounts.now[property])
                                        }
                                        let searchCountsReg = new RegExp(resTextUUIDCounts.name, "g")
                                        if(outputSinceLast.search(searchCountsReg) == -1){
                                            outputSinceLast += `- ${resTextUUIDCounts.name}: +${(resTextCounts.now[g][1] - resTextCounts.lastCounts[index(resTextCounts.now[g][0], resTextCounts.lastCounts)][1]).toLocaleString("en")} GXP; +${(resTextCounts.now[g][2] - resTextCounts.lastCounts[index(resTextCounts.now[g][0], resTextCounts.lastCounts)][2]).toLocaleString("en")} emeralds\n`
                                        }
                                        g++;
                                        if(g == resTextCounts.now.length){
                                            let sinceLastEmbed = new Discord.RichEmbed()
                                            .setColor("#000000")
                                            .setTitle("GXP/Emeralds gained since the last Pillager Counts")
                                            .setFooter(`Last Update: ${(new Date(resTextCounts.timestamp)).toUTCString()}`)
                                            if(outputSinceLast.length > 1024){
                                                let n = Math.floor(outputSinceLast.length / 1024)
                                                for(i = 0;i <= n;i++){
                                                    sinceLastEmbed.addField("Changes Part " + (i+1), "```" + outputSinceLast.substr(outputSinceLast.indexOf("-", i*1024), outputSinceLast.lastIndexOf("\n", (i+1)*1024 - 100)) + "\n```")
                                                }
                                            }else{
                                                sinceLastEmbed.addField("Changes", outputSinceLast)
                                            }
                                            message.channel.send(sinceLastEmbed)
                                        }
                                    } catch (e) {
                                        throw e
                                    }
                                }
                            }
                            xmlUUIDCounts.send();
                            }
                        
                        }catch(e){
                            //empty
                        }
                    }
                }
            xmlGetCounts.send();      
    }
    /*
      let resText2 = "";
        let names = [];
        let nameTime = [[]];
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
                        let i = 0;
                        for(property in resText2.members){
                            let xmlUUID = new XMLHttpRequest();
                            xmlUUID.open("GET", "https://mc-heads.net/minecraft/profile/" + resText2.members[property].name);
                            xmlUUID.onreadystatechange = function(){
                                if(this.status == 200 && this.readyState == 4){
                                try{
                                resTextUUID = JSON.parse(this.responseText);
                                dashedUUID =  resTextUUID.id.substr(0,8)+"-"+resTextUUID.id.substr(8,4)+"-"+resTextUUID.id.substr(12,4)+"-"+resTextUUID.id.substr(16,4)+"-"+resTextUUID.id.substr(20);
                                if(dashedUUIDs.indexOf(dashedUUID) == -1){
                                    dashedUUIDs.push(dashedUUID);
                                }
                                //Getting the stats of the players.
                                let resText3 = "";
                                for(uuids in dashedUUIDs){
                                    if(names.indexOf(dashedUUIDs[uuids]) == -1){
                                        names.push(dashedUUIDs[uuids]);
                                    }
                                    xml12 = new XMLHttpRequest();
                                    xml12.open("GET", "https://api.wynncraft.com/v2/player/" + names[uuids]+  "/stats");
                                    xml12.onreadystatechange = function(){0
                                        i++;
                                        if(this.status == 200 && this.readyState == 4){
                                            try{
                                                resText3 = JSON.parse(this.responseText);
                                                if(index(resText3.data[0].username, nameTime) == -1){
                                                    nameTime.push([resText3.data[0].username, resText3.data[0].meta.lastJoin]);
                                                }
                                                console.table(nameTime)
                                                 
                                            }catch(e){
                                                throw e
                                            }
                                        }
                                    }
                                    xml12.send()
                                }
                                
                            }catch(e){
                                //empty
                            }
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
       /*
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
    if(user.id != '639956302788820993'){-
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
 })
 /*
client.on("messageReactionAdd", async (reaction, user) => {
    console.log("reaction")
    if (reaction.message.partial) {
        console.log("oldreaction")
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
        
    }
    let xmlReactionAddGET = new XMLHttpRequest();
    xmlReactionAddGET.open("GET", process.env.reactionURL)
    xmlReactionAddGET.setRequestHeader("Content-Type", "application/json");
    xmlReactionAddGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
    xmlReactionAddGET.setRequestHeader("versioning", false)
    xmlReactionAddGET.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            try{
            resTextReactionAdd = JSON.parse(this.responseText)
            if(index(reaction.message.id, resTextReactionAdd) != -1){
                console.log(resTextReactionAdd[index(reaction.message.id, resTextReactionAdd)][2])
                user.addRole(resTextReactionAdd[index(reaction.message.id, resTextReactionAdd)][2])
            }
            }catch(e){
                throw e;
            }
        }
    }
    xmlReactionAddGET.send();  
})
*/
client.on("voiceStateUpdate", () => {
    const guild = client.guilds.get('463736564837777428')
    const channels = guild.channels.filter(c => c.parentID === '468697649592401920' && c.type === 'voice');

    for (const [channelID, channel] of channels) {
        for (const [memberID, member] of channel.members) {
            if (channel.id === '666379507522863104') {
                console.log("ChannelID: " + channelID + "\nMemberID: " + memberID);
                member.setVoiceChannel('666381898343514133')
                    .then(() => console.log(`Moved ${member.user.tag}.`))
                    .catch(console.error);
            }
        }
    }
});