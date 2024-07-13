const socketIo = require("socket.io");

let io;
let connectedClients = []; // Maintain a list of connected clients

exports.init = (httpServer) => {
	const env_origin = process.env.ORIGIN;
	const origin = ["http://127.0.0.1:5185", "http://localhost:5185", env_origin];

	io = require("socket.io")(httpServer, {
		cors: {
			origin: origin,
			methods: ["GET", "POST"],
			credentials: true,
		},
	});
	io.on("connection", (socket) => {
		// Add the connected socket to our list
		connectedClients.push(socket);

		socket.on("disconnect", () => {
			// Remove the disconnected socket from our list
			connectedClients = connectedClients.filter(
				(client) => client.id !== socket.id
			);
		});

		// ... other socket event handlers
	});

	return io;
};

exports.getIo = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

// New function to disconnect all clients and close the socket.io server
exports.close = () => {
	connectedClients.forEach((client) => {
		client.disconnect(true);
	});

	if (io) {
		io.close();
	}
};
