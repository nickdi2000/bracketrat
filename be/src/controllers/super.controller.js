// controllers/SuperController.js
//const BaseController = require("./baseController");
const { User, Message } = require("../models");

const list = async (req, res) => {
	res.send("SuperController");
};

const listusers = async (req, res) => {
	const records = await User.find({});
	//const records = await User.find({ deleted_at: null }).populate("campaigns");
	res.send(records);
};

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

module.exports = {
	list,
	listusers,
	getuser,
	deleteuser,
};
