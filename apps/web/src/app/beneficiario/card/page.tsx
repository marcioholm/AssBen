'use client'

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { LogOut, QrCode, Clock, Users, ShieldCheck } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'
import Link from 'next/link'

export default function BeneficiaryCardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [qrToken, setQrToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(120)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            router.push('/beneficiario')
            return
        }
        setUser(JSON.parse(storedUser))
    }, [router])

    useEffect(() => {
        let timer: any
        if (qrToken && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        } else if (timeLeft === 0) {
            setQrToken(null)
            setTimeLeft(120)
        }
        return () => clearInterval(timer)
    }, [qrToken, timeLeft])

    const generateQr = async () => {
        setLoading(true)
        try {
            const { token } = await api.validation.generateQr()
            setQrToken(token)
            setTimeLeft(120)
        } catch (e: any) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-white overflow-hidden">
            {/* Background Image/Pattern */}
            <div className="absolute inset-0 z-0 opacity-5">
                <Image src="/images/welcome.png" alt="Background" fill className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="card-digital">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">Digital Card</p>
                            <h2 className="text-2xl font-black">ACEBRAZ</h2>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-brand-green">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Beneficiário</p>
                            <p className="text-xl font-bold">{user.nome}</p>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Vínculo</p>
                                <p className="font-bold">{user.tipoVinculo}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Validade</p>
                                <p className="font-bold">DEZ/2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6 rounded-[2.5rem] bg-slate-50 p-10 shadow-xl border-2 border-slate-100">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-[#1c8f48]/5 animate-pulse"></div>
                        {qrToken ? (
                            <div className="relative bg-white p-4 rounded-3xl shadow-inner border-2 border-slate-100">
                                <QRCodeSVG value={qrToken} size={200} />
                            </div>
                        ) : (
                            <button
                                onClick={generateQr}
                                disabled={loading}
                                className="h-48 w-48 rounded-3xl bg-white flex flex-col items-center justify-center gap-3 text-slate-400 border-2 border-dashed border-slate-200 hover:border-[#1c8f48] hover:text-[#1c8f48] transition-all"
                            >
                                <QrCode className="h-12 w-12" />
                                <span className="text-xs font-black uppercase tracking-widest">Gerar QR Code</span>
                            </button>
                        )}
                    </div>

                    {qrToken && (
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-900">QR Code ativado</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3" /> Expira em {timeLeft}s
                            </p>
                        </div>
                    )}

                    <div className="w-full space-y-3">
                        {!qrToken ? (
                            <button
                                onClick={generateQr}
                                disabled={loading}
                                className="btn-acebraz btn-primary w-full"
                            >
                                {loading ? 'Gerando...' : 'GERAR QR CODE'}
                            </button>
                        ) : (
                            <button
                                onClick={generateQr}
                                disabled={loading}
                                className="btn-acebraz bg-slate-100 text-slate-600 w-full"
                            >
                                ATUALIZAR QR CODE
                            </button>
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem('token')
                                localStorage.removeItem('user')
                                router.push('/beneficiario')
                            }}
                            className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                        >
                            Sair da conta
                        </button>
                    </div>
                </div>

                <div className="mt-8 glass rounded-2xl p-4 text-center">
                    <p className="text-[10px] leading-relaxed text-slate-500">
                        Apresente este QR Code no balcão do parceiro para obter seu desconto. <br />
                        Em caso de instabilidade, informe seu CPF e PIN ao atendente.
                    </p>
                    <Link href="#privacidade" className="mt-2 block text-[10px] text-slate-400 hover:underline">
                        Nossos termos de uso e privacidade
                    </Link>
                </div>
            </div>
        </div>
    )
}
