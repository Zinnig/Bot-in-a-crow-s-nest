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

module.exports = {
	name: 'subs',
	description: "Lists the sub guilds of the selected guild (which is in Artemis)",
	execute(message, args) {
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
	},
};