/*
 Given the following schemas..
*/

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
	},
	{
		timestamps: true,
	}
);

const playerGameDetailsSchema = new mongoose.Schema(
	{
		player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
		score: { type: Number, default: 0 },
		winner: { type: Boolean, default: null },
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
