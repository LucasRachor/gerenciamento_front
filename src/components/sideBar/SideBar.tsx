// src/components/NavBar.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Home as HomeIcon,
    Tv as TvIcon,
    Users as UsersIcon,
    LogOut as LogOutIcon,
    Settings as SettingsIcon,
} from "lucide-react";

interface NavBarProps {
    onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {
    return (
        <aside
            className="
        fixed left-0 top-0 h-full
        w-56
        bg-white dark:bg-gray-800
        shadow-lg
        flex flex-col
        overflow-y-auto
        z-50
      "
        >
            {/* Logo / Brand */}
            <div className="flex items-center h-16 px-4 mt-4 flex-shrink-0">
                <Image
                    src="/logo2.png"
                    alt="ClipTv Logo"
                    width={180}
                    height={180}
                    className="object-contain"
                    priority
                />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-2 space-y-1 mt-3">
                <Link
                    href="/"
                    className="
            flex items-center h-12 px-4 rounded-md 
            text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
                >
                    <HomeIcon className="h-6 w-6" />
                    <span className="ml-3 whitespace-nowrap">Início</span>
                </Link>

                <Link
                    href="/tvs"
                    className="
            flex items-center h-12 px-4 rounded-md 
            text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
                >
                    <TvIcon className="h-6 w-6" />
                    <span className="ml-3 whitespace-nowrap">TVs</span>
                </Link>

                <Link
                    href="/clientes"
                    className="
            flex items-center h-12 px-4 rounded-md 
            text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
                >
                    <UsersIcon className="h-6 w-6" />
                    <span className="ml-3 whitespace-nowrap">Clientes</span>
                </Link>

                <Link
                    href="/configuracoes"
                    className="
            flex items-center h-12 px-4 rounded-md 
            text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
                >
                    <SettingsIcon className="h-6 w-6" />
                    <span className="ml-3 whitespace-nowrap">Configurações</span>
                </Link>
            </nav>

            {/* Logout Button */}
            <div className="px-4 py-4 flex-shrink-0">
                <button
                    onClick={onLogout}
                    className="
            w-full flex items-center h-12 px-4 rounded-md 
            text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
                >
                    <LogOutIcon className="h-6 w-6" />
                    <span className="ml-3 whitespace-nowrap">Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default NavBar;
