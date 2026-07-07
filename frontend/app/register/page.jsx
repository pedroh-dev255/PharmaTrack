'use client';

import { useState } from 'react';
import TermsModal from '../_components/TermsModal';
import PrivacyPolicyModal from '../_components/PrivacyPolicyModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  EyeIcon,
  EyeOffIcon,
  ShieldCheck,
  LockKeyhole,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from "next/link";
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [exib_nome, setExibNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Validações de senha em tempo real
  const [validacoes, setValidacoes] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false
  });

  // Função para validar senha em tempo real
  const validarSenha = (senha) => {
    setValidacoes({
      minLength: senha.length >= 8,
      hasUpperCase: /[A-Z]/.test(senha),
      hasNumber: /\d/.test(senha),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
      passwordsMatch: senha === confirmarSenha && senha.length > 0
    });
  };

  // Atualiza validações quando a senha muda
  const handleSenhaChange = (e) => {
    const novaSenha = e.target.value;
    setSenha(novaSenha);
    validarSenha(novaSenha);
  };

  // Atualiza validação de confirmação quando muda
  const handleConfirmarSenhaChange = (e) => {
    const novaConfirmacao = e.target.value;
    setConfirmarSenha(novaConfirmacao);
    setValidacoes(prev => ({
      ...prev,
      passwordsMatch: senha === novaConfirmacao && senha.length > 0
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Validações finais antes de enviar
    if (!nome.trim()) {
      toast.error('Por favor, informe seu nome completo');
      setErro('Por favor, informe seu nome completo');
      return;
    }

    if (!exib_nome.trim()) {
      toast.error('Por favor, informe seu nome para exibição');
      setErro('Por favor, informe seu nome para exibição');
      return;
    }

    if (!email.trim()) {
      toast.error('Por favor, informe seu e-mail');
      setErro('Por favor, informe seu e-mail');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor, informe um e-mail válido');
      setErro('Por favor, informe um e-mail válido');
      return;
    }

    if (!validacoes.minLength) {
      toast.error('Senha deve ter no mínimo 8 caracteres');
      setErro('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (!validacoes.hasUpperCase) {
      toast.error('Senha deve conter letra maiúscula');
      setErro('Senha deve conter letra maiúscula');
      return;
    }

    if (!validacoes.hasNumber) {
      toast.error('Senha deve conter número');
      setErro('Senha deve conter número');
      return;
    }

    if (!validacoes.hasSpecialChar) {
      toast.error('Senha deve conter caractere especial');
      setErro('Senha deve conter caractere especial');
      return;
    }

    if (!validacoes.passwordsMatch) {
      toast.error('As senhas não coincidem');
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome.trim(),
          exib_nome: exib_nome.trim(),
          email: email.trim().toLowerCase(),
          senha: senha
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Erro ao realizar cadastro');
        setErro(data.message || 'Erro ao realizar cadastro');
        setLoading(false);
        return;
      }

      toast.success('Cadastro realizado com sucesso!');
      setSucesso('Cadastro realizado com sucesso! Redirecionando...');

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o servidor');
      setErro('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  // Componente de validação individual
  const ValidacaoItem = ({ valid, text }) => (
    <div className="flex items-center gap-2 text-xs">
      {valid ? (
        <CheckCircle size={14} className="text-green-500" />
      ) : (
        <XCircle size={14} className="text-gray-300" />
      )}
      <span className={valid ? 'text-green-600' : 'text-gray-400'}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#FFFFFF]
      flex items-center justify-center
      p-4
      relative
    ">
      {/* Efeito de fundo suave */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="
          bg-white/80 backdrop-blur-xl
          rounded-3xl
          shadow-[0_8px_40px_rgba(0,0,0,0.06)]
          border border-white/60
          overflow-hidden
          transition-all
          hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)]
        ">
          {/* HEADER */}
          <div className="px-8 pt-10 pb-6 border-b border-gray-100/80 bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/30">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center p-2">
              <img src="/icon-512.png" alt="PharmaTrack" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-center bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              PharmaTrack
            </h1>

            <h2 className="text-lg font-semibold text-center mt-2 text-gray-700">
              Criar Conta
            </h2>

            <p className="text-sm text-gray-500 text-center mt-1.5 leading-relaxed max-w-xs mx-auto">
              Preencha os dados abaixo para criar sua conta no sistema de gestão clínica
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {/* NOME */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="
                group
                h-12
                rounded-xl
                border border-gray-200
                bg-white
                flex items-center gap-3
                px-4
                transition-all duration-200
                focus-within:border-blue-400
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                hover:border-gray-300
              ">
                <User size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Ex: João Silva Martins"
                  className="
                    bg-transparent
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    w-full
                    text-sm
                    font-medium
                  "
                />
              </div>
            </div>

            {/* NOME */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Nome para exibição
              </label>
              <div className="
                group
                h-12
                rounded-xl
                border border-gray-200
                bg-white
                flex items-center gap-3
                px-4
                transition-all duration-200
                focus-within:border-blue-400
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                hover:border-gray-300
              ">
                <User size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="exib_nome"
                  value={exib_nome}
                  onChange={(e) => setExibNome(e.target.value)}
                  required
                  placeholder="Ex: Dr. João Silva"
                  className="
                    bg-transparent
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    w-full
                    text-sm
                    font-medium
                  "
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                E-mail
              </label>
              <div className="
                group
                h-12
                rounded-xl
                border border-gray-200
                bg-white
                flex items-center gap-3
                px-4
                transition-all duration-200
                focus-within:border-blue-400
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                hover:border-gray-300
              ">
                <Mail size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Ex: usuario@clinica.com.br"
                  className="
                    bg-transparent
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    w-full
                    text-sm
                    font-medium
                  "
                />
              </div>
            </div>

            {/* SENHA */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Senha
              </label>
              <div className="
                group
                h-12
                rounded-xl
                border border-gray-200
                bg-white
                flex items-center gap-3
                px-4
                transition-all duration-200
                focus-within:border-blue-400
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                hover:border-gray-300
              ">
                <LockKeyhole size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  name="senha"
                  value={senha}
                  onChange={handleSenhaChange}
                  required
                  placeholder="Crie uma senha forte"
                  className="
                    bg-transparent
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    w-full
                    text-sm
                    font-medium
                  "
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>

              {/* Validações de senha */}
              {senha.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                  <p className="text-xs font-medium text-gray-600 mb-1">Requisitos da senha:</p>
                  <ValidacaoItem valid={validacoes.minLength} text="Mínimo 8 caracteres" />
                  <ValidacaoItem valid={validacoes.hasUpperCase} text="Letra maiúscula" />
                  <ValidacaoItem valid={validacoes.hasNumber} text="Número" />
                  <ValidacaoItem valid={validacoes.hasSpecialChar} text="Caractere especial (!@#$%^&*())" />
                </div>
              )}
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Confirmar Senha
              </label>
              <div className="
                group
                h-12
                rounded-xl
                border border-gray-200
                bg-white
                flex items-center gap-3
                px-4
                transition-all duration-200
                focus-within:border-blue-400
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                hover:border-gray-300
              ">
                <LockKeyhole size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  name="confirmarSenha"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                  required
                  placeholder="Confirme sua senha"
                  className="
                    bg-transparent
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    w-full
                    text-sm
                    font-medium
                  "
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarConfirmarSenha ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              
              {/* Indicador de senhas coincidem */}
              {confirmarSenha.length > 0 && (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {validacoes.passwordsMatch ? (
                    <>
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-green-600">As senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-red-500">As senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ERRO */}
            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-2.5
                  text-sm
                  text-red-600
                  flex items-center gap-2
                ">
                <AlertCircle size={16} className="flex-shrink-0" />
                {erro}
              </motion.div>
            )}

            {/* SUCESSO */}
            {sucesso && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  rounded-xl
                  border border-green-200
                  bg-green-50
                  px-4 py-2.5
                  text-sm
                  text-green-600
                  flex items-center gap-2
                ">
                <CheckCircle size={16} className="flex-shrink-0" />
                {sucesso}
              </motion.div>
            )}

            {/* BTN */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-xl
                bg-gradient-to-r from-blue-600 to-cyan-500
                hover:from-blue-700 hover:to-cyan-600
                text-white
                transition-all duration-200
                font-semibold text-sm
                disabled:opacity-60
                disabled:cursor-not-allowed
                shadow-lg shadow-blue-200/50
                hover:shadow-xl hover:shadow-blue-300/40
                mt-1
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : 'Criar Conta'}
            </motion.button>

            {/* LINK PARA LOGIN */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Já possui uma conta?{' '}
                <Link
                  href="/login"
                  className="
                    text-blue-600
                    hover:text-blue-700
                    transition-colors
                    font-medium
                    hover:underline
                    underline-offset-2
                  "
                >
                  Faça login
                </Link>
              </p>
            </div>
          </form>

          {/* FOOTER */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100/80 bg-gradient-to-r from-blue-50/20 via-white to-cyan-50/20">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Ao criar sua conta você concorda com os{' '}
              <button
                type="button"
                onClick={() => setOpenTerms(true)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-2 transition-colors"
              >
                Termos de Uso
              </button>
              {' '}e a{' '}
              <button
                type="button"
                onClick={() => setOpenPrivacyPolicy(true)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-2 transition-colors"
              >
                Política de Privacidade
              </button>
              .
            </p>
          </div>
        </div>
      </motion.div>

      <TermsModal open={openTerms} onClose={() => setOpenTerms(false)} />
      <PrivacyPolicyModal open={openPrivacyPolicy} onClose={() => setOpenPrivacyPolicy(false)} />
    </div>
  );
}