const { Bracket, Game } = require("../models");
const { Player } = require("../models/player.model");

const incrementPlayerWins = async (playerId) => {
	await Player.findByIdAndUpdate(playerId, { $inc: { wins: 1 } });
};

const addPlayerToBracket = async (playerId, bracketId) => {
	await Player.findByIdAndUpdate(playerId, {
		$addToSet: { brackets: bracketId },
	});
};

const removePlayerFromBracket = async (playerId, bracketId) => {
	await Player.findByIdAndUpdate(playerId, { $pull: { brackets: bracketId } });
};

const destroyPlayer = async (playerId) => {
	await Player.findByIdAndDelete(playerId);
};

const addPlayer = async (name, organization_id) => {
	//check if player already exists
	const existingPlayer = await Player.findOne({
		name,
		organization: organization_id,
	});
	if (existingPlayer) {
		throw new Error("Player already exists with this name");
	}

	const player = await Player.create({
		name,
		organization: organization_id,
	});

	return player;
};

const createPlayerToSlot = async ({
	gameId,
	participantIndex,
	name,
	bracketId,
}) => {
	//console log all arguments
	console.log("createPlayerToSlopt player service.js - gameId", gameId);
	console.log("participantIndex", participantIndex);
	console.log("name", name);
	console.log("bracketId", bracketId);

	try {
		// First, retrieve the bracket to get the associated organization
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		// Create the new player with the correct organization ID
		const player = new Player({ name, organization: bracket.organization });
		await player.save();

		// Find the game using the provided gameId
		const game = await Game.findById(gameId);
		if (!game) {
			throw new Error("Game not found.");
		}

		// Check if the participant index is within range
		if (participantIndex < 0 || participantIndex >= game.participants.length) {
			throw new Error("Invalid participant index.");
		}

		// Update the respective participant slot
		game.participants[participantIndex] = {
			...game.participants[participantIndex],
			player: player._id,
			name: player.name,
			filled: true,
		};

		console.log("new playerIndex value", game.participants[participantIndex]);

		// Save the updated game
		await game.save();

		return game;
	} catch (error) {
		console.error("Error creating player and inserting into slot:", error);
		throw new Error("Failed to create player and insert into slot.");
	}
};

const createPlayer = async (name, organization) => {
	const player = new Player({ name, organization });
	await player.save();
	return player._id;
};

const getPlayersByOrganization = async (organization) => {
	const players = await Player.find({
		organization,
	}).populate("brackets");
	return players;
};

module.exports = {
	incrementPlayerWins,
	addPlayerToBracket,
	removePlayerFromBracket,
	destroyPlayer,
	addPlayer,
	createPlayerToSlot,
	getPlayersByOrganization,
};
