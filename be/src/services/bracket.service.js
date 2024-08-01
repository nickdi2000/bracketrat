const { Bracket, Organization } = require("../models");
const { Player } = require("../models/player.model");
const { Game } = require("../models");

/* Generate Bracket with all players, or if bracketSize is provided, generate a fixed-size bracket with no players.  if useCurrentPlayers is true, we take the players already in the bracket and rebuild it (to fix blanks/errorenous byes etc) */
const generateBracket = async ({
	bracketId,
	useCurrentPlayers = false,
	bracketSize = null,
}) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		console.log("---bracketSize", bracketSize);

		let players = [];
		if (bracketSize) {
			// Fixed bracket size for starting the tournament without initial player data
			players = new Array(bracketSize).fill(null);
		} else if (useCurrentPlayers) {
			// Load current players from existing games (if any)
			players =
				bracket.rounds[0]?.games
					.flatMap((game) =>
						game.participants.map((participant) => participant.player)
					)
					.filter((player) => player) || [];
		} else {
			// Optionally load players based on another criterion, e.g., from an organization
			const organization = await Organization.findById(bracket.organization);
			if (!organization) {
				throw new Error("Organization not found.");
			}
			players = await Player.find({ organization: organization._id });
		}

		const totalPlayers = players.length;
		const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalPlayers || 1)));
		const numberOfGames = nextPowerOfTwo / 2;
		const totalRoundsNeeded = Math.log2(nextPowerOfTwo);

		bracket.rounds = []; // Reset rounds
		let allGames = []; // Store all games for later nextGameId linking

		// Generate the initial round with actual players or placeholders
		const firstRoundGames = [];
		for (let i = 0; i < numberOfGames; i++) {
			const game = new Game({
				bracketId: bracket._id,
				participants: [
					{
						player: players[2 * i] ? players[2 * i]._id : null,
						bye: !players[2 * i],
					},
					{
						player: players[2 * i + 1] ? players[2 * i + 1]._id : null,
						bye: !players[2 * i + 1],
					},
				],
				status: "pending",
				nextGameId: null,
			});
			await game.save();
			firstRoundGames.push(game);
		}
		bracket.rounds.push({
			games: firstRoundGames.map((game) => game._id),
			roundNumber: 1,
		});
		allGames.push(...firstRoundGames);

		// Generate subsequent rounds with empty games for future winners
		for (let roundNumber = 2; roundNumber <= totalRoundsNeeded; roundNumber++) {
			const gamesThisRound = [];
			for (let i = 0; i < numberOfGames / Math.pow(2, roundNumber - 1); i++) {
				const game = new Game({
					bracketId: bracket._id,
					participants: [{}, {}],
					status: "pending",
					nextGameId: null,
				});
				await game.save();
				gamesThisRound.push(game);
			}
			bracket.rounds.push({
				games: gamesThisRound.map((game) => game._id),
				roundNumber,
			});
			allGames.push(...gamesThisRound);
		}

		// Link games with nextGameId
		for (
			let roundIndex = 0;
			roundIndex < bracket.rounds.length - 1;
			roundIndex++
		) {
			const currentRoundGames = allGames.filter(
				(game) => game.roundNumber === roundIndex + 1
			);
			const nextRoundGames = allGames.filter(
				(game) => game.roundNumber === roundIndex + 2
			);
			currentRoundGames.forEach((game, index) => {
				if (nextRoundGames.length > index / 2) {
					game.nextGameId = nextRoundGames[Math.floor(index / 2)]._id;
					game.save();
				}
			});
		}

		await bracket.save();
		return populateRoundsWithPlayers(bracket); // Assuming this function populates and returns full bracket details
	} catch (error) {
		console.error("Error generating bracket:", error.message);
		throw new Error("Failed to generate bracket.");
	}
};

