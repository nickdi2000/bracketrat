const httpStatus = require("http-status");
const { User, Document, Organization } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	return User.create(userBody);
};

const createOrganization = async (user) => {
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
	return User.findOne({ email });
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
