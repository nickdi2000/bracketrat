import request from "supertest";
import { expect } from "chai";
import { setupTestEnvironment, getServerInstance } from "./sharedSetup.mjs"; // Adjust the path as necessary

setupTestEnvironment();

const username = process.env.DB_TEST_USER ?? "admin@example.com";
const password = process.env.DB_TEST_PASS ?? "password123";
const baseUri = "/api/v1";

describe(`POST ${baseUri}/auth/login`, function () {
	this.timeout(5000); // Increase the timeout for the test

	it("Responds with json containing a user token when passed correct credentials", function (done) {
		const server = getServerInstance();
		request(server)
			.post(`${baseUri}/auth/login`)
			.send({ email: username, password: password })
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body?.data).to.have.property("user");
				expect(res.body?.data).to.have.property("tokens");
				done();
			});
	});
});
