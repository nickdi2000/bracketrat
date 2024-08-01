import mongoose from "mongoose";
import app from "../src/app.js"; // Adjust the path as necessary
import config from "../src/config/config.js"; // Adjust the path as necessary

let server;

const connectToTestDatabase = async () => {
	const testDbUrl = "mongodb://localhost:27017/bracket-test"; // Adjust as necessary
	const mongooseOptions = config.mongoose.options; // Assuming this exists in your config

	await mongoose.connect(testDbUrl, mongooseOptions);
	console.log("Connected to test MongoDB");
};

const startTestServer = (port) => {
	return new Promise((resolve, reject) => {
		server = app.listen(port, (err) => {
			if (err) {
				reject(err);
			} else {
				console.log(`Test server running on port ${port}`);
				resolve(server);
			}
		});
	});
};

const closeTestServer = async () => {
	if (server) {
		await new Promise((resolve) => server.close(resolve));
		console.log("Test server closed");
	}
};

const disconnectTestDatabase = async () => {
	await mongoose.disconnect();
	console.log("Disconnected from test MongoDB");
};

export {
	connectToTestDatabase,
	startTestServer,
	closeTestServer,
	disconnectTestDatabase,
};
