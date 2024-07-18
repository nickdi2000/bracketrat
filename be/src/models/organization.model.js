const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	contactEmail: {
		type: String,
		trim: true,
	},
	contactNumber: String,
	address: {
		street: String,
		city: String,
		state: String,
		zipCode: String,
		country: String,
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	code: {
		type: String,
		default: () => generateRandomCode(6), // Use the function to generate a default code
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	brackets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bracket",
		},
	],
	defaultBracket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bracket",
	},
	// Additional fields like website, social media links, etc.
	website: String,
	// Timestamps
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: Date,
});

function generateRandomCode(length = 10) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = mongoose.model("Organization", organizationSchema);
