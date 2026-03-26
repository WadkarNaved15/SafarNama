import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const API_BASE   = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";
const UPLOAD_URL = `${API_BASE}/upload`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  plane:  "M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-1 0-1.5.5-3.5 2.5L11 8 2.8 6.2c-.5-.1-.9.2-1.1.7l-.3.8c-.1.5.1 1 .6 1.2L8 12l-4 4H3l-3 1v1l4-1 4 4 3.4-1.7c.5-.2.7-.7.6-1.2Z",
  plus:   "M12 5v14M5 12h14",
  send:   "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  image:  "M21 15l-5-5L5 21M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  x:      "M18 6L6 18M6 6l12 12",
  chat:   "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  menu:   "M3 6h18M3 12h18M3 18h18",
  mappin: "M12 22s-8-6-8-13a8 8 0 1 1 16 0c0 7-8 13-8 13zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  spin:   "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (ts) => {
  const d = new Date(ts), today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const y = new Date(today); y.setDate(today.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const SUGGESTIONS = [
  { icon: "🏖️", label: "Beach getaways in India" },
  { icon: "🏔️", label: "Adventure trips under ₹15,000" },
  { icon: "❄️",  label: "Best winter destinations" },
  { icon: "👨‍👩‍👧", label: "Family-friendly packages" },
];

// ─── Avatar styles ────────────────────────────────────────────────────────────
const av = {
  ai: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "1.5px solid #bfdbfe",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#2563eb", flexShrink: 0,
  },
  user: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 13, fontWeight: 600, flexShrink: 0,
  },
};

