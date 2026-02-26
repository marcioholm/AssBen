'use client'

'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { BrowserMultiFormatReader } from '@zxing/library'
import { api } from '@/lib/api'
import { CheckCircle2, XCircle, AlertCircle, QrCode, User } from 'lucide-react'

function BalcaoContent() {
    const searchParams = useSearchParams()
    const tokenValidacao = searchParams.get('tokenValidacao')

    const [mode, setMode] = useState<'scan' | 'manual'>('scan')
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [manualCpf, setManualCpf] = useState('')
    const [manualPin, setManualPin] = useState('')

    const videoRef = useRef<HTMLVideoElement>(null)
    const codeReader = useRef(new BrowserMultiFormatReader())

    useEffect(() => {
        if (mode === 'scan' && tokenValidacao && !result) {
            startScanner()
        }
        return () => codeReader.current.reset()
    }, [mode, tokenValidacao, result])

    const startScanner = async () => {
        try {
            const videoInputDevices = await codeReader.current.listVideoInputDevices()
            const selectedDevice = videoInputDevices[0].deviceId

            codeReader.current.decodeFromVideoDevice(selectedDevice, videoRef.current, (res: any, err: any) => {
                if (res) {
                    handleValidateQr(res.getText())
                }
            })
        } catch (e) {
            setError('Câmera não encontrada ou permissão negada.')
        }
    }

    const handleValidateQr = async (token: string) => {
        setLoading(true)
        setError('')
        try {
            const data = await api.validation.validateQr({ token, parceiroToken: tokenValidacao })
            setResult(data)
            codeReader.current.reset()
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const handleManualValidation = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await api.validation.validateCpfPin({
                cpf: manualCpf,
                pin: manualPin,
                parceiroToken: tokenValidacao
            })
            setResult(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    if (!tokenValidacao) {
        return <div className="p-8 text-center">Token de validação do parceiro não fornecido na URL.</div>
    }

    if (result) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
                {result.resultado === 'APROVADO' ? (
                    <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl border-4 border-brand-green/20">
                        <CheckCircle2 className="mx-auto mb-4 h-24 w-24 text-brand-green" />
                        <h1 className="text-3xl font-black text-slate-900">APROVADO</h1>
                        <p className="mt-4 text-xl text-slate-600">{result.beneficiario.nome}</p>
                        <p className="text-sm uppercase tracking-widest text-slate-400">{result.beneficiario.tipoVinculo}</p>
                        <button
                            onClick={() => { setResult(null); setMode('scan') }}
                            className="mt-8 w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800"
                        >
                            PRÓXIMO CLIENTE
                        </button>
                    </div>
                ) : (
                    <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <XCircle className="mx-auto mb-4 h-24 w-24 text-red-500" />
                        <h1 className="text-3xl font-bold text-slate-900">NEGADO</h1>
                        <p className="mt-2 text-slate-600">Benefício não autorizado ou token inválido.</p>
                        <button onClick={() => setResult(null)} className="mt-8 w-full rounded-xl bg-slate-900 py-4 font-bold text-white">TENTAR NOVAMENTE</button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col p-6">
            <header className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900">ACEBRAZ Balcão</h1>
                <p className="text-slate-500">Validação em tempo real</p>
            </header>

            <div className="flex-1 flex flex-col items-center">
                <div className="mb-6 flex w-full max-w-md rounded-xl bg-slate-200 p-1">
                    <button
                        onClick={() => setMode('scan')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${mode === 'scan' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
                    >
                        <QrCode className="h-4 w-4" /> LEITOR QR
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${mode === 'manual' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
                    >
                        <User className="h-4 w-4" /> CPF + PIN
                    </button>
                </div>

                {error && (
                    <div className="mb-4 flex w-full max-w-md items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {mode === 'scan' ? (
                    <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-3xl bg-black shadow-2xl ring-4 ring-white/50">
                        <video ref={videoRef} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="h-64 w-64 rounded-3xl border-2 border-dashed border-white/50" />
                            <p className="mt-4 text-sm font-medium text-white/70">Aponte para o QR Code do cliente</p>
                        </div>
                        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">Validando...</div>}
                    </div>
                ) : (
                    <form onSubmit={handleManualValidation} className="glass w-full max-w-md rounded-3xl p-8 shadow-xl">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">CPF</label>
                                <input
                                    type="text"
                                    maxLength={11}
                                    value={manualCpf}
                                    onChange={e => setManualCpf(e.target.value)}
                                    className="mt-1 w-full border-b-2 border-slate-200 bg-transparent py-2 text-lg outline-none focus:border-slate-900"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">PIN</label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={manualPin}
                                    onChange={e => setManualPin(e.target.value)}
                                    className="mt-1 w-full border-b-2 border-slate-200 bg-transparent py-2 text-lg outline-none focus:border-slate-900"
                                    placeholder="****"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-acebraz btn-primary w-full"
                            >
                                {loading ? 'Validando...' : 'VALIDAR AGORA'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <footer className="mt-12 text-center text-xs text-slate-400">
                &copy; 2026 ACEBRAZ - Associação Comercial de Wenceslau Braz
            </footer>
        </div>
    )
}

export default function BalcaoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Caregando balcão...</div>}>
            <BalcaoContent />
        </Suspense>
    )
}
