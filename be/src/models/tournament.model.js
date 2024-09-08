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
		unit: {
			type: String,
			enum: ["team", "solo", "other"],
			required: false,
		},
		contactNumber: String,
		address: {
			street: String,
			city: String,
			state: String,
			zipCode: String,
			country: String,
		},
		/* 
			although this 'type' will be stored in the bracket, we will also populate it here for now, until we can clean the relationship up a bit.  If they select "LINK"
			we will eventually have it converted to one-to-many, in which case the bracket will determine the type. But again this is POST MVP.

		*/

		type: {
			type: String,
			enum: [
				"single-elimination",
				"double-elimination",
				"round-robin",
				"swiss",
				"ladder",
				"playoffs",
				"link",
				"other",
			],
			default: "single-elimination",
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		code: {
			type: String,
			default: () => generateRandomCode(), // Use the function to generate a default code
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
		//POST MVP option
		require_auth: {
			type: Boolean,
			default: false,
		},
		//POST MVP option
		auth_type: {
			type: String,
			enum: ["just_name", "symbols", "password"],
			default: "symbols",
		},
		auto_bracket: {
			type: Boolean,
			default: true,
		},
		mark_method: {
			type: String,
			enum: ["binary", "points"],
			default: "binary",
		},
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

function generateRandomCode() {
	let animalsArray = [
		"dog",
		"cat",
		"bird",
		"fish",
		"elephant",
		"tiger",
		"lion",
		"bear",
		"wolf",
		"fox",
		"rabbit",
		"deer",
		"moose",
		"horse",
		"cow",
		"pig",
		"sheep",
		"goat",
		"chicken",
		"duck",
		"goose",
		"turkey",
		"eagle",
		"owl",
		"parrot",
		"penguin",
		"raven",
		"swan",
		"peacock",
		"flamingo",
		"crocodile",
		"alligator",
		"snake",
		"lizard",
		"turtle",
		"frog",
		"toad",
		"newt",
		"gecko",
		"iguana",
		"chameleon",
		"tarantula",
		"scorpion",
		"spider",
		"beetle",
		"butterfly",
		"moth",
		"dragonfly",
		"grasshopper",
		"cricket",
		"ant",
		"bee",
		"wasp",
		"hornet",
		"fly",
	];

	let wordsArray = [
		"apple",
		"banana",
		"orange",
		"grape",
		"strawberry",
		"blueberry",
		"raspberry",
		"kiwi",
		"watermelon",
		"melon",
		"peach",
		"pear",
		"plum",
		"cherry",
		"apricot",
		"mango",
		"pineapple",
		"coconut",
		"papaya",
		"guava",
		"fig",
		"date",
		"lemon",
		"lime",
		"grapefruit",
		"tangerine",
		"clementine",
		"mandarin",
		"persimmon",
		"avocado",
		"tomato",
		"potato",
		"carrot",
		"broccoli",
		"spinach",
		"lettuce",
		"cabbage",
		"onion",
		"garlic",
		"ginger",
		"turmeric",
		"pepper",
		"chili",
		"pumpkin",
		"squash",
		"zucchini",
		"cucumber",
		"eggplant",
		"bellpepper",
		"mushroom",
		"asparagus",
		"corn",
		"peas",
		"beans",
		"lentils",
		"chickpeas",
		"soybeans",
		"peanuts",
		"almonds",
		"walnuts",
		"cashews",
		"pistachios",
		"hazelnuts",
		"macadamia",
		"pecans",
		"chestnuts",
		"coconut",
		"olive",
		"sunflower",
		"sesame",
		"flax",
		"chia",
		"quinoa",
		"amaranth",
		"buckwheat",
		"barley",
		"oats",
	];

	let animalsIndex = Math.floor(Math.random() * animalsArray.length);
	let wordsIndex = Math.floor(Math.random() * wordsArray.length);
	let randomNumber = Math.floor(Math.random() * 100);

	let randomAnimal = animalsArray[animalsIndex];
	let randomWord = wordsArray[wordsIndex];

	let result = randomAnimal + randomWord + randomNumber;

	return result;
}

function legacy_generateRandomCode(length = 10) {
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
