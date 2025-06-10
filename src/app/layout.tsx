// src/app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import SidebarLayout from "@/components/sideBar/SideBarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DogTv",
  description: "Aplicação de gerenciamento de tv",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
