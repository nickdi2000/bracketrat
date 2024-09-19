const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: false,
			trim: true,
		},
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
		},
		tournament: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tournament",
		},
		status: {
			type: String,
			enum: ["guest", "active", "upgraded", "inactive", "archived"],
			default: "active",
		},
		player_at: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Player",
			},
		],
		isAdmin: {
			type: Boolean,
			default: true,
		},
		email: {
			type: String,
			required: false,
			unique: true,
			trim: true,
			sparse: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid email");
				}
			},
		},
		password: {
			type: String,
			required: false,
			trim: true,
			minlength: 8,
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error(
						"Password must contain at least one letter and one number"
					);
				}
			},
			private: true, // used by the toJSON plugin
		},
		role: {
			type: String,
			enum: roles,
			default: "user",
		},
		sso_info: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},

		meta_info: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		utm_source: {
			type: String,
			required: false,
			default: "",
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		location: {
			type: mongoose.Schema.Types.Mixed,
		},
		defaultBracket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bracket",
		},
		emailsSent: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
