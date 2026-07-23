'use client';

import { useState, useEffect, useCallback } from "react";
import Navbar from "../_components/Navbar";
import {
    Users,
    UserPlus,
    Search,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Mail,
    X,
    Edit,
    Power,
    PowerOff,
    AlertTriangle,
    Loader2,
    Stethoscope,
    ShieldCog,
    User as UserIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Usuarios() {
    const [openModal, setOpenModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        nome_usuario: "",
        email: "",
        senha: "",
        senha2: "",
        perfil: "Usuário",
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    const ativos = usuarios.filter(u => u.ativo).length;

    // Verificar se o usuário é admin
    const checkAdmin = useCallback(async () => {
        setLoadingAdmin(true);
        try {
            const res = await fetch('/api/verify-admin', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!res.ok) {
                setIsAdmin(false);
                setLoadingAdmin(false);
                return false;
            }
            
            const data = await res.json();
            const isAdminUser = data.isAdmin === true;
            setIsAdmin(isAdminUser);
            setLoadingAdmin(false);
            return isAdminUser;
        } catch (err) {
            console.error('Erro ao verificar permissões:', err);
            setIsAdmin(false);
            setLoadingAdmin(false);
            return false;
        }
    }, []);

    async function getUsers() {
        if (!isAdmin) {
            const adminStatus = await checkAdmin();
            if (!adminStatus) {
                toast.error("Usuário sem acesso a esta tela");
                return;
            }
        }
        
        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error('Você não tem permissão para acessar esta área');
                    setIsAdmin(false);
                    return;
                }
                throw new Error('Erro ao carregar usuários');
            }

            const data = await res.json();

            if (data.success !== true) {
                toast.error(data.message || 'Erro ao carregar usuários');
                return;
            }

            setUsuarios(data.users || []);
        } catch (error) {
            toast.error(error.message || 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    }

    async function getGrupos() {
        if (!isAdmin) {
            const adminStatus = await checkAdmin();
            if (!adminStatus) {
                toast.error("Usuário sem acesso a esta função");
                return;
            }
        }
        
        setLoadingGrupos(true);
        try {
            const res = await fetch('/api/groups', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error('Você não tem permissão para acessar esta área');
                    setIsAdmin(false);
                    return;
                }
                throw new Error('Erro ao carregar grupos');
            }

            const data = await res.json();

            if (data.success !== true) {
                toast.error(data.message || 'Erro ao carregar grupos');
                return;
            }
            setGrupos(data.groups || []);
        } catch (error) {
            toast.error(error.message || 'Erro ao carregar grupos');
        } finally {
            setLoadingGrupos(false);
        }
    }

    useEffect(() => {
        const initialize = async () => {
            // Verificar permissões primeiro
            const adminStatus = await checkAdmin();
            // Se for admin, carregar usuários e grupos
            if (adminStatus) {
                await Promise.all([getUsers(), getGrupos()]);
            }
        };
        
        initialize();
    }, [checkAdmin]);

    // Filtrar usuários
    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.perfil?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Resetar formulário
    const resetForm = () => {
        setFormData({
            nome: "",
            nome_usuario: "",
            email: "",
            senha: "",
            senha2: "",
            perfil: "Usuário",
            grupo_id: ""
        });
        setEditingUser(null);
    };

    // Abrir modal para edição
    const handleEdit = (usuario) => {
        if (!isAdmin) {
            toast.error('Você não tem permissão para editar usuários');
            return;
        }
        setEditingUser(usuario);
        setFormData({
            nome: usuario.nome_exibicao || usuario.nome,
            nome_usuario: usuario.nome,
            email: usuario.email,
            senha: "",
            senha2: "",
            perfil: usuario.perfil,
            grupo_id: usuario.grupo_id || ""
        });
        setOpenModal(true);
    };

    // Salvar usuário (criar ou editar)
    const handleSave = async () => {
        if (!isAdmin) {
            toast.error('Você não tem permissão para realizar esta operação');
            return;
        }

        // Validações básicas
        if (!formData.nome.trim()) {
            toast.error('O nome de exibição é obrigatório');
            return;
        }
        if (!formData.nome_usuario.trim()) {
            toast.error('O nome de usuário é obrigatório');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('O email é obrigatório');
            return;
        }
        if (!editingUser && !formData.senha.trim()) {
            toast.error('A senha é obrigatória para novo usuário');
            return;
        }
        if (formData.senha !== formData.senha2) {
            toast.error('As senhas não coincidem');
            return;
        }

        setSaving(true);
        try {
            let url = '/api/users';
            let method = 'POST';
            let body = { 
                nome_exibicao: formData.nome,
                nome: formData.nome_usuario,
                email: formData.email,
                perfil: formData.perfil,
                grupo_id: formData.grupo_id || null
            };

            if (editingUser) {
                url = `/api/users/${editingUser.id}`;
                method = 'PUT';
                // Se a senha estiver vazia, não enviar
                if (formData.senha) {
                    body.senha = formData.senha;
                }
            } else {
                body.senha = formData.senha;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error('Você não tem permissão para realizar esta operação');
                    setIsAdmin(false);
                    return;
                }
                const data = await res.json();
                toast.error(data.message || 'Erro ao salvar usuário');
                return;
            }

            const data = await res.json();

            if (data.success !== true) {
                toast.error(data.message || 'Erro ao salvar usuário');
                return;
            }

            toast.success(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
            setOpenModal(false);
            resetForm();
            await getUsers();
        } catch (error) {
            toast.error(error.message || 'Erro ao salvar usuário');
        } finally {
            setSaving(false);
        }
    };

    // Alternar status do usuário (ativar/inativar)
    const toggleUserStatus = async (id) => {
        if (!isAdmin) {
            toast.error('Você não tem permissão para alterar status de usuários');
            return;
        }

        setToggling(true);
        try {
            const res = await fetch(`/api/users/${id}/toggle-status`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error('Você não tem permissão para realizar esta operação');
                    setIsAdmin(false);
                    return;
                }
                const data = await res.json();
                toast.error(data.message || 'Erro ao alterar status do usuário');
                return;
            }

            const data = await res.json();

            if (data.success !== true) {
                toast.error(data.message || 'Erro ao alterar status do usuário');
                return;
            }

            toast.success('Status do usuário alterado com sucesso!');
            setShowConfirmModal(false);
            setUserToToggle(null);
            await getUsers();
        } catch (error) {
            toast.error(error.message || 'Erro ao alterar status do usuário');
        } finally {
            setToggling(false);
        }
    };

    const handleToggleClick = (usuario) => {
        if (!isAdmin) {
            toast.error('Você não tem permissão para alterar status de usuários');
            return;
        }
        setUserToToggle(usuario);
        setShowConfirmModal(true);
    };

    // Tela de carregamento
    if (loadingAdmin) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
                <Navbar />
                <main className="flex-1 p-8 lg:p-10 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
                        <p className="mt-4 text-slate-600">Verificando permissões...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Tela de acesso negado
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
                <Navbar />
                <main className="flex-1 p-8 ml-8 mr-8 lg:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    Usuários
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Gerencie os usuários do sistema
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
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
                    </div>
                </main>
            </div>
        );
    }

    // Tela principal (apenas para admin)
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">

            <Navbar />

            <main className="flex-1 p-8 ml-8 mr-8 lg:p-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Usuários
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Gerencie os usuários do sistema
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            resetForm();
                            setOpenModal(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-3 rounded-xl text-white font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                    >
                        <UserPlus size={18} />
                        Novo Usuário
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">
                                    Total de usuários
                                </p>
                                <h2 className="text-4xl font-bold mt-2 text-slate-800">
                                    {loading ? <Loader2 className="animate-spin" size={32} /> : usuarios.length}
                                </h2>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">
                                    Usuários ativos
                                </p>
                                <h2 className="text-4xl font-bold mt-2 text-green-600">
                                    {loading ? <Loader2 className="animate-spin" size={32} /> : ativos}
                                </h2>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <ShieldCheck className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">
                                    Usuários inativos
                                </p>
                                <h2 className="text-4xl font-bold mt-2 text-red-600">
                                    {loading ? <Loader2 className="animate-spin" size={32} /> : usuarios.length - ativos}
                                </h2>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="font-semibold text-lg text-slate-800">
                            Lista de usuários
                        </h2>
                        <div className="relative w-full sm:w-72">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                placeholder="Pesquisar usuário..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-blue-600" size={40} />
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                                    <tr className="text-left text-slate-600 text-sm font-semibold">
                                        <th className="p-4">Nome</th>
                                        <th className="p-4 hidden md:table-cell">Email</th>
                                        <th className="p-4">Perfil</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsuarios.length > 0 ? (
                                        filteredUsuarios.map(usuario => (
                                            <tr
                                                key={usuario.id}
                                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                            {usuario.perfil === "Administrador" ? <ShieldCog size={20} /> : 
                                                             usuario.perfil === "Médico" ? <Stethoscope size={20} /> : 
                                                             <UserIcon size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {usuario.nome_exibicao || usuario.nome}
                                                            </p>
                                                            <p className="text-sm text-slate-400 md:hidden">
                                                                {usuario.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Mail size={16} className="text-slate-400" />
                                                        {usuario.email}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                                        usuario.perfil === 'Administrador'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : usuario.perfil === 'Médico'
                                                                ? 'bg-cyan-100 text-cyan-700'
                                                                : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {usuario.perfil}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {usuario.ativo ? (
                                                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                            <CheckCircle2 size={15} />
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                            <XCircle size={15} />
                                                            Inativo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(usuario)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                            title="Editar"
                                                            disabled={!isAdmin}
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleClick(usuario)}
                                                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                                                usuario.ativo
                                                                    ? 'text-red-600 hover:bg-red-50'
                                                                    : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                            title={usuario.ativo ? "Inativar" : "Ativar"}
                                                            disabled={toggling || !isAdmin}
                                                        >
                                                            {toggling && userToToggle?.id === usuario.id ? (
                                                                <Loader2 className="animate-spin" size={18} />
                                                            ) : usuario.ativo ? (
                                                                <PowerOff size={18} />
                                                            ) : (
                                                                <Power size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="text-slate-300" size={32} />
                                                    <p>{searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-200/80 flex justify-between items-center text-sm text-slate-500">
                        <span>Mostrando {filteredUsuarios.length} de {usuarios.length} usuários</span>
                    </div>
                </div>

            </main>

            {/* Modal de Cadastro/Edição */}
            {openModal && isAdmin && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    {editingUser ? <Edit className="text-blue-600" size={20} /> : <UserPlus className="text-blue-600" size={20} />}
                                </div>
                                <h2 className="font-bold text-xl text-slate-800">
                                    {editingUser ? "Editar Usuário" : "Novo Usuário"}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Nome de Exibição
                                </label>
                                <input
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Digite o nome de exibição. Ex: Dr. Jorge Martins"
                                    disabled={saving}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Usuário
                                </label>
                                <input
                                    value={formData.nome_usuario}
                                    onChange={(e) => setFormData({ ...formData, nome_usuario: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Digite o nome do usuário. Ex: jorge"
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Digite o email"
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Senha {editingUser && "(deixe em branco para manter)"}
                                </label>
                                <input
                                    type="password"
                                    value={formData.senha}
                                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder={editingUser ? "Nova senha" : "Digite a senha"}
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Repetir Senha {editingUser && "(deixe em branco para manter)"}
                                </label>
                                <input
                                    type="password"
                                    value={formData.senha2}
                                    onChange={(e) => setFormData({ ...formData, senha2: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    placeholder={editingUser ? "Nova senha" : "Digite a senha novamente"}
                                    disabled={saving}
                                />
                            </div>


                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Perfil
                                </label>
                                <select
                                    value={formData.perfil}
                                    onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    disabled={saving || loadingGrupos}
                                >
                                    <option value="">Selecione um perfil</option>
                                    {loadingGrupos ? (
                                        <option value="" disabled>Carregando grupos...</option>
                                    ) : grupos.length > 0 ? (
                                        grupos.map(grupo => (
                                            <option key={grupo.id} value={grupo.nome}>
                                                {grupo.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Nenhum grupo encontrado</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button
                                    onClick={() => {
                                        setOpenModal(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors duration-200 font-medium"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center gap-2"
                                    disabled={saving}
                                >
                                    {saving && <Loader2 className="animate-spin" size={18} />}
                                    {editingUser ? "Salvar" : "Cadastrar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação */}
            {showConfirmModal && userToToggle && isAdmin && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-full ${userToToggle.ativo ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <AlertTriangle className={`${userToToggle.ativo ? 'text-red-600' : 'text-green-600'}`} size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">
                                        {userToToggle.ativo ? "Inativar" : "Ativar"} Usuário
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {userToToggle.ativo ? "Desativar" : "Ativar"} o acesso do usuário ao sistema
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-600 mb-6">
                                Tem certeza que deseja <span className="font-semibold">{userToToggle.ativo ? "inativar" : "ativar"}</span> o usuário <span className="font-semibold">{userToToggle.nome}</span>?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setUserToToggle(null);
                                    }}
                                    className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors duration-200 font-medium"
                                    disabled={toggling}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => toggleUserStatus(userToToggle.id)}
                                    className={`px-6 py-2.5 rounded-xl text-white font-medium transition-all duration-200 shadow-lg flex items-center gap-2 ${
                                        userToToggle.ativo
                                            ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20 hover:shadow-red-600/30'
                                            : 'bg-green-600 hover:bg-green-700 shadow-green-600/20 hover:shadow-green-600/30'
                                    }`}
                                    disabled={toggling}
                                >
                                    {toggling && <Loader2 className="animate-spin" size={18} />}
                                    {userToToggle.ativo ? "Inativar" : "Ativar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}