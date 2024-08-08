import mongoose from "mongoose";
import { createUser } from "../src/services/user.service.js";

/**
 * Deletes a user from the database by their user ID.
 *
 * @param {string} userId - The ID of the user to delete. This ID must be a valid MongoDB ObjectId string.
 * 
 * @returns {Promise<void>} A promise that resolves when the deletion operation is complete.
 * 
 * @throws {Error} Throws an error if the deletion operation fails. Errors are logged to the console.
 * 
 * This function accesses the "users" collection in the MongoDB database and attempts to delete the user document
 * corresponding to the provided user ID.
 */
export const deleteDocumentById = async (collectionName) => {
  const collection = mongoose.connection.collection(collectionName);
  try {
    await collection.drop();
  } catch (err) {
    console.error(`Failed to delete document from ${collectionName}:`, err);
  }
};

/**
 * Creates a test user and returns the user and organization details.
 * @returns {Promise<{user: Object, bracketId: string}>}
 */
export const createTestUser = async () => {
    const randomEmail = "tester@email.com";
    const testUser = {
        email: randomEmail,
        password: "password123",
        name: "Test User ",
    };
    const user = await createUser(testUser);
    const defaultBracketId = user.defaultBracket;
    return { user, defaultBracketId };
}