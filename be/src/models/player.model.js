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
		organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual field to compute the organizations
// playerSchema.virtual("organizations", {
// 	ref: "Organization",
// 	localField: "brackets",
// 	foreignField: "_id",
// 	justOne: false,
// });

// Ensure virtuals are included in JSON output
playerSchema.set("toJSON", { virtuals: true });
playerSchema.set("toObject", { virtuals: true });

//add virtual 'state' which says 'In-Bracket' if they have at least one bracket, otherwise Limbo
playerSchema.virtual("state").get(function () {
	return this.brackets?.length > 0 ? 1 : 0;
});

const stateLabels = {
	0: "Limbo",
	1: "In Bracket",
};

playerSchema.virtual("stateLabel").get(function () {
	return stateLabels[this.state] || "Unknown";
});

//add index
playerSchema.index({ name: "text" });

const Player = mongoose.model("Player", playerSchema);
module.exports = { Player, playerSchema };
