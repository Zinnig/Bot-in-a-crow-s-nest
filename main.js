//for local testing
require('dotenv').config()
const Discord = require('discord.js');
const utils = require('./utils.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const db = require('./db/dbms.js');

const token = process.env.token;
const prefix = process.env.prefix;
const quartermasters = [
    {
        id: "139517283637657600",
        uuid: "85665133-b2b0-44a6-b824-73776394a924",
        name: "Auxiliary_"
    },
    {
        id: "216664954562936832",
        uuid: "7e3fa8ab-74e0-4566-8108-3226f7be90b3",
        name: "cheeseries"
    },
    {
        id: "297088316317368320",
        uuid: "99a88c81-c926-4224-8604-6ebec53022a1",
        name: "IsabellaSky"
    },
    {
        id: "282964164358438922",
        uuid: "6d4dd862-a9f6-4171-9b62-fe78179b38e5",
        name: "Zinnig"
    },
    {
        id: "467377364762886144",
        uuid: "cf406197-f8e9-451f-870b-1cc2207d74ff",
        name: "Blockfox_XV"
    },
    {
        id: "251741848698093568",
        uuid: "8d825350-a518-4825-b32a-879ce0b5ed8b",
        name: "raviva"
    },
    {
        id: "370993200137240576",
        uuid: "b1b8d770-62a4-44e5-a6e8-68d8c7104ce8",
        name: "VHoltz_"
    },
    {
        id: "310869684180221952",
        uuid: "65b6835b-1af0-457e-8b1c-00239d8740e1",
        name: "Nieke"
    }
];

client.login(token);
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.on("ready", async () => {
    console.log("Started...");
    client.user.setPresence({
        status: 'online',
        activity: {
            name: `${prefix}help`,
            type: "LISTENING"
        }
    });
});
function index(a, arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == a) { return i; }
        }
    }
    return -1;
}
process.on('unhandledRejection', async error => {
    let me = await client.users.fetch('282964164358438922'); //@Zinnig#2769
    me.send(`Unhandled promise rejection: \n${error.stack}`);
    const logger = await client.channels.cache.get("855427611479113758"); //#console-log
    logger.send(`Unhandled promise rejection: \`\`\`${error}\`\`\``);
});

