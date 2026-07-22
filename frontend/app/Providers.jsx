'use client';

import ToastProvider from './_components/ToastProvider';
import AuthGuard from './_components/AuthGuard';
import WebSocketProvider from './_components/WebSocketProvider';
import NotificationDisplayProvider from './_components/NotificationDisplayProvider';

export default function Providers({ children }) {
  return (
    <>
      <ToastProvider/>
      <AuthGuard>
        <NotificationDisplayProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </NotificationDisplayProvider>
      </AuthGuard>

    </>
  );
}