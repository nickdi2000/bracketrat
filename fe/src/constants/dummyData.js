export const dummyRounds = [
  //first round
  {
    games: [
      {
        player1: { id: "1", name: "John Smith", winner: true },
        player2: { id: "11", name: "Dale Jones", winner: false },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: true },
        player2: { id: "12", name: "Amy Royal", winner: false },
      },
      {
        player1: { id: "1", name: "John Smith", winner: true },
        player2: { id: "13", name: "Stephen Jones", winner: false },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: true },
        player2: { id: "14", name: "Garriete Royal", winner: false },
      },
    ],
  },
  // Semi finals
  {
    games: [
      {
        player1: { id: null, name: "John Smith", winner: false },
        player2: { id: null, name: "Gary Jones", winner: true },
      },
      {
        player1: { id: null, name: "Jane Garamond", winner: false },
        player2: { id: null, name: "Danny Royal", winner: true },
      },
    ],
  },
  // Final
  {
    games: [
      {
        player1: { id: "4", name: "Gary Jones", winner: false },
        player2: { id: "8", name: "Danny Royal", winner: true },
      },
    ],
  },
];
