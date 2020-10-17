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
let output = [];
let includeList = ["Artemis", "Cooperating", "Neutral", "Other Allies"]
let output1 = [];
let listA = ["Artemis", "Cooperating", "Neutral", "Other Allies"]
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
module.exports = {
	name: 'caniattack',
	description: "Tells you if you should attack a certain guild.",
	execute(message, args) {
		if(!(args.join().replace(/,/g, " ").toUpperCase() == "RUSSIA IN WINTER")){
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
		}else{
			message.channel.send("As history tells us, it doesn't seem like a good idea tbh. But you do you.")
		}	
	},
};