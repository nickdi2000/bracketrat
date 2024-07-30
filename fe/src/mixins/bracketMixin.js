//i found out that my vue component requires all levels of the hiearchy, so we need to modify this mixin to add 'blank' games to the bracket if they are missing with placeholder data (blank name and null id)
export const bracketMixin = {
  methods: {
    _findGameByPlayer(playerId) {
      let foundGame = null;
      // Iterate through each round
      this.rounds.forEach((round) => {
        // Within each round, iterate through each game
        round.games.forEach((game) => {
          // Check both player1 and player2 for a match with the playerId
          if (
            (game.player1 && game.player1._id === playerId) ||
            (game.player2 && game.player2._id === playerId)
          ) {
            foundGame = game; // Update foundGame each time the player is found
          }
        });
      });

      return foundGame; // Returns the last found game involving the player or null if not found
    },

    _findGameByGameId(gameId) {
      let foundGame = null;

      // Iterate through each round
      this.rounds.forEach((round) => {
        // Within each round, iterate through each game
        round.games.forEach((game) => {
          // Check both player1 and player2 for a match with the playerId
          if (game._id === gameId) {
            foundGame = game; // Update foundGame each time the player is found
          }
        });
      });

      return foundGame; // Returns the last found game involving the player or null if not found
    },
    _findRoundIndexByGame(gameId) {
      console.log("gameId", gameId);
      return this.rounds.findIndex((round) => {
        return round.games.some((game) => {
          return game._id === gameId;
        });
      });
    },
  },
};
