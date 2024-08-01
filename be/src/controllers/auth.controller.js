const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
	authService,
	userService,
	tokenService,
	emailService,
} = require("../services");
const mail = require("../utils/mail");
const { sendNewUser } = require("../utils/slack");

const register = catchAsync(async (req, res) => {
	let userData = req.body;
	try {
		let user = await userService.createUser(userData);
		const tokens = await tokenService.generateAuthTokens(user);
		sendNewUser(user);
		res.status(httpStatus.CREATED).send({ user, tokens });
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: err.message });
	}
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);

	req.session.save((err) => {
		if (err) {
			console.log(err);
			return next(err);
		}
		res.send({ user, tokens });
	});
});

const ssoLoginRegister = catchAsync(async (req, res) => {
	const ssoInfo = req.body;
	const user = await authService.ssoLoginRegister(ssoInfo);
	const tokens = await tokenService.generateAuthTokens(user);
	sendNewUser(user);
	res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(
		req.body.email
	);
	//await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	const baseUrl = process.env.APP_URL || "https://successionwills.com/app";
	const url = `${baseUrl}/reset-password?token=${resetPasswordToken}`;
	console.log("Reset URL", url);

	await mail.sendResetPassword(req.body.email, resetPasswordToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
	await authService.resetPassword(req.query.token, req.body.password);
	res
		.status(httpStatus.NO_CONTENT)
		.json({ message: "Password reset successfully" });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
	const verifyEmailToken = await tokenService.generateVerifyEmailToken(
		req.user
	);
	await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
	await authService.verifyEmail(req.query.token);
	res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	verifyEmail,
	ssoLoginRegister,
};
