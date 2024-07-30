const mongoose = require("mongoose");
const config = require("./config/config");
const logger = require("./config/logger");

const connectToDatabase = () => {
	return mongoose.connect(config.mongoose.url, config.mongoose.options);
};

module.exports = {
	connectToDatabase,
};