// ─── Typing dots ──────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 20 }}>
    <div style={av.ai}><Icon d={icons.plane} size={14} /></div>
    <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: "4px 16px 16px 16px", padding: "13px 17px", display: "flex", gap: 5, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", display: "inline-block", animation: "snBounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s`, opacity: 0.6 }} />
      ))}
    </div>
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const Message = ({ msg, userName }) => {
  const isUser = msg.role === "user";
  const initials = userName ? userName.charAt(0).toUpperCase() : "U";
  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start", gap: 10, paddingBottom: 20, animation: "snFadeUp 0.25s ease-out" }}>
      <div style={isUser ? av.user : av.ai}>
        {isUser ? initials : <Icon d={icons.plane} size={14} />}
      </div>
      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4 }}>
        {msg.image && (
          <img
            src={`data:${msg.image.mimeType};base64,${msg.image.base64}`}
            alt="uploaded"
            style={{ maxWidth: 200, maxHeight: 150, borderRadius: 12, objectFit: "cover", border: "1px solid #e2e8f0", marginBottom: 4 }}
          />
        )}
        {msg.content && (
          <div style={{
            padding: "11px 15px", fontSize: 14, lineHeight: 1.65,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background:   isUser ? "#2563eb" : "#fff",
            color:        isUser ? "#fff" : "#1e293b",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
            border:       isUser ? "none" : "1px solid #e8edf5",
            boxShadow:    isUser ? "0 2px 12px rgba(37,99,235,0.18)" : "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {msg.content}
          </div>
        )}
        <span style={{ fontSize: 11, color: "#94a3b8", padding: "0 4px" }}>
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
};

// ─── Empty / welcome state ────────────────────────────────────────────────────
const EmptyState = ({ onSuggest }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: 28 }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#2563eb" }}>
        <Icon d={icons.plane} size={28} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", fontFamily: "'Playfair Display',serif", letterSpacing: "-0.3px" }}>
        Where to next?
      </h2>
      <p style={{ fontSize: 14, color: "#64748b", maxWidth: 300, lineHeight: 1.65, margin: 0 }}>
        Ask me about destinations, packages, or upload a photo of a place you'd love to visit.
      </p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 400 }}>
      {SUGGESTIONS.map((s, i) => (
        <button key={i} onClick={() => onSuggest(s.label)}
          style={{ padding: "12px 14px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, color: "#334155", cursor: "pointer", textAlign: "left", fontFamily: "inherit", lineHeight: 1.5, transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 4 }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#f8fbff"; }}
          onMouseOut={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
        >
          <span style={{ fontSize: 20 }}>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatScreen() {
  // ── Context ────────────────────────────────────────────────────────────────
  const { user } = useAuth();
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeMessages,
    isTyping,
    isCreatingChat,
    error,
    sendMessage,
    startNewChat,
  } = useChat();

  // ── Local UI state (stays in component — not shared) ───────────────────────
  const [input, setInput]           = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sidebar, setSidebar]       = useState(true);

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const taRef     = useRef(null);

  // ── Auto scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isTyping]);

  // ── Auto resize textarea ───────────────────────────────────────────────────
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
      const { base64, mimeType } = await res.json();
      setImgPreview({ base64, mimeType, objectUrl: URL.createObjectURL(file) });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // ── Send — delegates to context, clears local state ───────────────────────
  const handleSend = (text) => {
    const content = (text !== undefined ? text : input).trim();
    if (!content && !imgPreview) return;
    sendMessage(
      content,
      imgPreview ? { base64: imgPreview.base64, mimeType: imgPreview.mimeType } : null
    );
    setInput("");
    setImgPreview(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();   // ✅ was incorrectly calling sendMessage() before
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const isBusy      = isTyping || isCreatingChat;
  const canSend     = !isBusy && (!!input.trim() || !!imgPreview);
  const isNew       = !activeChatId || activeMessages.length === 0;
  const activeTitle = chats.find(c => c.id === activeChatId)?.title || "New Conversation";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .sn{font-family:'DM Sans',sans-serif;display:flex;height:100vh;background:#f1f5f9;overflow:hidden}
        .sn-sidebar{width:264px;min-width:264px;background:#fff;border-right:1px solid #e8edf5;display:flex;flex-direction:column;transition:width 0.22s ease,min-width 0.22s ease;overflow:hidden}
        .sn-sidebar.closed{width:0;min-width:0;border-right:none}
        .sb-head{padding:20px 16px 16px;border-bottom:1px solid #f1f5f9;flex-shrink:0}
        .sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:16px}
        .sb-logo{width:36px;height:36px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
        .sb-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#0f172a;white-space:nowrap}
        .sb-sub{font-size:10px;color:#94a3b8;margin-top:1px;white-space:nowrap}
        .new-btn{width:100%;padding:10px 14px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:background 0.15s,transform 0.1s;white-space:nowrap}
        .new-btn:hover{background:#1d4ed8}
        .new-btn:active{transform:scale(0.98)}
        .new-btn:disabled{background:#93c5fd;cursor:not-allowed}
        .sb-label{font-size:10.5px;font-weight:600;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;padding:16px 16px 6px;white-space:nowrap;flex-shrink:0}
        .sb-list{flex:1;overflow-y:auto;padding:0 8px 16px;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent}
        .sb-list::-webkit-scrollbar{width:3px}
        .sb-list::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        .sb-item{padding:10px;border-radius:10px;cursor:pointer;transition:background 0.12s;display:flex;align-items:flex-start;gap:9px;margin-bottom:2px}
        .sb-item:hover{background:#f8fafc}
        .sb-item.on{background:#eff6ff}
        .sb-ic{width:30px;height:30px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#64748b;flex-shrink:0;margin-top:1px}
        .sb-item.on .sb-ic{background:#dbeafe;color:#2563eb}
        .sb-body{flex:1;min-width:0}
        .sb-title{font-size:13px;font-weight:500;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-item.on .sb-title{color:#1d4ed8;font-weight:600}
        .sb-prev{font-size:11.5px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
        .sb-time{font-size:10px;color:#cbd5e1;flex-shrink:0;padding-top:2px;white-space:nowrap}
        .sn-main{flex:1;display:flex;flex-direction:column;min-width:0;background:#f8fafc}
        .topbar{height:56px;background:#fff;border-bottom:1px solid #e8edf5;display:flex;align-items:center;padding:0 20px;gap:12px;flex-shrink:0}
        .tog-btn{width:32px;height:32px;border:1px solid #e2e8f0;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all 0.12s;flex-shrink:0}
        .tog-btn:hover{background:#f8fafc;color:#0f172a}
        .tb-title{font-size:15px;font-weight:600;color:#0f172a;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .status-badge{display:flex;align-items:center;gap:6px;padding:5px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;font-size:12px;color:#16a34a;font-weight:500;flex-shrink:0;white-space:nowrap}
        .s-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:snPulse 2s ease-in-out infinite}
        .msgs{flex:1;overflow-y:auto;padding:24px 24px 8px;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent}
        .msgs::-webkit-scrollbar{width:4px}
        .msgs::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        .error-bar{margin:0 20px 10px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font-size:13px;color:#dc2626;animation:snFadeUp 0.2s ease-out}
        .inp-wrap{padding:12px 20px 16px;background:#fff;border-top:1px solid #e8edf5;flex-shrink:0}
        .img-bar{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:10px;animation:snFadeUp 0.2s ease-out}
        .img-bar img{width:38px;height:38px;object-fit:cover;border-radius:7px;border:1px solid #bfdbfe}
        .img-bar-txt{flex:1;font-size:12px;color:#2563eb;font-weight:500}
        .img-bar-sub{font-size:11px;color:#93c5fd;margin-top:1px}
        .bar-x{width:20px;height:20px;border-radius:50%;background:#dbeafe;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#3b82f6;transition:background 0.12s;flex-shrink:0}
        .bar-x:hover{background:#fee2e2;color:#ef4444}
        .inp-box{display:flex;align-items:flex-end;gap:8px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:10px 10px 10px 16px;transition:border-color 0.18s,box-shadow 0.18s}
        .inp-box:focus-within{border-color:#93c5fd;box-shadow:0 0 0 3px rgba(37,99,235,0.07);background:#fff}
        .chat-ta{flex:1;background:transparent;border:none;outline:none;resize:none;font-size:14px;color:#0f172a;font-family:inherit;line-height:1.55;min-height:22px;max-height:120px;overflow-y:auto}
        .chat-ta::placeholder{color:#94a3b8}
        .inp-btns{display:flex;align-items:center;gap:6px;flex-shrink:0}
        .ic-btn{width:34px;height:34px;background:transparent;border:1.5px solid #e2e8f0;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all 0.12s}
        .ic-btn:hover{background:#f1f5f9;color:#475569;border-color:#cbd5e1}
        .ic-btn.on{background:#eff6ff;border-color:#93c5fd;color:#2563eb}
        .snd-btn{width:34px;height:34px;background:#2563eb;border:none;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:all 0.12s;flex-shrink:0}
        .snd-btn:hover{background:#1d4ed8;transform:scale(1.04)}
        .snd-btn:active{transform:scale(0.96)}
        .snd-btn:disabled{background:#cbd5e1;cursor:not-allowed;transform:none}
        .inp-foot{text-align:center;font-size:11px;color:#cbd5e1;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:5px}
        .creating-hint{text-align:center;font-size:12px;color:#93c5fd;padding:6px 0;display:flex;align-items:center;justify-content:center;gap:6px}
        @keyframes snBounce{0%,60%,100%{transform:translateY(0);opacity:0.5}30%{transform:translateY(-5px);opacity:1}}
        @keyframes snFadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes snPulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes snSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="sn">

        {/* ── Sidebar ── */}
        <div className={`sn-sidebar ${sidebar ? "" : "closed"}`}>
          <div className="sb-head">
            <div className="sb-brand">
              <div className="sb-logo"><Icon d={icons.plane} size={16} /></div>
              <div>
                <div className="sb-name">SafarNama</div>
                <div className="sb-sub">AI Travel Assistant</div>
              </div>
            </div>
            <button className="new-btn" onClick={startNewChat} disabled={isCreatingChat}>
              <Icon d={icons.plus} size={15} />
              New Chat
            </button>
          </div>

          <div className="sb-label">Recent Chats</div>
          <div className="sb-list">
            {chats.map(c => (
              <div key={c.id} className={`sb-item ${activeChatId === c.id ? "on" : ""}`} onClick={() => setActiveChatId(c.id)}>
                <div className="sb-ic"><Icon d={icons.chat} size={13} /></div>
                <div className="sb-body">
                  <div className="sb-title">{c.title}</div>
                  <div className="sb-prev">{c.lastMsg}</div>
                </div>
                <div className="sb-time">{formatDate(c.time)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="sn-main">
          <div className="topbar">
            <button className="tog-btn" onClick={() => setSidebar(p => !p)}>
              <Icon d={icons.menu} size={14} />
            </button>
            <span className="tb-title">{activeTitle}</span>
            <div className="status-badge"><div className="s-dot" />AI Online</div>
          </div>

          {error && <div className="error-bar">{error}</div>}

          {isNew && !isBusy
            ? <EmptyState onSuggest={(t) => handleSend(t)} />
            : (
              <div className="msgs">
                {activeMessages.map((m, i) => (
                  <Message key={i} msg={m} userName={user?.name} />
                ))}
                {isBusy && <TypingDots />}
                <div ref={bottomRef} />
              </div>
            )
          }

          {/* ── Input area ── */}
          <div className="inp-wrap">
            {isCreatingChat && (
              <div className="creating-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" style={{ animation: "snSpin 0.8s linear infinite" }}>
                  <path d={icons.spin} />
                </svg>
                Starting new conversation...
              </div>
            )}

            {imgPreview && (
              <div className="img-bar">
                <img src={imgPreview.objectUrl} alt="preview" />
                <div>
                  <div className="img-bar-txt">Image attached</div>
                  <div className="img-bar-sub">AI will identify & suggest matching destinations</div>
                </div>
                <button className="bar-x" onClick={() => setImgPreview(null)}>
                  <Icon d={icons.x} size={10} />
                </button>
              </div>
            )}

            <div className="inp-box">
              <textarea
                ref={taRef}
                className="chat-ta"
                rows={1}
                placeholder={imgPreview ? "Add a message or just hit send..." : "Ask about destinations, packages, or upload a photo..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={isCreatingChat}
              />
              <div className="inp-btns">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
                <button
                  className={`ic-btn ${imgPreview ? "on" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading || isCreatingChat}
                  title="Upload destination photo"
                >
                  {isUploading
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "snSpin 0.8s linear infinite" }}><path d={icons.spin} /></svg>
                    : <Icon d={icons.image} size={14} />
                  }
                </button>
                <button className="snd-btn" onClick={() => handleSend()} disabled={!canSend}>
                  <Icon d={icons.send} size={14} />
                </button>
              </div>
            </div>

            <div className="inp-foot">
              <Icon d={icons.mappin} size={11} />
              Powered by SafarNama · Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </>
  );
}