const mongoose = require("mongoose");

const { roundSchema } = require("./round.model");

const playerSchema = new mongoose.Schema(
	{
		name: String,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			type: String,
			enum: ["active", "cancelled", "pending", "paused"],
			default: "pending",
		},
		score: { type: Number, default: 0 },
		wins: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

const bracketSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	players: [playerSchema],
	rounds: [roundSchema],
	organization: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Organization",
		required: false,
	},
	winner: {
		type: String,
		required: false,
	},
	unit: {
		type: String,
		enum: ["team", "solo", "other"],
		required: false,
	},
	sport: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		enum: ["in-progress", "draft", "completed", "cancelled", "paused"],
		default: "draft",
	},
	code: {
		type: String,
		default: () => generateRandomCode(6), // Use the function to generate a default code
	},
	type: {
		type: String,
		enum: [
			"single-elimination",
			"double-elimination",
			"round-robin",
			"swiss",
			"ladder",
			"playoffs",
			"other",
		],
		default: "single-elimination",
	},
});

function generateRandomCode(length = 10) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const Bracket = mongoose.model("Bracket", bracketSchema);
module.exports = Bracket;
