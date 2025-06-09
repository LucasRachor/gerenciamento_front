// src/components/SidebarLayout.tsx

"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "@/components/sideBar/SideBar";

interface SidebarLayoutProps {
    children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    if (pathname === "/login") {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="flex">
            <NavBar onLogout={handleLogout} />
            <main className="flex-1 ml-56">{children}</main>
        </div>
    );
};

export default SidebarLayout;
