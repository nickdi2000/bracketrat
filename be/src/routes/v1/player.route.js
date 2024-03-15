const express = require("express");
const playerController = require("../../controllers/player.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").post(playerController.insert);
router.route("/:bracketId").get(playerController.getByBracketId);

module.exports = router;
