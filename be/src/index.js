const app = require("./app");
const { connectToDatabase } = require("./db");
const config = require("./config/config");
const logger = require("./config/logger");
const socket = require("./utils/socket");

let server;

const startServer = async () => {
	try {
		await connectToDatabase();
		logger.info("Connected to MongoDB");

		server = app.listen(config.port, () => {
			logger.info(`Listening on http://localhost:${config.port}`);
		});

		socket.init(server);
	} catch (error) {
		logger.error("Failed to connect to MongoDB", error);
		process.exit(1);
	}
	return server;
};

const stopServer = async () => {
	if (server) {
		await new Promise((resolve) => server.close(resolve));
		logger.info("Server closed");
	}
};

const exitHandler = () => {
	stopServer().then(() => process.exit(1));
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	stopServer();
});

process.on("SIGINT", () => {
	console.log("Received SIGINT, shutting down gracefully");
	stopServer().then(() => console.log("Server shut down"));
});

// Only start the server if this script is run directly (not imported in tests)
if (require.main === module) {
	startServer();
}

module.exports = { startServer, stopServer, server };
