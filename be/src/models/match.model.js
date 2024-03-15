//match model will be defind here

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
	name: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
	// Any additional match-specific information
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
