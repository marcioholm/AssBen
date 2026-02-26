"use client"

import { useState, useRef } from 'react';
import { Presentation, MessageCircle, Mail, Maximize2, Minimize2, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const slides = [
    {
        title: "O que é o Clube ACEBRAZ?",
        content: "Uma rede exclusiva de benefícios mútuos entre empresas locais. Não é sobre baixar preço, é sobre girar a economia dentro da nossa própria rede de associados.",
        points: [
            "Fomentar o comércio local",
            "Aumentar o fluxo de clientes",
            "Valorizar os colaboradores"
        ]
    },
    {
        title: "Vantagens para o seu Negócio",
        content: "Ao se associar, sua empresa ganha visibilidade instantânea para milhares de funcionários e dependentes da rede ACEBRAZ.",
        points: [
            "Clientes qualificados e recorrentes",
            "Custo zero de adesão",
            "Marketing direcionado na vitrine do app"
        ]
    },
    {
        title: "Vantagens para o Colaborador",
        content: "Seus funcionários ganham poder de compra sem custo adicional para a empresa.",
        points: [
            "Descontos reais no dia a dia",
            "Sentimento de valorização (RH)",
            "Extensivo aos dependentes"
        ]
    },
    {
        title: "Como funciona na prática?",
        content: "Validação 100% digital e segura no balcão da sua loja.",
        points: [
            "O cliente gera um QR Code dinâmico no app",
            "Seu caixa lê o QR Code pelo portal do parceiro",
            "O desconto é aplicado na hora, sem fraudes"
        ]
    }
];

export default function VendasPage() {
    const [activeTab, setActiveTab] = useState<'slides' | 'textos'>('slides');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const presentationRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            presentationRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Texto copiado para a área de transferência!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Área de Vendas / Biblioteca de Pitch
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Ferramentas comerciais para apresentação e conversão de novos associados.
                    </p>
                </div>
            </div>

            <div className="flex space-x-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('slides')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'slides' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Presentation className="h-4 w-4" />
                        Apresentação de Impacto
                    </div>
                    {activeTab === 'slides' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('textos')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'textos' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Textos Prontos
                    </div>
                    {activeTab === 'textos' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'slides' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">Apresentação Institucional (Modo Tablet/Desktop)</h2>
                        <button
                            onClick={toggleFullscreen}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            {isFullscreen ? 'Sair da Tela Cheia' : 'Apresentar em Tela Cheia'}
                        </button>
                    </div>

                    <div
                        ref={presentationRef}
                        className={`bg-slate-900 transition-all duration-300 ${isFullscreen ? 'h-screen w-screen flex flex-col' : 'aspect-video relative overflow-hidden'}`}
                    >
                        {/* Slide Content */}
                        <div className="flex-1 flex flex-col justify-center px-12 md:px-24">
                            <div className="max-w-4xl mx-auto w-full">
                                <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4 block">ACEBRAZ Benefícios</span>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                    {slides[currentSlide].title}
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed">
                                    {slides[currentSlide].content}
                                </p>
                                <div className="space-y-6">
                                    {slides[currentSlide].points.map((point, i) => (
                                        <div key={i} className="flex items-center gap-4 text-lg md:text-xl text-slate-200 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                            <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-t from-slate-900 to-transparent">
                            <div className="flex gap-2">
                                {slides.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} />
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentSlide === slides.length - 1}
                                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'textos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WhatsApp Pitch */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-lg text-slate-800">Pitch por WhatsApp</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap font-medium border border-slate-100">
                            {`Olá [Nome], tudo bem?\n\nSou da ACEBRAZ e percebi que a [Nome da Empresa] tem muito potencial para atrair o público da nossa rede de associados.\n\nNós criamos o Clube de Benefícios ACEBRAZ exatamente para girar a economia local e trazer *clientes qualificados da própria rede para o seu balcão*.\n\nNão é baixar preço, é usar o desconto como isca de marketing para milhares de pessoas mapeadas.\n\nPodemos fazer uma call rápida de 10 min amanhã ou posso te visitar para te mostrar a plataforma? A adesão é gratuita para a empresa.`}
                        </div>
                        <button
                            onClick={() => copyToClipboard(`Olá [Nome], tudo bem?\n\nSou da ACEBRAZ e percebi que a [Nome da Empresa] tem muito potencial para atrair o público da nossa rede de associados.\n\nNós criamos o Clube de Benefícios ACEBRAZ exatamente para girar a economia local e trazer *clientes qualificados da própria rede para o seu balcão*.\n\nNão é baixar preço, é usar o desconto como isca de marketing para milhares de pessoas mapeadas.\n\nPodemos fazer uma call rápida de 10 min amanhã ou posso te visitar para te mostrar a plataforma? A adesão é gratuita para a empresa.`)}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors text-sm"
                        >
                            Copiar Texto
                        </button>
                    </div>

                    {/* Email Pitch */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Mail className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-lg text-slate-800">Pitch por E-mail</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap font-medium border border-slate-100 line-clamp-[10] hover:line-clamp-none transition-all">
                            {`Assunto: Aumente o fluxo de clientes conectando-se à rede ACEBRAZ\n\nOlá Equipe [Nome da Empresa],\n\nA ACEBRAZ acaba de lançar seu novo Clube de Benefícios 100% digital, conectando empresas locais a uma base crescente de associados, colaboradores e dependentes.\n\nGostaríamos de convidar a sua empresa a ser uma parceira oficial do programa. \n\nBenefícios de ser parceiro:\n- Visibilidade direta no app para milhares de potenciais clientes.\n- Aumento do ticket médio e fidelização.\n- Custo zero de adesão. Sua única "moeda" é o benefício que oferece.\n- Valorização do seu próprio time de RH (seus funcionários também ganham os descontos da rede inteira).\n\nGostaríamos de agendar uma breve apresentação para mostrar a plataforma e como a validação via QR code é simples e à prova de falhas na sua loja.\n\nQual o melhor horário esta semana?\n\nAtenciosamente,\n\nEquipe ACEBRAZ`}
                        </div>
                        <button
                            onClick={() => copyToClipboard(`Assunto: Aumente o fluxo de clientes conectando-se à rede ACEBRAZ\n\nOlá Equipe [Nome da Empresa],\n\nA ACEBRAZ acaba de lançar seu novo Clube de Benefícios 100% digital...`)}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors text-sm mt-auto"
                        >
                            Copiar Texto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
