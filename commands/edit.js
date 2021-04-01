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
                    descr = replace.substr(replace.search(/-d/)+3, replace.indexOf("-", replace.indexOf("-d")) == -1? replace.length:replace.indexOf("-", replace.indexOf("-d"))).replace(/,/g, " ");
                }
                if(replace.indexOf("-t") != -1){
                    title = replace.substr(replace.search(/-t/)+3, replace.indexOf("-", replace.indexOf("-t")) == -1? replace.length:replace.indexOf("-", replace.indexOf("-t"))).replace(/,/g, " ");
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
            }

        })
    },
};