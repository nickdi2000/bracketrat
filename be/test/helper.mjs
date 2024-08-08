import mongoose from "mongoose";
import { createUser } from "../src/services/user.service.js";

/**
 * Deletes a collection from the database.
 *
 * @param {string} collectionName - The collection name to delete.
 * 
 * @returns {Promise<void>} A promise that resolves when the deletion operation is complete.
 * 
 * @throws {Error} Throws an error if the deletion operation fails. Errors are logged to the console.
 * 
 * This function accesses the  delete collection in the MongoDB database.
 */
export const deleteCollectionByName = async (collectionName) => {
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