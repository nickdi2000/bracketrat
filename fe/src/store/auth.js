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

    async generateBracket() {
      return new Promise(async (resolve, reject) => {
        try {
          const tournamentId = this.selected_bracket?.tournament;
          if (!tournamentId) {
            console.error("No tournamentId provided to authStore");
            return;
          } else {
            console.log("tournamentId", tournamentId);
          }

          const rec = await api.post(`tournament/${tournamentId}/generate`);
          console.log("rec generated", rec.data?.bracket);
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    async generateRobinBracket() {
      try {
        const tournamentId = this.user;
        const rec = await api.post(`tournament/${tournamentId}/generate-robin`);
        this.setSelectedBracket(rec.data.bracket);
      } catch (err) {
        console.error("Error generating Robin bracket:", err);
        throw err;
      }
    },

    async generateFixedBracket(size) {
      return new Promise(async (resolve, reject) => {
        try {
          // const tournamentId = this.user.tournament;
          const tournamentId = this.selected_bracket?.tournament;

          if (!tournamentId) {
            console.error("No tournamentId provided to authStore");
            return;
          }

          const bracketType = this.selected_bracket?.type;
          const rec = await api.post(
            `tournament/${tournamentId}/generate-fixed`,
            {
              size,
              bracketType,
            }
          );
          console.log("rec fixed generated", rec.data?.bracket);
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    //to make th fetchBracket a promisebased on we could do it like this:
    async fetchBracket(bracket_id) {
      if (!bracket_id) {
        console.error("No bracket bracket_id provided to authStore");
        return;
      }
      let url = `/brackets/${bracket_id}`;

      return new Promise((resolve, reject) => {
        if (!bracket_id) {
          console.warn("No bracket bracket_id provided to authStore");
          reject("No bracket bracket_id provided to authStore");
        }
        api
          .get(url)
          .then(async (rec) => {
            this.setSelectedBracket(rec.data);

            resolve(rec);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async fetchRobinBracket(bracket_id) {
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
          .get(`/brackets/robin/${bracket_id}`)
          .then(async (rec) => {
            this.setSelectedBracket(rec.data);

            resolve(rec);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async markWinner({ playerId, gameId, bracketId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(
            `/brackets/robin/${bracketId}/set-winner`,
            {
              playerId,
              gameId,
            }
          );
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      });
    },

    async undoWinner({ playerId, gameId, bracketId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post(
            `/brackets/robin/${bracketId}/undo-winner`,
            {
              playerId,
              gameId,
            }
          );
          this.setSelectedBracket(rec.data.bracket);
          resolve(rec);
        } catch (err) {
          reject(err);
        }
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

    async createPlayer({ name, participantIndex, gameId }) {
      if (isNaN(participantIndex)) {
        console.info("!participantIndex, creating new", participantIndex);
      }
      const bracketId = this.selected_bracket?._id;

      if (!bracketId) {
        console.error("No bracket selected");
        return;
      }

      return new Promise(async (resolve, reject) => {
        try {
          const rec = await api.post("/players/create-player", {
            name,
            participantIndex,
            gameId,
            bracketId,
          });
          //const bracket = rec.data.bracket;
          //this.setSelectedBracket(bracket);

          //check if rec.data.players exists
          if (rec.data.players) {
            const players = rec.data.players;
            this.setPlayers(players);
          } else if (rec.data.player) {
            this.addPlayer(rec.data.player);
          }

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

          const players = rec.data.players;
          this.setPlayers(players);

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
    async clearBracket(bracketId, players) {
      return new Promise((resolve, reject) => {
        try {
          const rec = api.post(`brackets/${bracketId}/clear`, { players });
          console.log("rec cleared");
          //clear bracket
          this.selected_bracket.rounds = [];
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
      //clear selected bracket
      this.selected_bracket = null;
      localStorage.removeItem("selected_bracket");

      this.user = userData.data.user;
      this.tokens = userData.data.tokens;
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.tokens.access.token);

      //if selected_bracket is not set, fetch and then set it to the users defaultBracket
      await this.fetchBracket(this.user.defaultBracket);
    },
    setPlayers(players) {
      this.players = JSON.parse(JSON.stringify(players));
      //this.players = new Map(players.map((player) => [player._id, player]));
    },
    addPlayer(player) {
      this.players.push(player);
    },

    patchUser(partialData) {
      Object.assign(this.user, partialData);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    async patchBracket(partialData) {
      try {
        const rec = await api.patch(
          "brackets/" + this.user.tournament,
          partialData
        );
        this.selected_bracket = rec.data;
        // Store the updated selected_bracket in local storage
        localStorage.setItem(
          "selected_bracket",
          JSON.stringify(this.selected_bracket)
        );
        return rec;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    setSelectedBracket(bracket) {
      console.log("Setting bracket", bracket);
      this.selected_bracket = bracket;

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

    getToken() {
      return this.tokens?.access?.token || null;
    },
    getUser() {
      return JSON.parse(localStorage.getItem("user")) || this.user;
    },
    playerCount() {
      return this.players?.length || 0;
    },
    limboPlayers() {
      return this.players.filter((player) => player.stateLabel == "Limbo");
    },
  },
});
