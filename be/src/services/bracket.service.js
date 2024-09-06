const { Bracket, Organization, Tournament } = require("../models");
const mongoose = require("mongoose");
const { Player } = require("../models/player.model");
const { Game } = require("../models");
const { populate } = require("../models/token.model");

/* Generate Bracket with all players, or if bracketSize is provided, generate a fixed-size bracket with no players.  if useCurrentPlayers is true, we take the players already in the bracket and rebuild it (to fix blanks/errorenous byes etc) */
const generateBracket = async ({
	tournamentId,
	useCurrentPlayers = false,
	bracketSize = null,
}) => {
	try {
		const tournament = await Tournament.findById(tournamentId);

		if (!tournament) {
			throw new Error("Tournament not found");
		}

		let bracket = await Bracket.findOne({
			tournament: tournamentId,
			type: "single-elimination",
		});

		if (!bracket) {
			console.log("Non found -- Creating new organizaiton");
			bracket = await Bracket.create({
				tournament: tournamentId,
				type: "single-elimination",
				organization: tournament.organization,
			});
		}

		if (!bracket) {
			throw new Error("Bracket not found.");
		}


		console.log("---bracketSize", bracketSize);

		let players = [];
		if (bracketSize) {
			// Fixed bracket size for starting the tournament without initial player data
			players = new Array(bracketSize).fill(null);
			bracket.build_type = "fixed"; // Set the build type to fixed for UI purposes if necessary
		} else if (useCurrentPlayers) {
			bracket = await Bracket.findById(bracket._id).populate({
				path: "rounds.games",
				populate: {
					path: "participants.player",
				},
			});
			// Load current players from existing games (if any)
			players =
				bracket.rounds[0]?.games
					.flatMap((game) =>
						game.participants.map((participant) => participant.player)
					)
					.filter((player) => player) || [];
		} else {
			// Optionally load players based on another criterion, e.g., from an organization
			const tournament = await Tournament.findById(bracket.tournament);
			const organization = await Organization.findById(tournament.organization);
			if (!organization) {
				throw new Error("Organization not found.");
			}
			players = await Player.find({ organization: organization._id });
		}
		const totalPlayers = players.length;
		const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalPlayers || 1)));
		const numberOfGames = nextPowerOfTwo / 2;
		const totalRoundsNeeded = Math.log2(nextPowerOfTwo);

		if (totalRoundsNeeded <= 0 || numberOfGames < 1) {
			/*
			*
			TODO:
			Instead of throwing an error, we should just generate a bracket of size 4, with the players available (even if just one player) 
			*/
		
			throw new Error("Invalid player count to generate a bracket.");
		}

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
				roundNumber: 1,
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
					roundNumber,
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
			currentRoundGames.forEach((roundGames, index) => {
				if (nextRoundGames.length > index / 2) {
					roundGames.nextGameId = nextRoundGames[Math.floor(index / 2)]._id;
					roundGames.save();
				}
			});
		}

		await bracket.save();
		return populateRoundsWithPlayers(bracket); // Assuming this function populates and returns full bracket details
	} catch (error) {
		console.error("Error generating bracket:", error.message);
		throw new Error(error.message);
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
		console.log("after the console:::", game);
		return game;
	} catch (error) {
		console.error("Error updating game winner:", error.message);
		throw new Error("Failed to update game winner.");
	}
};

/*
Update winner for round robin 
*/

const updateGameWinnerRobin = async (gameId, winnerId) => {
	try {
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

		//get bracketId from game so we can return the full bracket
		const bracketId = game.bracketId;

		//augmentRobinRounds
		const bracket = await augmentRobinRounds(bracketId);

		return bracket;
	} catch (error) {
		console.error("Error updating game winner:", error.message);
		throw new Error("Failed to update game winner.");
	}
};

const undoWinner = async ({ gameId, playerId }) => {
	try {
		const game = await Game.findById(gameId).populate("participants.player");
		if (!game) {
			throw new Error("Game not found.");
		}

		// Reset the winner status for player1 and player2 within the game
		game.participants.forEach((participant) => {
			participant.winner = null;
		});

		game.status = "pending";
		game.winner = null;

		// Save the updated game
		await game.save();

		return game;
	} catch (error) {
		console.error("Error undoing outcomes:", error);

		throw new Error("Failed to undo outcomes.");
	}
};

