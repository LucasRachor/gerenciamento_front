"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface AuthContextData {
    user: UserData | null;
    loading: boolean;
}

interface UserData {
    id: string;
    nome: string;
}

const AuthContext = createContext<AuthContextData>({
    user: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Na montagem do componente, tentamos validar o token
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                // Se não houver token, redireciona imediatamente para /login
                setLoading(false);
                router.push("/login");
                return;
            }

            try {
                const response = await api.get<UserData>("/auth/verificar", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Se retornar dados, guardamos no estado
                setUser({
                    id: response.data.id,
                    nome: response.data.nome,
                });
                setLoading(false);
            } catch (err) {
                console.error("Token inválido ou expirado:", err);
                // Qualquer erro, removemos token e redirecionamos para login
                localStorage.removeItem("token");
                setLoading(false);
                router.push("/login");
            }
        };

        verifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
