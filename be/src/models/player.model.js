const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
	// Any additional player-specific information
});

const Player = mongoose.model("Player", playerSchema);
