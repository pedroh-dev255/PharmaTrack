'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    X, 
    Pill, 
    Users, 
    FileText, 
    Lock, 
    Scale, 
    ClipboardCheck,
    AlertCircle,
    UserCheck,
    Database
} from 'lucide-react';

export default function TermsModal({
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
                    transition={{
                        duration: 0.2
                    }}
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
                                    Termos de Uso
                                </h2>

                                <p className="text-sm text-gray-500">
                                    PharmaTrack - Controle de Estoque de Medicamentos
                                </p>
                                <p className="text-xs text-gray-400">
                                    Última atualização: Julho de 2026
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

                    {/* CONTEÚDO */}
                    <div className="
                        flex-1
                        overflow-y-auto
                        px-6 md:px-8
                        py-6
                        text-sm
                        md:text-base
                        leading-relaxed
                        text-gray-700
                        space-y-8
                    ">
                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    1. Aceitação dos Termos
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Ao acessar ou utilizar o sistema <strong>PharmaTrack</strong>, o usuário 
                                declara ter lido, compreendido e concordado com os presentes
                                Termos de Uso e Política de Privacidade, assim como com
                                quaisquer atualizações que venham a ser publicadas.
                            </p>

                            <p className="mt-2 text-gray-600">
                                A aceitação destes Termos é condição obrigatória para o
                                uso da plataforma e constitui manifestação de vontade
                                plenamente válida e eficaz, vinculando o usuário, o profissional
                                de saúde e o cliente contratante.
                            </p>

                            <div className="mt-3 bg-yellow-50/50 rounded-lg p-3 border border-yellow-200/50">
                                <p className="text-sm text-yellow-700 flex items-start gap-2">
                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Importante:</strong> O uso do sistema para prescrição e 
                                        dispensação de medicamentos deve estar em conformidade com as 
                                        normas do Conselho Federal de Medicina (CFM), ANVISA e demais 
                                        órgãos reguladores.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Pill size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    2. Finalidade do Sistema
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O <strong>PharmaTrack</strong> é um sistema especializado no 
                                gerenciamento de estoque de medicamentos em ambientes clínicos, 
                                desenvolvido para:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Controle de Estoque:</strong> Gerenciamento preciso de 
                                    medicamentos, incluindo entrada, saída, validade e rastreabilidade.
                                </li>
                                <li>
                                    <strong>Dispensação Segura:</strong> Registro e controle de 
                                    medicamentos fornecidos aos pacientes, com validação de prescrições.
                                </li>
                                <li>
                                    <strong>Prescrição Eletrônica:</strong> Digitalização e 
                                    rastreabilidade de prescrições médicas.
                                </li>
                                <li>
                                    <strong>Gestão de Medicamentos Controlados:</strong> Atendimento às 
                                    exigências da ANVISA e portarias específicas.
                                </li>
                                <li>
                                    <strong>Relatórios Gerenciais:</strong> Indicadores de consumo, 
                                    custos e otimização de estoque.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                O sistema <strong>não substitui</strong> a avaliação clínica profissional 
                                e deve ser utilizado como ferramenta de apoio à decisão médica.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <Database size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    3. Tratamento de Dados e LGPD
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O <strong>PharmaTrack</strong> atua em conformidade com a Lei Geral de 
                                Proteção de Dados (LGPD - Lei nº 13.709/2018), garantindo:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Controlador e Operador:</strong> O cliente contratante é o 
                                    controlador dos dados, enquanto o PharmaTrack atua como operador, 
                                    processando dados conforme instruções recebidas.
                                </li>
                                <li>
                                    <strong>Finalidade Específica:</strong> Os dados são tratados 
                                    exclusivamente para as finalidades de gestão de medicamentos e 
                                    dispensação.
                                </li>
                                <li>
                                    <strong>Segurança:</strong> Medidas técnicas e administrativas para 
                                    proteção de dados sensíveis de saúde.
                                </li>
                                <li>
                                    <strong>Transparência:</strong> Registros de auditoria e rastreabilidade 
                                    de todas as operações realizadas.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                Os dados de pacientes são tratados com estrito sigilo e apenas 
                                profissionais autorizados têm acesso às informações necessárias para 
                                a dispensação segura de medicamentos.
                            </p>

                            <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-200/50">
                                <p className="text-sm text-blue-700 flex items-start gap-2">
                                    <FileText size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Dados sensíveis:</strong> Informações de saúde são 
                                        classificadas como dados sensíveis pela LGPD e recebem proteção 
                                        especial, com acesso restrito e controle rigoroso.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Lock size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    4. Segurança da Informação
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O <strong>PharmaTrack</strong> implementa rigorosas medidas de segurança 
                                para proteger os dados de medicamentos e pacientes:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Criptografia:</strong> Dados criptografados em trânsito (TLS) 
                                    e em repouso (AES-256).
                                </li>
                                <li>
                                    <strong>Autenticação:</strong> Sistema com autenticação em duas 
                                    etapas (2FA) para acesso seguro.
                                </li>
                                <li>
                                    <strong>Controle de Acesso:</strong> RBAC (Role-Based Access Control) 
                                    com níveis específicos para médicos, farmacêuticos, enfermeiros e 
                                    administradores.
                                </li>
                                <li>
                                    <strong>Auditoria:</strong> Logs detalhados de todas as operações 
                                    realizadas no sistema.
                                </li>
                                <li>
                                    <strong>Backup:</strong> Cópias de segurança criptografadas com 
                                    retenção adequada.
                                </li>
                            </ul>

                            <div className="mt-3 bg-green-50/50 rounded-lg p-3 border border-green-200/50">
                                <p className="text-sm text-green-700 flex items-start gap-2">
                                    <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Conformidade:</strong> Nossos padrões de segurança estão 
                                        alinhados com as melhores práticas do setor de saúde, incluindo 
                                        requisitos da ANVISA e padrões internacionais.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <Users size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    5. Responsabilidades dos Profissionais
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Cada perfil de usuário no <strong>PharmaTrack</strong> possui 
                                responsabilidades específicas:
                            </p>

                            <div className="mt-4 space-y-3">
                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <UserCheck size={16} />
                                        Médicos
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Prescrever medicamentos de forma correta e responsável;</li>
                                        <li>Considerar alergias, interações e contraindicações;</li>
                                        <li>Registrar adequadamente as prescrições no sistema;</li>
                                        <li>Manter sigilo das informações dos pacientes.</li>
                                    </ul>
                                </div>

                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <ClipboardCheck size={16} />
                                        Farmacêuticos
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Realizar a dispensação segura de medicamentos;</li>
                                        <li>Conferir prescrições e validar autorizações;</li>
                                        <li>Orientar pacientes sobre o uso correto dos medicamentos;</li>
                                        <li>Gerenciar estoque e controle de medicamentos controlados.</li>
                                    </ul>
                                </div>

                                <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50">
                                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                        <Users size={16} />
                                        Administradores
                                    </h4>
                                    <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-600">
                                        <li>Gerenciar cadastros e permissões de usuários;</li>
                                        <li>Garantir a integridade e atualização dos dados;</li>
                                        <li>Configurar parâmetros do sistema;</li>
                                        <li>Assegurar conformidade com normas regulatórias.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <Scale size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    6. Conformidade Regulatória
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O <strong>PharmaTrack</strong> atende às principais exigências 
                                regulatórias do setor de saúde:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>ANVISA:</strong> RDC nº 44/2009 (Boas Práticas Farmacêuticas) 
                                    e RDC nº 20/2011 (Controle de Medicamentos).
                                </li>
                                <li>
                                    <strong>CFM:</strong> Resoluções sobre prescrição eletrônica, 
                                    prontuário eletrônico e telemedicina.
                                </li>
                                <li>
                                    <strong>LGPD:</strong> Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                                </li>
                                <li>
                                    <strong>Portaria MS nº 344/1998:</strong> Controle de medicamentos 
                                    sujeitos a prescrição especial.
                                </li>
                                <li>
                                    <strong>Código de Ética Médica:</strong> Resolução CFM nº 2.217/2018.
                                </li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                A clínica ou profissional responsável deve garantir que o uso do sistema 
                                esteja em conformidade com todas as normas aplicáveis à sua prática 
                                profissional.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    7. Ferramentas de Monitoramento
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Para garantir a qualidade e segurança dos serviços, o sistema utiliza 
                                ferramentas de monitoramento:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Logs de Auditoria:</strong> Registro completo de todas as 
                                    operações para garantir rastreabilidade.
                                </li>
                                <li>
                                    <strong>Controle de Acesso:</strong> Monitoramento de autenticações 
                                    e tentativas de acesso não autorizadas.
                                </li>
                                <li>
                                    <strong>Alertas de Segurança:</strong> Notificações automáticas sobre 
                                    atividades suspeitas.
                                </li>
                                <li>
                                    <strong>Análise de Desempenho:</strong> Uso de ferramentas como 
                                    Microsoft Clarity para melhorar a experiência do usuário, sem coletar 
                                    dados sensíveis de pacientes.
                                </li>
                            </ul>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    8. Direitos dos Pacientes e Titulares
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Os pacientes e titulares dos dados têm direitos garantidos pela LGPD:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>
                                    <strong>Acesso:</strong> Direito de solicitar informações sobre 
                                    medicamentos prescritos e dispensados.
                                </li>
                                <li>
                                    <strong>Correção:</strong> Direito de corrigir dados incorretos ou 
                                    desatualizados.
                                </li>
                                <li>
                                    <strong>Portabilidade:</strong> Direito de transferir dados para 
                                    outro serviço, quando aplicável.
                                </li>
                                <li>
                                    <strong>Eliminação:</strong> Direito de solicitar eliminação de dados, 
                                    exceto quando houver obrigação legal de retenção.
                                </li>
                                <li>
                                    <strong>Revogação:</strong> Direito de revogar consentimento para 
                                    tratamento de dados.
                                </li>
                            </ul>

                            <div className="mt-3 bg-yellow-50/50 rounded-lg p-3 border border-yellow-200/50">
                                <p className="text-sm text-yellow-700 flex items-start gap-2">
                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Retenção Obrigatória:</strong> Prontuários médicos e 
                                        registros de dispensação têm prazos de retenção definidos por lei 
                                        (ex: 20 anos para prontuários) e não podem ser eliminados antes 
                                        do prazo legal.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <AlertCircle size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    9. Limitação de Responsabilidade
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                O <strong>PharmaTrack</strong> é uma ferramenta de apoio à gestão de 
                                medicamentos e não substitui:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>O julgamento clínico do profissional de saúde;</li>
                                <li>As avaliações e diagnósticos médicos;</li>
                                <li>As decisões de tratamento personalizadas;</li>
                                <li>As boas práticas clínicas e farmacêuticas.</li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                A responsabilidade por decisões clínicas, prescrições e dispensação de 
                                medicamentos é integralmente dos profissionais de saúde envolvidos.
                            </p>

                            <div className="mt-3 bg-red-50/50 rounded-lg p-3 border border-red-200/50">
                                <p className="text-sm text-red-700 flex items-start gap-2">
                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Alerta:</strong> Erros de medicação, interações 
                                        medicamentosas e contraindicações são de responsabilidade do 
                                        profissional prescritor e dispensador. O sistema fornece alertas, 
                                        mas a decisão final é sempre do profissional.
                                    </span>
                                </p>
                            </div>
                        </section>

                        <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-3">
                                <FileText size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    10. Alterações dos Termos
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Estes Termos poderão ser revisados e atualizados periodicamente para 
                                acomodar:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>Mudanças na legislação ou regulamentação aplicável;</li>
                                <li>Novas funcionalidades ou serviços oferecidos;</li>
                                <li>Melhorias nos processos de segurança e conformidade;</li>
                                <li>Feedback e sugestões de profissionais e órgãos reguladores.</li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                A continuidade do uso do sistema após a publicação de alterações 
                                constitui aceitação tácita dos novos termos.
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Versão 2.0 - Julho de 2026
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-3">
                                <Scale size={20} className="text-blue-500" />
                                <h3 className="text-lg font-semibold text-blue-600">
                                    11. Foro e Legislação Aplicável
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                Estes Termos são regidos pelas leis da República Federativa do Brasil, 
                                com especial atenção à:
                            </p>

                            <ul className="mt-3 ml-5 list-disc space-y-1.5 text-gray-600">
                                <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018);</li>
                                <li>Código de Ética Médica e demais resoluções do CFM;</li>
                                <li>Leis e regulamentações da ANVISA para medicamentos;</li>
                                <li>Demais normas aplicáveis ao setor de saúde.</li>
                            </ul>

                            <p className="mt-3 text-gray-600">
                                As controvérsias decorrentes deste instrumento serão resolvidas, 
                                preferencialmente, por meios consensuais e, na ausência de acordo, 
                                pelo foro da comarca do domicílio do cliente contratante.
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
                            Ao utilizar o sistema, você concorda com estes Termos de Uso
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