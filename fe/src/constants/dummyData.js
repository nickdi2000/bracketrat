export const dummyRounds = [
  {
    games: [
      {
        status: "pending",
        _id: "65f78ccccad9307095f79766",
        player1: {
          id: "65f468a5ee5d26f3ea61b6d7",
          name: "james",
        },
        player2: {
          id: "65f49060ee5d26f3ea61b711",
          name: "Derek",
        },
        state: "pending2",
        misc: "test",
      },
      {
        status: "pending",
        _id: "65f78ccccad9307095f79767",
        player1: {
          id: "65f4b2f7968d703a54d43536",
          name: "jaeff",
        },
        player2: {
          id: "65f4b32a968d703a54d4353d",
          name: "Gabriel Lossane",
        },
        state: "pending2",
        misc: "test",
      },
    ],
    roundNumber: 1,
    id: "65f78ccccad9307095f79765",
  },
  {
    games: [
      {
        status: "pending",
        _id: "65f78ccccad9307095f79769",
        player1: {
          id: "65f4b2f7968d703a54d43536",
          name: "jaeff",
        },
        player2: {
          id: "65f4b32a968d703a54d4353d",
          name: "Gabriel Lossane",
        },
        state: "pending2",
        misc: "test",
      },
    ],
    roundNumber: 2,
    id: "65f78ccccad9307095f79768",
  },
];

export const dummyRounds__ = [
  //first round
  {
    games: [
      {
        player1: { id: "1", name: "John Smith", winner: true },
        player2: { id: "11", name: "Dale Gribble", winner: false },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: true },
        player2: { id: "12", name: "Amy Royal", winner: false },
      },
      {
        player1: { id: "101", name: "Harriet Garamond", winner: true },
        player2: { id: "102", name: "Damien Royal", winner: false },
      },
      {
        player1: { id: "103", name: "Malonen Garamond", winner: true },
        player2: { id: "104", name: "Marriot Royal", winner: false },
      },
    ],
  },
  {
    games: [
      {
        played: false,
        player1: { idd: "10", name: "", winner: null },
        player2: { idd: "13", name: "", winner: null },
      },
      {
        played: false,
        player1: { idd: "102", name: "Damien Royal", winner: true },
        player2: { idd: "14", name: "Garriete Royal", winner: false },
      },
    ],
  },
  {
    games: [
      {
        played: false,
        player1: { id: "101", name: "", winner: null },
        player2: { id: "5", name: "Damien Royal", winner: null },
      },
    ],
  },
];

export const dummyRounds_ = [
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
