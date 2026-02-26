'use client'

import { LayoutDashboard, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
    const stats = [
        { label: 'Validações Hoje', value: '42', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Tentativas Falhas', value: '3', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Beneficiários Ativos', value: '1,284', icon: Clock, color: 'text-brand-500', bg: 'bg-brand-50' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Bem-vindo ao painel de controle da ACEBRAZ.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="glass rounded-3xl p-6 shadow-sm">
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    )
                })}
            </div>

            <div className="glass overflow-hidden rounded-3xl p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Validações Recentes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <th className="pb-4">Data/Hora</th>
                                <th className="pb-4">Beneficiário</th>
                                <th className="pb-4">Parceiro</th>
                                <th className="pb-4">Resultado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="text-sm text-slate-600">
                                    <td className="py-4">26/02/2026 10:45</td>
                                    <td className="py-4 font-semibold text-slate-900">Rodrigo Magalhães</td>
                                    <td className="py-4">Supermercado Braz</td>
                                    <td className="py-4">
                                        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">APROVADO</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
