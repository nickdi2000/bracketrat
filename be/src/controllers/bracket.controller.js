// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket, Player } = require("../models");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	async show(req, res) {
		try {
			const bracket = await this.model.findById(req.params.id);
			if (!bracket) {
				return res.status(404).send("Bracket not found");
			}
			const augmentedBracket = this.augmentPlayerData(bracket);
			res.send(augmentedBracket);
			//res.send(bracket);
		} catch (error) {
			console.log("error", error);
			res.status(400).send("BracketController error" + JSON.stringify(error));
		}
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
					player1: null,
					player2: null,
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
	async updateGameWinner(req, res) {
		const { bracketId } = req.params;
		const { gameId, winnerId } = req.body;

		try {
			let bracket = await Bracket.findById(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			let gameUpdated = false;

			// Find the game and update the winner
			bracket.rounds.some((round, roundIndex) => {
				const gameIndex = round.games.findIndex(
					(game) => game._id.toString() === gameId
				);

				if (gameIndex !== -1) {
					let game = round.games[gameIndex];
					game.winner = winnerId; // Update the winner ID
					gameUpdated = true;

					// Determine the next round and game index
					let nextRoundIndex = roundIndex + 1;
					let nextGameIndex = Math.floor(gameIndex / 2);

					// Check if the next round exists
					if (nextRoundIndex < bracket.rounds.length) {
						let nextGame = bracket.rounds[nextRoundIndex].games[nextGameIndex];

						// If the winner should be placed in player1 or player2
						if (!nextGame.player1 || nextGame.player1 === winnerId) {
							bracket.rounds[nextRoundIndex].games[nextGameIndex].player1 =
								winnerId;
						} else {
							bracket.rounds[nextRoundIndex].games[nextGameIndex].player2 =
								winnerId;
						}

						// Mark the rounds array as modified
						bracket.markModified("rounds");
					}
					return true; // Stop the iteration since the game is found and updated
				}
				return false;
			});

			if (!gameUpdated) {
				return res
					.status(404)
					.json({ message: "Game not found in the bracket." });
			}

			await bracket.save();

			res.json({ message: "Game winner updated successfully.", bracket });
		} catch (error) {
			console.error("Error updating game winner:", error);
			res.status(500).json({ message: "Failed to update game winner." });
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

		//it seems that adding the .winner to the player that won the game is adding it to the player in each round, but i dont want it to add to the last round because it hasn't been played yet, they areboth in limbo

		bracket.rounds.forEach((round, roundIndex) => {
			round.games.forEach((game) => {
				//console.log("game", game);
				// Replace player IDs with player objects
				if (game.player1) {
					game.player1 = playerObjectsById[game.player1] || {
						id: game.player1,
						name: "Unknown",
					};
				} else {
					game.player1 = {
						id: null,
						name: "",
					};
				}

				if (game.player2) {
					game.player2 = playerObjectsById[game.player2] || {
						id: game.player2,
						name: "Unknown",
					};
				} else {
					game.player2 = {
						id: null,
						name: "",
					};
				}

				// Add winner flag to the player that won the game (we need to deep clone the object to avoid modifying the original player object in the players array and other games)
				if (game.player1.id === game.winner) {
					const newPlayer = JSON.parse(JSON.stringify(game.player1));
					newPlayer.winner = true;
					game.player1 = newPlayer;
				}

				if (game.player2.id === game.winner) {
					const newPlayer = JSON.parse(JSON.stringify(game.player2));
					newPlayer.winner = true;
					game.player2 = newPlayer;
				}

				//add winners:
				// if (roundIndex + 1 < bracket.rounds.length) {
				// 	game.player1.winner = game.player1.id === game.winner ? true : false;
				// 	game.player2.winner = game.player2.id === game.winner ? true : false;
				// }
			});
		});

		return bracket;
	}
}

module.exports = new BracketController();
