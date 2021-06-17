const fs = require('fs')
let output = [];
let includeList = ["Alliance", "Cooperating", "Neutral", "Other Allies"]
let output1 = [];
let listA = ["Alliance", "Cooperating", "Neutral", "Other Allies"]
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
		if(!message.member.roles.cache.has('472859173730648065') && !message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send(utils.errorResponse("notaguildmember", ""));
            return;
        }
		fs.readFile('Allies.json', (err, data) => {
			if (err) throw err;
				try {
					allyListJSON = JSON.parse(data);
				} catch (e) {
					//empty
				}
		
		
		
		if(!(args.join().replace(/,/g, " ").toUpperCase() == "RUSSIA IN WINTER")){
			let allyListTags = makeAllyTagList();
			allyList = makeAllyList();
			var upperCaseNames = allyListTags.map(function (value) {
				return value.toUpperCase();
			});
			if (upperCaseNames.indexOf(args[0]) == -1) {
				message.channel.send("You can attack this guild, it's not in our current Alliance/is no subguild of a guild in our current Alliance.");
			} else if (upperCaseNames.indexOf(args[0]) != -1) {
				message.channel.send(`The guild ${allyListTags[upperCaseNames.indexOf(args[0].toUpperCase())]} (${allyList[upperCaseNames.indexOf(args[0].toUpperCase())]}) is in Artemis (or they're a subguild), you shouldn't attack it.`)
			}
		}else{
			message.channel.send("As history tells us, it doesn't seem like a good idea tbh. But you do you.")
		}
	})	
	},
};