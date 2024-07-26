const { Bracket, Organization } = require("../models");
const { Player } = require("../models/player.model");
const { Game } = require("../models");
const mongoose = require("mongoose");

const generateBracket = async (bracketId, useCurrentPlayers = false) => {
	try {
		const bracket = await Bracket.findById(bracketId).populate("organization");
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
			const organization = bracket.organization;
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
					player1.filled = true;
					autoAdvancePlayers.push(player1);
				}
			} else {
				player2 = players[playersAssigned++];
			}

			const game = new Game({
				status: gameStatus,
				player1: {
					player: player1 ? player1._id : null,
					name: player1 ? player1.name : "",
					winner: null, //gameStatus === "completed",
					bye: gameStatus === "completed",
					filled: true,
				},
				player2: {
					player: player2 ? player2._id : null,
					name: player2 ? player2.name : "",
					winner: null, //false,
					filled: !!player2,
				},
			});

			await game.save();
			initialGames.push(game._id);
		}

		bracket.rounds.push({ games: initialGames, roundNumber: 1 });

		let nextRoundGames = autoAdvancePlayers;

		for (let roundNumber = 2; roundNumber <= totalRoundsNeeded; roundNumber++) {
			const gamesInThisRound = Math.pow(2, totalRoundsNeeded - roundNumber);
			const games = [];

			for (let index = 0; index < gamesInThisRound; index++) {
				const player1 =
					nextRoundGames.length > index * 2 ? nextRoundGames[index * 2] : null;
				const player2 =
					nextRoundGames.length > index * 2 + 1
						? nextRoundGames[index * 2 + 1]
						: null;

				const game = new Game({
					status: "pending",
					player1: {
						player: player1 ? player1._id : null,
						name: player1 ? player1.name : "",
						winner: false,
						filled: !!player1,
					},
					player2: {
						player: player2 ? player2._id : null,
						name: player2 ? player2.name : "",
						winner: false,
						filled: !!player2,
					},
				});

				await game.save();
				games.push(game._id);
			}

			nextRoundGames = [];
			bracket.rounds.push({ games, roundNumber });
		}

		for (let i = 0; i < bracket.rounds.length - 1; i++) {
			for (let j = 0; j < bracket.rounds[i].games.length; j++) {
				const gameId = bracket.rounds[i].games[j];
				const nextGameId = bracket.rounds[i + 1].games[Math.floor(j / 2)];
				const game = await Game.findById(gameId);
				if (game) {
					game.nextGameId = nextGameId;
					await game.save();
				}
			}
		}

		await bracket.save();
		return populateRoundsWithPlayers(bracket);
	} catch (error) {
		console.error("Error generating bracket:", error);
		throw new Error("Failed to generate bracket.");
	}
};

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

