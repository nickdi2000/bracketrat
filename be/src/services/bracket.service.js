const { Bracket, Organization } = require("../models");
const { Player } = require("../models/player.model");
const { Game } = require("../models");
const mongoose = require("mongoose");

const generateBracket = async (bracketId, useCurrentPlayers = false) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		let players;
		if (useCurrentPlayers) {
			players =
				bracket.rounds[0]?.games
					.flatMap((game) => [game.player1, game.player2])
					.filter((player) => player && player.player) || [];
		} else {
			const organization = await Organization.findById(bracket.organization);
			if (!organization) {
				throw new Error("Organization not found.");
			}
			players = await Player.find({ organization: organization._id });
		}

		// Ensure there are at least 4 players
		while (players.length < 4) {
			players.push(null); // Push null to represent a blank spot
		}

		const totalPlayers = players.length;
		const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalPlayers)));
		const numberOfByes = nextPowerOfTwo - totalPlayers;
		const totalRoundsNeeded = Math.log2(nextPowerOfTwo);

		bracket.rounds = [];

		const initialGames = [];
		const autoAdvancePlayers = [];

		let playersAssigned = 0;
		let byesAssigned = 0;

		while (playersAssigned < totalPlayers) {
			const player1 = players[playersAssigned++];
			let player2 = null;
			let gameStatus = "pending";

			if (byesAssigned < numberOfByes) {
				byesAssigned++;
				gameStatus = "completed";
				if (player1) {
					autoAdvancePlayers.push(player1);
				}
			} else {
				player2 = players[playersAssigned++];
			}

			const newGame = new Game({
				status: gameStatus,
				player1: {
					player: player1 ? player1._id : null,
					name: player1 ? player1.name : "",
					winner: gameStatus === "completed" ? true : null,
					bye: gameStatus === "completed",
				},
				player2: {
					player: player2 ? player2._id : null,
					name: player2 ? player2.name : "",
					winner: null,
				},
				bracketId, // Set the bracketId
			});
			await newGame.save();

			initialGames.push(newGame);
		}

		bracket.rounds.push({ games: initialGames, roundNumber: 1 });

		let nextRoundGames = autoAdvancePlayers;

		for (let roundNumber = 2; roundNumber <= totalRoundsNeeded; roundNumber++) {
			const gamesInThisRound = Math.pow(2, totalRoundsNeeded - roundNumber);
			const games = Array.from({ length: gamesInThisRound }).map((_, index) => {
				const player1 =
					nextRoundGames.length > index * 2 ? nextRoundGames[index * 2] : null;
				const player2 =
					nextRoundGames.length > index * 2 + 1
						? nextRoundGames[index * 2 + 1]
						: null;

				const newGame = new Game({
					status: "pending",
					player1: {
						player: player1 ? player1._id : null,
						name: player1 ? player1.name : "",
						winner: null,
					},
					player2: {
						player: player2 ? player2._id : null,
						name: player2 ? player2.name : "",
						winner: null,
					},
					bracketId, // Set the bracketId
				});
				newGame.save();

				return newGame;
			});

			nextRoundGames = [];
			bracket.rounds.push({ games, roundNumber });
		}

		for (let i = 0; i < bracket.rounds.length - 1; i++) {
			const currentRound = bracket.rounds[i];
			const nextRound = bracket.rounds[i + 1];
			for (let j = 0; j < currentRound.games.length; j++) {
				const currentGame = currentRound.games[j];
				const nextGame = nextRound.games[Math.floor(j / 2)];
				currentGame.nextGameId = nextGame._id;
				await currentGame.save();
			}
		}

		bracket.markModified("rounds");
		await bracket.save();
		return populateRoundsWithPlayers(bracket);
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

		const game = await Game.findById(gameId).populate(
			"player1.player player2.player"
		);
		if (!game) {
			throw new Error("Game not found.");
		}

		console.log(`Game Found: ${JSON.stringify(game, null, 2)}`);

		let winnerAssigned = false;
		let winnerName = "";
		let winnerPlayerId = null;

		if (game.player1 && game.player1._id.toString() === winnerId) {
			game.player1.winner = true;
			if (game.player2) {
				game.player2.winner = false;
			}
			winnerAssigned = true;
			winnerName = game.player1.player.name;
			winnerPlayerId = game.player1.player._id;
		} else if (game.player2 && game.player2._id.toString() === winnerId) {
			game.player2.winner = true;
			if (game.player1) {
				game.player1.winner = false;
			}
			winnerAssigned = true;
			winnerName = game.player2.player.name;
			winnerPlayerId = game.player2.player._id;
		}

		if (!winnerAssigned) {
			throw new Error("Player not found in the game.");
		}

		game.status = "completed";
		game.winner = mongoose.Types.ObjectId(winnerPlayerId); // Set the game winner to the actual player ID

		await game.save();

		console.log(`Game updated with winner. Now finding the next game...`);

		if (game.nextGameId) {
			const nextGame = await Game.findById(game.nextGameId);
			if (nextGame) {
				console.log(`Next game found: ${nextGame._id}`);

				if (!nextGame.player1 || !nextGame.player1.player) {
					nextGame.player1 = {
						player: mongoose.Types.ObjectId(winnerPlayerId),
						name: winnerName,
						winner: null,
						score: 0,
						bye: false,
						createdAt: new Date(),
						updatedAt: new Date(),
					};
					console.log(`Assigned winner to next game player1 slot.`);
				} else if (!nextGame.player2 || !nextGame.player2.player) {
					nextGame.player2 = {
						player: mongoose.Types.ObjectId(winnerPlayerId),
						name: winnerName,
						winner: null,
						score: 0,
						bye: false,
						createdAt: new Date(),
						updatedAt: new Date(),
					};
					console.log(`Assigned winner to next game player2 slot.`);
				} else {
					console.error("Next game slots are already filled.");
					throw new Error("Next game slots are already filled.");
				}

				await nextGame.save();
				console.log(`Winner assigned to next game: ${nextGame._id}`);
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
			populate: {
				path: "playerCount",
			},
		})
		.exec();

	if (!bracket) {
		throw new Error("Bracket not found.");
	}
	return populateRoundsWithPlayers(bracket);
	//return augmentPlayerData(bracket);
};

