import React from 'react';
import {
    Link,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams
} from 'react-router';
import { logout } from '~/appwrite/auth';
import { cn } from '~/lib/utils';

const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const user: any = useLoaderData();

    const handleLogout = async () => {
        await logout();
        navigate('/sign-in');
    };

    const isAdminPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/trips');
    if (isAdminPage) return null;

    return (
        <nav className={cn(
            location.pathname === `/travel/${params.tripId}` ? 'bg-white' : 'glassmorphism',
            'fixed top-0 left-0 w-full z-50 shadow-md'
        )}>
            <header className="root-nav wrapper flex items-center justify-between py-3">
                <Link to="/" className="link-logo flex items-center gap-2">
                    <img src="/assets/images/Rehla.png" alt="logo" className="size-[60px]" />
                    <h1 className="text-lg font-semibold">Rehla</h1>
                </Link>

                <aside className="flex items-center gap-4">
                    {user?.status === 'admin' && (
                        <Link
                            to="/dashboard"
                            className={cn(
                                'text-base font-medium transition',
                                location.pathname.startsWith('/travel') ? 'text-dark-100' : 'text-black'
                            )}

                        >
                            Admin Panel
                        </Link>
                    )}

                    <button onClick={handleLogout} className="cursor-pointer">
                        <img src="/assets/icons/logout.svg" alt="logout" className="size-6 rotate-180" />
                    </button>
                </aside>
            </header>
        </nav>
    );
};

export default RootNavbar;
