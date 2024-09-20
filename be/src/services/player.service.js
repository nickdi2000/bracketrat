const { Bracket, Game, Tournament } = require("../models");
const { Player } = require("../models/player.model");
const bracketService = require("./bracket.service");

const incrementPlayerWins = async (playerId) => {
	await Player.findByIdAndUpdate(playerId, { $inc: { wins: 1 } });
};

/* this will probably need to be redone or emoved as adding a player to a bracket is complicated (may require rebuild) */

const addPlayerToBracket = async (playerId, bracketId) => {
	await Player.findByIdAndUpdate(playerId, {
		$addToSet: { brackets: bracketId },
	});
};

const createAndAddToBracket = async ({ name, bracketId }) => {
	try {
		const bracket = await Bracket.findById(bracketId).populate("tournament");
		//const organization = bracket.organization;
		const tournament = bracket.tournament;
		const organization = tournament.organization;

		if (!organization) {
			throw new Error("Organization not found");
		} else {
			console.log("Organization found! ", organization);
		}

		const player = await createPlayer({ name, organization });
		/* TODO: bracket service here to add player to bracket */
		/* await bracketService.appendPlayerToBracket(player._id, bracketId); */
		/* this should add the user to an empty slot, if there are no empty slots it should EXPAND the bracket to allow them to join, this may mean creating bye's as the structure will be disrupted */
		try {
			const updatedBracket = await bracketService.addPlayerToFirstEmptySpot(
				bracketId,
				player._id
			);
		} catch (error) {
			console.error("Error adding player to bracket", error);
			throw new Error("Failed to add player to bracket (playerlservice.js)");
		}

		return player;
	} catch (error) {
		console.error("Error finding organization", error);
		throw new Error("Failed to find organization (playerlservice.js)");
	}
};

//player should just join ORG (via tourn) first, then select to join the bracket (if option is available)
const joinTournament = async ({ name, tournamentId }) => {
	try {
		const tournament = await Tournament.findById(tournamentId);

		if (!tournament) {
			throw new Error("Tournament not found");
		}

		const organization = tournament.organization;

		if (!organization) {
			throw new Error("Organization not found");
		} else {
			console.log("Organization found! ", organization);
		}

		const player = await createPlayer({ name, organization, tournamentId });

		return { player, tournament };

		//TODO: --- finish this
	} catch (error) {
		console.error("Error finding organization", error);
		throw new Error("Failed to find organization (player ser)");
	}
};

const removePlayerFromBracket = async (playerId, bracketId) => {
	await Player.findByIdAndUpdate(playerId, { $pull: { brackets: bracketId } });
};

const destroyPlayer = async (playerId) => {
	await Player.findByIdAndDelete(playerId);
};

const addPlayer = async (name, organization_id, tournamnet) => {
	const player = await Player.create({
		name,
		organization: organization_id,
		tournaments: [tournamnet],
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
		const bracket = await Bracket.findById(bracketId).populate("tournament");
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		const tournament = bracket.tournament;
		const organization = tournament.organization;

		// Check if the organization is valid
		if (!organization) {
			throw new Error("Organization not found");
		}
		console.log("Organization found! ", organization);

		// Create the new player with the correct organization ID
		const player = new Player({
			name,
			organization,
			tournaments: [tournament]
		});

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

		// Save the updated game
		await game.save();

		return game;
	} catch (error) {
		console.error("Error creating player and inserting into slot:", error);
		throw new Error("Failed to create player and insert into slot.");
	}
};

const addPlayerToEmptySlot = async ({
	name,
	playerId,
	bracketId,
}) => {

	try {
		let gameId;
		let participantIndex;
		const bracket = await Bracket.findById(bracketId)
			.populate({
				path: "rounds.games",
				model: "Game",
				populate: {
					path: "participants",
					model: "Player",
					populate: {
						path: "player",
						model: "Player",
					},
				},
			})
			.exec();

		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		if (bracket.build_type === "dynamic") {
			await bracketService.generateBracket({
				tournamentId: bracket.tournament,
				useCurrentPlayers: true,
				isDynamic: true,
				playerId: playerId
			});
		} else {
			const byeGame = bracket.rounds[0].games.find(game => {
				return game.participants.some(participant => participant.bye === true);
			});

			if (byeGame) {
				const participant = byeGame.participants.find(participant => participant.bye === true);
				participantIndex = byeGame.participants.indexOf(participant);
				gameId = byeGame.id;

			} else {
				throw new Error("No games with a bye found in Round 1.");
			}

			// Find the game using the provided gameId
			const game = await Game.findById(gameId);
			if (!game) {
				throw new Error("Game not found.");
			}

			// Update the respective participant slot
			game.participants[participantIndex] = {
				...game.participants[participantIndex],
				player: playerId,
				name: name,
				filled: true,
			};

			// // Save the updated game
			await game.save();

			return game;
		}
	} catch (error) {
		console.error("Error creating player and inserting into slot:", error);
		throw new Error(error);
	}
};

const createPlayer = async ({ name, organization, tournamentId }) => {
	const player = new Player({ name, organization });

	// Add the player to the tournament if provided
	if (tournamentId) {
		player.tournaments.push(tournamentId);
	}
	await player.save();
	return player;
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
	createAndAddToBracket,
	joinTournament,
	addPlayerToEmptySlot,
};
