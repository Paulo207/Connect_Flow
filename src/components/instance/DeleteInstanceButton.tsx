"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface DeleteInstanceButtonProps {
    instanceId: string;
}

export function DeleteInstanceButton({ instanceId }: DeleteInstanceButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/instances/${instanceId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/instances");
                router.refresh();
            } else {
                alert("Erro ao deletar instância.");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Error deleting instance:", error);
            alert("Erro ao deletar instância.");
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 border border-red-500/20"
            >
                <Trash2 size={16} />
                Deletar
            </button>

            <Modal
                isOpen={showModal}
                onClose={() => !isDeleting && setShowModal(false)}
                title="Deletar Instância"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        <AlertTriangle size={20} />
                        <p className="text-sm font-medium">Atenção: Esta ação é irreversível.</p>
                    </div>

                    <p className="text-slate-300">
                        Tem certeza que deseja deletar esta instância? Todos os dados, sessões e configurações serão perdidos permanentemente.
                    </p>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setShowModal(false)}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20"
                        >
                            {isDeleting ? "Deletando..." : "Sim, deletar instância"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
