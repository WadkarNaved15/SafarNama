import { createContext, useContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
const API_BASE   = import.meta.env.VITE_API_BASE   || "http://localhost:4000/api/v1";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();

  const [chats, setChats]               = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [msgMap, setMsgMap]             = useState({});   // { chatId: [msg, msg] }
  const [isTyping, setIsTyping]         = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [error, setError]               = useState(null);

  const socketRef = useRef(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("ai_response", ({ chatId, content }) => {
      setIsTyping(false);
      setMsgMap(p => ({
        ...p,
        [chatId]: [...(p[chatId] || []), { role: "model", content, timestamp: Date.now() }]
      }));
      setChats(p => p.map(c => c.id === chatId ? { ...c, lastMsg: content.slice(0, 60), time: Date.now() } : c));
    });

    socketRef.current.on("error", () => setIsTyping(false));
    return () => socketRef.current?.disconnect();
  }, []);

  // ── Fetch chats on login ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || !token) return;
    fetchChats();
  }, [user, token]);

  const fetchChats = async () => {
    try {
      const res  = await fetch(`${API_BASE}/chat`, { headers: authHeaders() });
      const data = await res.json();
      const normalized = (data.chats || data).map(c => ({
        id:      c._id,
        title:   c.title || "Untitled Chat",
        lastMsg: c.lastMessage || "",
        time:    new Date(c.updatedAt || c.createdAt).getTime(),
      }));
      setChats(normalized);
    } catch (err) { console.error(err); }
  };

  const createChat = async (firstMessage) => {
    setIsCreatingChat(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat/create`, {
        method:  "POST",
        headers: authHeaders(),
        body: JSON.stringify({ userId: user.id, title: firstMessage.slice(0, 40) || "New Chat" }),
      });
      if (!res.ok) throw new Error();
      const data    = await res.json();
      const newChat = data.chat || data;
      const chatId  = newChat._id;

      setChats(p => [{ id: chatId, title: newChat.title || "New Chat", lastMsg: firstMessage, time: Date.now() }, ...p]);
      return chatId;
    } catch {
      setError("Could not start a new chat. Please try again.");
      return null;
    } finally {
      setIsCreatingChat(false);
    }
  };

  const sendMessage = async (content, image = null) => {
    if (!content && !image) return;
    if (!user?.id) return;

    setError(null);

    // Create chat on first message
    let chatId = activeChatId;
    if (!chatId) {
      chatId = await createChat(content);
      if (!chatId) return;
      setActiveChatId(chatId);
    }

    // Optimistic UI update
    const msg = { role: "user", content: content || "Find destinations like this image", image, timestamp: Date.now() };
    setMsgMap(p => ({ ...p, [chatId]: [...(p[chatId] || []), msg] }));
    setChats(p => p.map(c => c.id === chatId ? { ...c, lastMsg: content, time: Date.now() } : c));
    setIsTyping(true);

    socketRef.current.emit("message", {
      chatId,
      userId: user.id,
      content: msg.content,
      ...(image && { image }),
    });
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setError(null);
  };

  const activeMessages = activeChatId ? (msgMap[activeChatId] || []) : [];

  return (
    <ChatContext.Provider value={{
      chats, activeChatId, setActiveChatId,
      activeMessages, isTyping, isCreatingChat, error,
      sendMessage, startNewChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};