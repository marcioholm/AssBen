'use client'

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import Image from 'next/image'

export default function ChangePinPage() {
    const router = useRouter()
    const [newPin, setNewPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPin !== confirmPin) {
            setError('Os PINs não coincidem')
            return
        }
        if (newPin.length < 4) {
            setError('O PIN deve ter pelo menos 4 dígitos')
            return
        }

        setLoading(true)
        setError('')
        try {
            // We need a specific endpoint for self-PIN change or use update
            // For MVP simplicity and following prompt "força troca", 
            // I'll assume we use a dedicated change-pin endpoint in Beneficiaries or Auth
            await api.beneficiaries.changePin({ newPin })

            // Update local user state
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            user.forcarTrocaPin = false
            localStorage.setItem('user', JSON.stringify(user))

            setSuccess(true)
            setTimeout(() => router.push('/beneficiario/card'), 2000)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold">PIN alterado com sucesso!</h1>
                <p className="text-slate-500 mt-2">Redirecionando para sua carteirinha...</p>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-white overflow-hidden">
            {/* Background Image Decorative */}
            <div className="absolute inset-0 z-0 opacity-5 grayscale">
                <Image src="/images/unity.png" alt="Background" fill className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-md glass rounded-[3rem] p-10 shadow-2xl border-4 border-brand-green/20">
                <div className="text-center mb-10">
                    <div className="mx-auto h-20 w-20 rounded-full bg-brand-yellow flex items-center justify-center mb-6 shadow-xl shadow-brand-yellow/20 text-brand-green">
                        <Lock className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Novo PIN</h1>
                    <p className="mt-2 text-slate-500 font-medium tracking-tight">Sua segurança em primeiro lugar.</p>
                </div>

                {error && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-brand-green transition-colors">Defina seu PIN (4 a 8 dígitos)</label>
                            <input
                                type="password"
                                maxLength={8}
                                value={newPin}
                                onChange={e => setNewPin(e.target.value)}
                                className="mt-1 w-full border-b-2 border-slate-100 bg-transparent py-3 text-2xl font-black outline-none focus:border-brand-green transition-all"
                                placeholder="****"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-brand-green transition-colors">Confirme o PIN</label>
                            <input
                                type="password"
                                maxLength={8}
                                value={confirmPin}
                                onChange={e => setConfirmPin(e.target.value)}
                                className="mt-1 w-full border-b-2 border-slate-100 bg-transparent py-3 text-2xl font-black outline-none focus:border-brand-green transition-all"
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
                        {loading ? 'Salvando...' : 'CONFIRMAR NOVO PIN'}
                    </button>

                    <p className="text-[10px] text-center text-slate-400 font-bold leading-relaxed px-4">
                        Este PIN será solicitado sempre que você precisar validar um benefício manualmente no balcão de atendimento.
                    </p>
                </form>
            </div>
        </div>
    )
}
