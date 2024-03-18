// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket, Player } = require("../models");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	async upsert(req, res) {
		let body = req.body;
		body.organization = req.user.organization;

		try {
			let item;
			if (req.body._id) {
				item = await Bracket.findByIdAndUpdate(body._id, body, {
					new: true,
					runValidators: true,
				});
				if (!item) {
					// If no document is found with the given ID, send a 404 response
					return res.status(404).send("Item not found");
				}
			} else {
				// If no ID is provided, create a new document
				item = new Bracket(req.body);
				await item.save();
			}
			res.status(201).send(item);
		} catch (error) {
			console.log("baseController error", error);
			res.status(400).send("BaseController error" + JSON.stringify(error));
		}
	}

	async removeAllPlayers(req, res) {
		const { id } = req.params;

		try {
			const bracket = await Bracket.findById(id);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found" });
			}

			// Clear both players and rounds arrays
			bracket.players = [];
			bracket.rounds = [];

			await bracket.save();

			res.json({
				message: "All players and rounds removed from bracket",
				bracket,
			});
		} catch (error) {
			console.error("Failed to remove all players and rounds:", error);
			res
				.status(500)
				.json({ message: "Failed to remove all players and rounds" });
		}
	}

	async generate_(req, res) {
		const { bracketId } = req.params;

		try {
			const bracket = await Bracket.findById(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			// Assuming bracket.players is an array of player IDs
			const playerIds = bracket.players;

			// Clear existing rounds if you need to regenerate the bracket from scratch
			bracket.rounds = [];

			// Generate initial matchups based on player IDs
			const initialGames = [];
			for (let i = 0; i < playerIds.length; i += 2) {
				const game = {
					player1: playerIds[i],
					player2: i + 1 < playerIds.length ? playerIds[i + 1] : null, // Handle potential bye
				};

				// If it's the last player and there's an odd number, they get a bye
				if (!game.player2) {
					game.winner = game.player1; // Assign the win due to bye
				}

				initialGames.push(game);
			}

			// Add the first round of games to the rounds array
			bracket.rounds.push({ games: initialGames, roundNumber: 1 });

			await bracket.save();

			res.json({ message: "Bracket generated successfully.", bracket });
		} catch (error) {
			console.error("Error generating bracket:", error);
			res.status(500).json({ message: "Failed to generate bracket." });
		}
	}

	async generate(req, res) {
		const { bracketId } = req.params;

		try {
			let bracket = await Bracket.findById(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			// Assuming bracket.players is an array of player IDs or objects
			const totalPlayers = bracket.players.length;
			// Calculate the total number of rounds needed for a single-elimination tournament
			const totalRoundsNeeded = Math.ceil(Math.log2(totalPlayers));

			// Clear existing rounds if regenerating the bracket
			bracket.rounds = [];

			// Generate the initial matchups (first round)
			const initialGames = [];
			for (let i = 0; i < totalPlayers; i += 2) {
				initialGames.push({
					status: "pending",
					player1: bracket.players[i] ? bracket.players[i].id : null, // Adjust based on your data structure
					player2: bracket.players[i + 1] ? bracket.players[i + 1].id : null, // Handle potential byes
				});
			}
			bracket.rounds.push({ games: initialGames, roundNumber: 1 });

			// Add blank rounds for future matches
			for (
				let roundNumber = 2;
				roundNumber <= totalRoundsNeeded;
				roundNumber++
			) {
				const gamesInThisRound = Math.pow(2, totalRoundsNeeded - roundNumber);
				const blankGames = Array.from({ length: gamesInThisRound }).map(() => ({
					status: "pending",
					player1: { id: null, name: "TBD" },
					player2: { id: null, name: "TBD" },
				}));
				bracket.rounds.push({ games: blankGames, roundNumber });
			}

			// Optionally, save the bracket if your changes need to be persisted
			await bracket.save();

			const augmentedBracket = this.augmentPlayerData(bracket);
			res.json({
				message: "Bracket generated successfully with blank rounds.",
				bracket: augmentedBracket,
			});
		} catch (error) {
			console.error("Error generating bracket:", error);
			res.status(500).json({ message: "Failed to generate bracket." });
		}
	}

	// Helper method to replace player IDs with player objects ( so we can easily display player names in the UI)

	augmentPlayerData(bracketOriginal) {
		const bracket = JSON.parse(JSON.stringify(bracketOriginal)); // Deep clone
		const playerObjectsById = bracket.players.reduce((acc, player) => {
			//acc[player._id] = player;
			acc[player._id] = {
				id: player._id,
				name: player.name,
			};

			return acc;
		}, {});

		bracket.rounds.forEach((round) => {
			round.games.forEach((game) => {
				// Replace player IDs with player objects
				game.state = "pending2";
				if (game.player1)
					game.player1 = playerObjectsById[game.player1] || {
						id: game.player1,
						name: "Unknown",
					};
				game.misc = "test";
				if (game.player2)
					game.player2 = playerObjectsById[game.player2] || {
						id: game.player2,
						name: "Unknown",
					};
			});
		});

		return bracket;
	}
}

module.exports = new BracketController();
