const fs = require('fs')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
module.exports = {
	name: 'war',
	description: "Gives you a list of territories you can attack. They're sorted by priority.",
	execute(message, args) {
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
                "Kingdom Furries": "KFF"
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

	},
};