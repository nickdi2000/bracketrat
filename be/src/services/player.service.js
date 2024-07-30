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

const addPlayer = async (name, organization) => {
	//check if player already exists
	const existingPlayer = await Player.findOne({
		name,
		organization: organization._id,
	});
	if (existingPlayer) {
		throw new Error("Player already exists with this name");
	}

	const player = await Player.create({
		name,
		organization: organization._id,
	});

	return player;
};

const createPlayerToSlot = async ({ slotId, name, bracketId }) => {
	try {
		// Create the new player
		const player = new Player({ name, organization: bracketId });
		await player.save();

		// Find the game that has the player1 or player2 with the given slotId
		const game = await Game.findOne({
			$or: [{ "player1._id": slotId }, { "player2._id": slotId }],
		});

		if (!game) {
			throw new Error("Game not found.");
		}

		// Update the respective player slot
		if (game.player1._id.toString() === slotId) {
			game.player1.player = player._id;
			game.player1.name = player.name;
			game.player1.filled = true;
		} else if (game.player2._id.toString() === slotId) {
			game.player2.player = player._id;
			game.player2.name = player.name;
			game.player2.filled = true;
		} else {
			throw new Error("Slot ID does not match any player in the game.");
		}

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

module.exports = {
	incrementPlayerWins,
	addPlayerToBracket,
	removePlayerFromBracket,
	destroyPlayer,
	addPlayer,
	createPlayerToSlot,
};
