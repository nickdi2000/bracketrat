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
		console.log("PostMark Error", err?.message);
		//throw error

		return false;
	}
};

const sendContactMail = async (email, message, type = "none") => {
	const data = templateObject;
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

const sendWelcomeEmail = async (params) => {
	const data = templateObject;
	data.To = params.email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.name = params.name ?? "[N/A]";
	data.TemplateModel.action_url = "https://bracketforce.com/login";
	data.TemplateId = 35012190;
	const rec = await executeSend(data);
	return rec;
};

const sendResetPassword = async (email, token) => {
	const data = templateObject;
	data.To = email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.action_url = `https://bracketforce.com/reset-password?token=${token}`;
	data.TemplateId = 35013037;
	const rec = await executeSend(data);
	return rec;
};

module.exports = {
	sendContactMail,
	sendWelcomeEmail,
	sendResetPassword,
};
