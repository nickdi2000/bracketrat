const mongoose = require("mongoose");
const { Player } = require("./player.model");

const { toJSON, paginate } = require("./plugins");

const playerGameDetailsSchema = new mongoose.Schema(
	{
		player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
		score: { type: Number, default: 0 },
		winner: { type: Boolean, default: null },
		bye: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

playerGameDetailsSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

playerGameDetailsSchema.virtual("filled").get(function () {
	return this.player != null;
});

const gameSchema = new mongoose.Schema(
	{
		// player1: playerGameDetailsSchema,
		// player2: playerGameDetailsSchema,
		//switching from player1/player2 to participants array
		participants: [
			{
				player: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Player",
					default: null,
				},
				name: String,
				winner: Boolean,
				bye: Boolean,
				score: { type: Number, default: 0 },
			},
		],
		winner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Player",
			required: false,
		},
		winnerMarkedById: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Player',
		},
		winnerMarkedByName: {
			type: String,
			deafult: "",
		},
		lastUpdatedAt: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ["active", "completed", "cancelled", "pending", "paused", "bye"],
			default: "pending",
		},
		roundNumber: { type: Number, default: 0 },
		scheduledDate: { type: Date, required: false },
		nextGameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
		bracketId: { type: mongoose.Schema.Types.ObjectId, ref: "Bracket" },
	},
	{
		toJSON: { virtuals: true },
	}
);

gameSchema.plugin(toJSON);

// Add indexes
gameSchema.index({ status: 1 });

//add a hasBye virtual, which searches participants for a bye
gameSchema.virtual("hasBye").get(function () {
	return this.participants.some((p) => p.bye);
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
