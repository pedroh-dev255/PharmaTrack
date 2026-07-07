'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ShieldCheck,
    X,
    Lock,
    Database,
    Eye,
    UserCheck,
    FileText,
    Scale,
    Pill,
    Users,
    ClipboardCheck,
    AlertCircle
} from 'lucide-react';

export default function PrivacyPolicyModal({
    open,
    onClose
}) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="
                    fixed inset-0
                    z-[999]
                    bg-black/40
                    backdrop-blur-sm
                    flex items-center justify-center
                    p-4
                "
                onClick={onClose}
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: 20
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="
                        w-full
                        max-w-4xl
                        max-h-[90vh]
                        overflow-hidden
                        rounded-3xl
                        bg-white/95
                        backdrop-blur-xl
                        shadow-[0_8px_40px_rgba(0,0,0,0.08)]
                        border border-white/60
                        flex flex-col
                    "
                >
                    {/* HEADER */}
                    <div className="
                        px-6 md:px-8
                        py-6
                        border-b border-gray-100/80
                        bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/30
                        flex items-center justify-between
                    ">
                        <div className="flex items-center gap-4">
                            <div className="
                                w-14 h-14
                                rounded-2xl
                                bg-gradient-to-br from-blue-500 to-cyan-400
                                shadow-lg shadow-blue-200/50
                                flex items-center justify-center
                            ">
                                <ShieldCheck size={28} className="text-white" />
                            </div>

                            <div>
                                <h2 className="
                                    text-xl md:text-2xl
                                    font-bold
                                    bg-gradient-to-r from-gray-800 to-gray-700
                                    bg-clip-text text-transparent
                                ">
                                    Política de Privacidade
                                </h2>

                                <p className="text-sm text-gray-500">
                                    PharmaTrack - Sistema de Controle de Estoque de Medicamentos
                                </p>
                                <p className="text-xs text-gray-400">
                                    Atualizada em Julho de 2026
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="
                                p-2.5
                                rounded-xl
                                hover:bg-gray-100/80
                                transition-all duration-200
                                text-gray-400 hover:text-gray-600
                            "
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="
                        flex-1
                        overflow-y-auto
                        px-6 md:px-8
                        py-6
                        space-y-8
                        text-sm md:text-base
                        leading-relaxed
                        text-gray-700
                    ">
                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    1. Compromisso com a Privacidade e Segurança dos Pacientes
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                A privacidade e a proteção das informações relacionadas à saúde dos pacientes,
                                dados médicos e operações de dispensação de medicamentos são princípios 
                                fundamentais deste sistema. Todas as operações de tratamento de dados são 
                                realizadas em conformidade com:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018);</li>
                                <li>Lei do Ato Médico (Lei nº 12.842/2013);</li>
                                <li>Código de Ética Médica do Conselho Federal de Medicina (CFM);</li>
                                <li>Resoluções da ANVISA sobre controle de medicamentos;</li>
                                <li>Demais normas aplicáveis ao setor de saúde e farmácia clínica.</li>
                            </ul>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Database size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    2. Dados Coletados no Sistema
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O sistema de controle de estoque de medicamentos coleta e processa 
                                diferentes categorias de dados para garantir a rastreabilidade e segurança 
                                no gerenciamento de medicamentos:
                            </p>

                            <div className="mt-4 space-y-3">
                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <Users size={16} />
                                        Dados de Usuários e Profissionais
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Dados cadastrais de médicos, enfermeiros e farmacêuticos;</li>
                                        <li>Registros de prescrições médicas e solicitações de medicamentos;</li>
                                        <li>Autorizações e níveis de acesso para dispensação;</li>
                                        <li>Logs de auditoria com identificação do profissional responsável.</li>
                                    </ul>
                                </div>

                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <Pill size={16} />
                                        Dados de Medicamentos e Estoque
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Nome, lote, validade e quantidade de medicamentos;</li>
                                        <li>Registros de entrada, saída e movimentação do estoque;</li>
                                        <li>Rastreabilidade de medicamentos controlados e especiais;</li>
                                        <li>Alertas de validade e controle de temperatura quando aplicável.</li>
                                    </ul>
                                </div>

                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <ClipboardCheck size={16} />
                                        Dados de Dispensação e Pacientes
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Registros de medicamentos dispensados aos pacientes;</li>
                                        <li>Histórico de prescrições e solicitações;</li>
                                        <li>Informações de dosagem, posologia e orientações de uso;</li>
                                        <li>Controle de medicamentos devolvidos ou não retirados.</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-gray-500 bg-yellow-50/50 rounded-lg p-3 border border-yellow-200/50 flex items-start gap-2">
                                <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Importante:</strong> Todos os dados de pacientes são tratados com 
                                    estrito sigilo e apenas profissionais autorizados têm acesso às informações 
                                    necessárias para a dispensação segura de medicamentos.
                                </span>
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <Eye size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    3. Finalidade da Utilização dos Dados
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Os dados coletados são utilizados exclusivamente para as seguintes 
                                finalidades clínicas e operacionais:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Gerenciamento de Estoque:</strong> Controle preciso de entrada, 
                                    saída e validade de medicamentos, evitando desperdícios e garantindo 
                                    disponibilidade.
                                </li>
                                <li>
                                    <strong>Dispensação Segura:</strong> Registro de medicamentos fornecidos 
                                    aos pacientes, com rastreabilidade completa do profissional que autorizou 
                                    e realizou a dispensação.
                                </li>
                                <li>
                                    <strong>Prescrição Eletrônica:</strong> Registro digital de prescrições 
                                    médicas, garantindo legibilidade e rastreabilidade.
                                </li>
                                <li>
                                    <strong>Controle de Medicamentos Controlados:</strong> Atendimento às 
                                    exigências da ANVISA e órgãos reguladores para substâncias sujeitas a 
                                    controle especial.
                                </li>
                                <li>
                                    <strong>Relatórios e Indicadores:</strong> Geração de relatórios gerenciais 
                                    para otimização do estoque e redução de custos operacionais.
                                </li>
                                <li>
                                    <strong>Segurança do Paciente:</strong> Prevenção de erros de medicação 
                                    através de alertas de interações, alergias e contraindicações.
                                </li>
                            </ul>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Scale size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    4. Compartilhamento de Dados
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Os dados relacionados a medicamentos, prescrições e pacientes são 
                                compartilhados exclusivamente nas seguintes situações:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Comunicação Interna:</strong> Entre profissionais de saúde 
                                    autorizados (médicos, enfermeiros, farmacêuticos) para garantir a 
                                    continuidade do cuidado ao paciente.
                                </li>
                                <li>
                                    <strong>Fornecedores e Distribuidores:</strong> Exclusivamente dados de 
                                    medicamentos e estoque, sem informações de identificação de pacientes.
                                </li>
                                <li>
                                    <strong>Órgãos Reguladores:</strong> Quando exigido por lei, como a 
                                    ANVISA para controle de medicamentos sujeitos a prescrição especial.
                                </li>
                                <li>
                                    <strong>Parceiros Tecnológicos:</strong> Prestadores de serviços que 
                                    atuam como operadores de dados, sob contratos rigorosos de 
                                    confidencialidade e segurança.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                <strong>Não compartilhamos</strong> dados de pacientes com terceiros para 
                                finalidades comerciais, de marketing ou qualquer outro propósito não 
                                autorizado.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    5. Ferramentas de Monitoramento
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O sistema utiliza ferramentas de monitoramento para garantir a qualidade 
                                e segurança dos serviços prestados:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Logs de Auditoria:</strong> Registro detalhado de todas as 
                                    operações realizadas no sistema, garantindo rastreabilidade e 
                                    conformidade.
                                </li>
                                <li>
                                    <strong>Controle de Acesso:</strong> Monitoramento de tentativas de 
                                    acesso e autenticação de usuários.
                                </li>
                                <li>
                                    <strong>Alertas de Segurança:</strong> Notificações automáticas sobre 
                                    atividades suspeitas ou não autorizadas.
                                </li>
                                <li>
                                    <strong>Análise de Desempenho:</strong> Ferramentas como Microsoft Clarity 
                                    e Google Analytics para melhorar a experiência do usuário, sem coletar 
                                    dados sensíveis de pacientes.
                                </li>
                            </ul>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Lock size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    6. Segurança das Informações
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Implementamos rigorosas medidas de segurança para proteger os dados 
                                de medicamentos e pacientes:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Criptografia de Dados:</strong> Todos os dados sensíveis são 
                                    criptografados em trânsito e em repouso.
                                </li>
                                <li>
                                    <strong>Autenticação em Duas Etapas (2FA):</strong> Proteção adicional 
                                    para acessos ao sistema.
                                </li>
                                <li>
                                    <strong>Controle de Acesso Baseado em Papéis (RBAC):</strong> Cada 
                                    profissional tem acesso apenas às informações necessárias para suas 
                                    funções específicas.
                                </li>
                                <li>
                                    <strong>Backups Criptografados:</strong> Cópias de segurança regulares e 
                                    protegidas para recuperação em caso de incidentes.
                                </li>
                                <li>
                                    <strong>Monitoramento Contínuo:</strong> Detecção e resposta rápida a 
                                    ameaças à segurança.
                                </li>
                            </ul>

                            <div className="mt-4 bg-green-50/50 rounded-lg p-3 border border-green-200/50">
                                <p className="text-sm text-green-700 flex items-start gap-2">
                                    <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Certificação:</strong> Nossos padrões de segurança estão 
                                        alinhados com as melhores práticas do setor de saúde, incluindo 
                                        conformidade com a HIPAA (para clientes internacionais) e requisitos 
                                        da ANVISA para sistemas de controle de medicamentos.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <UserCheck size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    7. Responsabilidades dos Profissionais
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Todos os profissionais que utilizam o sistema têm responsabilidades 
                                específicas:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Médicos:</strong> Responsáveis pela prescrição correta de 
                                    medicamentos, considerando alergias, interações e contraindicações.
                                </li>
                                <li>
                                    <strong>Farmacêuticos:</strong> Responsáveis pela dispensação segura, 
                                    conferência e orientação ao paciente.
                                </li>
                                <li>
                                    <strong>Enfermeiros:</strong> Responsáveis pela administração de 
                                    medicamentos e registro adequado.
                                </li>
                                <li>
                                    <strong>Administradores:</strong> Responsáveis pela gestão do estoque e 
                                    pela manutenção da integridade dos dados.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                Cada profissional é pessoalmente responsável por suas ações registradas 
                                no sistema, incluindo a precisão das informações e o cumprimento das 
                                normas éticas e legais.
                            </p>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    8. Direitos dos Pacientes e Titulares
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Os pacientes e titulares dos dados têm direitos garantidos pela LGPD e 
                                pelo Código de Ética Médica:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Acesso:</strong> Direito de solicitar acesso às informações 
                                    sobre medicamentos prescritos e dispensados.
                                </li>
                                <li>
                                    <strong>Correção:</strong> Direito de solicitar correção de dados 
                                    incorretos ou desatualizados.
                                </li>
                                <li>
                                    <strong>Portabilidade:</strong> Direito de solicitar a transferência de 
                                    seus dados para outro serviço, quando aplicável.
                                </li>
                                <li>
                                    <strong>Anonimização/Eliminação:</strong> Direito de solicitar a 
                                    anonimização ou eliminação de dados, exceto quando houver obrigação 
                                    legal de retenção (ex: registros médicos obrigatórios).
                                </li>
                                <li>
                                    <strong>Revogação de Consentimento:</strong> Direito de revogar o 
                                    consentimento para tratamento de dados, quando aplicável.
                                </li>
                            </ul>

                            <div className="mt-4 bg-yellow-50/50 rounded-lg p-3 border border-yellow-200/50">
                                <p className="text-sm text-yellow-700 flex items-start gap-2">
                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Observação Legal:</strong> Alguns dados de saúde têm 
                                        retenção obrigatória por períodos determinados por lei (ex: 
                                        prontuários médicos por 20 anos). Esses dados não podem ser 
                                        eliminados antes do prazo legal.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    9. Conformidade Regulatória
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O sistema atende aos seguintes requisitos regulatórios:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>ANVISA:</strong> RDC nº 44/2009 (Boas Práticas Farmacêuticas) 
                                    e RDC nº 20/2011 (Controle de Medicamentos).
                                </li>
                                <li>
                                    <strong>CFM:</strong> Resoluções sobre prescrição eletrônica e 
                                    prontuário eletrônico.
                                </li>
                                <li>
                                    <strong>LGPD:</strong> Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                                </li>
                                <li>
                                    <strong>Portaria MS nº 344/1998:</strong> Controle de medicamentos 
                                    sujeitos a prescrição especial.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                Mantemos processos de atualização contínua para garantir conformidade 
                                com alterações regulatórias.
                            </p>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <FileText size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    10. Alterações desta Política
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Esta Política de Privacidade pode ser atualizada para refletir:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>Alterações na legislação ou regulamentação aplicável;</li>
                                <li>Novas funcionalidades ou serviços oferecidos;</li>
                                <li>Melhorias nos processos de segurança e privacidade;</li>
                                <li>Feedback e sugestões de usuários e órgãos reguladores.</li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                A continuidade do uso do sistema após a comunicação das alterações 
                                constitui aceitação tácita da nova versão.
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Última atualização: Julho de 2026
                            </p>
                        </section>
                    </div>

                    {/* FOOTER */}
                    <div className="
                        px-6 md:px-8
                        py-5
                        border-t border-gray-100/80
                        bg-gradient-to-r from-blue-50/20 via-white to-cyan-50/20
                        flex flex-col md:flex-row items-center justify-between gap-3
                    ">
                        <p className="text-xs text-gray-400 text-center md:text-left">
                            Para dúvidas ou solicitações, entre em contato com o DPO da clínica
                        </p>
                        <button
                            onClick={onClose}
                            className="
                                w-full md:w-auto
                                h-11
                                px-8
                                rounded-xl
                                bg-gradient-to-r from-blue-600 to-cyan-500
                                hover:from-blue-700 hover:to-cyan-600
                                transition-all duration-200
                                text-white
                                font-semibold text-sm
                                shadow-lg shadow-blue-200/50
                                hover:shadow-xl hover:shadow-blue-300/40
                            "
                        >
                            Li e Concordo
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}