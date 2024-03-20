const { Bracket, Player } = require("../models");

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

module.exports = {
	incrementPlayerWins,
	addPlayerToBracket,
	removePlayerFromBracket,
};
