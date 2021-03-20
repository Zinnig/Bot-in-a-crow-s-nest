const utils = require('../utils.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
module.exports = {
	name: 'soulpoints',
	description: 'Lists servers with an uptime close to a mutliple of 20mins.',
	execute(message, args) {
        let xml = new XMLHttpRequest();
        xml.open('GET', 'https://athena.wynntils.com/cache/get/serverList');
        xml.onreadystatechange = () => {
            if(xml.status == 200 && xml.readyState == 4){
                outputS = "";
                outputL = [];
                response = JSON.parse(xml.responseText);
                for (key in response.servers) {
                    outputL.push([key, 1200000 - (Date.now() - response.servers[key].firstSeen)%1200000 - 60000, utils.setupTimeDiff(1200000 - (Date.now() - response.servers[key].firstSeen)%1200000 - 60000) == '' || 1200000 - (Date.now() - response.servers[key].firstSeen)%1200000 - 60000 < 1 ? '<1min' :  utils.setupTimeDiff(1200000 - (Date.now() - response.servers[key].firstSeen)%1200000 - 60000), utils.setupTimeDiff(Date.now() - response.servers[key].firstSeen +60000)]);
                }
                outputL = outputL.sort((a,b) =>  {
                    return b[1] - a[1];
                })
                outputL.reverse();
                outputL.forEach(elem => {
                    outputS += `${elem[0]}: ${elem[2]}, Uptime: ≈${elem[3]}\n`
                })
                outputEm = new Discord.MessageEmbed()
                .setColor('#125232')
                .setTitle('Time until next Soul Point')
                utils.splitString(outputS).forEach((elem, index) => {
                    outputEm.addField(index, '```\n'+elem +'```')
                })
                message.channel.send(outputEm);
                
            }
        }
        xml.send();
        
    }
};