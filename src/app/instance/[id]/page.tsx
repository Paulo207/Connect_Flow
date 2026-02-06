import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Settings, Trash2, Smartphone, Shield, Copy } from "lucide-react";

import { InstanceSettings } from "@/components/instance/InstanceSettings";
import { DeleteInstanceButton } from "@/components/instance/DeleteInstanceButton";
import { ConnectionStatus } from "@/components/instance/ConnectionStatus";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InstancePage(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    const instance = await prisma.instance.findUnique({
        where: { id },
    });

    if (!instance) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {instance.name}
                            <span className={`text-sm px-2.5 py-0.5 rounded-full border ${instance.status === 'connected'
                                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                                : 'bg-red-950/30 text-red-400 border-red-900/50'
                                }`}>
                                {instance.status === 'connected' ? 'Conectado' : 'Desconectado'}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">ID: {instance.id}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                        <RefreshCw size={16} />
                        Reiniciar
                    </button>
                    <DeleteInstanceButton instanceId={instance.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <ConnectionStatus instanceId={instance.id} initialStatus={instance.status} />
                <InstanceSettings instance={instance} />
            </div>
        </div>

    );
}
