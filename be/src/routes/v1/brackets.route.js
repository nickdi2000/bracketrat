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
module.exports = router;
