import request from "supertest";
import { expect } from "chai";
import { setupTestEnvironment, getServerInstance } from "./sharedSetup.mjs"; // Adjust the path as necessary
import { deleteDocumentById } from "./helper.mjs";
import * as mock from "./constants.mjs"

setupTestEnvironment();
let userId;

// Register Endpoint Test Case
describe(`POST ${mock.baseUri}/auth/register`, function () {
	// 201 Success Test
    it("Responds with json containing a user token & user object", async function () {
        const server = getServerInstance();
        const res = await request(server)
          .post(`${mock.baseUri}/auth/register`)
          .send({ email: mock.userame, password: mock.password })
          .set("Accept", "application/json");

        expect(res.status).to.equal(201);
        expect(res.body?.data).to.have.property("user");
        expect(res.body?.data).to.have.property("tokens");
    });

	// // 400 Bad request Test 
    it("Responds with 400 bad request for missing email and password", async function () {
        const server = getServerInstance();
        const res = await request(server)
          .post(`${mock.baseUri}/auth/register`)
          .set("Accept", "application/json");

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("success", false);
    });
});

// Login Endpoint Test Case
describe(`POST ${mock.baseUri}/auth/login`, function () {
    // 200 Success Test
    it("Responds with json containing a user token when passed correct credentials", async function () {
        const server = getServerInstance();
        const res = await request(server)
          .post(`${mock.baseUri}/auth/login`)
          .send({ email: mock.userame, password: mock.password })
          .set("Accept", "application/json");

        expect(res.status).to.equal(200);
        expect(res.body?.data).to.have.property("user");
        expect(res.body?.data).to.have.property("tokens");
        userId = res.body?.data.user.id;
    });

    // 401 Unauthorized Test
    it("Responds with 401 unauthorized for incorrect credentials", async function () {
        const server = getServerInstance();
        const res = await request(server)
          .post(`${mock.baseUri}/auth/login`)
          .send({ email: mock.failEmail, password: mock.failPassword })
          .set("Accept", "application/json");

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("success", false);
        expect(res.body?.data).to.have.property("message", "Incorrect email or password!");
    });

		// Cleanup
    after(async function () {
        if (userId) {
            await deleteDocumentById("users");
            userId = null;
        }
    });
});