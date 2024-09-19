// controllers/SuperController.js
//const BaseController = require("./baseController");
const { User, Message } = require("../models");
const mailerService = require("../services/mailer.service");

const list = async (req, res) => {
	res.send("SuperController");
};

const listusers = async (req, res) => {
	// const records = await User.find({ deleted_at: null }).populate(
	// 	"organization.brackets"
	// );
	const records = await getUsersAndBracketCountByOrganization(
		req.user.organization
	);
	res.send(records);
};

async function getUsersAndBracketCountByOrganization(organizationId) {
	try {
		const results = await User.aggregate([
			// Match users based on organization ID
			{ $match: { organization: mongoose.Types.ObjectId(organizationId) } },

			// Assuming 'brackets' field in User model contains the Bracket IDs
			{
				$lookup: {
					from: "brackets", // the collection to join
					localField: "brackets", // field from the input documents
					foreignField: "_id", // field from the documents of the "from" collection
					as: "bracketDetails", // output array field
				},
			},

			// Project necessary fields
			{
				$project: {
					username: 1, // Assume we have a username field
					numberOfBrackets: { $size: "$bracketDetails" }, // Count of brackets
				},
			},
		]);

		return results;
	} catch (error) {
		console.error("Error retrieving users and bracket count:", error);
		throw error;
	}
}

const getuser = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id); //.populate("campaigns");
	const messages = await Message.find({ user: id });

	res.json({ user, messages });
};

const deleteuser = async (req, res) => {
	const { id } = req.params;
	//set deleted_at to now
	const user = await User.findByIdAndUpdate(id, { deleted_at: Date.now() });
	res.json({ user });
};

const sendFollowUp = async (req, res) => {
	const body = req.body;
	console.log("Sending user", body);
	const data = await mailerService.sendFollowUp({ user: body });
	res.json({ data });
};

module.exports = {
	list,
	listusers,
	getuser,
	deleteuser,
	sendFollowUp,
};
