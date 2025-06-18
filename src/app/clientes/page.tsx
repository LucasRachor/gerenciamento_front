// src/app/clientes/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import Footer from "@/components/footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";
import {
    Snackbar,
    Alert,
} from '@mui/material'

interface Endereco {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
}

interface Cliente {
    id: string;
    nomeCompleto: string;
    email: string;
    telefone: string;
    genero: string;
    statusPagamento: boolean;
    pagamento: string[];
    endereco?: Endereco; // Tornamos opcional para evitar undefined
}

const ClientesPage: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notificacao, setNotificacao] = useState({ open: false, tipo: 'success', mensagem: '' });
    const [filtro, setFiltro] = useState("");

    // Modais
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

    // Formulário
    const initialFormState = {
        nomeCompleto: "",
        email: "",
        telefone: "",
        genero: "masculino",
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchClientes = async () => {
        try {
            const response = await api.get<Cliente[]>("/clientes");
            setClientes(response.data);
        } catch (err: any) {
            console.error("Erro ao buscar clientes:", err);
            setError(err.response?.data?.message || "Não foi possível carregar os clientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const openCreateModal = () => {
        setFormData(initialFormState);
        setShowCreateModal(true);
    };

    const openEditModal = (cliente: Cliente) => {
        setEditingCliente(cliente);
        setFormData({
            nomeCompleto: cliente.nomeCompleto,
            email: cliente.email,
            telefone: cliente.telefone,
            genero: cliente.genero,
            cep: cliente.endereco?.cep || "",
            rua: cliente.endereco?.rua || "",
            bairro: cliente.endereco?.bairro || "",
            cidade: cliente.endereco?.cidade || "",
            estado: cliente.endereco?.estado || "",
        });
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingCliente(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        const cep = value.replace(/\D/g, "");

        const formattedCEP = cep.replace(/(\d{5})(\d{3})/, "$1-$2");

        setFormData(prev => ({ ...prev, cep: formattedCEP }));

        if (cep.length === 8) {
            try {
                setLoading(true);
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        rua: data.logradouro || "",
                        bairro: data.bairro || "",
                        cidade: data.localidade || "",
                        estado: data.uf || "",
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nomeCompleto: formData.nomeCompleto,
                email: formData.email,
                telefone: formData.telefone,
                genero: formData.genero,
                endereco: {
                    cep: formData.cep,
                    rua: formData.rua,
                    bairro: formData.bairro,
                    cidade: formData.cidade,
                    estado: formData.estado,
                },
            };

            await api.post<Cliente>("/clientes", payload);

            fetchClientes();
            closeModal();
            setNotificacao({ open: true, tipo: 'success', mensagem: 'Cliente cadastrado com sucesso!' });
        } catch (err: any) {
            console.error("Erro ao criar cliente:", err);
            setNotificacao({ open: true, tipo: 'error', mensagem: err.response?.data?.error });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCliente) return;
        try {
            const payload = {
                nomeCompleto: formData.nomeCompleto,
                email: formData.email,
                telefone: formData.telefone,
                genero: formData.genero,
                endereco: {
                    cep: formData.cep,
                    rua: formData.rua,
                    bairro: formData.bairro,
                    cidade: formData.cidade,
                    estado: formData.estado,
                },
            };

            await api.patch<Cliente>(`/clientes/${editingCliente.id}`, payload);

            fetchClientes();
            closeModal();
        } catch (err: any) {
            console.error("Erro ao editar cliente:", err);
            setNotificacao({ open: true, tipo: 'error', mensagem: err.response?.data?.error });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        Gerenciar Clientes
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 w-64"
                        />
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Novo Cliente
                        </button>
                    </div>
                </div>

                {/* Estado de carregamento e erro */}
                {loading ? (
                    <p className="text-gray-700 dark:text-gray-300">Carregando clientes...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        {clientes.length === 0 ? (
                            <p className="text-gray-700 dark:text-gray-300">Nenhum cliente cadastrado.</p>
                        ) : (
                            <div className="relative max-h-[60vh] overflow-y-auto overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <thead >
                                        <tr className="sticky top-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Nome Completo
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Telefone
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Gênero
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Status Pagamento
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Cidade
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes
                                            .filter((cliente) =>
                                                cliente.nomeCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
                                                cliente.email.toLowerCase().includes(filtro.toLowerCase()) ||
                                                cliente.telefone.toLowerCase().includes(filtro.toLowerCase()) ||
                                                cliente.endereco?.cidade.toLowerCase().includes(filtro.toLowerCase())
                                            )
                                            .map((cliente) => (
                                                <tr
                                                    key={cliente.id}
                                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                                                        {cliente.nomeCompleto}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 break-all">
                                                        {cliente.email}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                        {cliente.telefone}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                        {cliente.genero}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        <span
                                                            className={
                                                                cliente.statusPagamento
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {cliente.statusPagamento ? "Pago" : "Pendente"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                        {/* Uso de optional chaining e fallback */}
                                                        {cliente.endereco?.cidade ?? "—"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <button
                                                            onClick={() => openEditModal(cliente)}
                                                            className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />

            <Snackbar
                open={notificacao.open}
                autoHideDuration={5000}
                onClose={() => setNotificacao({ ...notificacao, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setNotificacao({ ...notificacao, open: false })}
                    severity={notificacao.tipo}
                    variant="filled"
                >
                    {notificacao.mensagem}
                </Alert>
            </Snackbar>

            {/* Modal de Criar Cliente */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Novo Cliente
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <XIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <form
                                onSubmit={handleCreateSubmit}
                                className="px-6 py-4 space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            name="nomeCompleto"
                                            value={formData.nomeCompleto}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Gênero
                                        </label>
                                        <select
                                            name="genero"
                                            value={formData.genero}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="masculino">Masculino</option>
                                            <option value="feminino">Feminino</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-4">
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            name="rua"
                                            value={formData.rua}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={formData.bairro}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={formData.cidade}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Editar Cliente */}
            <AnimatePresence>
                {showEditModal && editingCliente && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Editar Cliente
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <XIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <form
                                onSubmit={handleEditSubmit}
                                className="px-6 py-4 space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            name="nomeCompleto"
                                            value={formData.nomeCompleto}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Gênero
                                        </label>
                                        <select
                                            name="genero"
                                            value={formData.genero}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="masculino">Masculino</option>
                                            <option value="feminino">Feminino</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-4">
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            name="rua"
                                            value={formData.rua}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={formData.bairro}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={formData.cidade}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleCEPChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientesPage;
