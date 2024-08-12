// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService, organizationService } = require("../services");
const mongoose = require("mongoose");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	//so how would i update this show method to include that function?
	async show(req, res) {
		const bracketId = req.params.id;

		try {
			const bracket = await bracketService.getFullBracket(bracketId);

			res.send(bracket);
		} catch (error) {
			console.log("error", error);
			res.status(400).send("BracketController error" + JSON.stringify(error));
		}
	}

	async addPlayer(req, res) {
		const { bracketId, playerId } = req.params;

		try {
			const bracket = await bracketService.addPlayerToFirstEmptySpot(
				bracketId,
				playerId
			);

			res.json({
				message: "Player added to bracket successfully",
				bracket,
			});
		} catch (error) {
			console.error("Failed to add player to bracket:", error);
			res.status(500).json({ message: "Failed to add player to bracket" });
		}
	}

	async upsert(req, res) {
		let body = req.body;
		body.organization = req.user.organization;

		//if "nname" is blank, call it "My First Bracket", otherwise use the name provided
		if (!body.name) {
			body.name = "My First Bracket";
		}

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
		const organization = req.user.organization;

		try {
			//we should delete just delete all players associated with organization
			await Player.deleteMany({ organization: organization._id });

			//then clear bracket
			const bracket = await Bracket.findById(id);
			bracket.rounds = [];
			await bracket.save();

			res.json({
				message: "All players and rounds removed from bracket",
				bracket,
				players: [],
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
			await bracketService.generateBracket({
				bracketId,
			});

			let bracket = await bracketService.getFullBracket(bracketId);

			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({
				message:
					"Bracket generated successfully with blank rounds and player seeds.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error generating bracket:", error);
			res.status(500).json({ message: "Failed to generate bracket." });
		}
	}

	async generateFixed(req, res) {
		const { bracketId } = req.params;
		const { size } = req.body;

		if (!size) {
			return res.status(400).json({ message: "Bracket size is required." });
		}

		try {
			 	await bracketService.generateBracket({
				bracketId,
				bracketSize: size,
			});

			let bracket = await bracketService.getFullBracket(bracketId);

			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({
				message:
					"Bracket generated successfully with blank rounds and player seeds.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error generating bracket:", error);
			res.status(500).json({ message: "Failed to generate bracket." });
		}
	}

	async reGenerate(req, res) {
		const { bracketId } = req.params;

		try {
			let bracket = await bracketService.reGenerateBracket(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({
				message: "Bracket re-generated successfully with blank rounds.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error re-generating bracket:", error);
			res.status(500).json({ message: "Failed to re-generate bracket." });
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
		const { playerId, gameId } = req.body;

		try {
			let game = await bracketService.updateGameWinner(gameId, playerId);

			try {
				let bracket = await bracketService.getFullBracket(bracketId);
				if (!bracket) {
					return res.status(404).json({ message: "Bracket not found." });
				}
				res.json({ message: "Updated Winner", bracket });
			} catch (error) {
				console.error("Error updating winner of match:", error);
				res.status(500).json({ message: "Failed to update winner." });
			}
		} catch (error) {
			console.error("Error updating winner of match:", error);
			res.status(500).json({ message: "Failed to update winner." });
		}
	}

	async removePlayerFromGame(req, res) {
		const { bracketId } = req.params;
		const { playerId, roundIndex, gameId } = req.body;

		try {
			let removedPlayerBracket = await bracketService.removePlayerFromGame({
				bracketId,
				playerId,
				roundIndex,
				gameId,
			});

			const bracket = await bracketService.getFullBracket(bracketId);
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
			let bracket = await bracketService.undoOutcomes({ gameId });
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

	async findByCode(req, res) {
		const { code } = req.params;
		try {
			const bracket = await Bracket.findOne({ code: code }).populate(
				"players.player"
			);
			if (!bracket) {
				return res.status(404).send("Bracket not found");
			}
			res.send(bracket);
		} catch (error) {
			console.log("error", error);
			res.status(400).send("BracketController error" + JSON.stringify(error));
		}
	}

	async patch(req, res) {
		const body = req.body;
		const { id } = req.params;

		try {
			const bracket = await Bracket.findById(id);
			if (!bracket) {
				return res.status(404).send("Item not found");
			}

			Object.keys(body).forEach((key) => {
				bracket[key] = body[key];
			});

			await bracket.save();
			res.status(200).send(bracket);
		} catch (error) {
			console.log("bracketController error", error);
			res.status(400).send("bracketController error" + JSON.stringify(error));
		}
	}
}

module.exports = new BracketController();
