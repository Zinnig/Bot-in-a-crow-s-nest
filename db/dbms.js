//Code by Block

const config = require("./config.json");
const DiscordGuild = require("./models/dcguild.js");
const WynnGuild = require("./models/wynnguild.js");
const Player = require("./models/player.js");
const mongoose = require("mongoose");
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
};

mongoose.connect(process.env.mongotoken, mongoOptions);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
    console.log("> Mongoose connection established!");
});

mongoose.connection.on("err", err => {
    console.log("\x1b[31m%s\x1b[0m", `> Mongoose Connection Error\n${err.stack}`);
});

mongoose.connection.on("disconnect", () => {
    console.log("\x1b[36m%s\x1b[0m", "> Mongoose Connection lost: Disconnected");
});


const updateWynnGuild = (data) => {
    console.log(`Updating dataVersion of ${data.guildName} from ${data.dataVersion} to ${config.dataVersionWynnGuild}`);
    switch (data.dataVersion) {
        case 12:
            const record = data.rewardRecord;
            for (let i = 0; i < record.guildTomes.length; i++) {
                record.guildTomes[i] = {
                    amount: record.guildTomes[i].amount,
                    acquired: Date.parse(record.guildTomes[i].acquired)
                }
            }
            for (let i = 0; i < record.emeralds.length; i++) {
                record.emeralds[i] = {
                    amount: record.emeralds[i].amount,
                    acquired: Date.parse(record.emeralds[i].acquired)
                }
                console.log(`Updated ${data.guildName} with ${JSON.stringify(record.emeralds[i], null, 2)}`);
            }
            data.rewardRecord = record;
        case 13:
            data.members = [];
        case 14:
            data.members = [];
        case 15:
            data.trackingDiscordGuilds.members = [];
            data.trackingDiscordGuilds.ranks = [];
            data.trackingDiscordGuilds.gxp = [];
        default:
            data.dataVersion = config.dataVersionWynnGuild;
    }
    return data;
};


const updateDiscordGuild = (data) => {
    console.log(`Updating dataVersion of ${data.guildID} from ${data.dataVersion} to ${config.dataVersionDiscordGuild}`);
    switch (data.dataVersion) {
        case 2:
            data.blacklisted = false;
        case 3:
            data.trackedWynnGuilds.members = [];
            data.trackedWynnGuilds.ranks = [];
            data.trackedWynnGuilds.gxp = [];
        default:
            data.dataVersion = config.dataVersionDiscordGuild;
            break;
    }
    return data;
};


const updatePlayer = (data) => {
    console.log(`Updating dataVersion of ${data.name} (${data.uuid} from ${data.dataVersion} to ${config.dataVersionPlayer}`);
    switch (data.dataVersion) {
        case 0:
        default:
            data.dataVersion = config.dataVersionPlayer;
            break;
    }
    return data;
};


const findOneDiscordGuild = async (guildID, forceUpdate = true) => {
    let data = await DiscordGuild.findOne({ guildID: guildID });
    if (data !== null && data?.dataVersion !== config.dataVersionDiscordGuild && forceUpdate) {
        data = updateDiscordGuild(data);
    }
    return data;
};


const findAllDiscordGuilds = async (predicate, forceUpdate = true) => {
    const data = await DiscordGuild.find(predicate);
    for (let i = 0; i < data.length; i++) {
        if (data[i].dataVersion !== config.dataVersionDiscordGuild && forceUpdate) {
            data[i] = updateDiscordGuild(data[i]);
        }
    }
    return data;
};


const findOneDiscordGuildAndDelete = (guildID) => {
    DiscordGuild.findOneAndDelete({ guildID: guildID }, (err, res) => {
        console.log(`Deleted DiscordGuild with guildID ${guildID}:\n${res}`);
        if (err) {
            console.log("\x1b[31m%s\x1b[0m", err);
        }
        return res;
    });
};