const populateRoundsWithPlayers = async (bracket) => {
	await bracket
		.populate({
			path: "rounds.games",
			populate: [
				{
					path: "player1.player",
					select: "name",
				},
				{
					path: "player2.player",
					select: "name",
				},
			],
		})
		.execPopulate();

	//convert to object
	bracket = bracket.toObject();

	// Flatten the populated data to the required structure
	bracket.rounds.forEach((round, roundIndex) => {
		round.games.forEach((game) => {
			if (game.player1 && game.player1.player) {
				game.player1.name = game.player1.player.name;
				game.player1.roundIndex = roundIndex;
				delete game.player1.player;
			}
			if (game.player2 && game.player2.player) {
				game.player2.name = game.player2.player.name;
				game.player2.roundIndex = roundIndex;
				delete game.player2.player;
			}
			game.roundIndex = roundIndex; // Add the roundIndex to the game object
		});
	});

	return bracket;
};

//use same players (without pulling in straggler players)
const reGenerateBracket = async (bracketId) => {
	let bracket = await Bracket.findById(bracketId).populate("players");
	if (!bracket) {
		throw new Error("Bracket not found.");
	}

	return await generateBracket(bracketId, true);
};
//so this migh tbe the problem, if the game doesn't exist, it should create a new one and also a blank spot for the second player
const addPlayerToFirstEmptySpot = async (bracketId, playerId) => {
	let bracket = await Bracket.findById(bracketId);
	if (!bracket) {
		throw new Error("Failed to find bracket.");
	}

	const round = bracket.rounds[0];
	const game = round.games.find((game) => !game.player1 || !game.player2);

	if (!game) {
		console.log("No game, creating new one with blank opponent");
		const newGame = {
			player1: {
				_id: playerId,
				winner: null,
				filled: true,
			},
			player2: null,
			status: "pending",
		};
		round.games.push(newGame);
	} else {
		if (!game.player1) {
			game.player1 = {
				_id: playerId,
			};
		} else if (!game.player2) {
			game.player2 = {
				_id: playerId,
			};
		}
	}

	bracket.markModified("rounds");
	await bracket.save();
	return populateRoundsWithPlayers(bracket);
};

const removePlayerFromGame = async (bracketId, playerId, roundIndex) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Failed to find bracket.");
		}

		const removePlayerFromRound = (round, playerId) => {
			let gameUpdated = false;
			round.games.forEach((game) => {
				if (game.player1 && game.player1._id.toString() === playerId) {
					game.player1 = null;
					gameUpdated = true;
				} else if (game.player2 && game.player2._id.toString() === playerId) {
					game.player2 = null;
					gameUpdated = true;
				}
			});
			return gameUpdated;
		};

		let playerFound = false;
		for (let i = roundIndex; i < bracket.rounds.length; i++) {
			const round = bracket.rounds[i];
			const gameUpdated = removePlayerFromRound(round, playerId);
			if (gameUpdated) {
				playerFound = true;
			}
		}

		if (!playerFound) {
			throw new Error(
				"Player not found in any games in or after the specified round."
			);
		}

		//remove outcomes from previous games
		for (let i = 0; i < roundIndex; i++) {
			const round = bracket.rounds[i];
			round.games.forEach((game) => {
				if (game.player1 && game.player1._id.toString() === playerId) {
					game.player1.winner = null;
					game.player2.winner = null;
				}
				if (game.player2 && game.player2._id.toString() === playerId) {
					game.player2.winner = null;
					game.player1.winner = null;
				}
				game.winner = null;
				game.status = "pending";
			});
		}

		bracket.markModified("rounds"); // Necessary because rounds is an array of subdocuments

		await bracket.save();

		return populateRoundsWithPlayers(bracket);
	} catch (error) {
		console.error("error", error);
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
