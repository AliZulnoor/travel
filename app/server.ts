// server.ts
import { Client, Databases, Account, Storage } from "appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
    throw new Error("❌ Missing Appwrite env vars (check APPWRITE_ENDPOINT, PROJECT_ID, API_KEY)");
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey); // Only on server side

export const database = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// You can add server logic here if needed, or export client for routes
