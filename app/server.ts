import { Client, Account, Databases, Storage } from "appwrite";

// Read environment variables
const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;

if (!endpoint || !endpoint.startsWith("http")) {
    throw new Error("❌ Missing or invalid APPWRITE_ENDPOINT");
}

if (!projectId) {
    throw new Error("❌ Missing APPWRITE_PROJECT_ID");
}

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

// Export instances
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
