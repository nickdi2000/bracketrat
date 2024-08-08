import request from "supertest";
import { expect } from "chai";
import { setupTestEnvironment, getServerInstance } from "./sharedSetup.mjs"; 
import * as mock from "./constants.mjs";
import { createTestUser, deleteDocumentById } from "./helper.mjs";
import { generateBracket } from "../src/services/bracket.service.js";

setupTestEnvironment();
let server;
let bracketId;

// Post Generate Bracket Endpoint Test Case
describe(`POST ${mock.baseUri}/brackets/:bracketId/generate`, function () {

  before(async function () {
    server = getServerInstance();
    const  { defaultBracketId } = await createTestUser();
    bracketId = defaultBracketId;
  });

  // 200 Success Test
  it("Responds with json containing a brackets object", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/brackets/${bracketId}/generate`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body?.data).to.have.property("bracket");
    expect(res.body?.data).to.have.property("message");
  });

  // 500 Internal Server Error Test Case
  it("Failed to generate bracket", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/brackets/${mock.failBracketId}/generate`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("success", false);
    expect(res.body?.data).to.have.property("message", "Failed to generate bracket.");
  });

  // Clean up test data
  after(async function () {
    if (bracketId) {
      await deleteDocumentById("brackets");
      await deleteDocumentById("users");
    }
  });

});

// Post Generate Fixed Bracket Endpoint Test Case
describe(`POST ${mock.baseUri}/brackets/:bracketId/generate-fixed`, function () {

  before(async function () {
    server = getServerInstance();
    const { defaultBracketId } = await createTestUser(); 
    bracketId = defaultBracketId;
  });

  // 200 Success Test Case
  it("Responds with json containing a brackets object", async function () {
    const res = await request(server)
      .post(`${mock.baseUri}/brackets/${bracketId}/generate-fixed`)
      .send({ size: mock.bracketSize_4 })
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
      .post(`${mock.baseUri}/brackets/${mock.failBracketId}/generate-fixed`)
      .send({ size: mock.bracketSize_4 })
      .set("Accept", "application/json");

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("success", false);
    expect(res.body?.data).to.have.property("message", "Failed to generate bracket.");
  });

  // Clean up test data
  after(async function () {
    if (bracketId) {
      await deleteDocumentById("users");
      await deleteDocumentById("brackets");
    }
  });
});

// Test for Generate Method with different parameters.
describe('generateBracket', function () {

  before(async function () {
    server = getServerInstance();
    const { defaultBracketId } = await createTestUser(); 
    bracketId = defaultBracketId;
  });

  it('should generate fixed size bracket', async function () {
    const result = await generateBracket({
      bracketId,
      bracketSize: mock.bracketSize_8,
    });
    const firstRound = result.rounds[0];
    const secondRound = result.rounds[1];
    const thirdRound = result.rounds[2];

    // Validate that the bracket has the expected structure
    expect(result).to.be.an('object');
    expect(firstRound).to.have.property("roundNumber", 1);
    expect(secondRound).to.have.property("roundNumber", 2);
    expect(thirdRound).to.have.property("roundNumber", 3);
    expect(result.rounds).to.be.an('array').with.lengthOf(3);
    expect(firstRound).to.have.property('games').that.is.an('array').with.lengthOf(4);
    expect(secondRound).to.have.property('games').that.is.an('array').with.lengthOf(2);
    expect(thirdRound).to.have.property('games').that.is.an('array').with.lengthOf(1);

  });

  it('should generate bracket', async function () {    
      const result = await generateBracket({ bracketId });
      expect(result).to.be.an('object');
      // TODO add more validations for this use case.
    
  });

  // TODO generate Method not working when useCurrentPlayers Set to true.
  //   it('should generate bracket', async function () {    
  //     const result = await generateBracket({ bracketId, useCurrentPlayers: true });
  //     const firstRound = result.rounds[0];
  //     const secondRound = result.rounds[1];
  //     const thirdRound = result.rounds[2];
  //     expect(firstRound).to.have.property("roundNumber", 1);
  //     expect(secondRound).to.have.property("roundNumber", 2);
  //     expect(thirdRound).to.have.property("roundNumber", 3);
  //     expect(result.rounds).to.be.an('array').with.lengthOf(3);
  //     expect(firstRound).to.have.property('games').that.is.an('array').with.lengthOf(4);
  //     expect(secondRound).to.have.property('games').that.is.an('array').with.lengthOf(2);
  //     expect(thirdRound).to.have.property('games').that.is.an('array').with.lengthOf(1);
  //     expect(result).to.be.an('object');
  //     // TODO add more validations for this use case.
    
  // });

    // Clean up test data
  after(async function () {
    if (bracketId) {
      await deleteDocumentById("users");
      await deleteDocumentById("brackets");
    }
  });
});
