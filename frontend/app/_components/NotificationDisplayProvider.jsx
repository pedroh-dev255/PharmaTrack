'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react';

const NotificationDisplayContext = createContext();

export function useNotificationDisplay() {
  return useContext(NotificationDisplayContext);
}

export function NotificationDisplayProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    //console.log("[NotifDisplay] Adicionando notificação:", notification);
    const id = Date.now();
    const notifWithId = { ...notification, id };
    setNotifications(prev => {
      const newNotifications = [notifWithId, ...prev];
      //console.log("[NotifDisplay] Estado atualizado, total de notificações:", newNotifications.length);
      console.log("[NotifDisplay] notificação recebida:", newNotifications);
      return newNotifications;
    });

    // Auto-remover após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 10000);

    return id;
  };

  const removeNotification = (id) => {
    //console.log("[NotifDisplay] Removendo notificação:", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  //console.log("[NotifDisplay] Provider renderizado, notificações ativas:", notifications.length);

  return (
    <NotificationDisplayContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationDisplay notifications={notifications} removeNotification={removeNotification} />
    </NotificationDisplayContext.Provider>
  );
}

function NotificationDisplay({ notifications, removeNotification }) {
  const getIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <Bug className="w-5 h-5 text-red-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColors = (level) => {
    switch (level) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 shadow-lg animate-slideIn ${getColors(notification.level)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.level)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
              {notification.message && (
                <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationDisplayProvider;
