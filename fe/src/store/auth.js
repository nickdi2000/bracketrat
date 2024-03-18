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
      this.setPlayers(rec.data.players);
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
            resolve(rec);
          })
          .catch((err) => {
            reject(err);
          });
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
    setToken(token) {
      this.tokens = token;
    },
    setFadedAt(progress) {
      this.faded_at = progress;
    },
    setAdvancedMode(mode) {
      this.advanced_mode = mode;
      localStorage.setItem("advanced_mode", mode);
    },
    toggleAdvancedMode() {
      this.advanced_mode = !this.advanced_mode;
      localStorage.setItem("advanced_mode", this.advanced_mode);
    },
    generateSteps(steps, formData) {
      const navSteps = [];
      for (const [index, step] of steps.entries()) {
        if (step.depends_on_value) {
          if (
            !step.depends_on_value.values.includes(
              formData[step.depends_on_value.field]
            )
          ) {
            continue;
          }
        }

        let isComplete = index <= this.user?.current_step || 0;

        if (step.fields !== null && typeof step.fields === "object") {
          for (const field of step.fields) {
            if (!formData[field.name] && field.required) {
              isComplete = false;
              break;
            }
          }
        }
        if (step.last === true) {
          continue;
        }
        navSteps.push({
          title: step.title,
          isComplete: isComplete,
        });
      }
      this.steps = navSteps;
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
    getToken() {
      return this.tokens?.access?.token || null;
    },
    getUser() {
      return JSON.parse(localStorage.getItem("user")) || this.user;
    },
  },
});
