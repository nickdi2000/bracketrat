// auth.test.js

import request from "supertest";
import { expect } from "chai";
import app from "../app.js";

import axios from "axios";

// Dynamic import for chai
let chai;
(async () => {
	chai = await import("chai");
})();

const username = process.env.DB_TEST_USER ?? "admin@example.com";
const password = process.env.DB_TEST_PASS ?? "password123";

describe("POST /login", function () {
	it("Responds with json containing a user token when passed correct credentials", function (done) {
		request(app)
			.post("/auth/login")
			.send({ login: username, password: password })
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body).to.have.property("token");
				done();
			});
	});

	it("Responds with 403 when passed incorrect credentials", function (done) {
		request(app)
			.post("/auth/login")
			.send({ login: "nick@triviarat.com", password: "wrongpassword" })
			.set("Accept", "application/json")
			.expect(403, done);
	});

	//now write one that does an axios call to
	// https://api.triviarat.com/api/get/random which should return a JSOn object with an attribute of response_code = 0
});

/*
	it("Responds with 200 and a JSON object with response_code = 0", function (done) {
		request(app)
			.get("https://api.triviarat.com/api/get/random")
			.set("Accept", "application/json")
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body).to.have.property("response_code").to.equal(0);
				done();
			});
	});
	*/

describe("GET /api/get/random", function () {
	it("Responds with 200 and a JSON object with response_code = 0", function (done) {
		axios
			.get("https://api.triviarat.com/api/get/random")
			.then((res) => {
				expect(res.data).to.have.property("response_code").to.equal(0);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});
