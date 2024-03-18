const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
		date: { type: Date, default: Date.now },
		status: {
			type: String,
			enum: ["active", "cancelled", "pending", "paused"],
			default: "pending",
		},
	},
	{
		timestamps: true, //this will create a
	}

	// Any additional player-specific information
);

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
