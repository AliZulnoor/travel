import { Outlet, redirect, useLocation } from "react-router";
import { getCurrentUser, storeUserData } from "~/appwrite/auth";
import RootNavbar from "../../../components/RootNavbar";
import { database, account } from "~/appwrite/client";
import { Query } from "appwrite";
import { jwtDecode } from "jwt-decode";

// Loader to check user and store data if missing
export async function clientLoader() {
    try {
        const user = await getCurrentUser();

        if (!user || !user.id) return redirect("/sign-in");

        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

        const existingDocs = await database.listDocuments(databaseId, collectionId, [
            Query.equal("accountId", user.id),
        ]);

        // If user doc doesn't exist, store it with Google picture fallback
        if (existingDocs.total === 0) {
            let googlePicture = "";

            try {
                const jwt = await account.createJWT();
                const decoded: any = jwtDecode(jwt.jwt);
                googlePicture = decoded?.picture || "";
            } catch (error) {
                console.warn("⚠️ Failed to decode JWT for picture.");
            }

            await storeUserData({
                ...user,
                picture: googlePicture || user.picture,
            });
        }

        return user;
    } catch (e) {
        console.error("Error fetching user", e);
        return redirect("/sign-in");
    }
}

// ✅ Component
const PageLayout = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith("/dashboard");

    return (
        <div className="bg-light-200 min-h-screen">
            {!isDashboard && <RootNavbar />} {/* Show navbar only on public pages */}
            <Outlet />
        </div>
    );
};

export default PageLayout;