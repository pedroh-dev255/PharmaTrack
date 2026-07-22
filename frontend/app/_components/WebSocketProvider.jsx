'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './AuthGuard';
import soundGenerator from '@/app/_lib/notificationSoundGenerator';
import { NotificationManager } from '@/app/_lib/notificationManager';
import { useNotificationDisplay } from './NotificationDisplayProvider';

const WSContext = createContext();

export function useWS() {
  return useContext(WSContext);
}

function getCookie(name) {
  if (typeof document === 'undefined') return null; // Evita erros no SSR
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export default function WebSocketProvider({ children }) {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const notificationContext = useNotificationDisplay();
  const addNotification = notificationContext?.addNotification;

  //console.log("[WS] WebSocketProvider renderizado, addNotification disponível:", !!addNotification);

  // Inicializar permissão de notificação
  useEffect(() => {
    if (typeof window !== 'undefined') {
      NotificationManager.requestPermission();
    }
  }, []);

  useEffect(() => {
    //console.log("Autenticação: ", isAuthenticated);

    // Se não estiver logado, não tenta conectar
    if (!isAuthenticated) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
        setConnected(false);
        setOnlineUsers([]);
      }
      return;
    }

    let reconnect;

    function connect() {
      console.log("Tentando conectar ao WS...");
      
      // 1. Pegamos o token do cookie
      let token = getCookie('token');
      
      if (!token) {
        console.log("Token não encontrado nos cookies. Abortando WS.");
        return;
      }
      
      // 2. Anexamos o token na URL (Ex: ws://localhost:8080?token=eyJh...)
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        //console.log("WS conectado");
        setConnected(true);
      };

     ws.current.onmessage = (event) => {

          const data = JSON.parse(event.data);

          //console.log("Tipo:", data.type);
          //console.log(data);

          switch (data.type) {
              case "connected":
                  console.log("Autenticado");
                  break;

              case "online-users":
                  console.log("Online users");
                  setOnlineUsers(data.users);
                  break;

              case "notification":
                  console.log("NOTIFICAÇÃO RECEBIDA");
                  handleNotification(data);
                  break;

              default:
                  console.log("TIPO DESCONHECIDO", data);
          }
      };

      ws.current.onclose = () => {
        console.log("WS fechado");
        setConnected(false);
        reconnect = setTimeout(connect, 5000);
      };
    }

    function handleNotification(data) {
      console.log("[WS] Notificação recebida:", data);
      
      // Tocar som
      try {
        //console.log("[WS] Tocando som:", data.sound);
        soundGenerator.play(data.sound || "notificacao_simples");
      } catch (err) {
        console.error("[WS] Erro ao tocar som:", err);
      }
      
      
      // Mostrar notificação do navegador
      if (data.title) {
        try {
          //console.log("[WS] Enviando notificação do navegador");
          NotificationManager.showWithId(data.title, {
            body: data.message,
            tag: `notification-${data.timestamp}`,
            data: data.data
          });
        } catch (err) {
          console.error("[WS] Erro ao mostrar notificação do navegador:", err);
        }
      }

      // Mostrar notificação visual no app
      if (addNotification) {
        try {
          //console.log("[WS] Adicionando notificação visual:", data.title);
          addNotification({
            title: data.title,
            message: data.message,
            level: data.level || 'info'
          });
        } catch (err) {
          console.error("[WS] Erro ao adicionar notificação visual:", err);
        }
      } else {
        console.warn("[WS] addNotification não está disponível");
      }
    }

    connect();

    return () => {
      clearTimeout(reconnect);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [isAuthenticated]);

  return (
    <WSContext.Provider
      value={{
        ws: ws.current,
        connected,
        onlineUsers
      }}
    >
      {children}
    </WSContext.Provider>
  );
}