'use client'

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export default function BeneficiaryLoginPage() {
    const router = useRouter()
    const [cpf, setCpf] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { access_token, user } = await api.auth.beneficiaryLogin({ cpf, pin })
            localStorage.setItem('token', access_token)
            localStorage.setItem('user', JSON.stringify(user))

            if (user.forcarTrocaPin) {
                router.push('/beneficiario/trocar-pin')
            } else {
                router.push('/beneficiario/card')
            }
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-white overflow-hidden">
            {/* Background Image Decorative */}
            <div className="absolute inset-0 z-0 opacity-10 blur-sm scale-110">
                <Image src="/images/welcome.png" alt="Background" fill className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-8 glass rounded-[3rem] p-10 shadow-2xl border-4 border-brand-green/20">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-3xl bg-brand-green flex items-center justify-center mb-6 shadow-xl shadow-brand-green/30">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Olá, Associado!</h1>
                    <p className="mt-2 text-slate-500 font-medium">Acesse sua carteirinha digital da ACEBRAZ</p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-brand-green transition-colors">CPF do Titular</label>
                            <input
                                type="text"
                                maxLength={11}
                                value={cpf}
                                onChange={e => setCpf(e.target.value)}
                                className="mt-1 w-full border-b-2 border-slate-100 bg-transparent py-3 text-xl font-bold outline-none focus:border-brand-green transition-all"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-brand-green transition-colors">PIN de Acesso</label>
                            <input
                                type="password"
                                maxLength={8}
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                                className="mt-1 w-full border-b-2 border-slate-100 bg-transparent py-3 text-xl font-bold outline-none focus:border-brand-green transition-all"
                                placeholder="****"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-acebraz btn-primary w-full py-5 text-lg"
                    >
                        {loading ? 'Validando...' : (
                            <>ENTRAR NA CONTA <ArrowRight className="h-6 w-6" /></>
                        )}
                    </button>
                </form>

                <div className="pt-6 text-center">
                    <p className="text-xs font-bold text-slate-400">
                        Esqueceu seu PIN? <br />
                        <span className="text-brand-green cursor-pointer hover:underline">Solicite um novo na sede da ACEBRAZ.</span>
                    </p>
                </div>
            </div>

            <p className="relative z-10 mt-12 text-[10px] font-bold uppercase tracking-widest text-brand-green/50">
                ACEBRAZ &copy; 2026 - Conectando Negócios
            </p>
        </div>
    )
}
