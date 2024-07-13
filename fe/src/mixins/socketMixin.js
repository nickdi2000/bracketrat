//import io from 'socket.io-client';
import io from "socket.io-client";
import { authStore } from "../store/auth";

export default {
  data() {
    return {
      message: "",
    };
  },
  created: function () {
    console.log("socketMixin created");
    const store = authStore();

    const socket = io("http://localhost:5067");

    // Listen for a message from the server
    socket.on("player-created", (data) => {
      //this.message = data;
      console.log("Received message from server: ", data);
      store.addPlayer(data.player);
    });

    // Send a message to the server
    socket.emit("message", "Hello server!");

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  },
};
