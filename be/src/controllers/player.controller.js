// controllers/MessageController.js
const BaseController = require("./baseController");
const { Player, Bracket } = require("../models");

class MessageController extends BaseController {
	constructor() {
		super(Player);
	}

	insert = async (req, res) => {
		async function insertPlayerIntoBracket(req, res) {
			const { name, bracketId } = req.body;

			try {
				// Check if the player already exists
				let player = await Player.findOne({ name: name });

				// If the player doesn't exist, create a new one
				if (!player) {
					player = new Player({ name: name });
					await player.save();
				}

				// Insert player into the bracket with initial details
				const updatedBracket = await Bracket.findByIdAndUpdate(
					bracketId,
					{
						$push: {
							players: {
								playerRef: player._id,
								status: "active", // Example status, adjust as needed
								score: 0, // Initial score, adjust as needed
								// Add other bracket-specific player details here
							},
						},
					},
					{ new: true } // Return the updated document
				).populate("players.playerRef"); // Optionally populate player references

				// Respond with the updated bracket details
				res.status(200).json(updatedBracket);
			} catch (error) {
				console.error("Error inserting player into bracket:", error);
				res.status(500).send("Error inserting player into bracket");
			}
		}
	};

	getByBracketId = async (req, res) => {
		const { bracketId } = req.params;

		try {
			// Find the bracket and populate the player references
			const bracket = await Bracket.findById(bracketId).populate(
				"players.playerRef"
			);

			// Respond with the bracket details
			res.status(200).json(bracket);
		} catch (error) {
			console.error("Error getting bracket by ID:", error);
			res.status(500).send("Error getting bracket by ID");
		}
	};
}

module.exports = new MessageController();
