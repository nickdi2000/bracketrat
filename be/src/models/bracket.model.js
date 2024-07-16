const mongoose = require("mongoose");

const { roundSchema } = require("./round.model");
const { playerSchema } = require("./player.model");

const bracketSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
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
			enum: ["active", "draft", "completed", "cancelled", "paused"],
			default: "draft",
		},
		locked: {
			type: Boolean,
			default: false,
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
		require_auth: {
			type: Boolean,
			default: false,
		},
		auth_type: {
			type: String,
			enum: ["just_name", "symbols", "password"],
			default: "symbols",
		},
		auto_bracket: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

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

//add indexes to the schema
bracketSchema.index({ code: 1 });

const Bracket = mongoose.model("Bracket", bracketSchema);
module.exports = Bracket;
