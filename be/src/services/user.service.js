const httpStatus = require("http-status");
const { User, Document, Organization, Bracket, Tournament } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
// user.save() is not a function here, how can i fix this method?:

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}

	let user = await User.create(userBody);
	const tournamentName = getRandomTournamentName();
	const tournament = await Tournament.create({
		name: tournamentName,
		admin: user._id,
	});
	// Create the organization
	const org = await createOrganization(user, tournament);
	tournament.organization = org._id
	tournament.currentBracket = org.defaultBracket;
	await tournament.save();

	// Update user's organization and defaultBracket
	user = await User.findByIdAndUpdate(
		user._id,
		{
			organization: org._id,
			defaultBracket: org.defaultBracket,
			tournament: tournament._id,
		},
		{ new: true }
	); //.populate("defaultBracket"); // Populate the defaultBracket reference

	return user;
};

const createOrganization = async (user, tournament) => {
	let name;
	if (!user.name) {
		name = getRandomName();
	} else {
		name = user.name;
	}
	name += "'s Organization";

	const org = await Organization.create({
		name: name,
		owner: user._id,
	});


	//also create a bracket for the organization and set the defaultBracket for the org to it
	const bracket = await Bracket.create({
		name: "My First Bracket",
		organization: org._id,
		tournament: tournament._id,

	});
	org.brackets.push(bracket._id);
	org.defaultBracket = bracket._id;
	await org.save();

	return org;
};

const getRandomName = () => {
	let names = [
		"Tiger Woods",
		"Phil Mickelson",
		"Jack Nicklaus",
		"Steve Nash",
		"Kobe Bryant",
		"Lebron James",
		"Michael Jordan",
		"Larry Bird",
		"Wayne Gretzky",
		"Joe Montana",
		"Jerry Rice",
		"Barry Bonds",
		"Roger Federer",
		"Rafael Nadal",
		"Novak Djokovic",
		"Pete Sampras",
		"Andre Agassi",
		"John McEnroe",
		"Jimmy Connors",
		"Chris Evert",
		"Martina Navratilova",
		"Serena Williams",
		"Venus Williams",
		"Maria Sharapova",
		"Anna Kournikova",
		"Billie Jean King",
		"Monica Seles",
	];
	return names[Math.floor(Math.random() * names.length)];
};

const getRandomTournamentName = () => {
	const activities = [
		"Soccer",
		"Basketball",
		"Boxing",
		"Golf",
		"Tennis",
		"Baseball",
		"Cricket",
		"Football",
		"Chess",
		"Table Tennis",
		"Volleyball",
		"Swimming",
		"Badminton",
		"Rugby",
		"Martial Arts",
		"Running",
		"Skating",
		"Karate",
		"Surfing",
		"Esports",
		"Archery",
		"Bowling",
		"Fencing",
		"Snooker",
		"Cycling",
	];
	const randomActivity = activities[Math.floor(Math.random() * activities.length)];
	return `${randomActivity} Tournament`;
};
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
	return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
	return User.findOne({ email }).populate("organization");

	// return User.findOne({ email }).populate({
	// 	path: "organization",
	// 	populate: {
	// 		path: "playerCount",
	// 		model: "Player",
	// 	},
	// });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	await user.remove();
	return user;
};

/* SUPER */
const getUsers = async () => {
	try {
		// const usersWithDocuments = await User.aggregate([
		//   {
		//     $lookup: {
		//       from: Document.collection.name, // The collection name of 'Document'
		//       localField: '_id', // Field from the 'User' collection
		//       foreignField: 'user_id', // Field from the 'Document' collection that references 'User'
		//       as: 'documents', // The field that will contain the array of matching 'Document' records
		//     },
		//   },
		// ]);

		//and to have it exlcude where status = 'archived' we do this:
		const usersWithDocuments = await User.aggregate([
			{
				$lookup: {
					from: Document.collection.name, // The collection name of 'Document'
					localField: "_id", // Field from the 'User' collection
					foreignField: "user_id", // Field from the 'Document' collection that references 'User'
					as: "documents", // The field that will contain the array of matching 'Document' records
				},
			},
			{
				$match: {
					status: { $ne: "archived" },
				},
			},
		]);

		return usersWithDocuments;
	} catch (error) {
		console.error("Error fetching users with documents:", error);
		throw error;
	}
};

module.exports = {
	createUser,
	queryUsers,
	getUserById,
	getUserByEmail,
	updateUserById,
	deleteUserById,
	getUsers,
	createOrganization,
};
