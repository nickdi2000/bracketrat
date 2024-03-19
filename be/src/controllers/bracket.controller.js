// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket, Player } = require("../models");
const { bracketService } = require("../services");
const mongoose = require("mongoose");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	async show(req, res) {
		try {
			const bracket = await Bracket.findById(req.params.id);
			if (!bracket) {
				return res.status(404).send("Bracket not found");
			}
			const augmentedBracket = bracketService.augmentPlayerData(bracket);
			res.send(augmentedBracket);
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
			let bracket = await bracketService.generateBracket(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			const augmentedBracket = bracketService.augmentPlayerData(bracket);
			res.json({
				message: "Bracket generated successfully with blank rounds.",
				bracket: augmentedBracket,
			});
		} catch (error) {
			console.error("Error generating bracket:", error);
			res.status(500).json({ message: "Failed to generate bracket." });
		}
	}

	async clearBracket(req, res) {
		const { bracketId } = req.params;

		try {
			let bracket = await bracketService.clearRounds(bracketId);

			res.json({ message: "Bracket rounds cleared successfully.", bracket });
		} catch (error) {
			console.error("Error clearing bracket:", error);
			res.status(500).json({ message: "Failed to clear bracket." });
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
			bracket.rounds.forEach((round, roundIndex) => {
				const gameIndex = round.games.findIndex(
					(game) => game._id.toString() === gameId
				);

				if (gameIndex !== -1) {
					let game = round.games[gameIndex];
					console.log("game", game);
					// Update the winner status for player1 and player2 within the game
					if (game.player1 && game.player1._id.toString() === winnerId) {
						game.player1.winner = true;
						game.player2.winner = false; // Assuming a 2-player game, the other player did not win
					} else if (game.player2 && game.player2._id.toString() === winnerId) {
						game.player2.winner = true;
						game.player1.winner = false;
					}

					gameUpdated = true;
					// Mark the game as completed
					game.status = "completed";
					// Set the game winner at the game level
					game.winner = winnerId;
					// Mark the rounds array as modified
					bracket.markModified("rounds");

					if (roundIndex + 1 < bracket.rounds.length) {
						const nextRound = bracket.rounds[roundIndex + 1];
						const nextGameIndex = Math.floor(gameIndex / 2);
						const nextGame = nextRound.games[nextGameIndex];

						const playerObj = {
							_id: winnerId, // Assuming the winnerId is the ObjectId of the player
							score: 1, // Example default score
							winner: null, // Default winner status for the next round
							// Include other necessary properties according to your schema
						};

						if (gameIndex % 2 === 0) {
							nextGame.player1 = playerObj;
						} else {
							nextGame.player2 = playerObj;
						}
					}
				}
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
}

module.exports = new BracketController();
