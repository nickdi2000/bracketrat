import { defineStore } from "pinia";
import api from "@/api";

export const playerAuthStore = defineStore({
  id: "player-auth",
  state: () => ({
    player:
      localStorage.getItem("player") != "undefined"
        ? JSON.parse(localStorage.getItem("player"))
        : null,

    organization: null,
    selected_bracket:
      localStorage.getItem("selected_bracket") != "undefined"
        ? JSON.parse(localStorage.getItem("selected_bracket"))
        : null,
  }),
  actions: {
    setOrganization(organization) {
      this.organization = organization;
    },

    //to make th fetchBracket a promisebased on we could do it like this:
    async fetchBracket(bracket_id) {
      return new Promise((resolve, reject) => {
        if (!bracket_id) {
          console.warn("No bracket bracket_id provided to authStore");
          reject("No bracket bracket_id provided to authStore");
        }
        api
          .get(`/brackets/${bracket_id}`)
          .then(async (rec) => {
            this.setSelectedBracket(rec.data);

            resolve(rec.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async fetchTournament(tournament_id) {
      console.log("fetching tournament");
      return new Promise((resolve, reject) => {
        if (!tournament_id) {
          console.warn("No tournament_id provided to authStore");
          reject("No tournament_id provided to authStore");
        }
        api
          .get(`/tournaments/${tournament_id}`)
          .then(async (rec) => {
            console.log("Fetched from store", rec.data);
            //this.setSelectedBracket(rec.data.bracket);
            resolve(rec.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async getOrg() {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.get("/organizations/me");
          //this.setOrganization(rec.data);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    setPlayer(playerData) {
      this.player = playerData;
      localStorage.setItem("player", JSON.stringify(this.player));
    },

    setPlayers(players) {
      this.players = players;
    },
    setRounds(rounds) {
      this.rounds = rounds;
    },
    patchplayer(partialData) {
      Object.assign(this.player, partialData);
      localStorage.setItem("player", JSON.stringify(this.player));
    },
    setSelectedBracket(bracket) {
      this.selected_bracket = bracket;
      this.players = bracket.players;
      this.rounds = bracket.rounds;

      localStorage.setItem(
        "selected_bracket",
        JSON.stringify(this.selected_bracket)
      );

      //this.setPlayers(bracket.players);
    },
    updateplayer(playerData) {
      localStorage.setItem("player", JSON.stringify(playerData));
    },
    destroy() {
      return new Promise((resolve) => {
        this.player = null;
        localStorage.removeItem("player");
        resolve(true);
      });
    },
  },
  getters: {
    teamPlayer() {
      if (typeof this.selected_bracket !== "string") {
        return "Player";
      }
      const bracket = JSON.parse(this.selected_bracket);
      return bracket.unit == "team" ? "Team" : "Player";
    },
    getBracket() {
      return this.selected_bracket ?? [];
    },
    check() {
      return this.player !== null || localStorage.getItem("player") !== null;
    },
    getplayer() {
      return JSON.parse(localStorage.getItem("player")) || this.player;
    },
  },
});
