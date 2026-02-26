"use client"

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

type Vinculo = 'ASSOCIADO' | 'FUNCIONARIO' | 'DEPENDENTE';

interface BeneficiaryRow {
    nome: string;
    cpf: string;
    tipoVinculo: Vinculo;
    id: number;
}

export default function FormulariosCadastroPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [selectedPartner, setSelectedPartner] = useState('');
    const [mode, setMode] = useState<'manual' | 'csv'>('manual');

    const [rows, setRows] = useState<BeneficiaryRow[]>([
        { id: 1, nome: '', cpf: '', tipoVinculo: 'FUNCIONARIO' }
    ]);
    const [termoAceito, setTermoAceito] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        api.partners.findAll().then(setPartners).catch(console.error);
    }, []);

    const addRow = () => {
        setRows([...rows, { id: Date.now(), nome: '', cpf: '', tipoVinculo: 'FUNCIONARIO' }]);
    };

    const removeRow = (id: number) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const updateRow = (id: number, field: string, value: string) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');

            const parsedRows: BeneficiaryRow[] = [];
            // Skip header if typical format
            const startIdx = lines[0].toLowerCase().includes('nome') ? 1 : 0;

            for (let i = startIdx; i < lines.length; i++) {
                const parts = lines[i].split(',').map(p => p.trim());
                if (parts.length >= 3) {
                    const vinculoRaw = parts[2].toUpperCase() as Vinculo;
                    const vinculo = ['ASSOCIADO', 'FUNCIONARIO', 'DEPENDENTE'].includes(vinculoRaw) ? vinculoRaw : 'FUNCIONARIO';

                    parsedRows.push({
                        id: Date.now() + i,
                        nome: parts[0],
                        cpf: parts[1].replace(/\D/g, ''),
                        tipoVinculo: vinculo
                    });
                }
            }

            if (parsedRows.length > 0) {
                setRows(parsedRows);
                setFeedback({ type: 'success', message: `${parsedRows.length} registros extraídos do CSV com sucesso.` });
            } else {
                setFeedback({ type: 'error', message: 'Nenhum registro válido encontrado no CSV. Use o formato: Nome, CPF, Vinculo' });
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPartner) {
            setFeedback({ type: 'error', message: 'Selecione uma empresa associada.' });
            return;
        }
        if (!termoAceito) {
            setFeedback({ type: 'error', message: 'Você deve aceitar o termo de responsabilidade.' });
            return;
        }

        const validRows = rows.filter(r => r.nome && r.cpf.length >= 11);
        if (validRows.length === 0) {
            setFeedback({ type: 'error', message: 'Preencha pelo menos um beneficiário válido (CPF 11 dígitos).' });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const res = await api.beneficiaries.bulkCreate({
                associadoEmpresaId: selectedPartner,
                termoAceito,
                beneficiaries: validRows.map(r => ({
                    nome: r.nome,
                    cpf: r.cpf,
                    tipoVinculo: r.tipoVinculo
                }))
            });

            if (res.errors && res.errors.length > 0) {
                setFeedback({
                    type: 'error',
                    message: `${res.successCount} salvos, mas houve erros: ${res.errors.join(', ')}`
                });
            } else {
                setFeedback({ type: 'success', message: `${res.successCount} beneficiários cadastrados com sucesso!` });
                setRows([{ id: Date.now(), nome: '', cpf: '', tipoVinculo: 'FUNCIONARIO' }]);
                setTermoAceito(false);
            }
        } catch (err: any) {
            setFeedback({ type: 'error', message: err.message || 'Erro ao salvar os beneficiários.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                    Cadastro em Lote
                </h1>
                <p className="text-slate-500 mt-1">
                    Adicione rapidamente colaboradores e dependentes para as empresas associadas.
                </p>
            </div>

            {feedback && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="font-medium text-sm">{feedback.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Step 1: Select Partner */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">1. Selecione a Empresa Associada</label>
                    <select
                        value={selectedPartner}
                        onChange={e => setSelectedPartner(e.target.value)}
                        className="w-full max-w-md px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">-- Selecione --</option>
                        {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.nomeFantasia} ({p.cnpj})</option>
                        ))}
                    </select>
                </div>

                {/* Step 2: Input Method */}
                <div className="p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">2. Dados dos Beneficiários</label>
                    <div className="flex space-x-2 mb-6 p-1 bg-slate-100/50 rounded-xl border border-slate-100 w-fit">
                        <button
                            type="button"
                            onClick={() => setMode('manual')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Users className="h-4 w-4" /> Digitação Rápida
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('csv')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${mode === 'csv' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Upload className="h-4 w-4" /> Importar CSV
                        </button>
                    </div>

                    {mode === 'csv' && (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors mb-6 cursor-pointer relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium mb-1">Clique ou arraste um arquivo CSV</p>
                            <p className="text-slate-400 text-sm">Formato: Nome, CPF (somente números), Vínculo (ASSOCIADO, FUNCIONARIO, DEPENDENTE)</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="grid grid-cols-[1fr,150px,150px,auto] gap-4 mb-2 px-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome Completo</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vínculo</div>
                            <div className="w-8"></div>
                        </div>
                        {rows.map((row, index) => (
                            <div key={row.id} className="grid grid-cols-[1fr,150px,150px,auto] gap-4 items-center bg-slate-50 p-2 rounded-xl group hover:bg-slate-100 transition-colors">
                                <input
                                    type="text"
                                    value={row.nome}
                                    onChange={(e) => updateRow(row.id, 'nome', e.target.value)}
                                    placeholder="Nome Completo"
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                />
                                <input
                                    type="text"
                                    value={row.cpf}
                                    onChange={(e) => updateRow(row.id, 'cpf', e.target.value)}
                                    placeholder="CPF (apenas n°)"
                                    maxLength={11}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                />
                                <select
                                    value={row.tipoVinculo}
                                    onChange={(e) => updateRow(row.id, 'tipoVinculo', e.target.value)}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm bg-white"
                                >
                                    <option value="FUNCIONARIO">Funcionário</option>
                                    <option value="DEPENDENTE">Dependente</option>
                                    <option value="ASSOCIADO">Sócio/Dono</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeRow(row.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {mode === 'manual' && (
                        <button
                            type="button"
                            onClick={addRow}
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        >
                            <Plus className="h-4 w-4" /> Adicionar Linha
                        </button>
                    )}
                </div>

                {/* Step 3: Term & Submit */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
                    <label className="flex items-start gap-3 cursor-pointer group mb-6">
                        <div className="relative flex items-center mt-0.5">
                            <input
                                type="checkbox"
                                checked={termoAceito}
                                onChange={(e) => setTermoAceito(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-colors block"
                            />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-slate-800">Termo de Responsabilidade</p>
                            <p className="text-slate-500 mt-0.5">Declaro que o associado (empresa) forneceu estes dados e se responsabilizou pela sua veracidade e finalidade, isentando a ACEBRAZ de responsabilidade pelo compartilhamento dos CPFs para inclusão no Clube.</p>
                        </div>
                    </label>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !termoAceito || !selectedPartner}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl shadow-sm transition-all"
                        >
                            {isSubmitting ? 'Salvando...' : 'Cadastrar e Ativar Beneficiários'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
