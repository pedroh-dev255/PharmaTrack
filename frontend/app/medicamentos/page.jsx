'use client';

import {
    ClipboardList,
    Search,
    Filter,
    Loader2,
    Package,
    MapPin,
    Tag,
    Calendar,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Plus,
    ChevronDown,
    ChevronUp,
    Layers
} from 'lucide-react';
import Navbar from "../_components/Navbar";
import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export default function Medicamentos() {
    const [medicamentos, setMedicamentos] = useState([]);
    const [filteredMedicamentos, setFilteredMedicamentos] = useState([]);
    const [displayedMedicamentos, setDisplayedMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [grupoFilter, setGrupoFilter] = useState('');
    const [localFilter, setLocalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Dados para os selects
    const [grupos, setGrupos] = useState([]);
    const [locais, setLocais] = useState([]);

    // Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const observerTarget = useRef(null);
    const searchTimeout = useRef(null);

    // Carregar dados iniciais
    useEffect(() => {
        loadInitialData();
    }, []);

    // Carregar dados iniciais (medicamentos, grupos e locais)
    const loadInitialData = async () => {
        setInitialLoading(true);
        try {
            //delay de carregamento
            await new Promise(resolve => setTimeout(resolve, 500));
            // Carregar tudo em paralelo
            const [medicamentosRes, gruposRes, locaisRes] = await Promise.all([
                fetch('/api/medicamentos', {
                    method: 'GET',
                    credentials: 'include'
                }),
                fetch('/api/medicamentos/grupo-medicamento', {
                    method: 'GET',
                    credentials: 'include'
                }),
                fetch('/api/medicamentos/local-medicamento', {
                    method: 'GET',
                    credentials: 'include'
                })
            ]);

            // Processar medicamentos
            const medicamentosData = await medicamentosRes.json();
            if (medicamentosData.success) {
                setMedicamentos(medicamentosData.medicamentos || []);
                setFilteredMedicamentos(medicamentosData.medicamentos || []);
                setTotalItems(medicamentosData.medicamentos?.length || 0);
                setTotalPages(Math.ceil((medicamentosData.medicamentos?.length || 0) / itemsPerPage));
                setDisplayedMedicamentos((medicamentosData.medicamentos || []).slice(0, itemsPerPage));
                setHasMore((medicamentosData.medicamentos?.length || 0) > itemsPerPage);
            } else {
                toast.error(medicamentosData.message || 'Erro ao carregar medicamentos');
            }

            // Processar grupos
            const gruposData = await gruposRes.json();
            if (gruposData.success) {
                setGrupos(gruposData.groups || []);
            }

            // Processar locais
            const locaisData = await locaisRes.json();
            if (locaisData.success) {
                setLocais(locaisData.locais || []);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados iniciais');
        } finally {
            setInitialLoading(false);
            setLoading(false);
        }
    };

    // Filtrar medicamentos com paginação
    const applyFilters = useCallback(async (pageToLoad = 1) => {
        setLoading(true);
        try {

             //delay de carregamento
            await new Promise(resolve => setTimeout(resolve, 600)); //500 ms de delay no lazy loading

            const params = new URLSearchParams({
                page: pageToLoad,
                limit: itemsPerPage
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }
            if (grupoFilter) {
                params.append('grupo', grupoFilter);
            }
            if (localFilter) {
                params.append('local', localFilter);
            }
            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const res = await fetch(`/api/medicamentos?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await res.json();

            if (data.success) {
                const newItems = data.medicamentos || [];
                
                if (pageToLoad === 1) {
                    setFilteredMedicamentos(newItems);
                    setDisplayedMedicamentos(newItems);
                } else {
                    setFilteredMedicamentos(prev => [...prev, ...newItems]);
                    setDisplayedMedicamentos(prev => [...prev, ...newItems]);
                }
                
                setTotalItems(data.total || 0);
                setTotalPages(data.totalPages || 0);
                setHasMore(data.hasMore || false);
                setPage(pageToLoad);
            } else {
                toast.error(data.message || 'Erro ao filtrar medicamentos');
            }
        } catch (error) {
            console.error('Erro ao filtrar:', error);
            toast.error('Erro ao filtrar medicamentos');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, grupoFilter, localFilter, statusFilter, itemsPerPage]);

    // Aplicar filtros quando os critérios mudarem
    useEffect(() => {
        if (!initialLoading) {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }

            searchTimeout.current = setTimeout(() => {
                applyFilters(1);
            }, 500);

            return () => {
                if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                }
            };
        }
    }, [searchTerm, grupoFilter, localFilter, statusFilter, initialLoading, applyFilters]);

    // Carregar mais itens (lazy loading)
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || loading) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            
            const params = new URLSearchParams({
                page: nextPage,
                limit: itemsPerPage
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }
            if (grupoFilter) {
                params.append('grupo', grupoFilter);
            }
            if (localFilter) {
                params.append('local', localFilter);
            }
            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const res = await fetch(`/api/medicamentos?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await res.json();

            if (data.success) {
                const newItems = data.medicamentos || [];
                
                setFilteredMedicamentos(prev => [...prev, ...newItems]);
                setDisplayedMedicamentos(prev => [...prev, ...newItems]);
                setTotalItems(data.total || 0);
                setTotalPages(data.totalPages || 0);
                setHasMore(data.hasMore || false);
                setPage(nextPage);
            } else {
                toast.error(data.message || 'Erro ao carregar mais medicamentos');
            }
        } catch (error) {
            console.error('Erro ao carregar mais:', error);
            toast.error('Erro ao carregar mais medicamentos');
        } finally {
            setLoadingMore(false);
        }
    }, [page, hasMore, loadingMore, loading, searchTerm, grupoFilter, localFilter, statusFilter, itemsPerPage]);

    // Intersection Observer para lazy loading
    useEffect(() => {
        if (!observerTarget.current || loadingMore || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(observerTarget.current);

        return () => observer.disconnect();
    }, [loadMore, loadingMore, hasMore, loading]);

    // Resetar filtros
    const resetFilters = () => {
        setSearchTerm('');
        setGrupoFilter('');
        setLocalFilter('');
        setStatusFilter('');
        applyFilters(1);
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Verificar se está vencido
    const isExpired = (dateString) => {
        if (!dateString) return false;
        const today = new Date();
        const validade = new Date(dateString);
        return validade < today;
    };

    // Obter cor do status
    const getStatusColor = (disponivel, validade) => {
        if (disponivel && !isExpired(validade)) {
            return 'bg-green-100 text-green-700';
        } else if (!disponivel) {
            return 'bg-red-100 text-red-700';
        } else {
            return 'bg-yellow-100 text-yellow-700';
        }
    };

    // Obter ícone do status
    const getStatusIcon = (disponivel, validade) => {
        if (disponivel && !isExpired(validade)) {
            return <CheckCircle size={14} />;
        } else {
            return <XCircle size={14} />;
        }
    };

    // Obter texto do status
    const getStatusText = (disponivel, validade) => {
        if (disponivel && !isExpired(validade)) {
            return 'Disponível';
        } else if (!disponivel) {
            return 'Indisponível';
        } else {
            return 'Vencido';
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />

            <main className="flex-1 p-4 md:p-6 lg:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <ClipboardList className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Medicamentos
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Gerencie o estoque de medicamentos
                            </p>
                        </div>
                    </div>

                    <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-3 rounded-xl text-white font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                    >
                        <Plus size={18} />
                        Novo Medicamento
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou princípio ativo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilters(1);
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="w-full lg:w-48">
                            <select
                                value={grupoFilter}
                                onChange={(e) => setGrupoFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white"
                            >
                                <option value="">Todos os grupos</option>
                                {grupos.map(grupo => (
                                    <option key={grupo.id} value={grupo.id}>
                                        {grupo.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full lg:w-48">
                            <select
                                value={localFilter}
                                onChange={(e) => setLocalFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white"
                            >
                                <option value="">Todos os locais</option>
                                {locais.map(local => (
                                    <option key={local.id} value={local.id}>
                                        {local.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full lg:w-40">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white"
                            >
                                <option value="">Todos</option>
                                <option value="disponivel">Disponível</option>
                                <option value="indisponivel">Indisponível</option>
                            </select>
                        </div>

                        {(searchTerm || grupoFilter || localFilter || statusFilter) && (
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors duration-200 text-slate-600 whitespace-nowrap"
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                        <span>
                            {!loading && totalItems > 0 && (
                                <>Encontrados {totalItems} grupos de medicamentos</>
                            )}
                            {!loading && totalItems === 0 && !initialLoading && (
                                <>Nenhum medicamento encontrado</>
                            )}
                        </span>
                        {loading && !initialLoading && (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                Filtrando...
                            </span>
                        )}
                    </div>
                </div>

                {/* Lista de Medicamentos Agrupados */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    {initialLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
                                <p className="mt-4 text-slate-600">Carregando medicamentos...</p>
                            </div>
                        </div>
                    ) : displayedMedicamentos.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Package className="text-slate-300 mx-auto" size={48} />
                                <p className="mt-4 text-slate-600 font-medium">Nenhum medicamento encontrado</p>
                                <p className="text-sm text-slate-400">
                                    Tente ajustar os filtros ou realizar uma nova busca
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Grid de Medicamentos Agrupados */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                {displayedMedicamentos.map((medicamento, index) => (
                                    <div
                                        key={`${medicamento.nome}-${medicamento.id_local}-${medicamento.id_grupo}-${medicamento.disponivel}-${index}`}
                                        className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                    >
                                        <div className="p-5">
                                            {/* Header com status e quantidade */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                        {medicamento.nome}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        {medicamento.principio}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(medicamento.disponivel, medicamento.validade)}`}>
                                                        {getStatusIcon(medicamento.disponivel, medicamento.validade)}
                                                        {getStatusText(medicamento.disponivel, medicamento.validade)}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        <Layers size={12} />
                                                        {medicamento.quantidade} un.
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Detalhes */}
                                            <div className="space-y-2 mt-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Tag size={14} className="text-slate-400" />
                                                    <span>{medicamento.grupo?.nome || 'Sem grupo'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    <span>{medicamento.local?.nome || 'Sem local'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span className={isExpired(medicamento.validade) ? 'text-red-600 font-medium' : ''}>
                                                        Validade: {formatDate(medicamento.validade)}
                                                        {isExpired(medicamento.validade) && ' (Vencido)'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Data de retirada (se houver) */}
                                            {medicamento.dt_retirada && (
                                                <div className="mt-3 pt-3 border-t border-slate-100">
                                                    <p className="text-xs text-slate-500">
                                                        Retirado em: {formatDate(medicamento.dt_retirada)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Loading mais e Observer */}
                            {loadingMore && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                    <span className="ml-3 text-slate-600">Carregando mais medicamentos...</span>
                                </div>
                            )}

                            {/* Elemento observer para lazy loading */}
                            {hasMore && !loadingMore && !loading && (
                                <div ref={observerTarget} className="h-4" />
                            )}

                            {/* Footer com informações */}
                            <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
                                <span>
                                    Mostrando {displayedMedicamentos.length} de {totalItems} grupos de medicamentos
                                </span>
                                {!hasMore && totalItems > 0 && (
                                    <span className="text-green-600 font-medium">
                                        Todos os grupos carregados
                                    </span>
                                )}
                                {hasMore && (
                                    <span className="text-blue-600 font-medium">
                                        Role para carregar mais
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}