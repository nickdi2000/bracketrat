const axios = require("axios");

const product_name = "BracketForce";
const contactTemplateID = 34214622;
const admin = process.env.ADMIN_EMAIL ?? "nickdifelice@gmail.com";
const sender_name = "The BracketForce Team";

const { Message } = require("../models");

const templateObject = {
	From: "info@bracketforce.com",
	To: admin,
	TemplateId: 34214622,
	TemplateModel: {
		product_name: product_name,
		action_url: "https://bracketforce.com",
		support_url: "https://bracketforce.com/pages/contact",
		login_url: "https://bracketforce.com",
		sender_name: "Nick",
	},
	MessageStream: "outbound",
};

const executeSend = async (data) => {
	if (!process.env.POSTMARK_KEY) {
		throw new Error("Postmark Key not set");
	}
	try {
		const rec = await axios.post(
			"https://api.postmarkapp.com/email/withTemplate",
			data,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-Postmark-Server-Token": process.env.POSTMARK_KEY,
				},
			}
		);
		console.log("PostMark Response", rec.response);
		return true;
	} catch (err) {
		console.log("Node executeSend Error", err);
		//throw error

		return false;
	}
};

const executePlainSend = async (data) => {
	if (!process.env.POSTMARK_KEY) {
		throw new Error("Postmark Key not set");
	}
	try {
		const rec = await axios.post("https://api.postmarkapp.com/email", data, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-Postmark-Server-Token": process.env.POSTMARK_KEY,
			},
		});
		//console.log("PostMark Response", rec.response);
		return true;
	} catch (err) {
		console.log("Node executeSend Error", err);
		//throw error

		return false;
	}
};

const sendContactMail = async ({ email, message, type = "none", location }) => {
	const data = templateObject;
	message += `<br/><br/><br/>Location: ${JSON.stringify(location)}`;

	data.TemplateModel.message = message;
	data.TemplateModel.type = type;
	data.TemplateModel.from_email = email;
	data.ReplyTo = email;
	data.TemplateId = contactTemplateID;

	const messageObject = {
		subject: "Contact Form",
		body: message,
		type: type,
		email: email,
	};
	//const messageRecord = await Message.create(messageObject);

	const rec = await executeSend(data);
	return rec;
};

const sendWelcomeEmail = async (user, verifyToken = null) => {
	const data = templateObject;
	data.To = user.email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.name = user.name ?? "[N/A]";
	data.TemplateModel.action_url =
		"https://bracketforce.com/pages/verify-email?token=" + verifyToken;
	data.TemplateId = 37402953;
	const rec = await executeSend(data);
	return rec;
};

const sendResetPassword = async (email, token) => {
	const data = templateObject;
	data.To = email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.action_url = `https://bracketforce.com/reset-password?token=${token}`;
	data.TemplateId = 34214251;
	const rec = await executeSend(data);
	return rec;
};

module.exports = {
	sendContactMail,
	sendWelcomeEmail,
	sendResetPassword,
	executePlainSend,
};
