'use client';

import {
    Activity,
    Users,
    Building2,
    ShieldCheck,
    Table,
    Cog,
} from 'lucide-react';
import Navbar from "../_components/Navbar";
import { useEffect, useState } from 'react';
import NotificationPanel from '../_components/NotificationPanel';
import { useWS } from '../_components/WebSocketProvider';
import toast from 'react-hot-toast';

export default function Configs() {
    const { onlineUsers } = useWS();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    useEffect(() => {
        // Verificar se o usuário é admin
        // Validação feita no backend com JWT + Redis + Banco de Dados
        const checkAdmin = async () => {
            try {
                const res = await fetch('/api/verify-admin');
                const data = await res.json();
                setIsAdmin(data.isAdmin === true);
            } catch (err) {
                console.error('Erro ao verificar permissões:', err);
                setIsAdmin(false);
            } finally {
                setLoadingAdmin(false);
            }
        };

        checkAdmin();
    }, []);
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />
            <main className="flex-1 p-8 ml-8 mr-8 lg:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Cog className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Configurações
                            </h1>
                            <p className="text-slate-500 text-sm">
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Painel de Notificações (apenas para admins) */}
                    {loadingAdmin && (
                        <div className="bg-white p-4 rounded-lg shadow">

                        </div>
                    )}
                    {isAdmin ? (
                        <>
                            {/* Lista de usuários online */}
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">Usuários Online</h2>
                                <p className="text-gray-600 mb-4">{onlineUsers?.length || 0} usuários online</p>
                                <ul className="mt-4">
                                    {(!onlineUsers || onlineUsers.length === 0) && (
                                        <li className="py-2 border-b">Nenhum usuário online</li>
                                    )}
                                    {onlineUsers?.map((user, index) => {
                                        return (
                                            <li key={user.id ?? index} className="py-2 border-b hover:bg-gray-50 px-2 rounded">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{user.nome_exibicao}</span>
                                                    {user.Grupo && (
                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                            {user.Grupo}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <NotificationPanel />
                        </>

                    ) : (
                        <div className="flex items-center justify-center min-h-[70vh]">
                            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 p-10 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                                    <ShieldCheck className="h-10 w-10 text-red-500" />
                                </div>

                                <h2 className="text-2xl font-bold text-slate-800">
                                    Acesso Restrito
                                </h2>

                                <p className="mt-3 text-slate-600 leading-relaxed">
                                    Você não possui permissão para acessar esta área do sistema.
                                    Caso acredite que isso seja um erro, entre em contato com um
                                    administrador para solicitar as permissões necessárias.
                                </p>

                                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                                            <ShieldCheck className="h-5 w-5 text-amber-600" />
                                        </div>

                                        <div className="text-left">
                                            <p className="font-medium text-slate-800">
                                                Permissões insuficientes
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Apenas usuários autorizados podem visualizar ou alterar as configurações desta página.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.history.back()}
                                    className="mt-8 inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-900"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}