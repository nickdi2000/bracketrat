const mongoose = require("mongoose");
//const { toJSON } = require("./plugins");

const { roundSchema } = require("./round.model");
const { required } = require("joi");
//const { playerSchema } = require("./player.model");

const bracketSchema = new mongoose.Schema(
	{
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
		sport: {
			type: String,
			required: false,
		},
		build_type: {
			type: String,
			enum: ["dynamic", "fixed"],
			default: "dynamic",
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
		tournament: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tournament",
			required: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

bracketSchema.pre("find", function () {
	this.populate("tournament");
});

bracketSchema.virtual("unit").get(function () {
	return this.tournament.unit;
});

bracketSchema.virtual("isReady").get(function () {
	//check if there are any rounds with games that have no participants
	let result = true;
	this.rounds.forEach((round) => {
		round.games.forEach((game) => {
			if (!game.participants || game.participants?.length === 0) {
				result = false;
			}
		});
	});
});

/* get unit from associated tournament */

bracketSchema.virtual("tournament_type").get(function () {
	return this.tournament.type;
});

//add indexes to the schema
//bracketSchema.index({ code: 1 });

//bracketSchema.plugin(toJSON);

const Bracket = mongoose.model("Bracket", bracketSchema);
module.exports = Bracket;
