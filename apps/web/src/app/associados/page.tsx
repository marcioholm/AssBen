'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Search, MapPin, Tag, Phone, ArrowRight, Building2, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ParceirosPage() {
    const [partners, setPartners] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPartners()
    }, [])

    const fetchPartners = async () => {
        try {
            // Simulated fetch with actual endpoints if available
            // const data = await api.partners.findAll() 
            // setPartners(data)

            // For MVP/Demo:
            setPartners([
                { id: '1', nomeFantasia: 'Restaurante Central', categoria: 'Alimentação', endereco: 'Rua Principal, 100', contato: '43 9999-9999', rules: '15% de desconto no buffet' },
                { id: '2', nomeFantasia: 'Farmácia Vida', categoria: 'Saúde', endereco: 'Av. Brasil, 500', contato: '43 8888-8888', rules: '10% em medicamentos genéricos' },
                { id: '3', nomeFantasia: 'Academia Fit', categoria: 'Lazer', endereco: 'Rua 7 de Setembro, 20', contato: '43 7777-7777', rules: 'Isenção de matrícula' },
                { id: '4', nomeFantasia: 'Posto Alvorada', categoria: 'Serviços', endereco: 'Rodovia BR-369', contato: '43 3333-3333', rules: 'R$ 0,10 de desconto por litro' },
                { id: '5', nomeFantasia: 'Padaria Pão de Mel', categoria: 'Alimentação', endereco: 'Rua das Flores, 45', contato: '43 2222-2222', rules: 'Café grátis em compras acima de R$ 20' },
            ])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filteredPartners = partners.filter(p =>
        p.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
        p.categoria.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="relative min-h-screen bg-white">
            {/* Background Decorative */}
            <div className="absolute inset-0 z-0 opacity-[0.03] grayscale pointer-events-none">
                <Image src="/images/unity.png" alt="Background" fill className="object-cover" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-24">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-bold text-brand-green mb-6">
                        <Store className="h-4 w-4" /> REDE CONVENIADA
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
                        Onde <span className="text-brand-green">Economizar</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500">
                        Como associado ACEBRAZ, você tem acesso a centenas de descontos exclusivos em nossa cidade.
                        Fortaleça o comércio local e aproveite suas vantagens.
                    </p>

                    <div className="mt-12 flex max-w-2xl items-center gap-4 rounded-3xl bg-white p-3 shadow-2xl shadow-slate-200 border border-slate-100">
                        <div className="flex flex-1 items-center gap-3 px-3">
                            <Search className="h-6 w-6 text-slate-400" />
                            <input
                                type="text"
                                placeholder="O que você está procurando hoje?"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-transparent py-3 text-lg font-medium outline-none placeholder:text-slate-300"
                            />
                        </div>
                        <button className="hidden sm:block rounded-2xl bg-brand-green px-8 py-3 font-bold text-white transition-transform active:scale-95">
                            BUSCAR
                        </button>
                    </div>
                </header>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPartners.map(p => (
                        <div key={p.id} className="group relative rounded-[2.5rem] bg-slate-50 p-2 transition-all hover:bg-white hover:shadow-2xl hover:shadow-brand-green/10 hover:-translate-y-2 border-2 border-transparent hover:border-brand-green/10">
                            <div className="relative h-48 overflow-hidden rounded-[2rem] bg-white">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                {p.logoUrl ? (
                                    <Image src={p.logoUrl} alt={p.nomeFantasia} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-100/50 text-slate-300">
                                        <Building2 className="h-16 w-16" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-green shadow-sm">
                                    {p.categoria}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-black text-slate-900 line-clamp-1">{p.nomeFantasia}</h3>

                                <div className="mt-4 space-y-3 text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="line-clamp-1">{p.endereco || 'Consultar endereço'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span>{p.contato || 'Solicitar fone'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl bg-brand-yellow/10 p-4 border border-brand-yellow/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag className="h-3 w-3 text-brand-green" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Vantagem Exclusiva</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">
                                        {p.rules || 'Apresente o cartão para conferir'}
                                    </p>
                                </div>

                                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-[0.2em] text-brand-green border-2 border-brand-green/30 transition-all hover:bg-brand-green hover:text-white">
                                    VER DETALHES <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPartners.length === 0 && !loading && (
                    <div className="mt-20 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                            <Search className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Nenhum parceiro encontrado</h2>
                        <p className="mt-2 text-slate-500">Tente buscar por um termo diferente ou outra categoria.</p>
                        <button
                            onClick={() => setSearch('')}
                            className="mt-8 font-black text-brand-green hover:underline uppercase tracking-widest text-xs"
                        >
                            Limpar busca
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
