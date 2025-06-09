// src/app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/footer/Footer";
import api from "@/services/api";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/sideBar/SideBar";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  statusPagamento: boolean;
  pagamento: any[];
}

interface Tv {
  id: string;
  nome: string;
  clientes: Cliente[];
}

const TvItem: React.FC<{ tv: Tv }> = ({ tv }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
      >
        <span className="text-lg font-semibold text-left text-gray-800 dark:text-gray-100">
          {tv.nome}
        </span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 overflow-y-auto max-h-80">
              {tv.clientes.length > 0 ? (
                <ul>
                  <li className="flex text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">
                    <span className="w-1/4">Nome</span>
                    <span className="w-1/4">Email</span>
                    <span className="w-1/4">Telefone</span>
                    <span className="w-1/4">Status</span>
                  </li>
                  {tv.clientes.map((cliente) => (
                    <li
                      key={cliente.id}
                      className="flex text-sm text-gray-800 dark:text-gray-100 py-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      <span className="w-1/4 font-bold">{cliente.nome}</span>
                      <span className="w-1/4 break-all">{cliente.email}</span>
                      <span className="w-1/4">{cliente.telefone}</span>
                      <span
                        className={`w-1/4 font-medium ${cliente.statusPagamento ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {cliente.statusPagamento ? "Pago" : "Pendente"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhum cliente cadastrado.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Home: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [tvs, setTvs] = useState<Tv[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Caso o AuthContext ainda esteja verificando ou não haja usuário, não busca as TVs
    if (authLoading) return;

    // Se não vier user do AuthContext, o próprio AuthContext já redirecionou para /login
    // Então aqui a gente prossegue buscando as TVs
    const fetchTvs = async () => {
      try {
        const response = await api.get<Tv[]>("/tvs/clientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTvs(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar TVs:", err);
        setError(err.response?.data?.message || "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchTvs();
  }, [authLoading, token]);

  // Enquanto o AuthContext estiver carregando (verificando token), mostramos “Carregando...”
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Exibe “Olá, {nomeCompleto}” */}
        <h1 className="text-3xl font-extraboldtext-gray-900 dark:text-gray-100 mb-4">
          Olá {user?.nome}
        </h1>

        <h2 className="text-1xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Seus clientes:
        </h2>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Carregando lista de TVs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {tvs.map((tv) => (
              <TvItem key={tv.id} tv={tv} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
