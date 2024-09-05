const sampleHosts = [
  {
    name: "Bens Beer League",
    sport: "Baseball",
    level: "Amateur",
    active_players: 12,
    site_label: "Jalapeno Trivia Facebook Page",
    description:
      "All skill levels welcome.  We usually play at Glen Park on Sundays.",
    day: "Sunday",
    interval: "monthly",
    time: "1:00 PM",
    position: {
      lat: 42.89055007644136,
      lng: -78.84264458362281,
    },
  },
  {
    name: "Golden Racketball Club",
    sport: "Racketball",
    level: "Intermediate",
    active_players: 8,
    site_label: "Golden Racketball Club Site",
    description:
      "We play at the Golden Racketball Club on Tuesdays and Thursdays.",
    day: "Tuesday",
    interval: "weekly",
    time: "6:00 PM",
    position: {
      lat: 38.99162018934174,
      lng: -77.07311252765327,
    },
  },
  {
    name: "Pickleball Sundays",
    sport: "Pickleball",
    level: "Beginner/Social",
    active_players: 6,
    site_label: "Pickleball Sundays Site",
    description:
      "We play in jims tennis court (if its free) on Sundays (if the weather is nice). EMail us to join.",
    day: "Sunday",
    interval: "weekly",
    time: "10:00 AM",
    position: {
      lat: 43.684143499829055,
      lng: -79.33410575992983,
    },
  },
  {
    name: "The Golden Tee Club",
    sport: "Golf",
    level: "Intermediate",
    active_players: 4,
    site_label: "Golden Tee Club Site",
    description: "We play at the Golden Tee Club on Wednesdays and Fridays.",
    day: "Wednesday",
    interval: "weekly",
    time: "6:00 PM",
    // florida coordinates
    position: {
      lat: 27.994402,
      lng: -81.760254,
    },
  },
];

export default {
  sampleHosts,
};
