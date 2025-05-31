import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite';
import { jwtDecode } from 'jwt-decode';


// Init Appwrite client
const client = new Client();
const account = new Account(client);
const databases = new Databases(client);

// ✅ Configure Appwrite only in browser
if (typeof window !== 'undefined') {
    const endpoint = import.meta.env.VITE_APPWRITE_API_ENDPOINT;
    const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    if (!endpoint || !project) {
        console.error('❌ Missing Appwrite environment variables!');
    } else {
        client.setEndpoint(endpoint).setProject(project);
    }
}

// ✅ Login with Google
export const loginWithGoogle = async () => {
    try {
        await account.createOAuth2Session(
            'google' as any,
            window.location.origin,
            window.location.origin
        );
    } catch (error) {
        console.error('❌ OAuth Login Failed:', error);
    }
};

// ✅ Get current authenticated user
export const getCurrentUser = async () => {
    try {
        if (typeof window === "undefined") return null;

        const authUser = await account.get();
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

        const userDocs = await databases.listDocuments(databaseId, collectionId, [
            Query.equal("accountId", authUser.$id),
        ]);

        if (userDocs.total === 0) {
            console.warn("⚠️ No user document found.");
            return null; // ❌ don't redirect here
        }

        const userDoc = userDocs.documents[0];

        const profilePicture =
            authUser.prefs?.picture || userDoc.imageUrl || "/assets/images/david.webp";

        return {
            id: authUser.$id,
            name: authUser.name,
            email: authUser.email,
            picture: profilePicture,
            status: userDoc.status || "user",
        };
    } catch (error: any) {
        if (error.code === 401) {
            console.warn("⚠️ No user session found.");
        } else {
            console.error("❌ Error fetching user:", error);
        }
        return null;
    }
};


// ✅ Logout current user
export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('❌ Logout failed:', error);
    }
};

// ✅ Store user data to Appwrite Database

let storingInProgress = false;

export const storeUserData = async (user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
}) => {
    if (storingInProgress) {
        console.log("🚫 Skipped duplicate storeUserData call");
        return;
    }

    storingInProgress = true;

    try {
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

        const existing = await databases.listDocuments(databaseId, collectionId, [
            Query.equal("accountId", user.id),
        ]);

        console.log("🧪 Matching:", existing.documents);

        if (existing.total > 0) {
            console.log("✅ User already exists.");
            return;
        }

        await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name: user.name,
                email: user.email,
                accountId: user.id,
                joinedAt: new Date().toISOString(),
                imageUrl: user.picture || "/assets/images/default.png",
            },
            [
                Permission.read(Role.user(user.id)),
                Permission.update(Role.user(user.id)),
                Permission.delete(Role.user(user.id)),
            ]
        );

        console.log("✅ New user document created.");
    } catch (error) {
        console.error("❌ Error storing user:", error);
    } finally {
        storingInProgress = false;
    }
};

// ✅ Fetch all users from the database (admin dashboard)
export const getAllUsers = async (limit = 10, offset = 0) => {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

    try {
        const response = await databases.listDocuments(
            databaseId,
            collectionId,
            [
                Query.limit(limit),
                Query.offset(offset)
            ]
        );
        console.log("📊 getAllUsers response:", response.documents);
        return {
            users: response.documents,
            total: response.total,
        };
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        return {
            users: [],
            total: 0,
        };
    }
};