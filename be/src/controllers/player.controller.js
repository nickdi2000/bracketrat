// controllers/MessageController.js
const { Player, Bracket } = require("../models");
const catchAsync = require("../utils/catchAsync");

const insertPlayer = async (req, res) => {
	const { name, bracketId } = req.body;

	try {
		// First, find the bracket to ensure it exists and to check if the player name already exists within it
		const bracket = await Bracket.findById(bracketId).populate("players");
		if (!bracket) {
			return res.status(404).json({ message: "Bracket not found" });
		}

		// Check if a player with the given name already exists in the bracket
		const playerExists = bracket.players.some((player) => player.name === name);
		if (playerExists) {
			return res.status(400).json({
				message: "Player with this name already exists in the bracket",
			});
		}

		// If the player doesn't exist, create and insert the new player
		const newPlayer = new Player({ name });
		await newPlayer.save();

		// Update the bracket with the new player
		bracket.players.push(newPlayer);
		await bracket.save();

		res
			.status(201)
			.json({ message: "Player added successfully", player: newPlayer });
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		res.status(500).json({ message: "Error adding player to bracket" });
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