/*
update winner 
*/
const updateGameWinner = async (gameId, winnerId) => {
	try {
		console.log(
			`Updating game winner for gameId: ${gameId}, winnerId: ${winnerId}`
		);

		const game = await Game.findById(gameId).populate("participants.player");
		if (!game) {
			throw new Error("Game not found.");
		}

		// Initialize variables to track the winner
		let winnerAssigned = false;
		let winnerName = "";

		// Update participants to mark the winner and losers
		game.participants.forEach((participant) => {
			if (
				participant.player &&
				participant.player._id.toString() === winnerId
			) {
				participant.winner = true;
				winnerName = participant.player.name;
				winnerAssigned = true;
			} else {
				participant.winner = false; // Mark other participants as not winners
			}
		});

		if (!winnerAssigned) {
			throw new Error("Player not found in the game.");
		}

		game.status = "completed"; // Update game status to completed
		await game.save();

		console.log(`Game updated with winner. Now finding the next game...`);

		// Handle progression to the next game if applicable
		if (game.nextGameId) {
			const nextGame = await Game.findById(game.nextGameId);
			if (nextGame) {
				console.log(`Next game found: ${nextGame._id}`);
				// Assign winner to the next game's first empty participant slot
				const emptyParticipant = nextGame.participants.find((p) => !p.player);
				if (emptyParticipant) {
					emptyParticipant.player = winnerId;
					emptyParticipant.name = winnerName;
					await nextGame.save();
					console.log(`Assigned winner to next game: ${nextGame._id}`);
				} else {
					console.error("Next game slots are already filled.");
					throw new Error("Next game slots are already filled.");
				}
			} else {
				console.log(`No next game found for current game: ${gameId}`);
			}
		} else {
			console.log(`No nextGameId set for current game: ${gameId}`);
		}

		return game;
	} catch (error) {
		console.error("Error updating game winner:", error.message);
		throw new Error("Failed to update game winner.");
	}
};

/*
 *
 */

//still doesn't seem to fill the player1 and player2 with the names...this is my bracket.service.js
const getFullBracket = async (bracketId) => {
	const bracket = await Bracket.findById(bracketId)
		.populate({
			path: "organization",
		})
		.exec();

	if (!bracket) {
		throw new Error("Bracket not found.");
	}
	console.log(JSON.stringify(bracket, null, 2));
	return populateRoundsWithPlayers(bracket);
	//return augmentPlayerData(bracket);
};

const populateRoundsWithPlayers = async (bracket) => {
	await bracket
		.populate({
			path: "rounds.games",
			populate: {
				path: "participants.player",
				select: "name",
			},
		})
		.execPopulate();

	bracket = bracket.toObject();

	// Adjusting to the new schema
	bracket.rounds.forEach((round, roundIndex) => {
		round.games.forEach((game) => {
			game.participants.forEach((participant) => {
				if (participant.player) {
					participant.name = participant.player.name; // Transfer name
					participant.roundIndex = roundIndex; // Add the round index to each participant
					participant._id = participant.player._id; // Add the player ID to the participant
				}
				delete participant.player; // Optionally remove the player object if no longer needed
			});
			game.roundIndex = roundIndex; // Add the roundIndex to the game object
		});
	});

	return formatDataForBracket(bracket);
};

const formatDataForBracket = (bracket) => {
	// Create a new structure for rounds to avoid mutating the original bracket
	const formattedRounds = bracket.rounds.map((round) => {
		const formattedGames = round.games.map((game) => {
			// Initialize default players in case there are fewer than two participants
			const defaultPlayer = {
				_id: null,
				name: "",
				winner: null,
				bye: false,
				score: 0,
			};
			const formattedGame = {
				status: game.status,
				_id: game._id,
				player1: game.participants[0]
					? {
							...game.participants[0],
							_id: game.participants[0]._id,
							participantIndex: 0,
							gameId: game._id,
					  }
					: { ...defaultPlayer },
				player2: game.participants[1]
					? {
							...game.participants[1],
							_id: game.participants[1]._id,
							participantIndex: 1,
							gameId: game._id,
					  }
					: { ...defaultPlayer },
				bracketId: game.bracketId,
				__v: game.__v,
				roundIndex: game.roundIndex,
			};

			return formattedGame;
		});

		return {
			games: formattedGames,
			_id: round._id,
			roundNumber: round.roundNumber,
			createdAt: round.createdAt,
			updatedAt: round.updatedAt,
			id: round.id,
		};
	});

	// Return the original bracket with the transformed rounds array
	return {
		...bracket,
		rounds: formattedRounds,
	};
};

