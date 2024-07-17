const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
	{
		name: String,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			type: String,
			enum: ["limbo", "active", "cancelled", "pending", "paused", "bye"],
			default: "limbo",
		},
		score: { type: Number, default: 0 },
		wins: { type: Number, default: 0 },
		strength: { type: Number, default: 0 },
		brackets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bracket" }],
	},
	{
		timestamps: true,
	}
);

//add index
playerSchema.index({ name: "text" });

const Player = mongoose.model("Player", playerSchema);
module.exports = { Player, playerSchema };
