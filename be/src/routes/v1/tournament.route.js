const express = require("express");
const tournamentController = require("../../controllers/tournament.controller");

const router = express.Router();

router.post("/:tournamentId/generate", (req, res, next) => {
	tournamentController.generate(req, res, next);
});

router.post("/:tournamentId/generate-robin", (req, res, next) => {
	tournamentController.generateRobin(req, res, next);
});

router.post("/:tournamentId/generate-fixed", (req, res, next) => {
	tournamentController.generateFixed(req, res, next);
});

//re-generate uses the same players in the bracket without incorporating new stragglers
router.post("/:tournamentId/regenerate", (req, res, next) => {
	tournamentController.reGenerate(req, res, next);
});

module.exports = router;
