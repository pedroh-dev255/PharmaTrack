'use client';

/**
 * Utilitário para gerenciar notificações do navegador
 */

export const NotificationManager = {
  /**
   * Solicita permissão para mostrar notificações
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  /**
   * Mostra uma notificação no navegador
   */
  show(title, options = {}) {
    if (Notification.permission === 'granted') {
      const defaultOptions = {
        icon: '/icon-512.png',
        badge: '/icon-512.png',
        tag: 'pharmatrack-notification',
        requireInteraction: false,
        ...options
      };

      return new Notification(title, defaultOptions);
    }
  },

  /**
   * Mostra notificação com ID da aplicação
   */
  showWithId(title, options = {}) {
    const notification = this.show(title, options);
    
    if (notification) {
      // Auto-fechar após 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  }
};

export default NotificationManager;
