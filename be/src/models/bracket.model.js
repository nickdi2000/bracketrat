const mongoose = require("mongoose");
//const { toJSON } = require("./plugins");

const { roundSchema } = require("./round.model");
//const { playerSchema } = require("./player.model");

const bracketSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},

		//players: [playerSchema],
		rounds: [roundSchema],
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
			required: false,
		},
		winner: {
			type: String,
			required: false,
		},
		unit: {
			type: String,
			enum: ["team", "solo", "other"],
			required: false,
		},
		sport: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			enum: ["active", "draft", "completed", "cancelled", "paused"],
			default: "draft",
		},
		locked: {
			type: Boolean,
			default: false,
		},
		code: {
			type: String,
			default: () => generateRandomCode(6), // Use the function to generate a default code
		},
		type: {
			type: String,
			enum: [
				"single-elimination",
				"double-elimination",
				"round-robin",
				"swiss",
				"ladder",
				"playoffs",
				"other",
			],
			default: "single-elimination",
		},
		require_auth: {
			type: Boolean,
			default: false,
		},
		auth_type: {
			type: String,
			enum: ["just_name", "symbols", "password"],
			default: "symbols",
		},
		auto_bracket: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

bracketSchema.virtual("isReady").get(function () {
	//check if there are any rounds with games that have no participants
	let result = true;
	this.rounds.forEach((round) => {
		round.games.forEach((game) => {
			if (!game.participants || game.participants?.length === 0) {
				result = false;
			}
		});
	});
});

function _generateRandomCode(length = 10) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

//create another generateRandomCode function, but use a random animal + random word + random number

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
		"salamaner",
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
		"pomegranate",
		"avocado",
		"tomato",
		"potato",
		"carrot",
		"broccoli",
		"cauliflower",
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

//add indexes to the schema
bracketSchema.index({ code: 1 });

//bracketSchema.plugin(toJSON);

const Bracket = mongoose.model("Bracket", bracketSchema);
module.exports = Bracket;
