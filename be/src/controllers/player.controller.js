// controllers/MessageController.js
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService, playerService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const socket = require("../utils/socket");

/* create player and get org from req.user */
const insertPlayer = async (req, res) => {
	const { name } = req.body;
	const { organization } = req.user;

	try {
		const player = await playerService.addPlayer(name, organization);
		const bracket = await Bracket.findOne({ organization: organization._id });

		res.status(201).json({ player, bracket });
	} catch (error) {
		console.error("Error creating player:", error);
		res.status(500).json({ message: error.message });
	}
};

const createToSlot = async (req, res) => {
	const { slotId, name, bracketId } = req.body;

	try {
		const player = await playerService.createPlayerToSlot({
			slotId,
			name,
			bracketId,
		});
		const bracket = await bracketService.getFullBracket(bracketId);

		res.status(201).json({ player, bracket });
	} catch (error) {
		console.error("Error creating player to slot:", error);
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
	const { playerId } = req.query;

	try {
		await playerService.destroyPlayer(playerId);
		res.status(200).send({
			message: "Player removed successfully.",
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

const list = async (req, res) => {
	const orgId = req.user.organization._id;
	try {
		const players = await Player.find({ organization: orgId });
		res.status(200).json(players);
	} catch (error) {
		console.error("Error getting players:", error);
		res.status(500).json({ message: "Failed to get players." });
	}
};

module.exports = {
	insertPlayer,
	getByBracketId,
	destroy,
	showPlayer,
	register,
	login,
	batchUpdate,
	list,
	createToSlot,
};
