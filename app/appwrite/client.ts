import { Client, Account, Databases, Storage } from "appwrite";

export const appwriteConfig = {
    endpointUrl: process.env.APPWRITE_ENDPOINT!,
    projectId: process.env.APPWRITE_PROJECT_ID!,
    apiKey: process.env.APPWRITE_API_KEY!,
    databaseId: process.env.APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.APPWRITE_USERS_COLLECTION_ID!,
    tripCollectionId: process.env.APPWRITE_TRIPS_COLLECTION_ID!
};

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);