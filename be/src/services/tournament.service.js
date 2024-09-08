const { Tournament, Bracket } = require("../models");
//const { bracketService } = require("../services");

const create = async (data) => {
	if (!data?.organization) {
		throw new Error("Cannot create a tournament with an organization");
	}

	if (!data?.unit) {
		data.unit = "solo";
	}
	//should create a tournament AND a bracket, then assign the bracket to the tournaments' currentBracket
	const tournament = await Tournament.create(data);
	const bracket = await Bracket.create({ tournament: tournament._id });
	tournament.currentBracket = bracket._id;
	await tournament.save();
	return tournament;
};

const update = async (id, data) => {
	const tournament = await Tournament.findById(id);

	if (!tournament) {
		throw new Error("Tournament not found (service)");
	}

	Object.keys(data).forEach((key) => {
		tournament[key] = data[key];
	});

	await tournament.save();
	return tournament;
};

module.exports = {
	create,
	update,
};
