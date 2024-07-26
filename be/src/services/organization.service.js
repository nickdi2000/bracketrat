const httpStatus = require("http-status");
const { Organization, Bracket } = require("../models");
const { Player } = require("../models/player.model");
const ApiError = require("../utils/ApiError");

const createOrganizationFromUser = async (body) => {
	const obj = {
		name: `${body.name}'s Organization`,
		email: body.email,
		code: getRandomCode(body.name),
	};

	return Organization.create(obj);
};

const createOrganization = async (body) => {
	return Organization.create(body);
};

const getOrganizations = async () => {
	const orgs = await Organization.find();
	return orgs;
};

const getOrganization = async (org) => {
	try {
		// Fetch the organization
		const organization = await Organization.findOne(org)
			.populate("brackets")
			.populate("playerCount");

		if (!organization) {
			throw new Error("Organization not found");
		}

		return organization;
	} catch (error) {
		console.error(error);
		throw error; // Or handle the error as needed
	}
};

const getByCode = async (code) => {
	const comp = await Organization.findOne({ code: code });
	return comp;
};

const updateOrganization = async (data) => {
	console.log("updating org", data);
	const comp = await Organization.findByIdAndUpdate(data._id, data, {
		new: true,
	});
	return comp;
};

function getRandomCode(word) {
	const strippedWord = word.replace(/[^\w\s]/gi, "");
	return strippedWord.slice(0, 5);
}

module.exports = {
	createOrganization,
	getOrganizations,
	getOrganization,
	createOrganizationFromUser,
	updateOrganization,
	getByCode,
};
