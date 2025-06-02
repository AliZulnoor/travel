import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (saved === "dark" || (!saved && prefersDark)) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-500 text-sm font-semibold"
        >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
};

export default ThemeToggle;