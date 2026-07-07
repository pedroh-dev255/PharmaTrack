'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/login', '/register', '/redefinir-senha', '/redefinir-senha/confirmação'];

export default function AuthGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/validate-token', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const validToken = res.ok && (await res.json()).success;

        // 🚧 Se estiver em rota pública e token for válido → manda pra "/"
        if (PUBLIC_ROUTES.some(route => pathname?.startsWith(route))) {
          if (validToken) {
            router.replace('/');
            return;
          }
          if (mounted) setChecking(false);
          return;
        }

        // 🔒 Se não for rota pública e token for inválido → manda pra "/login"
        if (!validToken) {
          if (mounted) router.replace('/login');
          return;
        }

        if (mounted) setChecking(false);
      } catch (err) {
        console.error('Erro validando token:', err);
        if (mounted) router.replace('/login');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-6">
        <div
          className="
            w-full max-w-xl
            rounded-3xl
            border border-slate-200
            bg-[#FCFCFD]
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            p-10
            text-center
          "
        >
          {/* ÍCONE */}
          <div
            className="
              mx-auto mb-8
              w-24 h-24
              rounded-3xl
              bg-slate-100
              border border-slate-200
              flex items-center justify-center
            "
          >
            <svg
              className="animate-spin h-10 w-10 text-slate-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                5.291A7.962 7.962 0 014 12H0c0 3.042
                1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          {/* TÍTULO */}
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Validando sua sessão
          </h1>

          {/* TEXTO */}
          <p className="mt-4 text-base leading-7 text-slate-600">
            Estamos verificando suas credenciais de acesso e preparando o ambiente
            para utilização do sistema.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Caso esta etapa demore mais do que o esperado, atualize a sessão para
            iniciar uma nova validação.
          </p>

          {/* BOTÃO */}
          <button
            onClick={() => {
              console.log("Forçando revalidação da sessão...");
              window.location.reload();
            }}
            className="
              mt-8
              h-12
              px-8
              rounded-2xl
              border
              border-slate-300
              bg-white
              hover:bg-slate-100
              transition-all
              font-semibold
              text-slate-800
              shadow-sm
            "
          >
            Validar novamente
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}