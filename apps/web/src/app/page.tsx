import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, ShieldCheck, ShoppingBag } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-yellow/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"></div>

            <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:gap-12 lg:py-24">
                <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-bold text-brand-green">
                        <Users className="h-4 w-4" /> ACEBRAZ CONECTADA
                    </div>

                    <h1 className="mt-6 text-5xl font-black leading-tight text-slate-900 sm:text-7xl">
                        Clube de <span className="text-brand-green">Benefícios</span> ACEBRAZ
                    </h1>

                    <p className="mt-8 text-xl leading-relaxed text-slate-600">
                        Fortalecendo o comércio local através do assossiativismo.
                        Unidos somos mais fortes para crescer e oferecer vantagens exclusivas para nossa comunidade.
                    </p>

                    <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                        <Link href="/beneficiario" className="btn-acebraz btn-primary">
                            ÁREA DO BENEFICIÁRIO <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link href="/associados" className="btn-acebraz bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green/5">
                            <ShoppingBag className="h-5 w-5" /> VER CATALOGO
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span> MVP em Produção
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                            Pronto para Escalar
                        </div>
                    </div>
                </div>

                <div className="mt-16 lg:mt-0 lg:w-1/2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[3rem] shadow-2xl ring-8 ring-brand-yellow/20">
                        <Image
                            src="/images/unity.png"
                            alt="Associativismo ACEBRAZ"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/40 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 right-10 glass rounded-2xl p-6 text-brand-green">
                            <ShieldCheck className="h-8 w-8 mb-2" />
                            <p className="font-bold text-lg leading-snug">
                                "Onde há união, há vitória. ACEBRAZ: A força do nosso comércio."
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 border-t border-slate-100 py-12 text-center text-slate-400">
                <p className="text-sm font-medium">
                    &copy; 2026 ACEBRAZ - Associação Comercial de Wenceslau Braz
                </p>
            </footer>
        </div>
    )
}
