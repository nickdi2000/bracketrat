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
		//brackets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bracket" }],
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
		//array, but for now it will act as a one-to-one relationship (single bracket/tournament)
		tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Ensure virtuals are included in JSON output
playerSchema.set("toJSON", { virtuals: true });
playerSchema.set("toObject", { virtuals: true });

//add virtual 'state' which says 'In-Bracket' if they have at least one bracket, otherwise Limbo
playerSchema.virtual("state").get(function () {
	return this.brackets?.length > 0 ? 1 : 0;
});

// Define a virtual property 'brackets' that fetches bracket IDs on access
playerSchema.virtual("brackets", {
	ref: "Game", // The model to use
	localField: "_id", // Find games where 'participants.player' is this _id
	foreignField: "participants.player",
	justOne: false, // Returns an array of games
	options: { select: "bracketId" }, // Only fetch the 'bracketId' field
});

// When a player is added or its organization is changed
playerSchema.pre("save", function (next) {
	const player = this;
	if (player.isNew || player.isModified("organization")) {
		this.constructor
			.find({ organization: player.organization })
			.count()
			.then((count) => {
				// Set the player count on the associated organization
				return this.model("Organization").findByIdAndUpdate(
					player.organization,
					{ playerCount: count + (player.isNew ? 1 : 0) }
				);
			})
			.then(() => next())
			.catch((err) => next(err));
	} else {
		next();
	}
});

// When a player is removed
playerSchema.pre("remove", function (next) {
	const player = this;
	this.constructor
		.find({ organization: player.organization })
		.count()
		.then((count) => {
			// Decrement the player count on the associated organization
			return this.model("Organization").findByIdAndUpdate(player.organization, {
				playerCount: count - 1,
			});
		})
		.then(() => next())
		.catch((err) => next(err));
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
