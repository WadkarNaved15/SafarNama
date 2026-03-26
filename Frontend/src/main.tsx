import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.tsx';
import App from './App.tsx';
import './index.css';
import { ChatProvider } from './context/ChatContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>   {/* 👈 add this */}
    <App />
  </ChatProvider>
    </AuthProvider>
  </StrictMode>
);
