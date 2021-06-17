const fs = require('fs')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const utils = require('../utils.js')
module.exports = {
	name: 'war',
	description: "Gives you a list of territories you can attack. They're sorted by priority.",
	execute(message, args) {
        if (!message.member.roles.cache.has('472859173730648065')) {
            message.channel.send(utils.errorResponse("notaguildmember", ""));
            return;
        }
		let list = ["Avos Temple", "Bloody Beach", "Corkus Castle", "Corkus City", "Corkus City Mine",
        "Corkus City South", "Corkus Countryside", "Corkus Docks", "Corkus Forest North",
        "Corkus Forest South", "Corkus Mountain", "Corkus Outskirts", "Corkus Sea Cove", "Corkus Sea Port",
        "Durum Isles Center", "Fallen Factory", "Factory Entrance", "Legendary Island", "Southern Outpost",
        "Statue", "Corkus Abandoned Tower", "Road To Mine", "Ruined Houses", "Phinas Farm", "Lighthouse Plateau"]

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
fs.readFile('Allies.json', (err, data) => {
    if (err) throw err;
        allies = data
        try {
            allyListJSON = JSON.parse(data);
        } catch (e) {
            //empty
        }


let output = [];
    let includeList = ["Alliance", "Cooperating", "Neutral", "Other Allies"]
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
                    } else if (allyList.indexOf(resText.territories[property].guild) == -1 && terrs.territories[property] != null && terrs.territories[property] != "-" && terrs.territories[property] != "UND") {
                        regex1 = new RegExp(property, "g")
                        if (missingTerrsAlly.search(regex1) == -1) {
                            missingTerrsAlly += `- [${terrs.territories[property]}] ${property} (${resText.territories[property].guild})  \n`
                            notOwnedAlly += 1;
                        }


                    } else if (((terrs.territories[property] == null || terrs.territories[property] == "-") && resText.territories[property].guild != "Paladins United") && terrs.territories[property] != "UND") {
                        missingFFAs += `- ${property} (${resText.territories[property].guild}) \n`
                        notOwnedFFA += 1;
                    }
                }
            }
            console.log(missingTerrs.length, missingTerrsAlly.length, missingFFAs.length);
            try {
                if (sent == false && i >= list.length) {
                    terrEmbed = new Discord.MessageEmbed()
                    .setColor(notOwned == 0 ? '#582370': notOwned > 0 && notOwned <= 5 ? '#ffcc00' : notOwned > 5 && notOwned <= 10 ? '#ff9d00' :notOwned > 10 && notOwned <= 15 ? '#ff6f00' : notOwned > 15 ? '#ff000d': '');
                    if(notOwned == 0){
                        terrEmbed.setTitle('Peace ...');
                        terrEmbed.addField("We're not missing any territories.", "Have a box of cookies.");
                    }else if (notOwned > 0){
                        terrEmbed.setTitle("Get the man-o'-war ready!");
                        if(missingTerrs.length > 1024 && missingTerrs.length < 6000){
                            let terrSplit = utils.splitString(missingTerrs);
                                terrSplit.forEach((elem, index) => {
                                    terrEmbed.addField(`We're currently missing the following territories (${notOwned}) Part ${index + 1}:`, elem);
                                });
                        }else{
                            terrEmbed.addField(`We're currently missing the following territories (${notOwned}):`, missingTerrs);
                        }
                    }
                    message.channel.send(terrEmbed).then(() => {
                        sent = true;
                    })
                }
                if (sent2 == false && i >= list.length) {
                    terrAllyEmbed = new Discord.MessageEmbed()
                    .setColor(notOwnedAlly == 0 ? '#582370': notOwnedAlly > 0 && notOwnedAlly <= 5 ? '#ffcc00' : notOwnedAlly > 5 && notOwnedAlly <= 10 ? '#ff9d00' :notOwnedAlly > 10 && notOwnedAlly <= 15 ? '#ff6f00' : notOwnedAlly > 15 ? '#ff000d': '');
                    if(notOwnedAlly == 0){
                        terrAllyEmbed.setTitle('Peace for the whole alliance');
                        terrAllyEmbed.addField("Our Allies are not missing any territories.", "Have a box of cookies.");
                    }else if (notOwnedAlly > 0){
                        terrAllyEmbed.setTitle("Get the man-o'-war ready!");
                        if(missingTerrsAlly.length > 1024 && missingTerrsAlly.length < 6000){
                            let terrSplit = utils.splitString(missingTerrsAlly);
                                terrSplit.forEach((elem, index) => {
                                    terrAllyEmbed.addField(`Our Allies are currently missing the following territories (${notOwnedAlly}) Part ${index + 1}:`, elem);
                                });
                        }else{
                            terrAllyEmbed.addField(`Our Allies are currently missing the following territories (${notOwnedAlly}):`, missingTerrsAlly);
                        }
                    }
                    message.channel.send(terrAllyEmbed).then(() => {
                        sent2 = true;
                    })
                }
                if (sent3 == false && i >= list.length) {
                    ffaEmbed = new Discord.MessageEmbed()
                    .setColor(notOwnedFFA == 0 ? '#582370': notOwnedFFA > 0 && notOwnedFFA <= 5 ? '#ffcc00' : notOwnedFFA > 5 && notOwnedFFA <= 10 ? '#ff9d00' :notOwnedFFA > 10 && notOwnedFFA <= 15 ? '#ff6f00' : notOwnedFFA > 15 ? '#ff000d': '');
                    if(notOwnedFFA == 0){
                        ffaEmbed.setTitle('Peace ...');
                        ffaEmbed.addField("We're not missing any FFAs.", "Have a box of cookies.");
                    }else if (notOwnedFFA > 0){
                        ffaEmbed.setTitle("Get the man-o'-war ready!");
                        if(missingFFAs.length > 1024 && missingFFAs.length < 6000){
                            let terrSplit = utils.splitString(missingFFAs);
                                terrSplit.forEach((elem, index) => {
                                    ffaEmbed.addField(`We're currently missing the following territories (${notOwnedFFA}) Part ${index + 1}:`, elem);
                                });
                        }else{
                            ffaEmbed.addField(`We're currently missing the following territories (${notOwnedFFA}):`, missingFFAs);
                        }
                    }
                    message.channel.send(ffaEmbed).then(() => {
                        sent3 = true;
                    })
                }
            } catch (e) {
                console.log(e)
            }
        }

    });
})
    },

};