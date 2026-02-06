"use client";

import { useState } from "react";
import { Settings, Shield, Webhook, CreditCard, Save, CheckCircle } from "lucide-react";

interface InstanceSettingsProps {
    instance: any;
}

export function InstanceSettings({ instance }: InstanceSettingsProps) {
    const [activeTab, setActiveTab] = useState("webhooks");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            // Convert checkbox values to booleans
            const payload = {
                ...data,
                settingsRejectCalls: formData.get("settingsRejectCalls") === "on",
                settingsReadMessages: formData.get("settingsReadMessages") === "on",
                settingsReadStatus: formData.get("settingsReadStatus") === "on",
                settingsDisableQueue: formData.get("settingsDisableQueue") === "on",
            };

            const res = await fetch(`/api/instances/${instance.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                const errorData = await res.json();
                alert(`Erro ao salvar configurações: ${errorData.details || errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "data", label: "Dados da conta", icon: Shield },
        { id: "webhooks", label: "Webhooks e configurações", icon: Webhook },
        { id: "payment", label: "Pagamento", icon: CreditCard },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
            {/* Tabs Sidebar */}
            <div className="w-full md:w-64 bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-800 p-2">
                <nav className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-emerald-600/10 text-emerald-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 lg:p-8">
                {activeTab === "data" && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white mb-4">Dados da Instância</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">Nome</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-3 text-slate-300">
                                    {instance.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">ID</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-3 text-slate-300 font-mono">
                                    {instance.id}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "webhooks" && (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-white">Configurar Webhooks</h3>
                            {showSuccess && (
                                <span className="text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                    <CheckCircle size={16} /> Salvo com sucesso!
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">URLs de Eventos</h4>

                                {[
                                    { label: "Ao enviar", name: "webhookUrlSend", rows: 1 },
                                    { label: "Ao receber", name: "webhookUrlReceive", rows: 1 },
                                    { label: "Ao conectar", name: "webhookUrlConnect", rows: 1 },
                                    { label: "Ao desconectar", name: "webhookUrlDisconnect", rows: 1 },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">{field.label}</label>
                                        <input
                                            type="url"
                                            name={field.name}
                                            defaultValue={instance[field.name]}
                                            placeholder="https://seu-sistema.com/webhook"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configurações Gerais</h4>

                                {[
                                    { label: "Rejeitar chamadas automaticamente", name: "settingsRejectCalls" },
                                    { label: "Ler mensagens automaticamente", name: "settingsReadMessages" },
                                    { label: "Ler status automaticamente", name: "settingsReadStatus" },
                                    { label: "Desabilitar fila quando desconectado", name: "settingsDisableQueue" },
                                ].map((toggle) => (
                                    <label key={toggle.name} className="flex items-center justify-between group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                        <span className="text-slate-300 group-hover:text-white transition-colors">{toggle.label}</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name={toggle.name} defaultChecked={instance[toggle.name]} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === "payment" && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">Pagamentos</h3>
                        <p className="text-slate-400 mt-2">Esta funcionalidade estará disponível em breve.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
