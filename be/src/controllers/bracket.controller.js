// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService } = require("../services");
const mongoose = require("mongoose");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	//so how would i update this show method to include that function?
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
		const { gameId, playerId, roundIndex } = req.body;

		try {
			let bracket = await bracketService.updateGameWinner(
				bracketId,
				gameId,
				playerId,
				roundIndex
			);

			res.json({ message: "Updated Winner", bracket });
		} catch (error) {
			console.error("Error updating winner of match:", error);
			res.status(500).json({ message: "Failed to update winner." });
		}
	}

	async removePlayerFromGame(req, res) {
		const { bracketId } = req.params;
		const { gameId, playerId, roundIndex } = req.body;

		try {
			let bracket = await bracketService.removePlayerFromGame(
				bracketId,
				gameId,
				playerId,
				roundIndex
			);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({
				message: "Player removed from game successfully.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error removing player from game:", error);
			res.status(500).json({ message: "Failed to remove player from game." });
		}
	}

	async findGameInBracket(bracket, gameId) {
		let game;
		bracket.rounds.forEach((round) => {
			round.games.forEach((g) => {
				if (g._id.toString() === gameId) {
					game = g;
				}
			});
		});
		return game;
	}

	async undoOutcomes(req, res) {
		const { bracketId } = req.params;
		const { gameId, roundIndex } = req.body;

		try {
			let bracket = await bracketService.undoOutcomes(
				bracketId,
				roundIndex,
				gameId
			);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({
				message: "Outcomes undone successfully.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error undoing outcomes:", error);
			res.status(500).json({ message: "Failed to undo outcomes." });
		}
	}
}

module.exports = new BracketController();
