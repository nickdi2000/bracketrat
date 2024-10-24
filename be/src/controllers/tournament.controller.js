// controllers/TournamentController.js
const { Bracket, Tournament } = require("../models");
const { Player } = require("../models/player.model");
const { bracketService, tournamentService } = require("../services");
const mongoose = require("mongoose");

const upsert = async (req, res) => {
	const org_id = req.user.organization;
	console.log("orgaId", org_id);
	req.body.organization = org_id;

	try {
		let item;
		if (req.body.id) {
			item = await Tournament.findByIdAndUpdate(req.body.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!item) {
				return res.status(404).send("Item not found");
			}
		} else {
			// If no ID is provided, create a new document
			item = await tournamentService.create(req.body);
			await item.save();

			//if user does not have a defaultBracket, we will set it to this bracket
			if (!req.user.defaultBracket) {
				req.user.defaultBracket = item.currentBracket;
				await req.user.save();
			}
		}
		res.status(201).send(item);
	} catch (error) {
		console.log("TournamentController error", error);
		res.status(400).send("TournamentController error" + JSON.stringify(error));
	}
};

const list = async (req, res) => {
	try {
		const org_id = req.user.organization;
		console.log("finding tournament org_id", org_id);

		const items = await Tournament.find({ organization: org_id });

		res.send(items);
	} catch (error) {
		res.status(400).send("BaseController error" + JSON.stringify(error));
	}
};

const generate = async (req, res) => {
	const { tournamentId } = req.params;
	let { type } = req.body;
	type = type || "single";

	try {
		if (!type) {
			await bracketService.generateBracket({
				tournamentId,
			});
		} else if (type == "double") {
			await bracketService.generateDouble({
				tournamentId,
			});
		}

		const bracketId = await Bracket.findOne({
			tournament: mongoose.Types.ObjectId(tournamentId),
			type: type + "-elimination",
		});

		let bracket = await bracketService.getFullBracket(bracketId._id);

		if (!bracket) {
			return res.status(404).json({ message: "Bracket not found." });
		}

		res.json({
			message:
				"Bracket generated successfully with blank rounds and player seeds.",
			bracket: bracket,
		});
	} catch (error) {
		console.error("Error generating bracket:", error);
		res.status(500).json({ message: error.message });
	}
};

const generateRobin = async (req, res) => {
	const { tournamentId } = req.params;
	console.log("tourneasdasdasd:", tournamentId);
	try {
		const bracket = await bracketService.generateRobinBracket({
			tournamentId,
		});

		res.json({
			message:
				"Bracket generated successfully with blank rounds and player seeds.",
			bracket: bracket,
		});
	} catch (error) {
		console.error("Error generating robin bracket:", error);
		res.status(500).json({ message: error.message });
	}
};

const generateFixed = async (req, res) => {
	const { tournamentId } = req.params;
	const { size, bracketType } = req.body;

	if (!size) {
		return res.status(400).json({ message: "Bracket size is required." });
	}
	try {
		await bracketService.generateBracket({
			tournamentId,
			bracketSize: size,
		});
		const bracketIdTest = await Bracket.findOne({
			tournament: mongoose.Types.ObjectId(tournamentId),
			type: bracketType,
		});
		console.log("brackeIdTest::", bracketIdTest);
		let bracket = await bracketService.getFullBracket(bracketIdTest._id);

		if (!bracket) {
			return res.status(404).json({ message: "Bracket not found." });
		}

		res.json({
			message:
				"Bracket generated successfully with blank rounds and player seeds.",
			bracket: bracket,
		});
	} catch (error) {
		console.error("Error generating bracket:", error);
		res.status(500).json({ message: "Failed to generate bracket." });
	}
};

const reGenerate = async (req, res) => {
	const { tournamentId } = req.params;
	try {
		let bracket = await bracketService.reGenerateBracket(tournamentId);
		if (!bracket) {
			return res.status(404).json({ message: "Bracket not found." });
		}

		res.json({
			message: "Bracket re-generated successfully with blank rounds.",
			bracket: bracket,
		});
	} catch (error) {
		console.error("Error re-generating bracket:", error);
		res.status(500).json({ message: "Failed to re-generate bracket." });
	}
};

const patch = async (req, res) => {
	const body = req.body;
	const { tournamentId } = req.params;

	try {
		//const tournament = await tournamentService.update(tournamentId, body);
		let tournament = await Tournament.findById(tournamentId);
		if (!tournament) {
			return res.status(404).json({ message: "Tournament not found." });
		}

		//create bracket for type if doesn't exist (copied from bracket controller)
		let bracket;

		bracket = await Bracket.findOne({
			tournament: tournamentId,
			type: body.type,
		});

		if (!bracket) {
			bracket = await Bracket.create({
				tournament: tournamentId,
				type: body.type,
				organization: body.organization,
			});
		}

		// Update tournament with request body
		Object.keys(body).forEach((key) => {
			tournament[key] = body[key];
		});

		tournament.currentBracket = bracket._id;
		await tournament.save();

		//bracket = bracket.toObject();
		bracket.type = body.type;
		bracket.save();

		const bracketObject = await bracketService.getFullBracket(bracket._id);

		res.send({ bracket: bracketObject, tournament: tournament });
	} catch (error) {
		console.log("TournamentController error", error);
		res.status(400).json({ message: "Error" + error });
	}
};

const show = async (req, res) => {
	const { tournamentId } = req.params;
	try {
		let tournament = await Tournament.findById(tournamentId).populate(
			"currentBracket"
		);

		if (!tournament) {
			return res.status(404).json({ message: "Tournament not found." });
		}
		tournament = tournament.toObject();
		delete tournament.currentBracket.tournament;

		res.json(tournament);
	} catch (error) {
		console.error("Error getting tournament:", error);
		res.status(500).json({ message: error.message });
	}
};

const findByCode = async (req, res) => {
	const { code } = req.params;
	try {
		//ignore case
		const tournament = await Tournament.findOne({
			code: { $regex: new RegExp(code, "i") },
		});

		const bracketId = tournament.currentBracket;

		if (!bracketId) {
			return res
				.status(404)
				.json({ message: "BracketId not found for this tournament." });
		}

		//const bracket = await Bracket.findById(bracketId);
		const bracket = await bracketService.getFullBracket(bracketId);
		//find players via organization of bracket
		const players = await Player.find({ organization: bracket.organization });
		const playersNames = players.map((player) => player.name);

		if (!bracket) {
			return res.status(404).send("Bracket not found");
		}
		res.send({ tournament, bracket, players: playersNames });
	} catch (error) {
		console.log("error", error);
		res.status(400).send("BracketController error" + JSON.stringify(error));
	}
};

module.exports = {
	generateFixed,
	generateRobin,
	reGenerate,
	generate,
	list,
	upsert,
	patch,
	findByCode,
	show,
};
