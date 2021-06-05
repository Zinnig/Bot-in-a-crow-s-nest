//Code by Block

const mongoose = require("mongoose");
const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    prefix: String,
    blacklisted: Boolean,
    dataVersion: Number,
    permissionGroups: Array,
    ignoredChannels: Array,
    trackedWynnGuilds: {
        guildTomes: Array,
        emeralds: Array,
        levels: Array,
        members: Array,
        ranks: Array,
        gxp: Array
    }
});

module.exports = mongoose.model("DiscordGuild", guildSchema, "dcguilds");