const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const tournamentSchema = new mongoose.Schema(
	{
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
		status: {
			type: String,
			enum: ["active", "draft", "completed", "cancelled", "paused"],
			default: "draft",
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
		currentBracket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bracket",
		},
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
			required: false,
		},
		website: String,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

tournamentSchema.set("toObject", { virtuals: true });
tournamentSchema.set("toJSON", { virtuals: true });

//add index
tournamentSchema.index({ name: 1 });
tournamentSchema.index({ code: 1 });

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

module.exports = mongoose.model("Tournament", tournamentSchema);