const saveDiscordGuild = (data, logInConsole = false) => {
    return new Promise((resolve, reject) => {
        data.save((err, res) => {
            if (logInConsole) {
                console.log("Database changed, new data: " + res);
            }
            if (err) {
                console.log("\x1b[31m%s\x1b[0m", err);
                reject(err);
            }
            resolve(res);
        });
    });
};


const getDiscordGuildCollectionStats = () => {
    return new Promise((resolve, reject) => {
        DiscordGuild.collection.stats((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};


const findOneWynnGuild = async (guildName, forceUpdate = true) => {
    return new Promise((resolve, reject) => {
        WynnGuild.findOne({ guildName: guildName }).then(data => {
            if (data === null && forceUpdate) {
                //no guild of such name
                data = new WynnGuild({
                    _id: mongoose.Types.ObjectId(),
                    guildName: guildName,
                    dataVersion: config.dataVersionWynnGuild,
                    level: 0,
                    trackingDiscordGuilds: {
                        guildTomes: [],
                        emeralds: [],
                        levels: [],
                        members: [],
                        ranks: [],
                        gxp: []
                    },
                    rewardRecord: {
                        guildTomes: [],
                        emeralds: []
                    },
                    rewards: {
                        guildTomes: [],
                        emeralds: [],
                    },
                    activityCheck: {
                        lastUpdated: Date.now(),
                        data: [
                            [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
                        ]
                    },
                    members: []
                });
            }
            if (data === null) {
                reject(data);
            }
            //update dataversion
            if (data?.dataVersion !== config.dataVersionWynnGuild && forceUpdate) {
                data = updateWynnGuild(data);
            }
            resolve(data);
        });
    });
};


const findAllWynnGuilds = async (predicate, forceUpdate = true) => {
    const data = await WynnGuild.find(predicate);
    for (let i = 0; i < data.length; i++) {
        if (data[i].dataVersion !== config.dataVersionWynnGuild && forceUpdate) {
            data[i] = updateWynnGuild(data[i]);
        }
    }
    return data;
};


const findOneWynnGuildAndDelete = (guildName) => {
    const data = WynnGuild.findOneAndDelete({ guildName: guildName }, (err, res) => {
        console.log(`Deleted WynnGuild with guildName ${guildName}:\n${res}`);
        if (err) {
            console.log("\x1b[31m%s\x1b[0m", err);
        }
        return res;
    });
    return data;
};


const saveWynnGuild = (data, logInConsole = false) => {
    return new Promise((resolve, reject) => {
        data.save((err, res) => {
            if (logInConsole) {
                console.log("Database changed, new data: " + res);
            }
            if (err) {
                console.log("\x1b[31m%s\x1b[0m", err);
                reject(err);
            }
            resolve(res);
        });
    });
};


const getWynnGuildCollectionStats = () => {
    return new Promise((resolve, reject) => {
        WynnGuild.collection.stats((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};


const findOnePlayerByName = async (name, forceUpdate = true) => {
    return new Promise((resolve, reject) => {
        Player.findOne({ name: name }).then(data => {
            if (data === null && forceUpdate) {
                //no player of such name
                data = newPlayer(null, name);
            }
            if (data === null) {
                reject(data);
            }
            //update dataversion
            if (data?.dataVersion !== config.dataVersionPlayer && forceUpdate) {
                data = updatePlayer(data);
            }
            resolve(data);
        });
    });
};


const findOnePlayerByUUID = async (uuid, forceUpdate = true) => {
    return new Promise((resolve, reject) => {
        Player.findOne({ uuid: uuid }).then(data => {
            if (data === null) {
                if (forceUpdate) {
                    //no player of such name
                    data = newPlayer(uuid);
                } else {
                    reject(data);
                }
            }
            //update dataversion
            if (data?.dataVersion !== config.dataVersionPlayer && forceUpdate) {
                data = updatePlayer(data);
            }
            resolve(data);
        });
    });
};


const findAllPlayers = async (predicate, forceUpdate = true) => {
    const data = await Player.find(predicate);
    if (forceUpdate) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].dataVersion !== config.dataVersionPlayer) {
                data[i] = updatePlayer(data[i]);
            }
        }
    }
    return data;
};


const findOnePlayerAndDelete = (uuid) => {
    const data = Player.findOneAndDelete({ uuid: uuid }, (err, res) => {
        console.log(`Deleted Player with UUID ${uuid}:\n${res}`);
        if (err) {
            console.log("\x1b[31m%s\x1b[0m", err);
        }
        return res;
    });
    return data;
};


const savePlayer = (data, logInConsole = false) => {
    return new Promise((resolve, reject) => {
        data.save((err, res) => {
            if (logInConsole) {
                console.log("Database changed, new data: " + res);
            }
            if (err) {
                console.log("\x1b[31m%s\x1b[0m", err);
                reject(err);
            }
            resolve(res);
        });
    });
};


const getPlayerCollectionStats = () => {
    return new Promise((resolve, reject) => {
        Player.collection.stats((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};


/**
 * returns a new Player Database object
 */
const newPlayer = (uuid = null, name = null) => {
    return new Player({
        _id: mongoose.Types.ObjectId(),
        uuid: uuid,
        name: name,
        guild: "_NONE",
        rank: "_NONE",
        joined: 0,
        lastOnline: 0,
        xpData: [],
        onlineData: [],
        previousGuilds: [],
        dataVersion: config.dataVersionPlayer
    });
}


const removeChannelTracker = async (guildID, channelID, guildName, dcGuildData) => {
    let wynnguild = await findOneWynnGuild(guildName);
    let success = true;
    if (wynnguild === null) {
        let tracking = dcGuildData.trackedWynnGuilds;
        let dcGTomeIndex = tracking.guildTomes.indexOf(tracking.guildTomes.find(g => g.name === guildName && g.channelID === channelID));
        let dcEMIndex = tracking.emeralds.indexOf(tracking.emeralds.find(g => g.name === guildName && g.channelID === channelID));
        let dcLevelIndex = tracking.levels.indexOf(tracking.levels.find(g => g.name === guildName && g.channelID === channelID));
        let dcMemberIndex = tracking.members.indexOf(tracking.members.find(g => g.name === guildName && g.channelID === channelID));
        let dcRankIndex = tracking.ranks.indexOf(tracking.ranks.find(g => g.name === guildName && g.channelID === channelID));
        let dcGXPIndex = tracking.gxp.indexOf(tracking.gxp.find(g => g.name === guildName && g.channelID === channelID));
        if (dcGTomeIndex >= 0) { tracking.guildTomes.splice(dcGTomeIndex, 1); }
        if (dcEMIndex >= 0) { tracking.emeralds.splice(dcEMIndex, 1); }
        if (dcLevelIndex >= 0) { tracking.levels.splice(dcLevelIndex, 1); }
        if (dcMemberIndex >= 0) { tracking.members.splice(dcMemberIndex, 1); }
        if (dcRankIndex >= 0) { tracking.ranks.splice(dcRankIndex, 1); }
        if (dcGXPIndex >= 0) { tracking.gxp.splice(dcGXPIndex, 1); }
        await saveDiscordGuild(dcGuildData).catch(e => {
            success = false;
        });
    } else {
        let trackers = wynnguild.trackingDiscordGuilds;
        let tracking = dcGuildData.trackedWynnGuilds;
        let wynnGTomeIndex = trackers.guildTomes.indexOf(trackers.guildTomes.find(g => g.guildID === guildID && g.channelID === channelID));
        let wynnEMIndex = trackers.emeralds.indexOf(trackers.emeralds.find(g => g.guildID === guildID && g.channelID === channelID));
        let wynnLevelIndex = trackers.levels.indexOf(trackers.levels.find(g => g.guildID === guildID && g.channelID === channelID));
        let wynnMemberIndex = trackers.members.indexOf(trackers.members.find(g => g.guildID === guildID && g.channelID === channelID));
        let wynnRankIndex = trackers.ranks.indexOf(trackers.ranks.find(g => g.guildID === guildID && g.channelID === channelID));
        let wynnGXPIndex = trackers.gxp.indexOf(trackers.gxp.find(g => g.guildID === guildID && g.channelID === channelID));
        let dcGTomeIndex = tracking.guildTomes.indexOf(tracking.guildTomes.find(g => g.name === guildName && g.channelID === channelID));
        let dcEMIndex = tracking.emeralds.indexOf(tracking.emeralds.find(g => g.name === guildName && g.channelID === channelID));
        let dcLevelIndex = tracking.levels.indexOf(tracking.levels.find(g => g.name === guildName && g.channelID === channelID));
        let dcMemberIndex = tracking.members.indexOf(tracking.members.find(g => g.name === guildName && g.channelID === channelID));
        let dcRankIndex = tracking.ranks.indexOf(tracking.ranks.find(g => g.name === guildName && g.channelID === channelID));
        let dcGXPIndex = tracking.gxp.indexOf(tracking.gxp.find(g => g.name === guildName && g.channelID === channelID));
        if (wynnGTomeIndex >= 0) { trackers.guildTomes.splice(wynnGTomeIndex, 1); }
        if (wynnEMIndex >= 0) { trackers.emeralds.splice(wynnEMIndex, 1); }
        if (wynnLevelIndex >= 0) { trackers.levels.splice(wynnLevelIndex, 1); }
        if (wynnMemberIndex >= 0) { trackers.members.splice(wynnMemberIndex, 1); }
        if (wynnRankIndex >= 0) { trackers.ranks.splice(wynnRankIndex, 1); }
        if (wynnGXPIndex >= 0) { trackers.gxp.splice(wynnGXPIndex, 1); }
        if (dcGTomeIndex >= 0) { tracking.guildTomes.splice(dcGTomeIndex, 1); }
        if (dcEMIndex >= 0) { tracking.emeralds.splice(dcEMIndex, 1); }
        if (dcLevelIndex >= 0) { tracking.levels.splice(dcLevelIndex, 1); }
        if (dcMemberIndex >= 0) { tracking.members.splice(dcMemberIndex, 1); }
        if (dcRankIndex >= 0) { tracking.ranks.splice(dcRankIndex, 1); }
        if (dcGXPIndex >= 0) { tracking.gxp.splice(dcGXPIndex, 1); }
        wynnguild.trackingDiscordGuilds = trackers;
        dcGuildData.trackedWynnGuilds = tracking;
        await saveDiscordGuild(dcGuildData)
            .then(() => saveWynnGuild(wynnguild))
            .catch(e => {
                success = false;
            });
    }
    return success;
};

module.exports = {
    findOneDiscordGuild: findOneDiscordGuild,
    findAllDiscordGuilds: findAllDiscordGuilds,
    findOneDiscordGuildAndDelete: findOneDiscordGuildAndDelete,
    saveDiscordGuild: saveDiscordGuild,
    getDiscordGuildCollectionStats: getDiscordGuildCollectionStats,
    findOneWynnGuild: findOneWynnGuild,
    findAllWynnGuilds: findAllWynnGuilds,
    findOneWynnGuildAndDelete: findOneWynnGuildAndDelete,
    saveWynnGuild: saveWynnGuild,
    getWynnGuildCollectionStats: getWynnGuildCollectionStats,
    findOnePlayerByUUID: findOnePlayerByUUID,
    findOnePlayerByName: findOnePlayerByName,
    findAllPlayers: findAllPlayers,
    findOnePlayerAndDelete: findOnePlayerAndDelete,
    savePlayer: savePlayer,
    getPlayerCollectionStats: getPlayerCollectionStats,
    removeChannelTracker: removeChannelTracker,
    newPlayer: newPlayer
}