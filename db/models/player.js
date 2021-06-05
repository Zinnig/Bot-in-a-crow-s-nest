//Code by Block

const mongoose = require("mongoose");
const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uuid: String,
    name: String,
    guild: String,
    rank: String,
    joined: Number,
    lastOnline: Number,
    xpData: Array,
    onlineData: Array,
    previousGuilds: Array,
    dataVersion: Number
});

module.exports = mongoose.model("Player", playerSchema, "players");