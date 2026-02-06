
"use client";

import { useEffect, useState } from "react";
import { Smartphone, Shield, Search } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ConnectionStatusProps {
    instanceId: string;
    initialStatus: string;
}

export function ConnectionStatus({ instanceId, initialStatus }: ConnectionStatusProps) {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        // Poll status every 3 seconds
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/instances/${instanceId}/status`);
                const data = await res.json();

                if (data.status) {
                    setStatus(data.status);
                }

                if (data.status === "connected") {
                    setQrCode(null);
                } else if (data.qrCode) {
                    setQrCode(data.qrCode);
                }
            } catch (e) {
                console.error("Failed to poll status", e);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [instanceId]);

    // If connected
    if (status === "connected") {
        return (
            <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Instância Conectada</h3>
                <p className="text-slate-400 max-w-md">
                    Sua instância está sincronizada e pronta para enviar mensagens.
                </p>
            </div>
        );
    }

    // If disconnected and waiting for QR Code or Scan
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12 animate-in fade-in">
            <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                        <Smartphone className="text-slate-400" />
                        Conectar WhatsApp
                    </h3>
                    <p className="text-slate-400">
                        Escaneie o QR Code abaixo com o seu celular para conectar esta instância.
                    </p>
                </div>

                <ol className="text-sm text-slate-400 space-y-3 inline-block text-left">
                    <li className="flex items-center gap-2">
                        <span className="bg-slate-800 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        Abra o WhatsApp no seu celular
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="bg-slate-800 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        Toque em Mais opções ou Configurações
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="bg-slate-800 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        Selecione Aparelhos conectados e Conectar aparelho
                    </li>
                </ol>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xl shadow-black/20">
                {qrCode ? (
                    <QRCodeSVG value={qrCode} size={260} level={"H"} />
                ) : (
                    <div className="w-[260px] h-[260px] bg-slate-100 rounded flex flex-col items-center justify-center text-slate-400 gap-4 animate-pulse">
                        <Search size={40} />
                        <span className="text-sm font-medium">Buscando QR Code...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
