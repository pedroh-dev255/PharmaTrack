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
  Mail
} from 'lucide-react';
import Link from "next/link";

import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          senha
        }),

        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
          'Usuário ou senha inválidos'
        );

        setErro(
          data.message ||
          'Usuário ou senha inválidos'
        );

        setLoading(false);

        return;
      }

      toast.success(
        'Login realizado com sucesso!'
      );

      router.push('/');

    } catch (err) {
      console.error(err);

      setErro(
        'Erro ao conectar com o servidor'
      );

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div
    className="
      min-h-screen
      bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#FFFFFF]
      flex items-center justify-center
      p-4
      relative
    "
  >
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
          <div className="w-25 h-25 mx-auto mb-4 flex items-center justify-center p-3">
            <img src="/icon-512.png" alt="PharmaTrack" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-center bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
            PharmaTrack
          </h1>

          <h2 className="text-lg font-semibold text-center mt-2 text-gray-700">
            Acesso ao Sistema
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1.5 leading-relaxed max-w-xs mx-auto">
            Entre com suas credenciais para acessar o sistema de gestão clínica
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
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
                placeholder="usuario@empresa.com"
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
                minLength={6}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
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
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              {erro}
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
                Entrando...
              </span>
            ) : 'Entrar'}
          </motion.button>
        </form>

        {/* FOOTER */}
        <div className="px-8 pb-8 pt-4 border-t border-gray-100/80 bg-gradient-to-r from-blue-50/20 via-white to-cyan-50/20">
          <p className="text-sm text-gray-500 text-center">
            Esqueceu sua senha?{' '}
            <Link
              href="/redefinir-senha"
              className="
                text-blue-600
                hover:text-blue-700
                transition-colors
                font-medium
                hover:underline
                underline-offset-2
              "
            >
              Redefinir acesso
            </Link>
          </p>

          <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
            Ao utilizar o sistema você concorda com os{' '}
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