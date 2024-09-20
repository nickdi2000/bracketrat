// controllers/MessageController.js
const { Bracket } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService, playerService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { isValidParticipant, checkIfPlayerExists } = require("../utils/playerHelper");
const socket = require("../utils/socket");

/* create player and get org from req.user */
const insertPlayer = async (req, res) => {
	const { name } = req.body;
	const { organization } = req.user;

	try {
		const player = await playerService.addPlayer(name, organization._id);
		const bracket = await bracketService.getFullBracket(
			organization.defaultBracket
		);

		res.status(201).json({ player, bracket });
	} catch (error) {
		console.error("Error creating player:", error);
		res.status(500).json({ message: error.message });
	}
};

const createPlayer = async (req, res) => {
	const { name, bracketId, gameId, participantIndex, autoAddToBracket } = req.body;
	const { organization, tournament } = req.user;

	try {
		// Check if player already exists
		const existingPlayer = await checkIfPlayerExists(name, organization._id);
		if (existingPlayer) {
			return res.status(400).json({ message: "Player already exists with this name" });
		}

		let insertedPlayer, players, bracket;

		// Create player for organization if no gameId or participantIndex is provided
		if (!isValidParticipant(gameId, participantIndex)) {
			({ insertedPlayer, players } = await createPlayerForOrganization(name, organization._id, tournament));
		} else {
			// Handle player creation based on gameId or participantIndex
			({ insertedPlayer, bracket } = await handlePlayerCreationInBracket({
				name, gameId, participantIndex, bracketId
			}));
		}

		// Handle auto-add to bracket
		if (autoAddToBracket && insertedPlayer) {
			const playerInBracket = await addPlayerToBracket({
				name,
				playerId: insertedPlayer._id,
				bracketId
			});
			return res.status(201).json(playerInBracket);
		}

		// Send response based on the result of the player creation
		return res.status(201).json({ insertedPlayer, players, bracket });

	} catch (error) {
		console.error("Error creating player:", error);
		return res.status(500).json({ message: "An error occurred while creating the player" });
	}
};

const addPlayerInBracket = async (req, res) => {
	const { name, playerId, bracketId, } = req.body;
	try {
		const player = await playerService.addPlayerToEmptySlot({
			name,
			playerId,
			bracketId,
		});
		const bracket = await bracketService.getFullBracket(bracketId);

		res.status(201).json({ player, bracket });
	} catch (error) {
		console.error("Error creating player to slot:", error);
		res.status(500).json({ message: error.message });
	}
};

const createPlayerForOrganization = async (name, organizationId, tournament) => {
	try {
		const insertedPlayer = await playerService.addPlayer(name, organizationId, tournament);
		const players = await playerService.getPlayersByOrganization(organizationId);
		return { insertedPlayer, players };
	} catch (error) {
		console.error("Error creating player for organization:", error);
		throw new Error("Error creating player for organization");
	}
};

const handlePlayerCreationInBracket = async ({ name, gameId, participantIndex, bracketId }) => {
	try {
		const player = await playerService.createPlayerToSlot({
			gameId,
			participantIndex,
			name,
			bracketId
		});
		const bracket = await bracketService.getFullBracket(bracketId);
		return { insertedPlayer: player, bracket };
	} catch (error) {
		console.error("Error creating player to slot:", error);
		throw new Error("Error creating player to slot");
	}
};

const addPlayerToBracket = async ({ name, playerId, bracketId }) => {
	try {
		const player = await playerService.addPlayerToEmptySlot({
			name,
			playerId,
			bracketId
		});
		const bracket = await bracketService.getFullBracket(bracketId);
		return { player, bracket };
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		throw new Error("Error adding player to bracket");
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
	const { organization } = req.user;

	try {
		await playerService.destroyPlayer(playerId);

		//get new player list
		const players = await playerService.getPlayersByOrganization(
			organization._id
		);

		res.status(200).send({
			message: "Player removed successfully.",
			players,
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
	const { name, tournamentId } = req.body;

	try {
		//const player = await playerService.createAndAddToBracket({ name, bracketId });
		const { player, tournament } = await playerService.joinTournament({
			name,
			tournamentId,
		});
		//const playerId = result.newPlayer._id;

		// Emit an event to all connected clients
		//const io = socket.getIo();
		//io.emit("player-created", { player: result.newPlayer });

		res.status(201).json({ player, tournament });
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		res.status(500).json({ message: error.message });
	}
});

const login = catchAsync(async (req, res) => {
	const { name, bracketId } = req.body;

	try {
		const { player, bracket } = await bracketService.findPlayerInBracket({
			name,
			bracketId,
		});
		const io = socket.getIo();
		io.emit("player-loggedin", { player: player });

		res.status(201).json({ player: player, bracket: bracket });
	} catch (error) {
		console.error("Error finding player in bracket:", error);
		res.status(500).json({ message: error.message });
	}
});

const batchUpdate = catchAsync(async (req, res) => {
	const { players } = req.body;
	const { bracketId } = req.params;

	if (!players || players.length === 0) {
		return res.status(400).json({ message: "No players provided" });
	}

	try {
		const updatedBracket = await bracketService.batchUpdatePlayers({
			bracketId,
			players,
		});

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
		//const players = await Player.find({ organization: orgId });
		const players = await playerService.getPlayersByOrganization(orgId);
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
	createPlayer,
	addPlayerInBracket,
};
