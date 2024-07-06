const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { organizationService } = require("../services");

const getMe = catchAsync(async (req, res) => {
	//get my organization
	const orgId = req.user.organization; //.toString();
	const data = await organizationService.getOrganization(orgId);
	res.status(200).send(data);
});

const insert = catchAsync(async (req, res) => {
	const data = await organizationService.createorganization(req.body);
	res.status(httpStatus.CREATED).send(data);
});

const getCompanies = catchAsync(async (req, res) => {
	const data = await organizationService.getCompanies();
	res.status(httpStatus.CREATED).send(data);
});

const getorganization = catchAsync(async (req, res) => {
	const data = await organizationService.getorganization(
		req.user.organization_id
	);
	res.status(httpStatus.CREATED).send(data);
});

const getByCode = catchAsync(async (req, res) => {
	const data = await organizationService.getByCode(req.params.code);
	res.status(httpStatus.CREATED).send(data);
});

const update = catchAsync(async (req, res) => {
	if (!req.body?.id) {
		req.body.id = req.user.organization_id;
	}
	const data = await organizationService.updateorganization(req.body);
	res.status(httpStatus.CREATED).send(data);
});

module.exports = {
	insert,
	getCompanies,
	getorganization,
	update,
	getByCode,
	getMe,
};
