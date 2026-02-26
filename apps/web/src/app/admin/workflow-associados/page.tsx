"use client"

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Network, Edit, Search, Filter, Save, X } from 'lucide-react';

const WORKFLOW_STATUSES = ['LEAD', 'NEGOCIACAO', 'FECHADO', 'DOCS', 'CADASTRADO', 'ATIVO'];
const STATUS_COLORS: Record<string, string> = {
    'LEAD': 'bg-slate-100 text-slate-700 border-slate-200',
    'NEGOCIACAO': 'bg-purple-50 text-purple-700 border-purple-200',
    'FECHADO': 'bg-blue-50 text-blue-700 border-blue-200',
    'DOCS': 'bg-amber-50 text-amber-700 border-amber-200',
    'CADASTRADO': 'bg-teal-50 text-teal-700 border-teal-200',
    'ATIVO': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function WorkflowAssociadosPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingPartner, setEditingPartner] = useState<any | null>(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const data = await api.partners.findAll();
            setPartners(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPartner) return;

        try {
            await api.partners.update(editingPartner.id, {
                statusWorkFlow: editingPartner.statusWorkFlow,
                responsavel: editingPartner.responsavel,
                descontoAssociado: editingPartner.descontoAssociado,
                descontoFuncionario: editingPartner.descontoFuncionario,
                descontoDependente: editingPartner.descontoDependente,
                restricoes: editingPartner.restricoes,
                anotacoes: editingPartner.anotacoes,
            });
            setEditingPartner(null);
            fetchPartners();
        } catch (err) {
            alert('Erro ao salvar os dados.');
        }
    };

    const filteredPartners = partners.filter(p =>
        p.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
        p.cnpj.includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Workflow de Adesão
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestão do funil de vendas e onboarding de novos associados.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por Nome ou CNPJ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Filter className="h-4 w-4" />
                        <span>Total: {filteredPartners.length} empresas</span>
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Empresa</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Categoria</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status Frontend</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Responsável</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            Carregando funil...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPartners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nenhuma empresa encontrada com a busca informada.
                                    </td>
                                </tr>
                            ) : (
                                filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-800">{partner.nomeFantasia}</div>
                                            <div className="text-sm text-slate-500">{partner.cnpj}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700">{partner.categoria}</div>
                                            <div className="text-xs text-slate-400">{partner.subcategoria || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[partner.statusWorkFlow] || STATUS_COLORS['LEAD']}`}>
                                                {partner.statusWorkFlow}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {partner.responsavel || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setEditingPartner({ ...partner })}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Gerenciar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Editor Modal */}
            {editingPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingPartner(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Network className="h-5 w-5 text-blue-500" />
                                    Gerenciar Adesão
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">{editingPartner.nomeFantasia}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingPartner(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Funil State */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Funil de Vendas</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Status no Pipeline</label>
                                        <select
                                            value={editingPartner.statusWorkFlow}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, statusWorkFlow: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        >
                                            {WORKFLOW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Responsável ACEBRAZ</label>
                                        <input
                                            type="text"
                                            value={editingPartner.responsavel || ''}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, responsavel: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Nome do corretor/admin"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Anotações Internas</label>
                                        <textarea
                                            value={editingPartner.anotacoes || ''}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, anotacoes: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                            placeholder="Ex: Reunião agendada para sexta, focar no fluxo..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount Definitions */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Acordo de Clube (Benefícios)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">P/ Associados</label>
                                        <input
                                            type="text"
                                            value={editingPartner.descontoAssociado || ''}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, descontoAssociado: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Ex: 20%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">P/ Funcionários</label>
                                        <input
                                            type="text"
                                            value={editingPartner.descontoFuncionario || ''}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, descontoFuncionario: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Ex: 15%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">P/ Dependentes</label>
                                        <input
                                            type="text"
                                            value={editingPartner.descontoDependente || ''}
                                            onChange={(e) => setEditingPartner({ ...editingPartner, descontoDependente: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Ex: 10%"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Regras e Restrições (Termo)</label>
                                    <textarea
                                        value={editingPartner.restricoes || ''}
                                        onChange={(e) => setEditingPartner({ ...editingPartner, restricoes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Ex: Não cumulativo com outras promoções. Válido apenas para pagamento em PIX ou dinheiro."
                                    />
                                </div>
                            </div>
                        </form>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setEditingPartner(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSave}
                                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                            >
                                <Save className="h-4 w-4" />
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
