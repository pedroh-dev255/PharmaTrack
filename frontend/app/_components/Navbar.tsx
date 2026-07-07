'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const menu = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Usuários',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Empresas',
    href: '/dashboard/companies',
    icon: Building2,
  },
  {
    name: 'Registros',
    href: '/dashboard/logs',
    icon: ClipboardList,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  async function logout() {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Logout realizado com sucesso!');
        window.location.href = '/login';
      }
    }catch (error) {
      toast.error('Erro ao realizar logout. Por favor, tente novamente.');
      console.error('Logout failed:', error);
    }
  }

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">

      {/* Logo */}

      <div className="h-20 border-b border-slate-200 flex items-center px-8">

        <img src="/icon-512.png" alt="Logo" className="w-12 h-12" />

        <div className="ml-4">
          <h1 className="font-bold text-slate-900 text-lg">
            PH Core
          </h1>

          <p className="text-sm text-slate-500">
            Painel Administrativo
          </p>
        </div>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-5 space-y-2">

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
          onClick={async () => logout()}
        >
          <LogOut size={18} />
          Sair
        </button>

      </div>

    </aside>
  );
}