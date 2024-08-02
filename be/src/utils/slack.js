// slack.service.js
const { WebClient } = require("@slack/web-api");

// Read the Slack token from environment variables
const token = process.env.SLACK_TOKEN;
const defaultChannel = process.env.SLACK_DEFAULT_CHANNEL || "C06BT7TAWR2"; // #electosense

if (!token) {
	throw new Error("SLACK_TOKEN environment variable is required");
}

const web = new WebClient(token);

/**
 * Sends a message to a Slack channel.
 *
 * @param {string} message - The message to send.
 * @param {string} [channel=defaultChannel] - The Slack channel to send the message to.
 * @returns {Promise<void>}
 */
async function sendMessage(message, channel = defaultChannel) {
	try {
		await web.chat.postMessage({
			text: message,
			channel: channel,
		});
		console.log(`Message sent to ${channel}`);
	} catch (error) {
		console.error(`Error sending message to ${channel}:`, error);
	}
}

async function sendNewUser(user) {
	const env = process.env.NODE_ENV;
	if (env != "production") {
		return;
	}

	let msg = `NEW BF User: ${user.email}`;
	if (user.location) {
		msg += `\n from ${user.location.city}, ${user.location.state}, ${user.location.country}`;
	}

	try {
		await web.chat.postMessage({
			text: msg,
			channel: defaultChannel,
		});
		console.log(`Message sent to ${defaultChannel}`);
	} catch (error) {
		console.error(`Error sending message to ${defaultChannel}:`, error);
	}
}

module.exports = {
	sendMessage,
	sendNewUser,
};
