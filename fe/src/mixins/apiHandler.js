import { data } from "autoprefixer";

export const apiHandler = {
  data() {
    return {
      _errorMessage: '',
    };
  },
  methods: {
    _handleResponse(payload) {
      console.error("handling response", payload);
      if (payload.response && payload.response.data) {
        let msg;
        if (payload.response.data?.data?.message) {
          msg = payload.response.data.data.message;
        } else if (payload.response.data?.message) {
          msg = payload.response.data.message;
        } else {
          msg = "An error occurred";
        }
        this.$toast.error(msg);
        this._errorMessage = msg;
      }
    },
  },
};