function isTableFlip(message) {
    const leftTableLegIndex = message.content.indexOf("┻");
    if (leftTableLegIndex >= 0) {
        if (message.content.lastIndexOf("┻") > leftTableLegIndex) {
            return true;
        }
    }
    return false;
}
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix) && message.type !== 'GUILD_MEMBER_JOIN' && message.channel.id !== '346392052046757888' && !isTableFlip(message)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    //anti-tableflip-unit
    if (isTableFlip(message)) message.channel.send('┬─┬ ノ( ゜-゜ノ)')
    //check if message is in #welcome
    if (message.channel.id === "514453846676996097" && message.type === "GUILD_MEMBER_JOIN") {
        message.react("✔️")
            .then(() => message.react("✅"))
            .then(() => message.react("☑️"))
            .catch(() => console.log(`Failed to assign all emojis to the join message of ${message.author.tag}`));
    }
    if (message.channel.id === '346392052046757888' && message.content.indexOf('<@&472859173730648065>') !== -1) {
        message.react('👍')
            .then(() => message.react('753502162079711293'))
            .then(() => message.react('👎'));
        if (message.content.search(/'/g) !== -1) {
            start = message.content.search(/>/);
            pos = message.content.search(/'/);
            ign = message.content.substring(start + 2, pos);
            let player = await utils.getPlayer(ign);
            if (player == undefined) message.channel.send(`The stats of the player **${ign}** couldn't be found!`);
            let embed = new Discord.MessageEmbed()
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setTitle(player.meta.tag.value === null ? player.username : `[${player.meta.tag.value}] ${player.username}`)
                .setDescription(player.meta.location.online ? `Online on ${player.meta.location.server}` : 'Offline')
                .addFields(
                    { name: 'Total Playtime', value: `${Math.floor(player.meta.playtime / 60 * 4.7)}h`, inline: true },
                    { name: 'Highest Combat Level', value: await utils.getHighestClass(player), inline: false },
                    { name: 'First Join', value: new Date(player.meta.firstJoin).toLocaleDateString(), inline: true },
                    { name: 'Last Join', value: new Date(player.meta.lastJoin).toLocaleDateString(), inline: true }
                )
                .setTimestamp();
            message.channel.send(embed);
        }
    }
    const cmdModule = client.commands.get(cmd) == undefined ? client.commands.array().filter(c => c.aliases.includes(cmd))[0] : client.commands.get(cmd);
    if (cmdModule) {
        cmdModule.execute(message, args, client);
    } else if (message.content.startsWith(prefix)) {
        unknownCommandEmbed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Unknown Command!")
            .setDescription(`Try ${prefix}help for a command list.`);
        message.channel.send(unknownCommandEmbed);
    }
});
client.on("raw", async packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'MESSAGE_DELETE'].includes(packet.t)) return;
    switch (packet.t) {
        case 'MESSAGE_REACTION_ADD':
            msg = await client.channels.cache.get(packet.d.channel_id).messages.fetch(packet.d.message_id);
            if (!(msg.author.id == '639956302788820993' || msg.author == '761658848217137222' || msg.system === true || msg.channel.id !== '346392052046757888' && msg.content.indexOf('<@&472859173730648065>') !== -1)) return;
            if (packet.d.user_id == client.user.id) return;
            if (packet.d.channel_id == "514453846676996097") {
                //get user
                guild = client.guilds.cache.get(packet.d.guild_id);
                guild.members.fetch(msg.author.id).then(author => {
                    switch (packet.d.emoji.name) {
                        case "✔️":
                            author.roles.add("513527251674071040"); //Stowaways
                            break;
                        case "✅":
                            author.roles.add("472859173730648065"); //Guild Member
                            break;
                        case "☑️":
                            author.roles.add("513527246703820800"); //Brethren of the Coast
                            break;
                        default:
                            break;
                    }
                    return;
                })
            } else if (packet.d.emoji.name == '👍' || packet.d.emoji.name == '👎') {
                let xmlVoteRaw = new XMLHttpRequest();
                xmlVoteRaw.open("GET", process.env.voteURL)
                xmlVoteRaw.setRequestHeader("Content-Type", "application/json");
                xmlVoteRaw.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                xmlVoteRaw.setRequestHeader("versioning", false)
                xmlVoteRaw.onreadystatechange = function () {
                    if (this.status == 200 && this.readyState == 4) {
                        try {
                            let resTextVoteRaw = JSON.parse(this.responseText)
                            let voteArray = resTextVoteRaw.data[index(packet.d.message_id, resTextVoteRaw.data)];
                            let yes = voteArray[4];
                            let no = voteArray[5]
                            if (packet.d.emoji.name == '👍') {
                                msg.reactions.resolve('👍').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if (voteArray[6].indexOf(packet.d.user_id) == -1 && voteArray[7].indexOf(packet.d.user_id) == -1) {
                                    voteArray[6].push(packet.d.user_id)
                                    yes++;
                                    voteArray[4] = yes;
                                } else if (voteArray[7].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1) {
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
                            } else if (packet.d.emoji.name == '👎') {
                                msg.reactions.resolve('👎').users.remove(packet.d.user_id) //removing a reaction from a user.
                                if (voteArray[7].indexOf(packet.d.user_id) == -1 && voteArray[6].indexOf(packet.d.user_id) == -1) {
                                    voteArray[7].push(packet.d.user_id)
                                    no++;
                                    voteArray[5] = no;
                                } else if (voteArray[6].indexOf(packet.d.user_id) != -1 && voteArray[6].indexOf(packet.d.user_id) == -1) {
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
                        } catch (e) {
                            //empty
                        }
                    }
                }
                xmlVoteRaw.send()

            } else {
                if (['◀️', '▶️'].includes(packet.d.emoji.name)) return;
                guild = client.guilds.cache.get(packet.d.guild_id);
                rrData = await utils.getRRData();
                obj = rrData.data.find(n => Object.keys(n).includes(packet.d.message_id));
                if (obj == undefined) return;
                emoRol = obj[packet.d.message_id].find(i => i.emoji === packet.d.emoji.name || i.emoji === `<:${packet.d.emoji.name}:${packet.d.emoji.id}>`);
                guild.members.fetch(packet.d.user_id).then(member => {
                    member.roles.add(emoRol.role.replace("<@&", "").replace(">", ""));
                });
            }
            break;
        case 'MESSAGE_REACTION_REMOVE':
            msg = await client.channels.cache.get(packet.d.channel_id).messages.fetch(packet.d.message_id);
            if (!(msg.author.id == '639956302788820993' || msg.author == '761658848217137222' || msg.system === true || msg.channel.id !== '346392052046757888' && msg.content.indexOf('<@&472859173730648065>') !== -1)) return;
            if (msg.channel.id === '514453846676996097' && msg.channel.id === '346392052046757888' && msg.content.indexOf('<@&472859173730648065>') !== -1 || msg.author.id === client.id) return;
            if (packet.d.user_id == client.id) return;
            guild = client.guilds.cache.get(packet.d.guild_id);
            rrData = await utils.getRRData();
            obj = rrData.data.find(n => Object.keys(n).includes(packet.d.message_id));
            if (obj == undefined) return;
            emoRol = obj[packet.d.message_id].find(i => i.emoji === packet.d.emoji.name || i.emoji === `<:${packet.d.emoji.name}:${packet.d.emoji.id}>`);
            guild.members.fetch(packet.d.user_id).then(member => {
                member.roles.remove(emoRol.role.replace("<@&", "").replace(">", ""));
            });
            break;
        case 'MESSAGE_DELETE':
            msg = await client.channels.cache.get(packet.d.channel_id).messages.fetch(packet.d.id);
            if (!(msg.author.id == '639956302788820993' || msg.author == '761658848217137222' || msg.system === true || msg.channel.id !== '346392052046757888' && msg.content.indexOf('<@&472859173730648065>') !== -1)) return;
            msg.channel.messages.cache.first(5).forEach(elem => {
                if (isTableFlip(elem)) {
                    elem.delete();
                }
            })
            break;
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

