const initializePlayerStats = (player) => {
  return {
    playerId: player._id.toString(),
    playerName: player.name,
    wins: 0,
    losses: 0,
    played: 0,
    remaining: 0,
    score: 0,
  };
}

const updatePlayerStats = (participant, stats, gameStatus, isUpdateStat) => {
  if (!participant.player) return;

  const playerId = participant.player._id.toString();
  if (!stats[playerId]) {
    stats[playerId] = initializePlayerStats(participant.player);
  }


  stats[playerId].played += 1;
  stats[playerId].score += participant.score;

  if (gameStatus !== "pending") {
    if (participant.winner) {
      stats[playerId].wins += 1;
    } else {
      stats[playerId].losses += 1;
    }
  }
}

const calculateTotalGames = (bracket) => {
  let totalGames = 0;
  bracket.rounds.forEach(round => {
    round.games.forEach(() => {
      totalGames++;
    });
  });
  return totalGames;
}

const countPlayerGames = (bracket) => {
  const playerGamesPlayed = {};
  const playerRemainingGames = {};

  bracket.rounds.forEach(round => {
    round.games.forEach(game => {
      const isGameCompleted = game.status === 'completed';

      game.participants.forEach(participant => {
        if (participant.player) {
          const playerId = participant.player._id.toString();

          if (!playerGamesPlayed[playerId]) {
            playerGamesPlayed[playerId] = 0;
          }
          if (!playerRemainingGames[playerId]) {
            playerRemainingGames[playerId] = 0;
          }

          if (isGameCompleted) {
            playerGamesPlayed[playerId]++;
          } else {
            playerRemainingGames[playerId]++;
          }
        }
      });
    });
  });

  return { playerGamesPlayed, playerRemainingGames };
}

const findPlayerWithMaxPoints = (bracket, tiedPlayers) => {
  let maxTotalPoints = 0;
  let winner = null;
  tiedPlayers.forEach(player => {
    let totalPoints = 0;

    bracket.rounds.forEach(round => {
      round.games.forEach(game => {
        game.participants.forEach(participant => {
          if (participant.player && participant.player._id.toString() === player.playerId) {
            totalPoints += participant.score || 0;
          }
        });
      });
    });

    if (totalPoints > maxTotalPoints) {
      maxTotalPoints = totalPoints;
      winner = player;
    }
  });

  return winner;
};

const findHeadToHeadWinner = (bracket, tiedPlayers) => {
  let winner = null;
  let playerId;
  for (const game of bracket.rounds.flatMap(round => round.games)) {
    const playerWins = {};

    game.participants.forEach(participant => {
      if (participant.player && tiedPlayers.some(p => p.playerId === participant.player._id.toString())) {
        playerId = participant.player._id.toString();
        if (!playerWins[playerId]) {
          playerWins[playerId] = 0;
        }
        if (participant.winner) {
          playerWins[playerId]++;
        }
      }
    });


    if (Object.keys(playerWins).length === tiedPlayers.length) {
      let maxHeadToHeadWins = 0;
      tiedPlayers.forEach(player => {
        if (playerWins[playerId] > maxHeadToHeadWins) {
          maxHeadToHeadWins = playerWins[player.playerId];
          winner = player;
        }
      });
      if (winner) break;
    }
  }

  return winner;
}

const hasTieInWinCounts = (participantStats) => {
  const winCounts = {};

  for (const p of Object.values(participantStats)) {
    winCounts[p.wins] = (winCounts[p.wins] || 0) + 1;
    if (winCounts[p.wins] > 1) {
      return true;
    }
  }
  return false;
};

module.exports = {
  countPlayerGames,
  calculateTotalGames,
  updatePlayerStats,
  initializePlayerStats,
  findPlayerWithMaxPoints,
  findHeadToHeadWinner,
  hasTieInWinCounts,
}