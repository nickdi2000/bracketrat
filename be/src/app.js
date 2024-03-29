const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const apiResponse = require("./middlewares/apiResponse");

const app = express();
//var session = require('express-session');
var session = require("express-session");

if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

app.use(
	session({
		secret: "secret-key-chanz-32123", // The secret used to sign the session ID cookie. Can be a string for a single secret, or an array of multiple secrets
		resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
		saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
		cookie: { secure: false }, // secure: true for HTTPS(SSL) websites, false for HTTP websites
	})
);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
	app.use("/v1/auth", authLimiter);
}
app.use(apiResponse);
// v1 api routes

app.use("/v1", routes);
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

require("./utils/worker");

module.exports = app;
