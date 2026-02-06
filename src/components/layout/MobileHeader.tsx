"use client";

import { Menu } from "lucide-react";

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    return (
        <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    ConnectFlow
                </span>
            </div>
        </header>
    );
}
