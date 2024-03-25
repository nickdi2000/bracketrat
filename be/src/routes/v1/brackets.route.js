const express = require("express");
const bracketController = require("../../controllers/bracket.controller");

const router = express.Router();

router.post("/", (req, res, next) => {
	bracketController.upsert(req, res, next);
});

router.get("/", (req, res, next) => {
	bracketController.list(req, res, next);
});

router.get("/:id", (req, res, next) => {
	bracketController.show(req, res, next);
});

router.post("/:bracketId/generate", (req, res, next) => {
	bracketController.generate(req, res, next);
});

router.post("/:bracketId/set-winner", (req, res, next) => {
	bracketController.updateGameWinner(req, res, next);
});

router.post("/:id/delete-all-players", (req, res, next) => {
	bracketController.removeAllPlayers(req, res, next);
});

//clear
router.post("/:bracketId/clear", (req, res, next) => {
	bracketController.clearBracket(req, res, next);
});

router.post("/:bracketId/remove-player-from-game", (req, res, next) => {
	bracketController.removePlayerFromGame(req, res, next);
});

router.post("/:bracketId/undo-outcomes", (req, res, next) => {
	bracketController.undoOutcomes(req, res, next);
});

module.exports = router;
