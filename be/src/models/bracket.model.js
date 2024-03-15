const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

//this is my bracket model so far, can you forsee anything else I would need?

const bracketSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	players: [
		{
			playerRef: { type: mongoose.Schema.Types.ObjectId, ref: "Player" }, // Reference to the Player
			status: {
				type: String,
				enum: ["active", "cancelled", "pending", "paused"],
				default: "pending",
			},
			score: { type: Number, default: 0 },
		},
	],
	rounds: {
		type: Array,
		required: false,
	},
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

const Bracket = mongoose.model("Bracket", bracketSchema);
module.exports = Bracket;
