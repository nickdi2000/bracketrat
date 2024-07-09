// controllers/MessageController.js
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService } = require("../services");
const catchAsync = require("../utils/catchAsync");

//insert into player list
const insertPlayer = async (req, res) => {
	const { name, bracketId } = req.body;
	console.log("bracketId", bracketId);
	try {
		const result = await bracketService.addPlayerToBracket({ name, bracketId });
		const playerId = result.newPlayer._id;

		res.status(201).json(result);

		// try {
		// 	//await bracketService.addPlayerToFirstEmptySpot(bracketId, playerId);
		// 	//const bracket = await bracketService.generateBracket(bracketId);
		// 	res.status(201).json(result);
		// } catch (error) {
		// 	console.error("Failed to add player to bracket:", error);
		// 	res.status(500).json({ message: "Failed to add player to bracket" });
		// }
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		res.status(500).json({ message: error.message });
	}
};

const getByBracketId = catchAsync(async (req, res) => {
	const { bracketId } = req.params;

	try {
		// Find the bracket and populate the player references
		const bracket = await Bracket.findById(bracketId).populate(
			"players.playerRef"
		);

		// Respond with the bracket details
		res.status(200).json(bracket);
	} catch (error) {
		console.error("Error getting bracket by ID:", error);
		res.status(500).send("Error getting bracket by ID");
	}
});

const destroy = catchAsync(async (req, res) => {
	const { bracketId, playerId } = req.query;

	try {
		// Find the bracket by ID and update it by pulling the player from the 'players' array
		const updatedBracket = await Bracket.findByIdAndUpdate(
			bracketId,
			{ $pull: { players: { _id: playerId } } },
			{ new: true }
		);

		if (!updatedBracket) {
			return res.status(404).send({ message: "Bracket not found." });
		}

		res.status(200).send({
			message: "Player removed successfully.",
			bracket: updatedBracket,
		});
	} catch (error) {
		console.error("Error removing player from bracket:", error);
		res.status(500).send({ message: "Error removing player from bracket." });
	}
});

module.exports = {
	insertPlayer,
	getByBracketId,
	destroy,
};
