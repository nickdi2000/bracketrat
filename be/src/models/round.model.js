const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const playerGameDetailsSchema = new mongoose.Schema(
	{
		player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
		score: { type: Number, default: 0 },
		winner: { type: Boolean, default: null },
		filled: { type: Boolean, default: false },
		bye: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // Ensure virtuals are included when the document is converted to JSON
		toObject: { virtuals: true },
	}
);

playerGameDetailsSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

const gameSchema = new mongoose.Schema({
	player1: playerGameDetailsSchema,
	player2: playerGameDetailsSchema,
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Player",
		required: false,
	},
	status: {
		type: String,
		enum: ["active", "completed", "cancelled", "pending", "paused", "bye"],
		default: "pending",
	},
	scheduledDate: { type: Date, required: false },
	nextGameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
	// Additional fields to represent game details (scores, status, etc.)
});

gameSchema.plugin(toJSON);

//add indexes
gameSchema.index({ status: 1 });

const roundSchema = new mongoose.Schema(
	{
		games: [gameSchema],
		roundNumber: { type: Number, required: false },
		week: { type: Number, required: false },
		scheduledDate: { type: Date, required: false },
	},
	{
		timestamps: true,
	}
);

roundSchema.plugin(toJSON);
roundSchema.plugin(paginate);

//add indexes
roundSchema.index({ roundNumber: 1 });

const Round = mongoose.model("Round", roundSchema);

module.exports = { Round, roundSchema };
