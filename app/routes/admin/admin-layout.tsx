import { useEffect } from "react";
import { Outlet, redirect } from "react-router";
import { getCurrentUser } from "~/appwrite/auth";
import NavItems from "../../../components/NavItems";
import MobileSidebar from "../../../components/MobileSidebar";

export async function clientLoader() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            console.warn("⛔ No user found. Redirecting to sign-in.");
            return redirect("/sign-in");
        }

        if (user.status !== "admin") {
            console.warn("⛔ User is not admin. Redirecting to home.");
            return redirect("/");
        }

        return user;
    } catch (error) {
        console.error("❌ Error in admin loader:", error);
        return redirect("/sign-in");
    }
}

const AdminLayout = () => {
    useEffect(() => {
        const debugUser = async () => {
            const user = await getCurrentUser();
            console.log("👤 Admin Layout User:", user);
        };
        debugUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ✅ Sidebar: show mobile or desktop based on screen size */}
            <div className="block lg:hidden">
                <MobileSidebar />
            </div>
            <div className="hidden lg:block">
                <NavItems />
            </div>

            {/* ✅ Main content always rendered */}
            <div className="flex-1">
                <main className="p-6 pt-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
