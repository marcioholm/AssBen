'use client'

import Link from 'next/link'
import { LayoutDashboard, Users, Store, FileBarChart, LogOut, Presentation, Network, ListPlus, Clock } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Parceiros', icon: Store, href: '/admin/partners' },
        { name: 'Workflow de Adesão', icon: Network, href: '/admin/workflow-associados' },
        { name: 'Área de Vendas', icon: Presentation, href: '/admin/vendas' },
        { name: 'Beneficiários', icon: Users, href: '/admin/beneficiaries' },
        { name: 'Cadastro em Lote', icon: ListPlus, href: '/admin/formularios-cadastro' },
        { name: 'Revalidações', icon: Clock, href: '/admin/revalidacoes' },
        { name: 'Relatórios', icon: FileBarChart, href: '/admin/reports' },
    ]

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-8">
                    <h1 className="text-xl font-bold tracking-tight">ACEBRAZ <span className="text-brand-500">Admin</span></h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
