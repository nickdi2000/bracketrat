const { Bracket } = require("../models");
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

module.exports = {
	incrementPlayerWins,
	addPlayerToBracket,
	removePlayerFromBracket,
	destroyPlayer,
	addPlayer,
};
