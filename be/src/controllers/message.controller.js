// controllers/MessageController.js
const BaseController = require("./baseController");
const { Message } = require("../models");
//import message service
const messageService = require("../services/message.service");
const mailer = require("../utils/mail");
class MessageController extends BaseController {
	constructor() {
		super(Message);
	}

	inbound = async (req, res) => {
		const { body } = req;
		console.log("inbound message", body);
		res.send("Made it");
	};

	contact = async (req, res) => {
		const { email, message, type } = req.body;
		//res.json({ email: email, message: message, type: type });
		try {
			const rec = await mailer.sendContactMail(email, message, type);
			if (!rec) throw new Error("Error sending email");
			res.status(200).send(rec);
		} catch (error) {
			res.status(400).send(error.message);
		}
	};
}

module.exports = new MessageController();
