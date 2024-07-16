const { Bracket } = require("../models");
const { Player } = require("../models/player.model");

const generateBracket = async (bracketId, useCurrentPlayers = false) => {
	try {
		const bracket = await Bracket.findById(bracketId).populate("players");
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		let players;
		if (useCurrentPlayers) {
			players =
				bracket.rounds[0]?.games
					.flatMap((game) => [game.player1, game.player2])
					.filter(Boolean) || [];
		} else {
			players = bracket.players;
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
				player1.filled = true;
				autoAdvancePlayers.push(player1);
			} else {
				player2 = players[playersAssigned++];
			}

			initialGames.push({
				status: gameStatus,
				player1: {
					...player1,
					winner: gameStatus === "completed",
					bye: gameStatus === "completed",
					filled: true,
				},
				player2: player2 ? { ...player2, winner: false, filled: true } : null,
			});
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

				return {
					status: "pending",
					player1: player1 ? { ...player1, winner: false, filled: true } : null,
					player2: player2 ? { ...player2, winner: false, filled: true } : null,
				};
			});

			nextRoundGames = [];
			bracket.rounds.push({ games, roundNumber });
		}

		for (let i = 0; i < bracket.rounds.length; i++) {
			for (let j = 0; j < bracket.rounds[i].games.length; j++) {
				if (i < bracket.rounds.length - 1) {
					bracket.rounds[i].games[j].nextGameId =
						bracket.rounds[i + 1].games[Math.floor(j / 2)]._id;
				}
			}
		}

		bracket.markModified("rounds");
		await bracket.save();
		const augmentedBracket = augmentPlayerData(bracket);
		return augmentedBracket;
	} catch (error) {
		console.error("Error generating bracket:", error);
		throw new Error("Failed to generate bracket.");
	}
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
	return augmentPlayerData(bracket);
};

const addPlayerToBracket = async ({ name, bracketId }) => {
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

		const updatedBracket = await Bracket.findById(bracketId).populate(
			"players"
		);

		updatedBracket.players.push(newPlayer);
		await updatedBracket.save();

		const regeneratedBracket = await generateBracket(bracketId);

		//let augmentedBracket = augmentPlayerData(updatedBracket);

		return {
			message: "Player added successfully",
			newPlayer,
			players: regeneratedBracket.players,
		};
	} catch (error) {
		console.error("Error adding player to bracket:", error);
		throw new Error("Error adding player to bracket");
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

		bracket.markModified("rounds"); // Necessary because rounds is an array of subdocuments

		await bracket.save();

		return augmentPlayerData(bracket);
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

		return augmentPlayerData(bracket);
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
augmentPlayerData = (bracketOriginal) => {
	const bracket = JSON.parse(JSON.stringify(bracketOriginal)); // Deep clone
	const playerObjectsById = bracket.players.reduce((acc, player) => {
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

const updateGameWinner = async (bracketId, winnerId, roundIndex) => {
	try {
		const bracket = await Bracket.findById(bracketId);
		if (!bracket) {
			throw new Error("Bracket not found.");
		}

		const round = bracket.rounds[roundIndex];
		if (!round) {
			throw new Error("Failed to find round.");
		}

		// Find the game where the winnerId matches either player1 or player2
		const game = round.games.find(
			(game) =>
				(game.player1 && game.player1._id.toString() === winnerId) ||
				(game.player2 && game.player2._id.toString() === winnerId)
		);

		if (!game) {
			throw new Error("Failed to find game for the player.");
		}

		// Update the winner status for player1 and player2 within the game
		if (game.player1 && game.player1._id.toString() === winnerId) {
			game.player1.winner = true;
			if (game.player2) {
				game.player2.winner = false;
			}
		} else if (game.player2 && game.player2._id.toString() === winnerId) {
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
			const nextRound = bracket.rounds[roundIndex + 1];
			if (nextRound) {
				const nextGame = nextRound.games.find(
					(g) => g._id.toString() === game.nextGameId.toString()
				);

				if (nextGame) {
					// Assign the winner to the next available slot in the next game
					if (!nextGame.player1?.filled) {
						nextGame.player1 = {
							_id: winnerId,
							winner: null,
							filled: true,
						};
					} else if (!nextGame.player2?.filled) {
						nextGame.player2 = {
							_id: winnerId,
							winner: null,
							filled: true,
						};
					}
					// Mark the bracket as modified
					bracket.markModified("rounds");
				}
			}
		}

		await bracket.save();
		return augmentPlayerData(bracket);
	} catch (error) {
		console.error("Error:", error.message);
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

module.exports = {
	generateBracket,
	clearRounds,
	validateBracket,
	augmentPlayerData,
	removePlayerFromGame,
	updateGameWinner,
	undoOutcomes,
	addPlayerToFirstEmptySpot,
	addPlayerToBracket,
	reGenerateBracket,
	findPlayerInBracket,
};
