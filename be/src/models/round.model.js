const mongoose = require("mongoose");

const { toJSON, paginate } = require("./plugins");

const roundSchema = new mongoose.Schema(
	{
		games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
		roundNumber: { type: Number, required: false },
		week: { type: Number, required: false },
		scheduledDate: { type: Date, required: false },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

roundSchema.plugin(toJSON);
roundSchema.plugin(paginate);

// Add indexes
roundSchema.index({ roundNumber: 1 });

const Round = mongoose.model("Round", roundSchema);

module.exports = { Round, roundSchema };
