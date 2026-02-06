"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateInstancePage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/instances", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                throw new Error("Failed to create instance");
            }

            const data = await res.json();
            router.push(`/instance/${data.id}`);
            router.refresh();
        } catch (err) {
            setError("Ocorreu um erro ao criar a instância. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-10">
            <Link
                href="/"
                className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Voltar para Dashboard
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-2">Nova Instância</h1>
                <p className="text-slate-400 mb-8">
                    Adicione uma nova instância para conectar um número de WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Nome da Instância
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Suporte Vendas"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Plus size={20} />
                                Criar Instância
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