//use same players (without pulling in straggler players)
const reGenerateBracket = async (bracketId) => {
	let bracket = await Bracket.findById(bracketId).populate("players");
	if (!bracket) {
		throw new Error("Bracket not found.");
	}

	return await generateBracket(bracketId, true);
};
const addPlayerToFirstEmptySpot = async (bracketId, playerId) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Failed to find bracket.");
		}

		// Get the first round games
		const firstRoundGames = await Game.find({
			_id: { $in: bracket.rounds[0].games },
		});

		let foundEmptySpot = false;
		let updatedGame = null;

		// Search for an empty spot in existing games
		for (let game of firstRoundGames) {
			const emptyIndex = game.participants.findIndex(
				(part) => part.player === null
			);
			if (emptyIndex !== -1) {
				game.participants[emptyIndex] = {
					player: playerId,
					name: "", // Optionally pull this from player data
					winner: null,
					bye: false,
					filled: true,
				};
				await game.save();
				updatedGame = game;
				foundEmptySpot = true;
				break;
			}
		}

		// If no empty spot is found, create a new game
		if (!foundEmptySpot) {
			const newGame = new Game({
				participants: [
					{
						player: playerId,
						name: "", // Optionally pull this from player data
						winner: null,
						bye: false,
						filled: true,
					},
					{
						player: null,
						name: "",
						winner: null,
						bye: false,
						filled: false,
					},
				],
				bracketId: bracketId,
				status: "pending",
			});
			await newGame.save();
			bracket.rounds[0].games.push(newGame._id);
			await bracket.save();
			updatedGame = newGame;
		}

		return populateRoundsWithPlayers(bracket); // Update the bracket with populated player details
	} catch (error) {
		console.error("Error adding player to the first empty spot:", error);
		throw new Error("Failed to add player to the first empty spot.");
	}
};

const removePlayerFromGame = async ({ gameId, playerId }) => {
	try {
		// Use the update operation directly to remove the player by setting fields to null
		const updateResult = await Game.updateOne(
			{ _id: gameId, "participants.player": playerId },
			{
				$set: {
					"participants.$.player": null,
					"participants.$.name": "",
					"participants.$.winner": null,
					"participants.$.bye": false,
				},
			}
		);

		if (updateResult.modifiedCount === 0) {
			throw new Error(
				"Player not found in the specified game or no changes were made."
			);
		}

		// Optionally, fetch and return the updated game
		const updatedGame = await Game.findById(gameId);
		return updatedGame;
	} catch (error) {
		console.error("Error removing player from game:", error);
		throw new Error("Failed to remove player from game.");
	}
};

const undoOutcomes = async ({ gameId }) => {
	try {
		// Find the game by its ID
		const game = await Game.findById(gameId);
		if (!game) {
			throw new Error("Game not found");
		}

		// Find the bracket that contains this game
		const bracket = await Bracket.findOne({ "rounds.games": gameId });
		if (!bracket) {
			throw new Error("Bracket not found");
		}

		// Reset the winner status for player1 and player2 within the game
		if (game.player1) {
			game.player1.winner = null;
		}
		if (game.player2) {
			game.player2.winner = null;
		}
		game.status = "pending";
		game.winner = null;

		// Save the updated game
		await game.save();

		// Find the next game if it exists
		if (game.nextGameId) {
			const nextGame = await Game.findById(game.nextGameId);
			if (nextGame) {
				// Remove the winner from the next game
				if (
					nextGame.player1 &&
					nextGame.player1.player.toString() === game.winner.toString()
				) {
					nextGame.player1 = {
						player: null,
						name: "",
						winner: null,
						filled: false,
					};
				} else if (
					nextGame.player2 &&
					nextGame.player2.player.toString() === game.winner.toString()
				) {
					nextGame.player2 = {
						player: null,
						name: "",
						winner: null,
						filled: false,
					};
				}

				// Save the updated next game
				await nextGame.save();
			}
		}

		return game;
	} catch (error) {
		console.error("Error undoing outcomes:", error);
		throw new Error("Failed to undo outcomes.");
	}
};

