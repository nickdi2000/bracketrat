### models

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
		strength: { type: Number, default: 0 },
		brackets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bracket" }],
		organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
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
		bracketId: { type: mongoose.Schema.Types.ObjectId, ref: "Bracket" },
	},
	{
		toJSON: { virtuals: true },
	}
);



### please optimize and fix my test code:



it("should update the winner of a game correctly", async function () {
	try {
		// Generate a bracket with games
		const bracket = await Bracket.findById(this.bracket._id);

		if (!bracket) {
			throw new Error("Bracket not found");
		}

		// Get the first game in the bracket
		const firstGame = bracket.rounds[0].games[0];
		const gameId = firstGame._id;

		const game = await Game.findById(gameId);
		const playerId = game.player1?._id;

		const playerIdObj = playerId.toString();
		const gameIdObj = game._id.toString();


		const updatedGame = await updateGameWinner(gameIdObj, playerIdObj);

		// Verify that the nextgame has this player in it, meaning our existing game updatedGame.nextGameId (object id), should have this playerId in it as either player1 or player2

		const nextGame = await Game.findById(updatedGame.nextGameId);
		console.log("----nextGame", nextGame);

		//find player in nextGame
		let playerInNextGame = null;

		if (nextGame.player1?.player === playerIdObj) {
			playerInNextGame = nextGame.player1;
		} else if (nextGame.player2?.player === playerIdObj) {
			playerInNextGame = nextGame.player2;
		}

		console.log("playerInNextGame", playerInNextGame);

		if (!playerInNextGame) {
			throw new Error("Player not found in next game");
		}

		expect(playerInNextGame).to.be.an("object");

		// Further assertions can be made based on the expected structure and content of the updated game
	} catch (error) {
		throw new Error("Failed to update game winner: " + error.message);
	}
});