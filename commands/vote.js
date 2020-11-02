let sentEnd = false;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
function errorResponse(type, extraInfo){
    let errorEmbed = new Discord.MessageEmbed()
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
module.exports = {
	name: 'vote',
	description: "Create/End Votes",
	execute(message, args) {
        if(message.member.hasPermission("MANAGE_GUILD")){
            if(args[0] == "start"){
                    let xmlVoteGET = new XMLHttpRequest();
                    xmlVoteGET.open("GET", process.env.voteURL);
                    xmlVoteGET.setRequestHeader("Content-Type", "application/json");
                    xmlVoteGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                    xmlVoteGET.setRequestHeader("versioning", false)
                    xmlVoteGET.onreadystatechange = function(){
                        if(xmlVoteGET.status == 200 && xmlVoteGET.readyState == 4){
                            try{
                                resTextVote = JSON.parse(xmlVoteGET.responseText);  
                                args.splice(0, 1);
                                let list = args;
                                let title = list.join().replace(/,/g, " ");
                                let colourOfVote = Math.floor(Math.random()*16777215).toString(16);
                                voteEmbed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setColor(colourOfVote)
                                .addField("Options", "👍: yes \n 👎: no")
                                .setFooter("Total Votes: 0")
                                message.channel.send(voteEmbed).then(async message =>{
                                    try{
                                        await message.react('👍');
                                        await message.react('👎');
                                        message.pin();
                                    }catch(e){
                                        //empty
                                    }
                                resTextVote.data.push([message.id, message.channel.id, title, colourOfVote, 0, 0, [], []])
                                let xmlVotePUT = new XMLHttpRequest();
                                xmlVotePUT.open("PUT", process.env.voteURL);
                                xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                xmlVotePUT.setRequestHeader("versioning", false)
                                xmlVotePUT.send(JSON.stringify(resTextVote))
                            });
                            }catch(e){
                                throw e;
                            }
                        }
                    }
                    xmlVoteGET.send();
                    
            }else if(args[0] == "end"){
                //message.id, message.channel.id, title, colour, yes, no
                let xmlVoteGET = new XMLHttpRequest();
                xmlVoteGET.open("GET", process.env.voteURL);
                xmlVoteGET.setRequestHeader("Content-Type", "application/json");
                xmlVoteGET.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlVoteGET.setRequestHeader("versioning", false)
                xmlVoteGET.onreadystatechange = function(){
                    if(xmlVoteGET.status == 200 && xmlVoteGET.readyState == 4){
                        try{
                            let resTextVote = JSON.parse(xmlVoteGET.responseText);
                            args.splice(0, 1);
                            let list = args;
                            let msg = list.join().replace(/,/g, " ");
                            for(property in resTextVote.data){
                                if(resTextVote.data[property][2].toUpperCase() == msg.toUpperCase()){
                                    message.channel.messages.fetch(resTextVote.data[property][0]).then(message => {
                                        if(message.pinned){
                                            message.unpin();
                                            let xmlVotePUT = new XMLHttpRequest();
                                            xmlVotePUT.open("PUT", process.env.voteURL)
                                            xmlVotePUT.setRequestHeader("Content-Type", "application/json");
                                            xmlVotePUT.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                                            xmlVotePUT.setRequestHeader("versioning", false)  
                                            if(sentEnd == false){
                                                message.channel.send(`The vote "${resTextVote.data[property][2]}" was ended, there were ${resTextVote.data[property][4]} votes for yes and ${resTextVote.data[property][5]} votes for no; Total Votes: ${resTextVote.data[property][4] + resTextVote.data[property][5]}`)
                                                sendEnd = true;
                                                resTextVote.data.splice(property, 1)
                                                xmlVotePUT.send(JSON.stringify(resTextVote))
                                            }
                                            
                                        }
                                    })
                                    
                            }
                            }
                        }catch(e){
                            throw e;
                        }
                        
                    }
                }
                xmlVoteGET.send();
            }else{
                message.channel.send(errorResponse("wrongargs", "start, end"))
            }
        }else{
            message.channel.send(errorResponse("noperms", "MANAGE_GUILD"))
        }
    } 
};