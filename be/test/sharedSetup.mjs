import {
	connectToTestDatabase,
	startTestServer,
	closeTestServer,
	disconnectTestDatabase,
} from "./testSetup.mjs"; // Adjust the path as necessary

let server;

export const setupTestEnvironment = () => {
	before(async function () {
		this.timeout(60000); // Increase timeout for setting up the server

		try {
			await connectToTestDatabase();
			server = await startTestServer();
		} catch (error) {
			console.error("Failed to setup test environment:", error);
			throw error;
		}
	});

	after(async function () {
		this.timeout(60000); // Increase timeout for tearing down the server

		try {
			await closeTestServer();
			await disconnectTestDatabase();
		} catch (error) {
			console.error("Failed to teardown test environment:", error);
		}
	});
};

export const getServerInstance = () => server;
