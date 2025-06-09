"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/services/api";

interface LoginFormInputs {
    email: string;
    senha: string;
}

const LoginPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        mode: "onBlur",
    });
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setApiError(null);
        try {

            const response = await api.post("/auth/login", data);
            localStorage.setItem("token", response.data.token);
            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response && error.response.data) {
                setApiError(error.response.data.error || "Login failed. Please try again.");
            } else {
                setApiError("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex flex-col h-full">
                    {/* Logo / Brand */}
                    <div className="flex items-center justify-center">
                        <Image
                            src="/logo2.png"
                            alt="ClipTv Logo"
                            width={180}
                            height={180}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 text-center">
                    Faça login na sua conta
                </h2>
                {apiError && (
                    <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Email"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"} 
                  placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-indigo-500 
                  focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700`
                                }
                                {...register("email", {
                                    required: "O email é obrigatório",
                                    pattern: {
                                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                        message: "Formato de email inválido",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Senha"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${errors.senha ? "border-red-500" : "border-gray-300 dark:border-gray-700"} 
                  placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-indigo-500 
                  focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700`
                                }
                                {...register("senha", {
                                    required: "A senha é obrigatória",
                                    minLength: {
                                        value: 6,
                                        message: "A senha deve ter pelo menos 6 caracteres",
                                    },
                                })}
                            />
                            {errors.senha && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.senha.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                            >
                                Lembrar-me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                disabled:opacity-50 disabled:cursor-not-allowed`
                            }
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
