const axios = require("axios");

const product_name = "Rat Bracket";
const contactTemplateID = 34531828;
const admin = process.env.ADMIN_EMAIL ?? "nickd@ratbracket.com";
const sender_name = "The Succession Team";

const { Message } = require("../models");

const templateObject = {
	From: "Rat Bracket info@ratbracket.com",
	To: admin,
	TemplateId: 34531828,
	TemplateModel: {
		product_name: product_name,
		action_url: "https://ratbracket.com",
		support_url: "https://ratbracket.com/support",
		login_url: "https://ratbracket.com",
		sender_name: "Nick",
	},
	MessageStream: "outbound",
};

const executeSend = async (data) => {
	try {
		await axios.post("https://api.postmarkapp.com/email/withTemplate", data, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-Postmark-Server-Token": process.env.POSTMARK_KEY,
			},
		});
		//console.log('PostMark Response', rec);
		return true;
	} catch (err) {
		console.log("PostMark Error", err?.message);
		return false;
	}
};

const sendContactMail = async (email, message, type = "none") => {
	const data = templateObject;
	data.TemplateModel.message = message;
	data.TemplateModel.type = type;
	data.TemplateModel.from_email = email;
	data.ReplyTo = email;

	const messageObject = {
		subject: "Contact Form",
		body: message,
		type: type,
		email: email,
	};
	const messageRecord = await Message.create(messageObject);

	const rec = await executeSend(data);
	return rec;
};

const sendWelcomeEmail = async (params) => {
	const data = templateObject;
	data.To = params.email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.name = params.name ?? "[N/A]";
	data.TemplateModel.action_url = "https://ratbracket.com/app/login";
	data.TemplateId = 35012190;
	const rec = await executeSend(data);
	return rec;
};

const sendResetPassword = async (email, token) => {
	const data = templateObject;
	data.To = email;
	data.TemplateModel.sender_name = sender_name;
	data.TemplateModel.product_name = product_name;
	data.TemplateModel.action_url = `https://ratbracket.com/app/reset-password?token=${token}`;
	data.TemplateId = 35013037;
	const rec = await executeSend(data);
	return rec;
};

module.exports = {
	sendContactMail,
	sendWelcomeEmail,
	sendResetPassword,
};
