// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket, Game, Tournament } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService, playerService } = require("../services");
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

	async showRobin(req, res) {
		const bracketId = req.params.id;

		try {
			const bracket = await bracketService.showRobin(bracketId);

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
		const { playersObj } = req.body;
		const organization = req.user.organization;
		try {
			console.log("playersObj::", playersObj);
			const filteredIds = playersObj
				.filter((e) => e.stateLabel === "Limbo")
				.map((p) => p._id);
			console.log("filteredIds", filteredIds);

			await Player.deleteMany({
				_id: { $in: filteredIds },
				organization: organization._id,
			});

			const players = await playerService.getPlayersByOrganization(
				organization._id
			);

			res.json({
				message: "Removed all players who are not in the bracket.",
				players,
			});
		} catch (error) {
			console.error("Failed to remove all players:", error);
			res.status(500).json({ message: "Failed to remove all players" });
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
			res.status(500).json({ message: error.message });
		}
	}

	async generateRobin(req, res) {
		const { bracketId } = req.params;

		try {
			const bracket = await bracketService.generateRobinBracket({
				bracketId,
			});

			res.json({
				message:
					"Bracket generated successfully with blank rounds and player seeds.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error generating robin bracket:", error);
			res.status(500).json({ message: error.message });
		}
	}

	async generateFixed(req, res) {
		const { bracketId } = req.params;
		const { size, bracketType } = req.body;

		if (!size) {
			return res.status(400).json({ message: "Bracket size is required." });
		}
		try {
			await bracketService.generateBracket({
				bracketId,
				bracketSize: size,
			});
			const bracketIdTest = await Bracket.findOne({
				tournament: mongoose.Types.ObjectId(bracketId),
				type: bracketType,
			});
			let bracket = await bracketService.getFullBracket(bracketIdTest._id);

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
			await Game.deleteMany({ bracketId: bracketId });
			let bracket = await bracketService.clearRounds(bracketId);
			res.json({
				message:
					"Bracket rounds have been cleared and players have been set to 'Limbo' successfully.",
				bracket,
			});
		} catch (error) {
			console.error("Error clearing bracket:", error);
			res.status(500).json({ message: "Failed to clear bracket." });
		}
	}

	async updateGameWinner(req, res) {
		const { bracketId } = req.params;
		const { playerId, gameId, winnerMarkedById, winnerMarkedByName } = req.body;
		const userId = req?.user?._id ?? winnerMarkedById;
		const userName = req?.user?.isAdmin === true ? "Admin" : winnerMarkedByName;

		try {
			let game = await bracketService.updateGameWinner(gameId, playerId);
			game.winnerMarkedById = userId;
			game.winnerMarkedByName = userName
			game.lastUpdatedAt = new Date();
			game.save();
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

	async updateGameWinnerRobin(req, res) {
		const { bracketId } = req.params;
		const { playerId, gameId } = req.body;

		try {
			let bracket = await bracketService.updateGameWinnerRobin(
				gameId,
				playerId
			);

			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found." });
			}

			res.json({ message: "Updated Winner", bracket });
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

	/* robin undoOutcomes */

	async undoWinner(req, res) {
		const { bracketId } = req.params;
		const { gameId, playerId } = req.body;

		try {
			let game = await bracketService.undoWinner({ gameId, playerId });
			if (!game) {
				return res.status(404).json({ message: "game not found." });
			}

			const bracket = await bracketService.augmentRobinRounds(bracketId);
			if (!bracket) {
				return res.status(404).json({ message: "Bracket not found" });
			}

			res.json({
				message: "Winner undone successfully.",
				bracket: bracket,
			});
		} catch (error) {
			console.error("Error undoing winner:", error);
			res.status(500).json({ message: "Failed to undo winner." });
		}
	}

	async findByCode(req, res) {
		const { code } = req.params;
		try {
			const tournament = await Tournament.findOne({ code: code });
			const bracket = await Bracket.findById(tournament.currentBracket);
			//find players via organization of bracket
			const players = await Player.find({ organization: bracket.organization });

			if (!bracket) {
				return res.status(404).send("Bracket not found");
			}
			res.send({ bracket, players });
		} catch (error) {
			console.log("error", error);
			res.status(400).send("BracketController error" + JSON.stringify(error));
		}
	}

	async patch(req, res) {
		const body = req.body;
		const { id } = req.params;

		try {
			const tournamentId = mongoose.Types.ObjectId(id);
			let tournament = await Tournament.findById(tournamentId);

			if (!tournament) {
				return res.status(404).send("Tournament not found.");
			}

			let bracket = await Bracket.findOne({
				tournament: tournamentId,
				type: body.type
			});

			if (!bracket) {
				bracket = await Bracket.create({
					tournament: tournamentId,
					type: body.type,
					organization: body.organization.id,
				});
			} else {
				// Update tournament name and code if provided
				if (body.name) tournament.name = body.name;
				if (body.code) tournament.code = body.code;
			}
			tournament.currentBracket = bracket._id;
			await tournament.save();
			bracket = bracket.toObject();
			bracket.name = tournament.name;
			bracket.code = tournament.code;

			return res.status(200).send(bracket);

		} catch (error) {
			console.error("BracketController error:", error);
			return res.status(400).send(`BracketController error: ${error.message}`);
		}
	}
}

module.exports = new BracketController();
