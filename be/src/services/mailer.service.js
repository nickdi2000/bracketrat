const { executePlainSend } = require("../utils/mail");
const { User } = require("../models");

const domain = "bracketforce.com";
const fromEmail = "nick@" + domain;
const fromName = "Nick Di Felice";
const appName = "BracketForce";
/**
 * SAMPLE
 * 
 * {
  "From": "sender@example.com",
  "To": "receiver@example.com",
  "Cc": "copied@example.com",
  "Bcc": "blank-copied@example.com",
  "Subject": "Test",
  "Tag": "Invitation",
  "HtmlBody": "<b>Hello</b>",
  "TextBody": "Hello",
  "ReplyTo": "reply@example.com",
  "Metadata": {
      "Color":"blue",
      "Client-Id":"12345"
  },
  "Headers": [
    {
      "Name": "CUSTOM-HEADER",
      "Value": "value"
    }
  ],
  "TrackOpens": true,
  "TrackLinks": "HtmlOnly",
  "MessageStream": "outbound"
}

 */

const sendFollowUp = async ({ user }) => {
	let name = "there";
	if (user.name) {
		name = user.name;
		//remove first space and everything after to extract first name
		name = name.replace(/ .*/, "");
		//capitalize first letter
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}

	//let subject =  `Follow up from ${appName}`;
	let subject = `A full year! `;
	let msg = `Hey ${name},\n\n`;
	//msg += `I hope you're doing well. I noticed you signed up for ${appName} the other day and just wanted to see if you had any questions or needed help getting started. I also wanted to mention that we are actively building out new features everyday and your input would be greatly appreciated. We are going to build this based on your ideas! Anyway, take care!`;
	msg += `I hope you're doing well. I noticed you signed up for ${appName} and was wondering if you had any questions or needed help getting started. \n\nI'm happy to provide an entire year of our pro plan (normally $199/yr) for nothing more than a single sentence of feedback!  \n\nThanks for time either way!`;

	msg += `\n\nBest,\n${fromName}`;

	const data = {
		From: `${fromName} <${fromEmail}>`,
		To: user.email,
		Subject: subject,
		TextBody: msg,
	};

	const send = await executePlainSend(data);

	if (send) {
		await incrementEmailsSent(user);
	}

	return send;
};

const incrementEmailsSent = async (userData) => {
	const user = await User.findOneAndUpdate(
		{ email: userData.email },
		{ $inc: { emailsSent: 1 } }
	);
	return user;
};

module.exports = {
	sendFollowUp,
};
