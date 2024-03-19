const { Bracket, Player } = require("../models");
const { schema } = require("../models/token.model");

const generateBracket = async (bracketId) => {
	let bracket = await Bracket.findById(bracketId);
	if (!bracket) {
		return res.status(404).json({ message: "Bracket not found." });
	}

	const totalPlayers = bracket.players.length;
	const totalRoundsNeeded = Math.ceil(Math.log2(totalPlayers));

	bracket.rounds = [];

	// Assuming each player in bracket.players is now an object with id and potentially other properties
	const initialGames = [];
	for (let i = 0; i < totalPlayers; i += 2) {
		initialGames.push({
			status: "pending",
			player1: bracket.players[i]
				? { ...bracket.players[i], winner: false }
				: null,
			player2: bracket.players[i + 1]
				? { ...bracket.players[i + 1], winner: false }
				: null,
		});
	}
	bracket.rounds.push({ games: initialGames, roundNumber: 1 });

	for (let roundNumber = 2; roundNumber <= totalRoundsNeeded; roundNumber++) {
		const gamesInThisRound = Math.pow(2, totalRoundsNeeded - roundNumber);
		const blankGames = Array.from({ length: gamesInThisRound }).map(() => ({
			status: "pending",
			player1: { id: 0, winner: false },
			player2: { id: 1, winner: false },
		}));
		bracket.rounds.push({ games: blankGames, roundNumber });
	}

	await bracket.save();
	return bracket;
};

clearRounds = async (bracketId) => {
	let bracket = await Bracket.findById(bracketId);
	if (!bracket) {
		return res.status(404).json({ message: "Bracket not found." });
	}

	bracket.rounds = [];
	await bracket.save();
	return bracket;
};

validateBracket = (bracketId) => {
	if (!/^[0-9a-fA-F]{24}$/.test(bracketId)) {
		return res.status(400).json({ message: "Invalid bracket ID format." });
	}
	return true;
};

// Helper method to replace player IDs with player objects ( so we can easily display player names in the UI)
augmentPlayerData = (bracketOriginal) => {
	const bracket = JSON.parse(JSON.stringify(bracketOriginal)); // Deep clone
	const playerObjectsById = bracket.players.reduce((acc, player) => {
		acc[player._id] = player;
		return acc;
	}, {});

	console.log("playerObjectsById", playerObjectsById);

	bracket.rounds.forEach((round, roundIndex) => {
		round.games.forEach((game) => {
			console.log("game.player1", game.player1._id);
			if (game.player1) {
				const player1 = playerObjectsById[game.player1._id] || {
					id: game.player1._id,
					name: game.player1.name || "-",
				};
				game.player1 = { ...game.player1, ...player1 };
			} else {
				game.player1 = {
					id: 1,
					name: "--",
				};
			}

			if (game.player2) {
				const player2 = playerObjectsById[game.player2._id] || {
					id: game.player2._id,
					name: game.player2.name || "-",
				};
				game.player2 = { ...game.player2, ...player2 };
			} else {
				game.player2 = {
					id: 2,
					name: "--",
				};
			}
		});
	});

	return bracket;
};

module.exports = {
	generateBracket,
	clearRounds,
	validateBracket,
	augmentPlayerData,
};
