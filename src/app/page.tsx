import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Server, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const instances = await prisma.instance.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 mt-2">Gerencie suas instâncias do WhatsApp.</p>
        </div>
        <Link
          href="/create-instance"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />
          Nova Instância
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.length === 0 ? (
          <div className="col-span-full bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Server className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma instância encontrada</h3>
            <p className="text-slate-400 mb-6">Crie sua primeira instância para começar a enviar mensagens.</p>
            <Link
              href="/create-instance"
              className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
            >
              Criar agora &rarr;
            </Link>
          </div>
        ) : (
          instances.map((instance) => (
            <Link
              key={instance.id}
              href={`/instance/${instance.id}`}
              className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                  <Server className="text-emerald-400" size={24} />
                </div>
                {instance.status === "connected" ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Conectado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    Desconectado
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {instance.name}
              </h3>
              <p className="text-sm text-slate-500 font-mono truncate mb-4">
                ID: {instance.id}
              </p>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">
                <span>Token: ••••••••</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  Configurar &rarr;
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
