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
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
module.exports = {
	name: 'reactionroles',
	description: "React with the emoji to get the role.",
	execute(message, args) {
        if(args.length < 4) message.channel.send(errorResponse("wrongargs", "MANAGE_GUILD"))
        if(message.member.hasPermission("MANAGE_GUILD")){
            let reactionEmbed = new Discord.RichEmbed()
            .setColor("#ABCDEF")
            .setTitle(args.slice(2).toString().search(/-e/) == -1 ? args.slice(2).toString().replace(/,/g, " ") : args.slice(2).toString().substr(0, args.slice(2).toString().search(/-e/)).replace(/,/g, " "))
            .setDescription(args.slice(2).toString().substr(args.slice(2).toString().search(/-e/) + 2).replace(/%e/g, args[1]).replace(/,/g, " "));
            message.delete();
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
                            //empty
                        }
                    }
                }

                xmlReactionGET.send();
                
            })
            

        }
    }
};