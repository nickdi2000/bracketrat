const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const gameSchema = new mongoose.Schema({
	player1: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
	player2: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Player",
		required: false,
	},
	status: {
		type: String,
		enum: ["active", "completed", "cancelled", "pending", "paused"],
		default: "pending",
	},
	scheduledDate: { type: Date, required: false },
	// Additional fields to represent game details (scores, status, etc.)
});

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

const Round = mongoose.model("Round", roundSchema);

module.exports = { Round, roundSchema };