//find round and game in round

/*
 *
 */

//get full bracket, depending on bracket type currently set
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

	if (bracket.type === "round-robin") {
		const augmentedBracket = await augmentRobinRounds(bracketId);
		return augmentedBracket;
	}
	//normal single/double elim bracket style
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
	let tournament = await Tournament.findById(bracket.tournament);
	bracket = bracket.toObject();
	if (tournament) {
		bracket.name = tournament.name || "";
		bracket.code = tournament.code || "";
	}
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
const reGenerateBracket = async (tournamentId) => {
	return await generateBracket({ tournamentId: tournamentId, useCurrentPlayers: true });
};

const addPlayerToFirstEmptySpot = async (bracketId, playerId) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			console.error("NO bracket found");
			throw new Error("Failed to find bracket.");
		}
		let firstRoundGames;
		if (bracket.rounds?.length && bracket.rounds[0]?.games) {
			// Get the first round games
			firstRoundGames = await Game.find({
				_id: { $in: bracket.rounds[0].games },
			});
		} else {
			return;
		}

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

		game.participants.forEach((e) => {
			e.winner = null;
		});

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

//module.exports = { undoOutcomes };

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
	try {
		let bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			return res.status(404).json({ message: "Bracket not found." });
		}
		bracket.rounds = [];
		await bracket.save();
		return bracket;
	} catch (error) {
		console.error("Error deleting bracket:", error);
		return res
			.status(500)
			.json({ message: "An error occurred while deleting the bracket." });
	}
};

validateBracket = (bracketId) => {
	if (!/^[0-9a-fA-F]{24}$/.test(bracketId)) {
		return false;
	}
	return true;
};

findPlayerInBracket = async ({ name, bracketId }) => {
	//get bracket and player from bracket if exists
	let bracket = await Bracket.findById(bracketId).populate({
		path: "rounds.games",
		populate: {
			path: "participants.player",
			select: "name",
		},
	});

	if (!bracket) {
		throw new Error("Bracket not found.");
	}

	let foundPlayer = null;
	for (const round of bracket.rounds) {
		for (const game of round.games) {
			for (const participant of game.participants) {
				if (participant.player && participant.player.name === name) {
					foundPlayer = participant.player;
					break;
				}
			}
			if (foundPlayer) break;
		}
		if (foundPlayer) break;
	}
	if (!foundPlayer) {
		throw new Error("Player not found in bracket.");
	}

	return {
		player: {
			...foundPlayer.toObject(),
			bracketId: bracket._id,
			organizationId: bracket.organization,
		},
		bracket,
	};
};

async function batchUpdatePlayers({ players }) {
	try {
		// Construct the bulk update operations
		const operations = players.map((player) => ({
			updateOne: {
				filter: { _id: player._id },
				update: { $set: player },
			},
		}));

		// Perform the bulk operation
		await Player.bulkWrite(operations);

		// Fetch and populate the updated players
		const updatedPlayerIds = players.map((player) => player._id);
		const updatedPlayers = await Player.find({
			_id: { $in: updatedPlayerIds },
		}).populate("brackets"); // Assuming 'brackets' needs to be populated

		return updatedPlayers;
	} catch (error) {
		console.error("Failed to batch update players:", error);
		throw error; // Or handle this more gracefully
	}
}

/* ROUND ROBIN FUNCTIONS */

