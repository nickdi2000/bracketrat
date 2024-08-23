// src/utils/playerComposite.js

export function findCurrentGame(bracket, playerName) {
  // Iterate through rounds in reverse order
  for (let i = bracket.rounds.length - 1; i >= 0; i--) {
    const round = bracket.rounds[i];
    // Iterate through games in the current round
    for (const game of round.games) {
      // Check if the player is player1 or player2 in the current game
      if (
        (game.player1 && game.player1.name === playerName) ||
        (game.player2 && game.player2.name === playerName)
      ) {
        // Add roundIndex to the game object and return it
        return { ...game, roundIndex: i };
      }
    }
  }
  // If no game is found, return null
  return null;
}

export function findPreviousGame(bracket, playerName) {
  // Iterate through rounds in reverse order
  for (let i = bracket.rounds.length - 1; i >= 0; i--) {
    const round = bracket.rounds[i];
    // Iterate through games in the current round
    for (const game of round.games) {
      // Check if the player is player1 or player2 in the current game
      if (
        (game.player1 && game.player1.name === playerName) ||
        (game.player2 && game.player2.name === playerName)
      ) {
        // Add roundIndex to the game object and return it
        return { ...game, roundIndex: i };
      }
    }
  }
  // If no game is found, return null
  return null;
}

export function findAllMyGames(bracket, playerName) {
  const myGames = [];
  // Iterate through rounds in reverse order
  for (let i = bracket?.rounds?.length - 1; i >= 0; i--) {
    const round = bracket.rounds[i];
    // Iterate through games in the current round
    for (const game of round.games) {
      // Check if the player is player1 or player2 in the current game
      if (
        (game.player1 && game.player1.name === playerName) ||
        (game.player2 && game.player2.name === playerName)
      ) {
        // Add roundIndex to the game object and return it
        myGames.push({ ...game, roundIndex: i });
      }
    }
  }
  // If no game is found, return null
  return myGames;
}
