import request from "supertest";
import { expect } from "chai";
import { setupTestEnvironment, getServerInstance } from "./sharedSetup.mjs";
import * as mock from "./constants.mjs";
import { createTestUser, deleteCollectionByName } from "./helper.mjs";
import { generateBracket } from "../src/services/bracket.service.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

setupTestEnvironment();
let server;
let tournamentId;

// Post Generate Bracket Endpoint Test Case
describe(`POST ${mock.baseUri}/tournamnet/:tournamentId/generate`, function () {

  before(async function () {
    server = getServerInstance();
    const { tournament } = await createTestUser();
    tournamentId = tournament;
  });

  // 200 Success Test
  it("Responds with json containing a brackets object", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/tournament/${tournamentId}/generate`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body?.data).to.have.property("bracket");
    expect(res.body?.data).to.have.property("message");
  });

  // 500 Internal Server Error Test Case
  it("Failed to generate bracket", async function () {
    const validObjectId = new ObjectId();
    const res = await request(server)
      .post(`${mock.baseUri}/tournament/${validObjectId}/generate`)
      .set("Accept", "application/json");
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("success", false);
    expect(res.body.data).to.have.property("message", "Tournament not found");
  });

  // Clean up test data
  after(async function () {
    if (tournamentId) {
      await deleteCollectionByName("brackets");
      await deleteCollectionByName("tournaments");
      await deleteCollectionByName("users");
    }
  });

});

// Post Generate Fixed Bracket Endpoint Test Case
describe(`POST ${mock.baseUri}/tournament/:tournamentId/generate-fixed`, function () {

  before(async function () {
    server = getServerInstance();
    const { tournament } = await createTestUser();
    tournamentId = tournament;
  });

  // 200 Success Test Case
  it("Responds with json containing a brackets object", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/tournament/${tournamentId}/generate-fixed`)
      .send({
        size: mock.bracketSize_4,
        bracketType: mock.bracketType,
      })
      .set("Accept", "application/json");
    const bracket = res.body?.data?.bracket;
    const rounds = bracket.rounds;
    const firstRound = rounds[0];
    const secondRound = rounds[1];

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body?.data).to.have.property("bracket");
    expect(res.body?.data).to.have.property("message");
    expect(bracket).to.be.an("object");
    // Validate rounds and games structure when size is 4
    expect(firstRound).to.have.property("roundNumber", 1);
    expect(firstRound.games).to.be.an("array").that.has.lengthOf(2);
    expect(secondRound).to.have.property("roundNumber", 2);
    expect(secondRound.games).to.be.an("array").that.has.lengthOf(1);
  });

  // 400 Bad Request Test Case
  it("400 Bad Request for generate", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/brackets/${mock.failBracketId}/generate-fixed`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("success", false);
    expect(res.body?.data).to.have.property("message", "Bracket size is required.");
  });

  // 500 Internal Server Error Test Case
  it("Internal Server Error to generate bracket", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/tournament/${mock.failBracketId}/generate-fixed`)
      .send({ size: mock.bracketSize_4 })
      .set("Accept", "application/json");

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("success", false);
    expect(res.body?.data).to.have.property("message", "Failed to generate bracket.");
  });

  // Clean up test data
  after(async function () {
    if (tournamentId) {
      await deleteCollectionByName("users");
      await deleteCollectionByName("brackets");
    }
  });
});

// // Test for Generate Method with different parameters.
describe("generateBracket Method", function () {

  before(async function () {
    server = getServerInstance();
    const { tournament } = await createTestUser();
    tournamentId = tournament;
  });

  it("should generate fixed size bracket", async function () {
    const result = await generateBracket({
      tournamentId,
      bracketSize: mock.bracketSize_8,
      bracketType: mock.bracketType,
    });
    const firstRound = result.rounds[0];
    const secondRound = result.rounds[1];
    const thirdRound = result.rounds[2];

    // Validate that the bracket has the expected structure
    expect(result).to.be.an("object");
    expect(firstRound).to.have.property("roundNumber", 1);
    expect(secondRound).to.have.property("roundNumber", 2);
    expect(thirdRound).to.have.property("roundNumber", 3);
    expect(result.rounds).to.be.an("array").with.lengthOf(3);
    expect(firstRound).to.have.property("games").that.is.an("array").with.lengthOf(4);
    expect(secondRound).to.have.property("games").that.is.an("array").with.lengthOf(2);
    expect(thirdRound).to.have.property("games").that.is.an("array").with.lengthOf(1);
  });

  // Test Case should Fail when no bracket size is provided
  it("should not generate rounds when there are no players", async function () {
    const result = await generateBracket({ tournamentId });
    expect(result).to.be.an("object");
    expect(result).to.have.property("rounds").that.is.an("array").with.lengthOf(0);
  });

  // Test Case should Fail
  // TODO generate Method not working when useCurrentPlayers set to true.
  it("should use the currentPlayers to generate bracket", async function () {
    const result = await generateBracket({ tournamentId, useCurrentPlayers: true });
    const firstRound = result.rounds[0];
    const secondRound = result.rounds[1];
    const thirdRound = result.rounds[2];
    expect(firstRound).to.have.property("roundNumber", 1);
    expect(secondRound).to.have.property("roundNumber", 2);
    expect(thirdRound).to.have.property("roundNumber", 3);
    expect(result.rounds).to.be.an('array').with.lengthOf(3);
    expect(firstRound).to.have.property("games").that.is.an("array").with.lengthOf(4);
    expect(secondRound).to.have.property("games").that.is.an("array").with.lengthOf(2);
    expect(thirdRound).to.have.property("games").that.is.an("array").with.lengthOf(1);
    expect(result).to.be.an("object");
  });

  // Clean up test data
  after(async function () {
    if (tournamentId) {
      await deleteCollectionByName("users");
      await deleteCollectionByName("brackets");
    }
  });
});
