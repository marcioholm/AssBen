"use client"

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Clock, CheckSquare, XSquare, AlertTriangle, UserCheck, UserX } from 'lucide-react';

export default function RevalidacoesPage() {
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const data = await api.revalidations.getPending();
            setPending(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysLeft = (validadeStr: string) => {
        if (!validadeStr) return 0;
        const now = new Date();
        const validade = new Date(validadeStr);
        const diffTime = validade.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === pending.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pending.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkAction = async (action: 'revalidate' | 'inactivate') => {
        if (selectedIds.size === 0) return;

        const confirmMsg = action === 'revalidate'
            ? `Revalidar ${selectedIds.size} beneficiários por mais 12 meses?`
            : `Inativar definitivamente ${selectedIds.size} beneficiários? Eles perderão acesso ao clube.`;

        if (!confirm(confirmMsg)) return;

        setActionLoading(true);
        try {
            const idsArray = Array.from(selectedIds);
            if (action === 'revalidate') {
                await api.revalidations.bulkRevalidate({ beneficiaryIds: idsArray });
                alert(`${selectedIds.size} beneficiários revalidados com sucesso!`);
            } else {
                await api.revalidations.bulkInactivate({ beneficiaryIds: idsArray });
                alert(`${selectedIds.size} beneficiários inativados com sucesso.`);
            }
            setSelectedIds(new Set());
            await fetchPending();
        } catch (err: any) {
            alert(err.message || 'Erro ao processar a ação.');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-amber-500" />
                        Central de Revalidações
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestão de vínculos próximos ao vencimento (próximos 30 dias).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleBulkAction('inactivate')}
                        disabled={selectedIds.size === 0 || actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                        <UserX className="h-4 w-4" /> Inativar
                        {selectedIds.size > 0 && <span className="bg-white/50 px-1.5 rounded">{selectedIds.size}</span>}
                    </button>
                    <button
                        onClick={() => handleBulkAction('revalidate')}
                        disabled={selectedIds.size === 0 || actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        <UserCheck className="h-4 w-4" /> Renovar Vínculo
                        {selectedIds.size > 0 && <span className="bg-black/10 px-1.5 rounded">{selectedIds.size}</span>}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        {pending.length} registros requerem auditoria
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={pending.length > 0 && selectedIds.size === pending.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-colors cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Beneficiário</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Empresa (Origem)</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Vencimento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                            Carregando banco de revalidações...
                                        </div>
                                    </td>
                                </tr>
                            ) : pending.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full mb-3">
                                            <CheckSquare className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800">Tudo em dia!</h3>
                                        <p className="text-slate-500 mt-1">Nenhum beneficiário expira nos próximos 30 dias.</p>
                                    </td>
                                </tr>
                            ) : (
                                pending.map((item) => {
                                    const daysLeft = calculateDaysLeft(item.validade);
                                    const isUrgent = daysLeft <= 10;

                                    return (
                                        <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedIds.has(item.id) ? 'bg-blue-50/50' : ''}`} onClick={() => toggleSelect(item.id)}>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-colors cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{item.nome}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                    {item.cpfHmac}
                                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded">
                                                        {item.tipoVinculo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {item.empresaNome}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm font-semibold flex items-center gap-1.5 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                                                    {daysLeft <= 0 ? (
                                                        <>
                                                            <XSquare className="h-4 w-4" /> Expirado
                                                            {daysLeft < 0 ? ` (há ${Math.abs(daysLeft)} dias)` : ' (hoje)'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="h-4 w-4" /> Expira em {daysLeft} dias
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(item.validade).toLocaleDateString('pt-BR')}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
