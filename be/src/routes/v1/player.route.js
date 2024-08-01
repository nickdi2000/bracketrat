const express = require("express");
const playerController = require("../../controllers/player.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").post(playerController.insertPlayer);
router.route("/create-player").post(playerController.createPlayer);
router.route("/batch/:bracketId").post(playerController.batchUpdate);
router.route("/register").post(playerController.register);
router.route("/login").post(playerController.login);
router.route("/:bracketId").get(playerController.getByBracketId);
router.route("/show/:id").get(playerController.showPlayer);
router.route("/").get(playerController.list);
router.route("/").delete(playerController.destroy);

module.exports = router;
