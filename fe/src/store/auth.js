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
    utm_source: localStorage.getItem("utm_source") || null,
    players: [],
    rounds: [],
    organization: null,
    selected_bracket:
      localStorage.getItem("selected_bracket") != "undefined"
        ? JSON.parse(localStorage.getItem("selected_bracket"))
        : null,
  }),
  actions: {
    setUTMSource() {
      //get utm_source from url and set it to localstorage
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get("utm_source");
      if (!utm_source) {
        return;
      }
      //remove it from url
      const url = new URL(window.location.href);
      url.searchParams.delete("utm_source");
      window.history.replaceState({}, document.title, url);

      this.utm_source = utm_source;
      localStorage.setItem("utm_source", utm_source);
    },
    setOrganization(organization) {
      this.organization = organization;
    },
    async fetchDefaultBracket() {
      if (!this.user.defaultBracket) {
        console.error("No default bracket provided to authStore");
        return;
      }
      return await this.fetchBracket(this.user.defaultBracket);
    },
    //to make th fetchBracket a promisebased on we could do it like this:
    async fetchBracket(bracket_id) {
      if (!bracket_id) {
        console.error("No bracket bracket_id provided to authStore");
        return;
      }
      return new Promise((resolve, reject) => {
        if (!bracket_id) {
          console.warn("No bracket bracket_id provided to authStore");
          reject("No bracket bracket_id provided to authStore");
        }
        api
          .get(`/brackets/${bracket_id}`)
          .then(async (rec) => {
            this.setSelectedBracket(rec.data);

            resolve(rec);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async saveOrg(data) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.put("organizations", data);
          this.setOrganization(rec.data);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    async fetchPlayers() {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.get("/players");
          this.setPlayers(rec.data);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    async createPlayerToSlot({ name, slotId }) {
      const bracketId = this.selected_bracket._id;
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post("/players/create-to-slot", {
            name: name,
            slotId: slotId,
            bracketId: bracketId,
          });
          const bracket = rec.data.bracket;
          this.setSelectedBracket(bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },
    //add existing player to bracket
    async addPlayerToBracket(player) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(
            `/brackets/${this.selected_bracket._id}/player/${player._id}`
          );

          //set selected Bracket
          await this.setSelectedBracket(rec.data.bracket);

          resolve(rec);
        } catch (err) {
          console.log("error", err);
          reject(err);
        }
      });
    },

    /*
        playerId: this.player._id,
        gameId: this.game._id,
        bracketId: this.$store.getBracket?._id,
        roundIndex: this.player.roundIndex,
        */

    async removePlayerFromGame(params) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(
            `/brackets/${params.bracketId}/remove-player-from-game`,
            params
          );
          //set selected Bracket
          this.setSelectedBracket(rec.data.bracket);

          resolve(rec);
        } catch (err) {
          console.log("error", err);
          reject(err);
        }
      });
    },
    async removePlayer(id) {
      console.log("removing player", id);
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.delete(`players?playerId=${id}`, {});
          console.log("rec", rec);

          //this.players = this.players.filter((player) => player._id !== id);

          const newPlayers = this.players.filter((player) => player._id != id);
          this.setPlayers(newPlayers);

          resolve(rec);
        } catch (err) {
          console.log("error", err);
          reject(err);
        }
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
    async updateOrg(data) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post("/organizations", data);
          //this.setOrganization(rec.data);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },
    async resetBracket(bracketId) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(`brackets/${bracketId}/regenerate`);
          console.log("rec regenerated", rec.data);
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },
    async batchUpdatePlayers(players) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(
            `players/batch/${this.selected_bracket._id}`,
            { players: players }
          );
          console.log("rec batch updated", rec.data);
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
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
    async setUser(userData) {
      if (!userData.data.user) {
        return;
      }
      this.user = userData.data.user;
      this.tokens = userData.data.tokens;
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.tokens.access.token);

      //if selected_bracket is not set, fetch and then set it to the users defaultBracket
      await this.fetchBracket(this.user.defaultBracket);
    },
    setPlayers(players) {
      this.players = players; //JSON.parse(JSON.stringify(players));
    },
    addPlayer(player) {
      this.players.push(player);
    },
    setRounds(rounds) {
      this.rounds = rounds;
    },
    patchUser(partialData) {
      Object.assign(this.user, partialData);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    patchBracket(partialData) {
      try {
        const rec = api.patch(
          "brackets/" + this.selected_bracket._id,
          partialData
        );
        //set selected_bracket details from partiaLData
        Object.assign(this.selected_bracket, partialData);
        localStorage.setItem(
          "selected_bracket",
          JSON.stringify(this.selected_bracket)
        );
      } catch (err) {
        console.log(err);
      }
    },
    setSelectedBracket(bracket) {
      console.log("SEtting bracket", bracket);
      this.selected_bracket = bracket;
      this.rounds = bracket.rounds;

      localStorage.setItem(
        "selected_bracket",
        JSON.stringify(this.selected_bracket)
      );

      //this.setPlayers(bracket.players);
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
        localStorage.removeItem("selected_bracket");
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
      return this.user !== null || localStorage.getItem("user") !== null;
    },
    checkIfPlayer() {
      return localStorage.getItem("player") !== null;
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
    playerCount() {
      return this.players?.length || 0;
    },
  },
});
