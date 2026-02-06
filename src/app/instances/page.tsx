import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Smartphone, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InstancesPage() {
    const instances = await prisma.instance.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Instâncias</h2>
                    <p className="text-slate-400 mt-2">Gerencie todas as suas conexões do WhatsApp.</p>
                </div>
                <Link
                    href="/create-instance"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} />
                    Nova Instância
                </Link>
            </div>

            {/* Search/Filter Bar - Visual only for now */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar instâncias..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-950 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Instância</th>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Última Atualização</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {instances.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Nenhuma instância encontrada.
                                </td>
                            </tr>
                        ) : (
                            instances.map((instance) => (
                                <tr key={instance.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                                                <Smartphone size={20} />
                                            </div>
                                            <span className="font-medium text-white">{instance.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="bg-slate-950 px-2 py-1 rounded text-xs font-mono text-slate-400">{instance.id}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        {instance.status === "connected" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-900/50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Conectado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                                Desconectado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {new Date(instance.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/instance/${instance.id}`}
                                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <MoreHorizontal size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
