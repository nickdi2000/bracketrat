export const findPlayerInBracketRounds = (rounds, playerName) => {
  for (const round of rounds) {
    for (const game of round.games) {
      // Check player1 and player2 in each game
      if (game.player1 && game.player1.name === playerName) {
        return game.player1; // Return player1 if found
      }
      if (game.player2 && game.player2.name === playerName) {
        return game.player2; // Return player2 if found
      }
    }
  }
  return null; // Return null if player is not found
};