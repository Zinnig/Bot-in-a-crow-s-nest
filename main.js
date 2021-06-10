const Discord = require('discord.js');
const utils = require('./utils.js');
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
    let me = await client.users.fetch('282964164358438922');
    me.send(`Unhandled promise rejection: \n${error.stack}`);
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
                    { name: 'Average Daily Playtime', value: `${(((player.meta.playtime / 60 * 4.7) / ((Date.now() - Date.parse(player.meta.firstJoin)) / 86400000))).toFixed(2)}h`, inline: true },
                    { name: 'Highest Combat Level', value: await utils.getHighestClass(player), inline: false },
                    { name: 'First Join', value: new Date(player.meta.firstJoin).toLocaleDateString(), inline: true },
                    { name: 'Last Join', value: new Date(player.meta.lastJoin).toLocaleDateString(), inline: true }
                )
                .setTimestamp();
            message.channel.send(embed)
        }
    }

    switch (cmd) {
        case "ping":
            client.commands.get('ping').execute(message, args, client.ws.ping);
            break;
        case "help":
            client.commands.get('help').execute(message, args);
            break;
        case "war":
            client.commands.get('war').execute(message, args);
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
        case "guildstats":
            client.commands.get('guildstats').execute(message, args);
            break;
        case "userstats":
            client.commands.get('userstats').execute(message, args);
            break;
        case "counts":
            client.commands.get('counts').execute(message, args);
            break;
        case "sincelastcounts":
            client.commands.get('sincelastcounts').execute(message, args);
            break;
        case "sl":
            client.commands.get('sl').execute(message, args);
            break;
        case "inactivity":
            client.commands.get('inactivity').execute(message, args);
            break;
        case "sp":
        case "sps":
        case "soulpoints":
            client.commands.get('soulpoints').execute(message, args);
            break;
        case "reservetome":
            client.commands.get('reservetome').execute(message, args);
            break;
        case "debug":
        case "ver":
        case "version":
            client.commands.get('version').execute(message, args, client);
            break;
        case "edit":
            client.commands.get('edit').execute(message, args, client);
            break;
        case "guildwarleaderboard":
        case "gwl":
            client.commands.get('guildwarleaderboard').execute(message, args);
            break;
        default:
            if (message.content.startsWith(prefix)) {
                unknownCommandEmbed = new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Unknown Command!")
                    .setDescription(`Try ${prefix}help for a command list.`);
                message.channel.send(unknownCommandEmbed);
            }
            break;
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

const loop = async () => {
    let nextLbUpd = Date.now(); //1 hr, 30 mins ago
    while (true) {
        if (Date.now() > nextLbUpd) {
            const lb = await utils.getGuildLeaderboard();
            if (lb) {
                //find time of next update
                nextLbUpd = Date.now() - 2400000;
                let newestReward = 0;
                for (const guild of lb.data) {
                    if (guild.rewards) {
                        for (const reward of guild.rewards) {
                            const time = Date.parse(reward.acquired);
                            if (time > newestReward) {
                                console.log(`New time found: ${time} (+${time - newestReward})`);
                                newestReward = time;
                            }
                        }
                    }
                }
                if (newestReward > nextLbUpd) {
                    console.log(`Using reward timers: ${newestReward} (+${newestReward - nextLbUpd})`);
                    nextLbUpd = newestReward;
                }
                nextLbUpd += 6000000; //1 hr, 40 minutes
                console.log(`Next lbUpdate will be at ${nextLbUpd}, ${nextLbUpd - Date.now()} milliseconds`);
                /**
                 * So the way leaving members work is kinda e.
                 * If a member leaves, their entry here gets deleted.
                 * If they rejoin within 2 weeks (for example from a subguild),
                 * we can manually check their previous value, then set their
                 * "atLastTome: 0,Tome" property to the negative of that number
                 */
                //update PUN
                const pun = lb.data.find(guild => guild.name === "Paladins United");
                const oldRewards = JSON.parse(fs.readFileSync("./data/rewardData.json", "utf-8"));
                const newRewards = {
                    emeralds: [],
                    guildTomes: [],
                    members: [],
                    tomesReserved: oldRewards.tomesReserved,
                    currentTomeRule: oldRewards.currentTomeRule,
                    lastTome: oldRewards.lastTome
                };
                const guild = await utils.getGuild();
                //update members
                for (const member of guild) {
                    const old = oldRewards.members.find(m => m.uuid === member.uuid);
                    if (old === undefined) {
                        //create new
                        newRewards.members.push({
                            uuid: member.uuid,
                            atLastTome: 0,
                            previousTomes: []
                        });
                    } else {
                        //copy
                        newRewards.members.push(old);
                    }
                    //delete old entries
                    const idx = newRewards.members.length - 1;
                    while (newRewards.members[idx].previousTomes[0]?.time + 5184000000 < Date.now()) {
                        newRewards.members[idx].previousTomes.shift();
                    }
                }
                const qmNotes = client.channels.cache.get("671755757536018453"); //qm notes is "671755757536018453"
                for (const emeralds of pun.rewards.filter(r => r.type === "EMERALDS")) {
                    const foundEMAt = Date.parse(emeralds.acquired);
                    const oldIndex = oldRewards.emeralds.findIndex(r => r.acquired === foundEMAt);
                    newRewards.emeralds.push({
                        acquired: foundEMAt
                    })
                    if (oldIndex < 0) {
                        //emerald batch is new
                        if (newRewards.emeralds.length === 7) {
                            //storage critical, notify QMs
                            qmNotes.send(`💵 The Emerald storage is filling up (14336/20480)! Please empty it soon!`).catch(e => {
                                console.log(`Failed to notify Quartermasters:\n${e.stack}`);
                            });
                        } else if (newRewards.length === 10) {
                            //storage full, notify QMs
                            qmNotes.send(`💵 The Emerald storage has filled up! Please empty it immediately!`).catch(e => {
                                console.log(`Failed to notify Quartermasters:\n${e.stack}`);
                            });
                        }
                    }
                }
                for (const tome of pun.rewards.filter(r => r.type === "GUILD_TOMES")) {
                    const foundTomeAt = Date.parse(tome.acquired);
                    const oldIndex = oldRewards.guildTomes.findIndex(r => r.acquired === foundTomeAt);
                    newRewards.guildTomes.push({
                        acquired: foundTomeAt
                    })
                    if (oldIndex < 0) {
                        //tome is new
                        newRewards.lastTome++;
                        if (newRewards.tomesReserved > 0) {
                            //event tome or similar
                            newRewards.tomesReserved--;
                            qmNotes.send(`📘 A tome has been found! It has been declared as an off-rule reward.`).catch(e => {
                                console.log(`Failed to notify Quartermasters:\n${e.stack}`);
                            });;
                        } else {
                            let winner = "ERROR";
                            let winnerUUID = "";
                            const rule = newRewards.currentTomeRule;
                            switch (newRewards.currentTomeRule) {
                                case "WARS":
                                    const warrers = [
                                        "6d4dd862-a9f6-4171-9b62-fe78179b38e5", //Zinnig
                                        "cf406197-f8e9-451f-870b-1cc2207d74ff", //Blockfox_XV
                                        "b1b8d770-62a4-44e5-a6e8-68d8c7104ce8", //VHoltz_
                                        "65b6835b-1af0-457e-8b1c-00239d8740e1", //Nieke
                                        "5ce339c6-bb60-4142-8a50-4aa5ef0ef256", //Koni75
                                        "05d9fea7-cfcc-4497-b77b-e326d1d2b42b", //MigatteNoGokuii
                                        "47b48cdd-a4d2-45cf-a8a9-418c8d0be7b8", //Saraldar
                                        "72d140ad-efe3-4bbe-b09c-df5e988f5332", //thyme23
                                        "e67d4a1a-e879-4723-a356-0da0d15fe583", //g17fcH_3D
                                        "1168c5ec-a8bf-45ac-ab9c-808a2b023364", //Mehku
                                        //possible additions: Hrt1, Henry, Needsticc, The_Doggo
                                    ];
                                    const eligible = [];
                                    for (const member of newRewards.members) {
                                        if (warrers.includes(member.uuid) && member.previousTomes.length * 2 < newRewards.lastTome - (member.previousTomes[member.previousTomes.length - 1]?.id || 0)) {
                                            eligible.push(member.uuid);
                                        }
                                    }
                                    winnerUUID = eligible[Math.floor(Math.random() * eligible.length)];
                                    newRewards.currentTomeRule = "GXP";
                                    break;
                                case "GXP":
                                    const xp = [];
                                    for (let i = 0; i < guild.length; i++) {
                                        xp.push({
                                            uuid: guild[i].uuid,
                                            xp: guild[i].contributed - newRewards.members[i].atLastTome,
                                            cooldown: newRewards.members[i].previousTomes.length * 2,
                                            lastTome: newRewards.members[i].previousTomes[newRewards.members[i].previousTomes.length - 1]?.id | 0
                                        });
                                    }
                                    xp.sort((a, b) => {
                                        //if a is ineligible, return -1
                                        if (a.cooldown >= newRewards.lastTome - a.lastTome && b.cooldown < newRewards.lastTome - a.lastTome) {
                                            return -1;
                                        }
                                        //if a is ineligible, return -1
                                        if (a.cooldown < newRewards.lastTome - a.lastTome && b.cooldown >= newRewards.lastTome - a.lastTome) {
                                            return 1;
                                        }
                                        //default compare
                                        return a.xp - b.xp;
                                    });
                                    winnerUUID = xp[xp.length - 1].uuid;
                                    const winnerIdx = newRewards.members.findIndex(m => m.uuid === winnerUUID);
                                    newRewards.members[winnerIdx].atLastTome = guild.find(m => m.uuid === winnerUUID).contributed;
                                    newRewards.currentTomeRule = "WARS";
                                    break;
                            }
                            winner = guild.find(mem => mem.uuid === winnerUUID).name;
                            const winnerIndex = newRewards.members.findIndex(m => m.uuid === winnerUUID);
                            if (winnerIndex >= 0) {
                                newRewards.members[winnerIndex].previousTomes.push({
                                    reason: rule,
                                    time: Date.parse(tome.acquired),
                                    id: newRewards.lastTome
                                });
                            } else {
                                console.log(`${winnerUUID} does not appear to be in the guild`);
                            }
                            const msg = `📘 A tome has been found! The person to get it is **${winner}**.\n**Rule:** ${rule}`;
                            qmNotes.send(msg).catch(e => {
                                console.log(`Failed to send message\n${msg}\nin #qm-notes:\n${e}`);
                            });
                        }
                    }
                }
                //save
                fs.writeFileSync("./data/rewardData.json", JSON.stringify(newRewards, null, 2));
            }
            //repeat in 60s
            await utils.sleep(60000);
        }
    }
}

loop();
