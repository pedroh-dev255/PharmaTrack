'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  ClipboardPlus,
  Cog,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const menu = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Requisições',
    href: '/requisicoes',
    icon: ClipboardPlus,
  },
  {
    name: 'Medicamentos',
    href: '/medicamentos',
    icon: ClipboardList,
  },
  {
    name: 'Usuários',
    href: '/usuarios',
    icon: Users,
  },
  {
    name: 'Configurações',
    href: '/configs',
    icon: Cog,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Fecha o menu no mobile automaticamente quando a rota muda
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  async function userData() {
    try {
      const res = fetch('/api/userData', {method: 'GET', credentials: 'include'});
    } catch (error) {
      toast.error('Erro ao carregar dados do usuario.');
      console.error('UserData failed:', error);
    }
  }

  async function logout() {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || 'Erro ao realizar logout. Por favor, tente novamente.');
      } else {
        toast.success('Logout realizado com sucesso!');
        window.location.href = '/login';
      }
    } catch (error) {
      toast.error('Erro ao realizar logout. Por favor, tente novamente.');
      console.error('Logout failed:', error);
    }
  }

  return (
    <>
      {/* 🍔 Botão Flutuante Mobile (Aparece apenas quando fechado) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="
            md:hidden 
            fixed top-4 left-4 z-40 
            p-2 bg-white text-slate-600 
            border border-slate-200 shadow-md 
            hover:bg-slate-50 rounded-lg transition
          "
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 🌑 Overlay de Fundo (Fica escuro quando o menu mobile está aberto) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 💻 Sidebar (Lateral) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 bg-white border-r border-slate-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center">
            <img src="/icon-512.png" alt="Logo" className="w-12 h-12" />
            <div className="ml-4">
              <h1 className="font-bold text-slate-900 text-lg">
                PharmaTrak
              </h1>
              <p className="text-sm text-slate-500">
                Controle de Medicamentos
              </p>
            </div>
          </div>
          
          {/* Botão Fechar (Mobile) */}
          <button 
            className="md:hidden p-2 -mr-4 text-slate-500 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4
                  h-12
                  px-4
                  rounded-xl
                  transition
                  ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5">
          <button
            className="
              w-full
              h-12
              rounded-xl
              hover:bg-red-50
              text-red-600
              flex items-center
              justify-center
              gap-3
              transition
            "
            onClick={logout}
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}