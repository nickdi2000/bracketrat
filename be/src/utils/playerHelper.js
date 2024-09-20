const { Player } = require("../models/player.model");

const checkIfPlayerExists = async (name, organizationId) => {
  try {
    return await Player.findOne({ name, organization: organizationId }).exec();
  } catch (error) {
    console.error("Error checking if player exists:", error);
    throw new Error("Error checking if player exists");
  }
};

const isValidParticipant = (gameId, participantIndex) => {
  return !isNaN(participantIndex) && Boolean(gameId);
};

module.exports = {
  checkIfPlayerExists,
  isValidParticipant,
};
