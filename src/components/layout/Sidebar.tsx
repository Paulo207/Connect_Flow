"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Smartphone, Settings, FileText, HelpCircle, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/instances", label: "Instâncias", icon: Smartphone },
    { href: "/docs", label: "API Docs", icon: FileText },
    { href: "/support", label: "Suporte", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 z-30"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 
        bg-slate-900 text-white border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            ConnectFlow
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
