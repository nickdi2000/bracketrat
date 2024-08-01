import request from "supertest";
import { expect } from "chai";
import { setupTestEnvironment, getServerInstance } from "./sharedSetup.mjs"; // Adjust the path as necessary
import { Bracket, Game, Organization, User } from "../src/models/index.js"; // Adjust the path as necessary
import { Player } from "../src/models/player.model.js"; // Adjust the path as necessary
import {
	generateBracket,
	updateGameWinner,
} from "../src/services/bracket.service.js"; // Adjust the path as necessary
import { addPlayer } from "../src/services/player.service.js"; // Adjust the path as necessary

import { createUser } from "../src/services/user.service.js"; // Adjust the path as necessary
import { bracketService } from "../src/services/index.js";

setupTestEnvironment();

const baseUri = "/api/v1";
let server;

let user;
let organization;
let bracket;

describe("Bracket Service", function () {
	this.timeout(10000); // Increase the timeout for the test

	before(async function () {
		server = getServerInstance();

		// Create a test user which will create the organization as well
		const num = Math.random().toString(36).substring(7);
		const randomEmail = "tester" + num + "@email.com";
		const testUser = {
			email: randomEmail,
			password: "password123",
			name: "Test User " + num,
		};
		this.user = await createUser(testUser);
		this.organization = this.user.organization;

		// Create a test bracket
		const bracket = new Bracket({
			name: "Test Bracket",
			organization: this.organization,
			rounds: [],
		});
		await bracket.save();
		this.bracket = bracket;
	});

	it("should be able to create 4 players", async function () {
		try {
			const players = await Promise.all([
				await addPlayer("Player 1", this.organization._id),
				await addPlayer("Tom", this.organization._id),
				await addPlayer("Jerry", this.organization._id),
				await addPlayer("Spike", this.organization._id),
			]);
		} catch (error) {
			throw new Error("Failed to create players: " + error.message);
		}
	});

	it("should generate a bracket with proper structure", async function () {
		try {
			const result = await bracketService.generateBracket(this.bracket._id);

			if (!result) {
				throw new Error("Bracket not found");
			}

			// Verify the generated bracket
			expect(result).to.be.an("object");
			expect(result.rounds).to.be.an("array");
			expect(result.rounds).to.have.lengthOf.at.least(1);
			//we should ensure that the first round has at least one game
			expect(result.rounds[0].games).to.be.an("array");

			// Further assertions can be made based on the expected structure and content of the result
		} catch (error) {
			throw new Error("Failed to generate bracket: " + error.message);
		}
	});

	it("should update the winner of a game correctly", async function () {
		try {
			// Find the generated bracket
			const bracket = await Bracket.findById(this.bracket._id).populate(
				"rounds.games"
			);
			if (!bracket) {
				throw new Error("Bracket not found");
			}

			// Get the first game in the bracket
			const firstGame = bracket.rounds[0].games[0];
			const gameId = firstGame._id;
			const game = await Game.findById(gameId);

			//random player from Player model
			const player = await Player.findOne();

			console.log("player found", player);

			const playerId = player._id;

			console.log("playerId", playerId);
			console.log("gameId", gameId);

			// Update the game winner
			const updatedGame = await updateGameWinner(gameId, playerId);

			console.log("bracketId", this.bracket._id);
			// Verify that the next game has this player in it
			//const nextGame = await Game.findById(updatedGame.nextGameId);
			//expect(nextGame).to.not.be.null;

			const updatedBracket = await bracketService.getFullBracket(
				this.bracket._id
			);

			console.log("updatedBracket", updatedBracket);

			//updatedBracket should have player in round 2 (rounds[1])
			const playerInRound2 =
				updatedBracket.rounds[1].games[0].player1.player.toString();
			expect(playerInRound2).to.equal(playerId);
		} catch (error) {
			throw new Error("Failed to update game winner: " + error.message);
		}
	});

	after(async function () {
		// Clean up test data
		//await Bracket.deleteMany({});
		//await User.deleteMany({});
	});
});
