const fs = require("fs");
const utils = require('../utils.js');

module.exports = {
    name: 'rolltome',
    description: "Rolls a tome.",
    aliases: [],
    async execute(message, args) {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            let n = Number(args[0]);
            for (i = 0; i < n; i++) {
                const guild = await utils.getGuild();
                const oldRewards = JSON.parse(fs.readFileSync("./data/rewardData.json", "utf-8"));
                const newRewards = {
                    emeralds: [],
                    guildTomes: [],
                    members: [],
                    tomesReserved: oldRewards.tomesReserved,
                    currentTomeRule: oldRewards.currentTomeRule,
                    lastTome: oldRewards.lastTome
                };
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
                const foundTomeAt = Date.now()
                const oldIndex = oldRewards.guildTomes.findIndex(r => r.acquired === foundTomeAt);
                if (oldIndex < 0) {
                    //tome is new
                    newRewards.lastTome++;
                    newRewards.guildTomes.push({
                        acquired: foundTomeAt,
                        id: newRewards.lastTome
                    });
                    if (newRewards.tomesReserved > 0) {
                        //event tome or similar
                        newRewards.tomesReserved--;
                        qmNotes.send(`📘 A tome has been found! It has been declared as an off-rule reward.`).catch(e => {
                            console.log(`Failed to notify Quartermasters:\n${e.stack}`);
                        });
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
                                    "72d140ad-efe3-4bbe-b09c-df5e988f5332", //thyme23
                                    "e67d4a1a-e879-4723-a356-0da0d15fe583", //g17fcH_3D
                                    "1168c5ec-a8bf-45ac-ab9c-808a2b023364", //Mehku
                                    "d028ed64-e525-4d38-a654-63ac26e56831", //fundingrainslife (Needsticc)
                                    "47b48cdd-a4d2-45cf-a8a9-418c8d0be7b8", //Saraldar
                                    "30746de1-aaaf-48d3-89c7-efbe14014bc0", //BulkyUnicycle26
                                    "8f631723-6c06-4ceb-a2d0-21a13ec3acac", //Hrt1
                                    "8f0ca805-96b9-4d90-88eb-cd639e4181f8", //TheLegendHenry
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
                                time: Date.now(),
                                id: newRewards.lastTome
                            });
                        }
                        const msg = `📘 A tome has been found! The person to get it is **${winner}**.\n**Rule:** ${rule}\n**ID:** ${newRewards.lastTome}`;
                        message.channel.send(msg).catch(e => {
                            console.log(`Failed to send message\n${msg}\nin #qm-notes:\n${e}`);
                        });
                        //save
                        fs.writeFileSync("./data/rewardData.json", JSON.stringify(newRewards, null, 2));

                    }
                }
            }

        } else {
            message.channel.send(utils.errorResponse("noperms", "MANAGE_GUILD"))
        }
    }
};