generateRobinBracket = async ({ tournamentId }) => {
	try {
		console.log("tournamentId::", tournamentId);
		const tournament = await Tournament.findById(tournamentId).populate(
			"organization"
		);
		console.log("tournamnet::", tournament);
		if (!tournament) {
			throw new Error("Tournament not found.");
		}

		// Check if a round-robin bracket already exists for this tournament
		let bracket = await Bracket.findOne({
			tournament: tournamentId,
			type: "round-robin",
		}).populate("players");

		// If the bracket doesn't exist, create it
		if (!bracket) {
			bracket = await Bracket.create({
				name: `Round Robin Bracket`,
				tournament: tournamentId,
				type: "round-robin",
				organization: tournament.organization.id,
			});
		}
		const organization = await Organization.findById(bracket.organization);
		const players = await Player.find({ organization: organization._id });

		let totalPlayers = players.length;

		if (totalPlayers < 2) {
			throw new Error("Not enough players to generate a round-robin bracket.");
		}

		// If odd number of players, add a 'bye' player
		const hasBye = totalPlayers % 2 !== 0;
		if (hasBye) {
			players.push({ _id: null }); // Adding a null player to represent the "bye"
			totalPlayers += 1;
		}

		const totalRounds = totalPlayers - 1;
		const totalGamesPerRound = totalPlayers / 2;

		console.log(`player size ${totalPlayers}`);

		bracket.rounds = [];
		let allGames = [];
		// Generate rounds
		for (let round = 0; round < totalRounds; round++) {
			const roundGames = [];

			for (let i = 0; i < totalGamesPerRound; i++) {
				const home = players[i];
				const away = players[totalPlayers - i - 1];

				const game = new Game({
					bracketId: bracket._id,
					participants: [
						{
							player: home._id,
							bye: !home._id, // True if home is a "bye" player
						},
						{
							player: away._id,
							bye: !away._id, // True if away is a "bye" player
						},
					],
					status: "pending",
					roundNumber: round + 1,
					nextGameId: null,
				});
				await game.save();
				roundGames.push(game);
			}

			bracket.rounds.push({
				games: roundGames.map((game) => game._id),
				roundNumber: round + 1,
			});

			allGames.push(...roundGames);

			// Rotate players (except the first one)
			players.splice(1, 0, players.pop());
		}

		// Save the bracket with the updated rounds
		await bracket.save();

		return augmentRobinRounds(bracket._id);
	} catch (error) {
		console.error("Error generating robin bracket:", error.message);
		throw new Error(error.message);
	}
};

showRobin = async (bracketId) => {
	try {
		const bracket = await augmentRobinRounds(bracketId);
		return bracket;
	} catch (error) {
		console.error("Error showing robin bracket:", error.message);
		throw new Error(error.message);
	}
};

async function augmentRobinRounds(bracketId) {
	// Populate the bracket with player names
	let bracket = await Bracket.findById(bracketId)
		.populate({
			path: "rounds.games",
			model: "Game", // Ensure this is the correct model name for your games
			populate: {
				path: "participants",
				model: "Player", // Ensure this is the correct model name for your players
				populate: {
					path: "player",
					model: "Player", // Ensure this is the correct model name for your players
				},
			},
		})
		.exec();
	const tournament = await Tournament.findById(bracket.tournament);
	//sort by BYES last
	bracket.rounds.forEach((round) => {
		round.games.sort((a, b) => {
			const aNulls = a.participants.filter((p) => !p.player);
			const bNulls = b.participants.filter((p) => !p.player);
			return aNulls.length - bNulls.length;
		});
	});
	bracket = bracket.toObject();
	bracket.name = tournament.name;
	bracket.code = tournament.code;
	return bracket;
}

const unsetPlayerAsWinner = async ({ bracketId, playerId, roundIndex }) => {

	const bracket = await Bracket.findById(bracketId)
		.populate({
			path: 'rounds.games',
			model: 'Game',
		})
		.exec();

	if (!bracket) {
		throw new Error('Bracket not found');
	}

	const previousRoundIndex = roundIndex - 1;

	if (previousRoundIndex < 0) {
		throw new Error('No previous round exists');
	}

	const previousRound = bracket.rounds[previousRoundIndex];
	const gameIds = previousRound.games.map(game => game._id);
	const result = await Game.updateMany(
		{ _id: { $in: gameIds }, 'participants.player': playerId },
		{ $set: { 'participants.$[].winner': null } }
	);
}

module.exports = {
	generateBracket,
	generateRobinBracket,
	augmentRobinRounds,
	clearRounds,
	showRobin,
	validateBracket,
	removePlayerFromGame,
	updateGameWinner,
	updateGameWinnerRobin,
	undoWinner,
	undoOutcomes,
	addPlayerToFirstEmptySpot,
	reGenerateBracket,
	findPlayerInBracket,
	batchUpdatePlayers,
	getFullBracket,
	unsetPlayerAsWinner,
};
