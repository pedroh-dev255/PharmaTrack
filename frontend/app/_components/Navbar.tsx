'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  X,
  ChevronDown,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

// Tipagem para os itens do menu
interface MenuItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  sub?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

const menu: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Requisições',
    icon: ClipboardPlus,
    sub: [
      {
        name: "Todas as Requisições",
        href: '/requisicoes',
        icon: ClipboardList,
      },
      {
        name: "Nova Requisição",
        href: '/requisicoes/add',
        icon: ClipboardPlus,
      }
    ]
  },
  {
    name: 'Medicamentos',
    icon: ClipboardList,
    sub: [
      {
        name: "Todos os medicamentos",
        href: '/medicamentos',
        icon: ClipboardList,
      },
      {
        name: "Adicionar Medicamento",
        href: '/medicamentos/add',
        icon: ClipboardPlus,
      }
    ]
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Fecha o menu no mobile automaticamente quando a rota muda
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Verifica se o item está ativo (incluindo subitens)
  const isActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.sub) {
      return item.sub.some(sub => pathname === sub.href);
    }
    return false;
  };

  // Verifica se um subitem está ativo
  const isSubActive = (subItem: SubMenuItem): boolean => {
    return pathname === subItem.href;
  };

  // Verifica se o pai deve ser destacado (quando um subitem está ativo)
  const isParentActive = (item: MenuItem): boolean => {
    if (item.sub) {
      return item.sub.some(sub => pathname === sub.href);
    }
    return false;
  };

  // Alterna expansão do menu e navega para a primeira subcategoria se estiver fechado
  const toggleMenu = (item: MenuItem) => {
    const isCurrentlyExpanded = expandedMenus[item.name];
    
    // Se o menu está fechado E tem subitens, navega para o primeiro subitem
    if (!isCurrentlyExpanded && item.sub && item.sub.length > 0) {
      // Expande o menu
      setExpandedMenus(prev => ({
        ...prev,
        [item.name]: true
      }));
      
      // Navega para a primeira subcategoria
      router.push(item.sub[0].href);
    } else {
      // Se já está aberto, apenas fecha
      setExpandedMenus(prev => ({
        ...prev,
        [item.name]: !isCurrentlyExpanded
      }));
    }
  };

  // Expande automaticamente menus que têm subitens ativos
  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};
    menu.forEach(item => {
      if (item.sub) {
        const hasActiveSub = item.sub.some(sub => pathname === sub.href);
        if (hasActiveSub) {
          newExpanded[item.name] = true;
        }
      }
    });
    setExpandedMenus(prev => ({ ...prev, ...newExpanded }));
  }, [pathname]);

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
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0
          h-screen max-h-screen overflow-hidden
        `}
      >
        {/* Logo - Fixo no topo */}
        <div className="flex-shrink-0 h-20 border-b border-slate-200 flex items-center justify-between px-8">
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

        {/* Menu - Scrollável */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const hasSub = item.sub && item.sub.length > 0;
            const isExpanded = expandedMenus[item.name];
            const isParentActiveFlag = isParentActive(item);

            // Item sem submenu
            if (!hasSub) {
              return (
                <Link
                  key={item.href}
                  href={item.href || '#'}
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
            }

            // Item com submenu
            return (
              <div key={item.name} className="space-y-1">
                {/* Menu Principal */}
                <button
                  onClick={() => toggleMenu(item)}
                  className={`
                    w-full flex items-center justify-between
                    h-12
                    px-4
                    rounded-xl
                    transition
                    ${
                      active
                        ? 'bg-slate-900 text-white'
                        : isParentActiveFlag
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                  title={isExpanded ? "Clique para fechar" : `Clique para abrir e ir para ${item.sub?.[0]?.name || 'subcategoria'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} />
                    <span className={isParentActiveFlag && !active ? 'font-medium' : ''}>
                      {item.name}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={18} className="flex-shrink-0" />
                  ) : (
                    <ChevronRight size={18} className="flex-shrink-0" />
                  )}
                </button>

                {/* Submenu */}
                {isExpanded && (
                  <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-4">
                    {item.sub?.map((subItem) => {
                      const SubIcon = subItem.icon || ClipboardList;
                      const isSubActiveFlag = isSubActive(subItem);
                      
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center gap-3
                            h-10
                            px-4
                            rounded-lg
                            text-sm
                            transition
                            ${
                              isSubActiveFlag
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }
                          `}
                        >
                          <SubIcon size={16} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - Fixo no rodapé */}
        <div className="flex-shrink-0 border-t border-slate-200 p-5">
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