const express = require("express");
const organizationController = require("../../controllers/organization.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

// router.route('/').get(organizationController.get);

router.route("/me").get(auth(), organizationController.getMe);

router.route("/").post(organizationController.insert);
router.route("/update").post(organizationController.update);

router.route("/").put(organizationController.update);

router.route("/").get(organizationController.getorganization);
router.route("/:orgId").get(organizationController.show);
router.route("/code/:code").get(organizationController.getByCode);

module.exports = router;
