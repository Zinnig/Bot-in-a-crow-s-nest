const Discord = require('discord.js')
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.errorResponse = (type, extraInfo) =>{
    let errorEmbed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    switch(type){
        case "noperms":
            errorEmbed.setTitle(`You don't have the permission neede.`).setDescription(`You need ${extraInfo}`);
            break;
        case "wrongargs":
            errorEmbed.setTitle(`Invalid Arguments!`).setDescription(`Valid Arguments: ${extraInfo}`);
            break;
        case "noattachement":
            errorEmbed.setTitle(`Your message has no attachements`);
            break;
        case "namenotfound":
            errorEmbed.setTitle(`The username "${extraInfo}" couldn't be found, try again.`);
            break;
        case "guildnotfound":
            errorEmbed.setTitle(`Couldn't find the guild "${extraInfo}".`);
            break;
        case "notaguildmember":
            errorEmbed.setTitle(`You are not a guild member.`);
            break;
        case "guildmembernotfound":
            errorEmbed.setTitle(`Couldn't find the guild member "${extraInfo}"`);
            break;
        case "wrongdate":
            errorEmbed.setTitle(`You can't set someone on Shore Leave from now to a point in the past.`);
            break;
    }
    return errorEmbed
}
exports.index = (a, arr) => {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
        }
    }
    return -1;
}
exports.setupTimeDiff = (diff) => {
	years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
	days = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
	hours = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
	minutes = Math.floor((diff - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000) - hours * (60 * 60 * 1000)) / (60 * 1000));
    output = `${years > 0 ? years + "y:" : ""}${days > 0 ? days + "d:" : ""}${hours > 0 ? hours + "h:" : ""}${minutes > 0 ? minutes + "min" : ""}`;
    output = output[output.length - 1] == ":" ? output.slice(0, -1) : output;
    return output;
}
exports.splitString = (str) => {
    let output = []
    if (str.length > 1000){
      n = Math.floor(str.length/1000)
        for(i=0;i<=n;i++){
            a1 = str.substr(0, 1000)
            endingIndex = a1.lastIndexOf('\n')
            output.push(str.slice(0, endingIndex))
            str = str.replace(str.substr(0, endingIndex), "")      
      }
    }else{
        output.push(str)
    }
    return output;
    }   
exports.getData = () => {
    return new Promise(resolve => {
        fs.readFile("data/guildStats.json", (err, data) => {
            if(err) return;
            try {
                guildStats = JSON.parse(data);
                resolve(guildStats);
            } catch (error) {
                resolve(null);
            }
        })
    })
}
exports.getGuild = () => {
    return new Promise(resolve=>{
    xml = new XMLHttpRequest();
    xml.open("GET", "https://api.wynncraft.com/public_api.php?action=guildStats&command=Paladins%20United");
    xml.onreadystatechange = () => {
        if(xml.status == 200 && xml.readyState == 4){
            response = JSON.parse(xml.responseText);
            resolve(response.members);
        }
    }
    xml.send();
})
}
exports.getGuildLeaderboard = () => {
    return new Promise(resolve=>{
    xml = new XMLHttpRequest();
    xml.open("GET", "https://api.wynncraft.com/public_api.php?action=statsLeaderboard&type=guild&timeframe=alltime");
    xml.onreadystatechange = () => {
        if(xml.status == 200 && xml.readyState == 4){
            response = JSON.parse(xml.responseText);
            resolve(response);
        }
    }
    xml.send();
})
}

exports.getPlayer = (ign) => {
    return new Promise(resolve => {
        xml = new XMLHttpRequest();
        xml.open("GET", `https://api.wynncraft.com/v2/player/${ign}/stats`);
        xml.onreadystatechange = () => {
            if(xml.status == 200 && xml.readyState == 4){
                try {
                    response = JSON.parse(xml.responseText);
                    resolve(response.data[0]);
                } catch(error) {
                    resolve(null);
                }
            }
        }
        xml.send();
    });
}

exports.getOnlinePlayers = () => {
    return new Promise(resolve => {
        xml = new XMLHttpRequest();
        xml.open("GET", `https://api.wynncraft.com/public_api.php?action=onlinePlayers`);
        xml.onreadystatechange = () => {
            if(xml.status == 200 && xml.readyState == 4){
                try {
                    response = JSON.parse(xml.responseText);
                    const onlinePlayers = [];
                    for (const server in response) {
                        if (server !== "request") {
                            onlinePlayers.push(...response[server]);
                        }
                    }
                    resolve(onlinePlayers.sort()); //0 > 9 > A > Z > _ > a > z
                } catch(error) {
                    console.log(error)
                    resolve(null);
                }
            }
        }
        xml.send();
    });
}

exports.getHighestClass = (data) => {
    return new Promise(resolve => {
        highest = 0;
        data.classes.forEach((elem, index) => {
            if(highest < elem.professions.combat.level){
                highest = elem.professions.combat.level
            }
            if(index === data.classes.length-1){
                resolve(highest)
            }
        })
    })
}
exports.getRRData = () => {
    return new Promise(resolve => {
        fs.readFile("data/rrData.json", (err, data) => {
            if(err) return;
            try {
                rrData = JSON.parse(data);
                resolve(rrData);
            } catch (error) {
                resolve(null);
            }
        })
    })
}

exports.changePage = (message, reaction, user, color, title, field, currentIndex, footer) => {
    switch (reaction.emoji.name) {
        case '▶️':
            reaction.users.remove(user.id);
            editEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setFooter(footer === null ? "" : footer);
            if(field.length-1 > currentIndex){
                editEmbed.addField(`Page ${currentIndex+2}`, "```"+field[currentIndex+1]+"```");
                currentIndex++;
            }else{
                currentIndex = 0;
                editEmbed.addField(`Page ${currentIndex+1}`, "```"+field[0]+"```");
            }
            message.edit(editEmbed);
            return currentIndex;
        case '◀️':
            reaction.users.remove(user.id);
            editEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setFooter(footer === null ? "" : footer);
            if(currentIndex > 0){
                editEmbed.addField(`Page ${currentIndex}`, "```"+field[currentIndex-1]+"```");
                currentIndex--;
            }else if(currentIndex === 0){
                break;
            }
            message.edit(editEmbed);
            return currentIndex;

    }
    
}
