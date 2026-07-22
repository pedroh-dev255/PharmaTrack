'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationPanel() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [soundType, setSoundType] = useState('notification-simple');
  const [loading, setLoading] = useState(false);

  // Buscar grupos disponíveis
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/groups');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setGroups(data.groups || []);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar grupos:', err);
      }
    };

    fetchGroups();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!message.trim()) {
      toast.error('Mensagem é obrigatória');
      return;
    }

    setLoading(true);

    try {
      let endpoint = '/api/notifications/send-to-all';
      let body = {
        title,
        message,
        level: notificationType,
        sound: soundType
      };

      if (selectedGroup !== 'all') {
        endpoint = '/api/notifications/send-to-group';
        body.groupName = selectedGroup;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.status === 403) {
        toast.error('Acesso negado: Você não tem permissão para enviar notificações');
        return;
      }

      if (data.success) {
        toast.success('Notificação enviada com sucesso!');
        setTitle('');
        setMessage('');
        setNotificationType('info');
        setSoundType('notification-simple');
      } else {
        toast.error(data.message || 'Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast.error('Erro ao enviar notificação');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 403) {
        toast.error('Acesso negado: Você não tem permissão para enviar notificações');
        return;
      }

      if (data.success) {
        toast.success('Notificação de teste enviada!');
      } else {
        toast.error(data.message || 'Erro ao enviar notificação de teste');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold">Painel de Notificações</h2>
      </div>

      <form onSubmit={handleSendNotification} className="space-y-4">
        {/* Seleção de grupo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enviar para
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os usuários</option>
            {groups.map((group) => (
              <option key={group.id} value={group.nome}>
                {group.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Manutenção do Sistema"
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        {/* Mensagem */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mensagem *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem da notificação..."
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/500</p>
        </div>

        {/* Tipo de notificação */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Notificação
          </label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="info">Informação</option>
            <option value="success">Sucesso</option>
            <option value="warning">Aviso</option>
            <option value="error">Erro</option>
            <option value="alert">Alerta</option>
          </select>
        </div>

        {/* Tipo de som */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Som da Notificação
          </label>
          <select
            value={soundType}
            onChange={(e) => setSoundType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="notification-simple">Simples (beeps)</option>
            <option value="notification-alert">Alerta (beeps rápidos)</option>
          </select>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Dica:</p>
            <p>Use a notificação de alerta com o som de alerta para eventos críticos ou urgentes.</p>
          </div>
        </div>

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Enviando...' : 'Enviar Notificação'}
        </button>
      </form>

      {/* Botão de Teste */}
      <button
        onClick={handleSendTestNotification}
        disabled={loading}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Enviando Teste...' : 'Enviar Teste'}
      </button>
    </div>
  );
}
