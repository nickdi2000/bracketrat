// controllers/BracketController.js
const BaseController = require("./baseController");
const { Bracket } = require("../models");
class BracketController extends BaseController {
	constructor() {
		super(Bracket);
	}

	async upsert(req, res) {
		let body = req.body;
		body.organization = req.user.organization;

		try {
			let item;
			if (req.body._id) {
				item = await Bracket.findByIdAndUpdate(body._id, body, {
					new: true,
					runValidators: true,
				});
				if (!item) {
					// If no document is found with the given ID, send a 404 response
					return res.status(404).send("Item not found");
				}
			} else {
				// If no ID is provided, create a new document
				item = new Bracket(req.body);
				await item.save();
			}
			res.status(201).send(item);
		} catch (error) {
			console.log("baseController error", error);
			res.status(400).send("BaseController error" + JSON.stringify(error));
		}
	}
}

module.exports = new BracketController();