const addPlayerToBracket = async ({ name, bracketId }) => {
	return [];
	try {
		const bracket = await Bracket.findById(bracketId).populate("players");
		if (!bracket) {
			throw new Error("Bracket not found");
		}

		const playerExists = bracket.players.some((player) => player.name === name);
		if (playerExists) {
			throw new Error(
				"Player with this name already exists in the bracket. Please choose a different name or add an initial/last-name"
			);
		}

		const newPlayer = await Player.create({ name });
		newPlayer.brackets.push(bracketId);

		let updatedBracket = await Bracket.findById(bracketId).populate("players");

		updatedBracket.players.push(newPlayer);
		await updatedBracket.save();

		if (updatedBracket.auto_bracket) {
			updatedBracket = await generateBracket(bracketId, true);
		}

		let augmentedBracket = populateRoundsWithPlayers(updatedBracket);

		return {
			message: "Player added successfully",
			newPlayer,
			//players: updatedBracket.players,
			bracket: augmentedBracket,
		};
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		throw new Error(error);
	}
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

undoOutcomes = async (bracketId, roundIndex, gameId) => {
	let bracket;
	console.log("roundIndex", roundIndex);
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

// Helper method to replace player IDs with player objects ( so we can easily display player names in the UI)
/*
augmentPlayerData = async (bracketOriginal) => {
	const bracket = JSON.parse(JSON.stringify(bracketOriginal)); // Deep clone
	let players;

	const organization = await Organization.findById(bracket.organization);
	if (!organization) {
		throw new Error("Organization not found.");
	}
	players = await Player.find({ organization: organization._id });

	const playerObjectsById = players.reduce((acc, player) => {
		acc[player._id] = player;
		return acc;
	}, {});

	bracket.rounds.forEach((round, roundIndex) => {
		round.games.forEach((game) => {
			if (game.player1) {
				const player1 = playerObjectsById[game.player1._id] || {
					id: game.player1._id,
					name: game.player1.name || "",
				};
				game.player1 = { ...game.player1, ...player1 };
			} else {
				game.player1 = {
					id: 1,
					name: "",
				};
			}

			if (game.player2) {
				const player2 = playerObjectsById[game.player2._id] || {
					id: game.player2._id,
					name: game.player2.name || "",
				};
				game.player2 = { ...game.player2, ...player2 };
			} else {
				game.player2 = {
					id: 2,
					name: "",
				};
			}

			//add gameId for frontend to use
			game.player1.gameId = game._id;
			game.player2.gameId = game._id;

			game.player1.roundIndex = roundIndex;
			game.player2.roundIndex = roundIndex;

			game.player1.hasBye = game.player2.name || roundIndex ? false : true;
			game.player2.hasBye = game.player1.name || roundIndex ? false : true;

			game.player1.filled = game.player1.name ? true : false;
			game.player2.filled = game.player2.name ? true : false;
		});
	});

	if (!bracket.rounds?.length || !bracket.rounds[0]?.games?.length) {
		return bracket;
	}

	const playerIdsInFirstRound = bracket.rounds[0].games.reduce((acc, game) => {
		if (game.player1) {
			acc.push(game.player1._id);
		}
		if (game.player2) {
			acc.push(game.player2._id);
		}
		return acc;
	}, []);

	bracket.players.map((player) => {
		if (playerIdsInFirstRound.includes(player._id)) {
			player.status = "In-Bracket";
		}
	});

	//and last but not least, sort the players by createdAt date
	bracket.players.sort((a, b) => {
		const dateA = new Date(a.createdAt);
		const dateB = new Date(b.createdAt);
		return dateB - dateA;
	});

	return bracket;
};
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

		// Update the winner status for player1 and player2 within the game
		if (
			game.player1 &&
			game.player1._id &&
			game.player1._id.toString() === winnerId
		) {
			game.player1.winner = true;
			if (game.player2) {
				game.player2.winner = false;
			}
		} else if (
			game.player2 &&
			game.player2._id &&
			game.player2._id.toString() === winnerId
		) {
			game.player2.winner = true;
			if (game.player1) {
				game.player1.winner = false;
			}
		} else {
			throw new Error("Player not found in the game.");
		}

		game.status = "completed";
		game.winner = winnerId; // Set the game winner at the game level

		if (game.nextGameId) {
			const nextGame = await Game.findById(game.nextGameId);
			if (nextGame) {
				// Assign the winner to the next available slot in the next game
				if (!nextGame.player1?.filled) {
					nextGame.player1 = {
						player: mongoose.Types.ObjectId(winnerId),
						winner: null,
						filled: true,
					};
				} else if (!nextGame.player2?.filled) {
					nextGame.player2 = {
						player: mongoose.Types.ObjectId(winnerId),
						winner: null,
						filled: true,
					};
				}
				await nextGame.save();
			}
		}

		await game.save();
		return game;
	} catch (error) {
		console.error("Error updating game winner:", error.message);
		throw new Error("Failed to update game winner.");
	}
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
	addPlayerToBracket,
	reGenerateBracket,
	findPlayerInBracket,
	batchUpdatePlayers,
	getFullBracket,
};