module.exports = { undoOutcomes };

undoOutcomes_ = async (bracketId, roundIndex, gameId) => {
	let bracket;
	console.log("roundIndex", roundIndex);
	console.log("gameId", gameId);
	console.log("bracketId", bracketId);

	try {
		bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Failed to find bracket.");
		}

		const round = bracket.rounds[roundIndex];

		if (!round) {
			throw new Error("Failed to find round.");
		}
		//find game in round by gameId
		const gameIndex = round.games.findIndex(
			(game) => game._id.toString() === gameId
		);

		if (gameIndex == -1) {
			throw new Error("Failed to find game.");
		}

		let game = round.games[gameIndex];

		// Reset the winner status for player1 and player2 within the game
		if (game.player1) {
			game.player1.winner = null;
		}
		if (game.player2) {
			game.player2.winner = null;
		}

		// Reset the game winner at the game level
		game.winner = null;
		game.status = "pending";

		// Reset the next game player slots
		if (game.nextGameId) {
			const nextGame = bracket.rounds[roundIndex + 1].games.find(
				(g) => g._id.toString() === game.nextGameId.toString()
			);

			if (nextGame) {
				if (
					nextGame.player1 &&
					nextGame.player1._id.toString() === game.winner
				) {
					nextGame.player1 = null;
				} else if (
					nextGame.player2 &&
					nextGame.player2._id.toString() === game.winner
				) {
					nextGame.player2 = null;
				}
			}
		}

		// Save the bracket
		bracket.markModified("rounds");
		await bracket.save();

		return populateRoundsWithPlayers(bracket);
	} catch (error) {
		console.log("error", error);
		throw new Error("Failed to undo outcomes.");
	}
};

clearRounds = async (bracketId) => {
	let bracket = await Bracket.findById(bracketId);
	if (!bracket) {
		return res.status(404).json({ message: "Bracket not found." });
	}

	bracket.rounds = [];
	await bracket.save();
	return bracket;
};

validateBracket = (bracketId) => {
	if (!/^[0-9a-fA-F]{24}$/.test(bracketId)) {
		return false;
	}
	return true;
};

findPlayerInBracket = async ({ name, bracketId }) => {
	//get bracket and player from bracket if exists
	let bracket = await Bracket.findById(bracketId).populate("players");
	if (!bracket) {
		throw new Error("Bracket not found.");
	}

	let player = bracket.players.find((player) => player.name === name);
	if (!player) {
		throw new Error("Player not found in bracket.");
	}

	return player;
};

batchUpdatePlayers = async (bracketId, players) => {
	let bracket = await Bracket.findById(bracketId).populate("players");
	if (!bracket) {
		throw new Error("Bracket not found.");
	}

	// Update players
	players.forEach((player) => {
		let playerToUpdate = bracket.players.find(
			(p) => p._id.toString() === player._id
		);
		if (playerToUpdate) {
			Object.assign(playerToUpdate, player);
		}
	});

	await bracket.save();

	return populateRoundsWithPlayers(bracket);
};

module.exports = {
	generateBracket,
	clearRounds,
	validateBracket,
	removePlayerFromGame,
	updateGameWinner,
	undoOutcomes,
	addPlayerToFirstEmptySpot,
	reGenerateBracket,
	findPlayerInBracket,
	batchUpdatePlayers,
	getFullBracket,
};
