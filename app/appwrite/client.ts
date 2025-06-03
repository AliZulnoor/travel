import { Account, Client, Databases, Storage, ID } from "appwrite";

const isBrowser = typeof window !== "undefined";

// Safely load environment variables (Vite for browser, process.env for server)
const endpointUrl = isBrowser
  ? import.meta.env.VITE_APPWRITE_API_ENDPOINT
  : process.env.VITE_APPWRITE_API_ENDPOINT;

const projectId = isBrowser
  ? import.meta.env.VITE_APPWRITE_PROJECT_ID
  : process.env.VITE_APPWRITE_PROJECT_ID;

const apiKey = isBrowser
  ? import.meta.env.VITE_APPWRITE_API_KEY
  : process.env.VITE_APPWRITE_API_KEY;

const databaseId = isBrowser
  ? import.meta.env.VITE_APPWRITE_DATABASE_ID
  : process.env.VITE_APPWRITE_DATABASE_ID;

const userCollectionId = isBrowser
  ? import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
  : process.env.VITE_APPWRITE_USERS_COLLECTION_ID;

const tripCollectionId = isBrowser
  ? import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID
  : process.env.VITE_APPWRITE_TRIPS_COLLECTION_ID;

export const appwriteConfig = {
  endpointUrl,
  projectId,
  apiKey,
  databaseId,
  userCollectionId,
  tripCollectionId,
};

// ✅ Runtime safety check
if (!endpointUrl || !projectId) {
  console.error("❌ Appwrite config is incomplete. Check your env variables.");
}

// Only initialize client if values are valid
const client = new Client();
if (endpointUrl && projectId) {
  client.setEndpoint(endpointUrl).setProject(projectId);
}

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage, ID };
