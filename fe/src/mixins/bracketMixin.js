//i found out that my vue component requires all levels of the hiearchy, so we need to modify this mixin to add 'blank' games to the bracket if they are missing with placeholder data (blank name and null id)
export const bracketMixin = {
  methods: {
    _findGameByPlayer(playerId) {
      let foundGame = null;

      // Iterate through each round
      this.rounds.some((round) => {
        // Within each round, iterate through each game
        return round.games.some((game) => {
          // Check both player1 and player2 for a match with the playerId
          if (
            (game.player1 && game.player1.id === playerId) ||
            (game.player2 && game.player2.id === playerId)
          ) {
            foundGame = game; // If found, store the game object
            return true; // Stop searching
          }
          return false; // Continue searching
        });
      });

      return foundGame; // Returns the found game or null if not found
    },
  },
};
