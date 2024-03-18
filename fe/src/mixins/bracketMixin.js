//i found out that my vue component requires all levels of the hiearchy, so we need to modify this mixin to add 'blank' games to the bracket if they are missing with placeholder data (blank name and null id)
export const bracketMixin = {
  methods: {
    _transformBracketData(bracket) {
      let transformedBracket = JSON.parse(JSON.stringify(bracket));

      transformedBracket.rounds.forEach((round) => {
        round.games.forEach((game) => {
          // Since player1 and player2 are IDs, directly use them to find the player
          const player1 = bracket.players.find(
            (player) => player._id.toString() === game.player1.toString()
          );
          const player2 = bracket.players.find(
            (player) => player._id.toString() === game.player2?.toString()
          ); // player2 could be null for byes

          // Assign the transformed player1 object, or default if not found
          game.player1 = player1
            ? {
                id: game.player1.toString(),
                name: player1.name || "Unknown Player",
              }
            : { id: null, name: "Bye" };

          // Do the same for player2, if present
          game.player2 = player2
            ? {
                id: game.player2.toString(),
                name: player2.name || "Unknown Player",
              }
            : null; // Keep as null or provide a placeholder for byes as needed

          // Handle the winner similarly, checking if winner data is present
          if (game.winner) {
            const winner = bracket.players.find(
              (player) => player.toString() === game.winner.toString()
            );
            game.winner = winner
              ? { id: game.winner.toString(), name: winner.name }
              : { id: game.winner.toString(), name: "Unknown Player" };
          }
        });
      });

      return transformedBracket;
    },
    addBlankRounds(bracket) {
      let transformedBracket = JSON.parse(JSON.stringify(bracket));
      let roundCount = transformedBracket.rounds.length;
      let maxRound = Math.max(
        ...transformedBracket.rounds.map((round) => round.round)
      );
      let minRound = Math.min(
        ...transformedBracket.rounds.map((round) => round.round)
      );
      let newRounds = [];
      for (let i = minRound; i < maxRound; i++) {
        let round = transformedBracket.rounds.find(
          (round) => round.round === i
        );
        if (!round) {
          let newRound = {
            round: i,
            games: [],
          };
          newRounds.push(newRound);
        }
      }
      transformedBracket.rounds = [...transformedBracket.rounds, ...newRounds];
      return transformedBracket;
    },
  },
};
