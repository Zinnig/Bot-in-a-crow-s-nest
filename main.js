const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
//for local testing
require('custom-env').env()
const token = process.env.token;
const prefix = process.env.prefix;

client.login(token);
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
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
                activity: {
                    name: `${prefix}help`,
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
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', " eeeeee\n"+error.message);
});
client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch(cmd){
        case "ping":
            client.commands.get('ping').execute(message, args, client.ping);
            break;
        case "help":
            client.commands.get('help').execute(message, args);
            break;
        case "war":
            client.commands.get('war').execute(message, args)
            break;
        case "subs":
            client.commands.get('subs').execute(message, args);
            break;
        case "caniattack":
            client.commands.get('caniattack').execute(message, args);
            break;
        case "timeinguild":
            client.commands.get('timeinguild').execute(message, args);
            break;
        case "reactionroles":
            client.commands.get('reactionroles').execute(message, args);
            break;
        case "vote":
            client.commands.get('vote').execute(message, args);
            break;
        default:
            unknownCommandEmbed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Unknown Command!")
            .setDescription(`Try ${prefix}help for a command list.`)
            message.channel.send(unknownCommandEmbed);
            break;
    }
    /*
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
                                            let statsEmbed = new Discord.MessageEmbed()
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
                                            let statsEmbed = new Discord.MessageEmbed()
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
    /*
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
                                            let sinceLastEmbed = new Discord.MessageEmbed()
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
    */
}); 

