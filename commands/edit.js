const Discord = require('discord.js')

module.exports = {
	name: 'edit',
	description: 'Edits a message sent by the bot',
	execute(message, args, client) {
        options = {
            "embed": false,
        }
        client.channels.cache.get(args[0]).messages.fetch(args[1]).then(msg => {
            replace = args.splice(1).toString();
            if(replace.indexOf("-e") != -1){
                options.embed = true;
                if(replace.indexOf("-d") != -1){
                    console.log(replace.lastIndexOf("-"), replace.length)
                    descr = replace.substring(replace.search(/-d/)+3, replace.lastIndexOf("-")).replace(/,/g, " ");
                    console.log(replace.substring(replace.search(/-d/)+3, replace.lastIndexOf("-") -10))
                    replace = replace.replace(descr, "")
                    console.log(replace);
                }
                if(replace.indexOf("-t") != -1){
                    title = replace.substr(replace.search(/-t/)+3, replace.length).replace(/,/g, " ");
                } 
                edit = new Discord.MessageEmbed()
                .setTitle(title)
                .setColor(msg.embeds[0].color)
                .setDescription(descr)
                .addFields(msg.embeds[0].fields)
                if(msg.embeds[0].footer != null){
                    edit.setFooter(msg.embeds[0].footer.text)
                }
                msg.edit(edit);
                message.react('👍');
            }

        })
    },
};