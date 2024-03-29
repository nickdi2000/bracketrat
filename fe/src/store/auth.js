import { defineStore } from "pinia";
import api from "@/api";

export const authStore = defineStore({
  id: "auth",
  state: () => ({
    user:
      localStorage.getItem("user") != "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    tokens: localStorage.getItem("token")
      ? { access: { token: localStorage.getItem("token") } }
      : null,
    utm_source: null,
    players: [],
    rounds: [],
    selected_bracket: localStorage.getItem("selected_bracket") || null,
  }),
  actions: {
    setUTMSource(utm_source) {
      this.utm_source = utm_source;
    },
    //non promise based
    async _fetchBracket(bracket_id) {
      if (!bracket_id) {
        console.warn("No bracket bracket_id provided to authStore");
        return;
      }
      const rec = await api.get(`/brackets/${bracket_id}`);
      //console.log("rounds are", rec);

      this.setPlayers(rec.data.players);
      this.setRounds(rec.data.rounds);
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
          .then((rec) => {
            this.setPlayers(rec.data.players);
            this.setRounds(rec.data.rounds);
            resolve(rec);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async clearBracket(bracketId) {
      return new Promise((resolve, reject) => {
        try {
          const rec = api.post(`brackets/${bracketId}/clear`);
          console.log("rec cleared");
          this.setRounds([]);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },
    setUser(userData) {
      if (!userData.data.user) {
        return;
      }
      this.user = userData.data.user;
      this.tokens = userData.data.tokens;
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.tokens.access.token);
    },
    setPlayers(players) {
      this.players = players;
    },
    setRounds(rounds) {
      this.rounds = rounds;
    },
    patchUser(partialData) {
      Object.assign(this.user, partialData);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setSelectedBracket(bracket) {
      this.selected_bracket = {
        name: bracket.name,
        _id: bracket._id,
        organization: bracket.organization,
        sport: bracket.sport,
        type: bracket.type,
        unit: bracket.unit,
      };

      localStorage.setItem(
        "selected_bracket",
        JSON.stringify(this.selected_bracket)
      );

      this.setPlayers(bracket.players);
    },
    updateUser(userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    },
    destroy() {
      return new Promise((resolve) => {
        this.user = null;
        this.tokens = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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
      return (
        JSON.parse(localStorage.getItem("selected_bracket")) ||
        this.selected_bracket
      );
    },
    check() {
      return this.user !== null || localStorage.getItem("user") !== null;
    },
    getRounds() {
      return this.rounds ?? [];
    },
    getToken() {
      return this.tokens?.access?.token || null;
    },
    getUser() {
      return JSON.parse(localStorage.getItem("user")) || this.user;
    },
  },
});
