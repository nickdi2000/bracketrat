const express = require("express");
const slackService = require("../../services/slack.service.js");
const messageController = require("../../controllers/message.controller");

const router = express.Router();

const test = async (req, res) => {
	const rec = await slackService.loginNotify("crazy@gmail.com");
	//console.log("SEnding message", rec);
	res.send("attempted send");
};

router.route("/misc").get(test);
router.route("/contact").post(messageController.contact);

module.exports = router;
