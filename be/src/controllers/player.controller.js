// controllers/MessageController.js
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const socket = require("../utils/socket");

//insert into player list
const insertPlayer = async (req, res) => {
	const { name, bracketId } = req.body;
	console.log("bracketId", bracketId);
	try {
		const result = await bracketService.addPlayerToBracket({ name, bracketId });
		const playerId = result.newPlayer._id;

		res.status(201).json(result);
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

		let augmentedBracket = bracketService.augmentPlayerData(updatedBracket);

		res.status(200).send({
			message: "Player removed successfully.",
			bracket: augmentedBracket,
		});
	} catch (error) {
		console.error("Error removing player from bracket:", error);
		res.status(500).send({ message: "Error removing player from bracket." });
	}
});

const showPlayer = catchAsync(async (req, res) => {
	const { id } = req.params;

	try {
		const player = await Player.findById(id).populate("user");

		const brackets = await Bracket.find({ "players._id": id });

		if (!player) {
			return res.status(404).json({ message: "Player not found." });
		}

		res.json({ player, brackets });
	} catch (error) {
		console.error("Error getting player:", error);
		res.status(500).json({ message: "Failed to get player." });
	}
});

const register = catchAsync(async (req, res) => {
	const { name, bracketId } = req.body;

	try {
		const result = await bracketService.addPlayerToBracket({ name, bracketId });
		//const playerId = result.newPlayer._id;

		// Emit an event to all connected clients
		const io = socket.getIo();
		io.emit("player-created", { player: result.newPlayer });

		res.status(201).json({ player: result.newPlayer });
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		res.status(500).json({ message: error.message });
	}
});

const login = catchAsync(async (req, res) => {
	const { name, bracketId } = req.body;

	try {
		const player = await bracketService.findPlayerInBracket({
			name,
			bracketId,
		});

		const io = socket.getIo();
		io.emit("player-loggedin", { player: player });

		res.status(201).json({ player: player });
	} catch (error) {
		console.error("Error finding player in bracket:", error);
		res.status(500).json({ message: error.message });
	}
});

const batchUpdate = catchAsync(async (req, res) => {
	const { players } = req.body;
	const { bracketId } = req.params;

	try {
		const updatedBracket = await bracketService.batchUpdatePlayers(
			bracketId,
			players
		);

		if (!updatedBracket) {
			return res.status(404).json({ message: "Bracket not found." });
		}

		res.json({
			message: "Players updated successfully.",
			bracket: updatedBracket,
		});
	} catch (error) {
		console.error("Error updating players:", error);
		res.status(500).json({ message: "Failed to update players." });
	}
});

module.exports = {
	insertPlayer,
	getByBracketId,
	destroy,
	showPlayer,
	register,
	login,
	batchUpdate,
};
