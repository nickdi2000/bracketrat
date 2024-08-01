const mongoose = require("mongoose");
const { User, Organization, Bracket } = require("../models");
const { Player } = require("../models/player.model");
const db = require("../db");
const { userService } = require("../services");

const OrganizationSeedData = [
	{
		name: "Demo Org.",
	},
];
//password
const userSeedData = [
	{ name: "Admin Smith", email: "admin@example.com" },
	{ name: "John Doe", email: "john@example.com" },
	{ name: "Jane Smith", email: "jane@example.com" },
];

const addPasswords = (users) => {
	let password = "password123";
	users.forEach((user) => {
		user.password = password;
		user.isEmailVerified = true;
	});
};

const testDbUrl = "mongodb://127.0.0.1:27017/bracket-test";

db.connectToDatabase(testDbUrl)
	.then(async () => {
		console.log("Connected to the database");

		addPasswords(userSeedData);

		//delete Users:
		await User.deleteMany({});
		await Organization.deleteMany({});
		await Bracket.deleteMany({});
		await Player.deleteMany({});
		// Seed the User data

		try {
			await Promise.all(
				userSeedData.map(async (userData) => {
					//await User.create(user);

					let user = await userService.createUser(userData);
					const org = await userService.createOrganization(user);

					user = await userService.updateUserById(user._id, {
						organization: org._id,
					});
					console.log("Created user: ", user.email);
				})
			);

			console.log("Done seeding users");
			mongoose.disconnect();
		} catch (error) {
			console.error("Error seeding data:", error);
			mongoose.disconnect();
		}

		// User.insertMany(modifiedUserSeedData)
		//   .then(() => {
		//     console.log('Data seeded successfully');
		//     mongoose.disconnect();
		//   })
		//   .catch((error) => {
		//     console.error('Error seeding data:', error);
		//     mongoose.disconnect();
		//   });
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
	});
