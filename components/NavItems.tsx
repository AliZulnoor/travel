import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
import { logout } from "~/appwrite/auth";

// Define expected user data type
type User = {
    name: string;
    email: string;
    imageUrl?: string;
};

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
    const user = useLoaderData() as User | null;
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/sign-in");
    };

    return (
        <aside className="w-[250px] sticky top-0 h-screen bg-white shadow-md p-4 flex flex-col justify-between">
            {/* Top: Logo and navigation */}
            <div>
                <Link to="/" className="link-logo flex items-center gap-2 mb-6">
                    <img src="/assets/images/Rehla.png" alt="logo" className="size-[40px]" />
                    <h1 className="text-xl font-semibold">Rehla</h1>
                </Link>

                <nav className="flex flex-col gap-1">
                    {sidebarItems.map(({ id, href, icon, label }) => (
                        <NavLink to={href} key={id}>
                            {({ isActive }: { isActive: boolean }) => (
                                <div
                                    className={cn("group nav-item flex items-center gap-2 px-3 py-2 rounded-md", {
                                        "bg-primary-100 text-white": isActive,
                                    })}
                                    onClick={handleClick}
                                >
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={cn(
                                            "size-5 group-hover:brightness-0 group-hover:invert",
                                            isActive ? "brightness-0 invert" : ""
                                        )}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom: User footer */}
            <footer className="pt-4 border-t mt-6 flex items-center gap-2">


                <div className="flex-1">
                    <h2 className="text-sm font-semibold">{user?.name ?? "Unknown"}</h2>
                    <p className="text-xs text-gray-500">{user?.email ?? "No email"}</p>
                </div>

                <button onClick={handleLogout} className="cursor-pointer">
                    <img
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        className="size-5"
                    />
                </button>
            </footer>
        </aside>
    );
};

export default NavItems;