client.on("raw", async packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    let msg = await client.channels.cache.get(packet.d.channel_id).messages.fetch(packet.d.message_id)
    if(!(msg.author.id == '639956302788820993' || msg.author == '761658848217137222')) return; 
    if(packet.t == 'MESSAGE_REACTION_ADD'){
        if(packet.d.user_id == client.user.id) return;
        if(packet.d.emoji.name == '👍' || packet.d.emoji.name == '👎') {
            let xmlVoteRaw = new XMLHttpRequest();
            xmlVoteRaw.open("GET", process.env.voteURL)
            xmlVoteRaw.setRequestHeader("Content-Type", "application/json");
            xmlVoteRaw.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlVoteRaw.setRequestHeader("versioning", false)
            xmlVoteRaw.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        try{
                            let resTextVoteRaw = JSON.parse(this.responseText)
                            let voteArray = resTextVoteRaw.data[index(packet.d.message_id, resTextVoteRaw.data)];
                            let yes = voteArray[4];
                            let no = voteArray[5]
                                if(packet.d.emoji.name == '👍'){
                                msg.reactions.resolve('👍').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if(voteArray[6].indexOf(packet.d.user_id) == -1 && voteArray[7].indexOf(packet.d.user_id) == -1){
                                    voteArray[6].push(packet.d.user_id)
                                    yes++;
                                    voteArray[4] = yes;
                                }else if(voteArray[7].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[6].push(packet.d.user_id)
                                    voteArray[7].splice(voteArray[7].indexOf(packet.d.user_id), 1)
                                    yes++; 
                                    no--;
                                    voteArray[4] = yes;
                                    voteArray[5] = no;
                                }
                                    let xmlVotePUT = new XMLHttpRequest();
                                    xmlVotePUT.open("PUT", process.env.voteURL)
                                    xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                    xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlVotePUT.setRequestHeader("versioning", false)
                                    xmlVotePUT.send(JSON.stringify(resTextVoteRaw))
                                    let edit = new Discord.MessageEmbed()
                                    .setTitle(voteArray[2])
                                    .setColor(voteArray[3])
                                    .addField("Options", "👍: yes \n 👎: no")
                                    .setFooter(`Total Votes: ${voteArray[4] + voteArray[5]}`);
                                    msg.edit(edit)
                            }else if(packet.d.emoji.name == '👎'){
                                msg.reactions.resolve('👎').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if(voteArray[7].indexOf(packet.d.user_id) == -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[7].push(packet.d.user_id)
                                    no++;
                                    voteArray[5] = no;
                                }else if(voteArray[6].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1){
                                    voteArray[7].push(packet.d.user_id)
                                    voteArray[6].splice(voteArray[6].indexOf(packet.d.user_id), 1)
                                    no++;
                                    yes--;
                                    voteArray[5] = no;
                                    voteArray[4] = yes;
                                    }
                                    xmlVotePUT.open("PUT", process.env.voteURL)
                                    xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                    xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                    xmlVotePUT.setRequestHeader("versioning", false)
                                    xmlVotePUT.send(JSON.stringify(resTextVoteRaw)) 
                                    let edit = new Discord.MessageEmbed()
                                    .setTitle(voteArray[2])
                                    .setColor(voteArray[3])
                                    .addField("Options", "👍: yes \n 👎: no")
                                    .setFooter(`Total Votes: ${voteArray[4] + voteArray[5]}`);
                                    msg.edit(edit)
                                }
                        }catch(e){
                            //empty
                        }
                    }
                }
            xmlVoteRaw.send()
           
        }else{
            let guild = client.guilds.cache.get(packet.d.guild_id);
            let xmlReactionAddGET = new XMLHttpRequest();
            xmlReactionAddGET.open("GET", process.env.reactionURL)
            xmlReactionAddGET.setRequestHeader("Content-Type", "application/json");
            xmlReactionAddGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlReactionAddGET.setRequestHeader("versioning", false)
            xmlReactionAddGET.onreadystatechange = function(){
            if(this.status == 200 && this.readyState == 4){
                try{
                    resTextReactionAdd = JSON.parse(this.responseText)
                    if(index(packet.d.message_id, resTextReactionAdd.data) != -1 && `<:${packet.d.emoji.name}:${packet.d.emoji.id}>` == resTextReactionAdd.data[index(packet.d.message_id, resTextReactionAdd.data)][1]){
                        guild.members.fetch(packet.d.user_id).then(member => {
                            member.roles.add(resTextReactionAdd.data[index(packet.d.message_id, resTextReactionAdd.data)][2].replace("<@&", "").replace(">", ""))
                        
                    })
                }
                }catch(e){
                   //empty
                }
            }
        }
        xmlReactionAddGET.send(); 
    } 
    }else if(packet.t == 'MESSAGE_REACTION_REMOVE'){
        if(packet.d.user_id == client.id) return;
        let guild = client.guilds.cache.get(packet.d.guild_id);
        let xmlReactionAddGET = new XMLHttpRequest();
        xmlReactionAddGET.open("GET", process.env.reactionURL)
        xmlReactionAddGET.setRequestHeader("Content-Type", "application/json");
        xmlReactionAddGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
        xmlReactionAddGET.setRequestHeader("versioning", false)
        xmlReactionAddGET.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            try{
                resTextReactionAdd = JSON.parse(this.responseText)
                if(index(packet.d.message_id, resTextReactionAdd.data) != -1 && `<:${packet.d.emoji.name}:${packet.d.emoji.id}>` == resTextReactionAdd.data[index(packet.d.message_id, resTextReactionAdd.data)][1]){
                    guild.members.fetch(packet.d.user_id).then(member => {
                        member.roles.remove(resTextReactionAdd.data[index(packet.d.message_id, resTextReactionAdd.data)][2].replace("<@&", "").replace(">", ""))
                    })
                }
            }catch(e){
               //empty
            }
        }
    }
    xmlReactionAddGET.send();  
    }
})
client.on("voiceStateUpdate", () => {
    const guild = client.guilds.cache.get('463736564837777428')
    const channels = guild.channels.cache.filter(c => c.parentID === '468697649592401920' && c.type === 'voice');

    for (const [channelID, channel] of channels) {
        for (const [memberID, member] of channel.members) {
            if (channel.id === '666379507522863104') {
                console.log("ChannelID: " + channelID + "\nMemberID: " + memberID);
                member.voice.setChannel('666381898343514133')
                    .then(() => console.log(`Moved ${member.user.tag}.`))
                    .catch(console.error);
            }
        }
    }
})
