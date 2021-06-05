//Code by Block

const mongoose = require("mongoose");
const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    dataVersion: Number,
    level: Number,
    trackingDiscordGuilds: {
        guildTomes: Array,
        emeralds: Array,
        levels: Array,
        members: Array,
        ranks: Array,
        gxp: Array
    },
    rewards: {
        guildTomes: Array,
        emeralds: Array,
    },
    rewardRecord: {
        guildTomes: Array,
        emeralds: Array,
    },
    activityCheck: {
        lastUpdated: Number,
        data: Array
    },
    members: Array
});

module.exports = mongoose.model("WynnGuild", guildSchema, "wynnguilds");