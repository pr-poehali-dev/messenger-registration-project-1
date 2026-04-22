import { useState, FormEvent, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "chats" | "contacts" | "notifications" | "search" | "profile" | "settings";

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  status?: "sent" | "read";
}

interface Chat {
  id: number;
  name: string;
  sub: string;
  avatar: string;
  color: string;
  online: boolean;
  group?: boolean;
  messages: Message[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_CHATS: Chat[] = [
  {
    id: 1, name: "Алексей Воронов", sub: "Директор по развитию", avatar: "АВ",
    color: "hsl(218 65% 28%)", online: true,
    messages: [
      { id: 1, text: "Добрый день!", time: "09:10", out: false, status: "read" },
      { id: 2, text: "Привет, Алексей. Как дела с отчётом?", time: "09:12", out: true, status: "read" },
      { id: 3, text: "Работаю над финальным разделом, планирую к 17:00", time: "09:15", out: false, status: "read" },
      { id: 4, text: "Отлично, жду. Включи данные по Северо-Западу", time: "09:18", out: true, status: "read" },
      { id: 5, text: "Обязательно, добавлю сравнение с прошлым кварталом 👍", time: "09:20", out: false, status: "read" },
    ]
  },
  {
    id: 2, name: "Команда продаж", sub: "8 участников", avatar: "КП",
    color: "hsl(260 50% 35%)", online: false, group: true,
    messages: [
      { id: 1, text: "Всем привет! Встреча сегодня в 14:00", time: "08:30", out: false, status: "read" },
      { id: 2, text: "Буду", time: "08:45", out: true, status: "read" },
      { id: 3, text: "Марина: встреча перенесена на 15:00", time: "10:02", out: false, status: "read" },
    ]
  },
  {
    id: 3, name: "Ольга Смирнова", sub: "Главный бухгалтер", avatar: "ОС",
    color: "hsl(152 50% 28%)", online: true,
    messages: [
      { id: 1, text: "Документы подписаны, отправила на почту", time: "11:30", out: false, status: "read" },
      { id: 2, text: "Спасибо, Ольга!", time: "11:35", out: true, status: "read" },
    ]
  },
  {
    id: 4, name: "IT-Поддержка", sub: "3 участника", avatar: "IT",
    color: "hsl(30 65% 32%)", online: false, group: true,
    messages: [
      { id: 1, text: "Заявка №4821 закрыта", time: "11:00", out: false, status: "read" },
    ]
  },
  {
    id: 5, name: "Дмитрий Крылов", sub: "Руководитель проекта", avatar: "ДК",
    color: "hsl(0 55% 30%)", online: false,
    messages: [
      { id: 1, text: "Проект согласован, спасибо за работу!", time: "08:50", out: false, status: "read" },
      { id: 2, text: "Отлично, будем продолжать 🚀", time: "09:00", out: true, status: "read" },
    ]
  },
  {
    id: 6, name: "Юридический отдел", sub: "5 участников", avatar: "ЮО",
    color: "hsl(190 55% 28%)", online: false, group: true,
    messages: [
      { id: 1, text: "Контракт №12 на проверке, срок — пятница", time: "Вчера", out: false, status: "read" },
    ]
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Av = ({ color, initials, size = "md", online }: {
  color: string; initials: string; size?: "sm" | "md" | "lg"; online?: boolean
}) => {
  const s = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s[size]} rounded-full flex items-center justify-center font-bold`}
        style={{ background: color, color: "rgba(255,255,255,0.92)" }}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-gray-300"}`} />
      )}
    </div>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@corp.ru" && password === "securechat") {
        onLogin();
      } else {
        setError("Неверный email или пароль");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(218 55% 10%)" }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(hsl(213 72% 60%) 1px,transparent 1px),linear-gradient(90deg,hsl(213 72% 60%) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "hsl(213 72% 50%)" }} />

      <div className="relative w-full max-w-sm mx-4 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "hsl(213 72% 42%)" }}>
            <Icon name="Shield" size={28} style={{ color: "white" }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(210 30% 95%)" }}>SecureChat</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(213 20% 55%)" }}>Корпоративный мессенджер</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: "hsl(218 45% 14%)", borderColor: "hsl(218 40% 22%)" }}>
          <h2 className="text-base font-semibold mb-6" style={{ color: "hsl(210 30% 92%)" }}>Вход в систему</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: "hsl(213 20% 55%)" }}>Email</label>
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(213 20% 50%)" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="login@company.ru" required
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition-all"
                  style={{ background: "hsl(218 50% 10%)", border: "1px solid hsl(218 40% 24%)", color: "hsl(210 30% 92%)" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(213 72% 50%)")}
                  onBlur={e => (e.target.style.borderColor = "hsl(218 40% 24%)")} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: "hsl(213 20% 55%)" }}>Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(213 20% 50%)" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg outline-none transition-all"
                  style={{ background: "hsl(218 50% 10%)", border: "1px solid hsl(218 40% 24%)", color: "hsl(210 30% 92%)" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(213 72% 50%)")}
                  onBlur={e => (e.target.style.borderColor = "hsl(218 40% 24%)")} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={15} style={{ color: "hsl(213 20% 50%)" }} />
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg animate-fade-in"
                style={{ background: "hsl(0 60% 20%)", color: "hsl(0 80% 75%)", border: "1px solid hsl(0 50% 30%)" }}>
                <Icon name="AlertCircle" size={13} />{error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all mt-2 flex items-center justify-center gap-2"
              style={{ background: "hsl(213 72% 42%)", color: "white", opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Проверка...</>
                : <><Icon name="LogIn" size={15} />Войти</>}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t flex items-center gap-2 text-xs" style={{ borderColor: "hsl(218 40% 22%)", color: "hsl(213 20% 45%)" }}>
            <Icon name="Info" size={12} />
            <span>Демо: <span style={{ color: "hsl(213 50% 65%)" }}>admin@corp.ru</span> / <span style={{ color: "hsl(213 50% 65%)" }}>securechat</span></span>
          </div>
        </div>
        <div className="text-center mt-6 text-xs font-mono-plex" style={{ color: "hsl(213 20% 38%)" }}>
          SecureChat v2.4.1 · E2E Encrypted
        </div>
      </div>
    </div>
  );
};

// ─── Chat Window ──────────────────────────────────────────────────────────────
const ChatWindow = ({ chat, onSend, onBack }: {
  chat: Chat;
  onSend: (chatId: number, text: string) => void;
  onBack: () => void;
}) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    onSend(chat.id, t);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Group messages by date label
  const dateLabel = "Сегодня";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white flex-shrink-0">
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors mr-1">
          <Icon name="ChevronLeft" size={20} className="text-muted-foreground" />
        </button>
        <Av color={chat.color} initials={chat.avatar} size="sm" online={chat.online} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{chat.name}</div>
          <div className="text-xs" style={{ color: "hsl(215 16% 50%)" }}>
            {chat.online ? "в сети" : chat.group ? chat.sub : "не в сети"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="Phone" size={17} className="text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="Video" size={17} className="text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="MoreVertical" size={17} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        style={{ background: "hsl(220 18% 96%)" }}>

        {/* Date divider */}
        <div className="flex items-center justify-center my-3">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: "hsl(218 20% 88%)", color: "hsl(215 16% 45%)" }}>
            {dateLabel}
          </span>
        </div>

        {chat.messages.map((msg, i) => {
          const prevOut = i > 0 ? chat.messages[i - 1].out : null;
          const isFirst = prevOut !== msg.out;
          return (
            <div key={msg.id}
              className={`flex items-end gap-2 ${msg.out ? "justify-end" : "justify-start"} ${!isFirst ? (msg.out ? "pr-0" : "pl-10") : ""}`}
              style={{ marginTop: isFirst ? "12px" : "2px" }}>

              {/* Avatar for incoming, only on first in group */}
              {!msg.out && isFirst && (
                <Av color={chat.color} initials={chat.avatar} size="sm" />
              )}

              {/* Bubble */}
              <div className={`relative max-w-[72%] px-3.5 py-2 text-sm leading-relaxed select-text
                ${msg.out
                  ? "rounded-2xl rounded-br-sm"
                  : "rounded-2xl rounded-bl-sm"}`}
                style={msg.out
                  ? { background: "hsl(213 72% 42%)", color: "white" }
                  : { background: "white", color: "hsl(220 25% 14%)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
                <p style={{ wordBreak: "break-word" }}>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-end"}`}>
                  <span className="text-xs" style={{ color: msg.out ? "rgba(255,255,255,0.65)" : "hsl(215 16% 55%)" }}>
                    {msg.time}
                  </span>
                  {msg.out && (
                    <Icon name={msg.status === "read" ? "CheckCheck" : "Check"} size={13}
                      style={{ color: msg.status === "read" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)" }} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-border flex-shrink-0">
        <div className="flex items-end gap-2">
          <button className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0 mb-0.5">
            <Icon name="Paperclip" size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              placeholder="Сообщение..."
              rows={1}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-2xl resize-none outline-none transition-all bg-background"
              style={{ maxHeight: "120px", lineHeight: "1.5" }}
            />
          </div>
          <button onClick={send}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:brightness-110 mb-0.5"
            style={{ background: input.trim() ? "hsl(213 72% 42%)" : "hsl(215 18% 82%)" }}>
            <Icon name="Send" size={15} style={{ color: "white" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({
  chats, activeId, section, setSection, setActiveId, onLogout
}: {
  chats: Chat[];
  activeId: number | null;
  section: Section;
  setSection: (s: Section) => void;
  setActiveId: (id: number) => void;
  onLogout: () => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const getLastMsg = (c: Chat) => c.messages[c.messages.length - 1];
  const unread = (c: Chat) => 0; // можно добавить логику

  return (
    <div className="flex h-full">
      {/* Icon rail */}
      <div className="w-14 flex flex-col items-center py-3 gap-1 flex-shrink-0 border-r"
        style={{ background: "hsl(218 55% 14%)", borderColor: "hsl(218 45% 20%)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
          style={{ background: "hsl(213 72% 42%)" }}>
          <Icon name="Shield" size={16} style={{ color: "white" }} />
        </div>
        {([
          { key: "chats", icon: "MessageSquare" },
          { key: "contacts", icon: "Users" },
          { key: "notifications", icon: "Bell" },
          { key: "search", icon: "Search" },
          { key: "profile", icon: "User" },
          { key: "settings", icon: "Settings" },
        ] as { key: Section; icon: string }[]).map(item => (
          <button key={item.key} onClick={() => setSection(item.key)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${section === item.key ? "text-white" : "text-blue-300/60 hover:text-blue-200"}`}
            style={section === item.key ? { background: "hsl(218 50% 24%)" } : {}}>
            <Icon name={item.icon} size={19} />
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={onLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-300/50 hover:text-red-400 transition-colors">
          <Icon name="LogOut" size={18} />
        </button>
      </div>

      {/* Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {section === "chats" && (
          <>
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-base">Чаты</span>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <Icon name="SquarePen" size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted rounded-lg border-0 outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(chat => {
                const last = getLastMsg(chat);
                const active = activeId === chat.id;
                return (
                  <div key={chat.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all"
                    style={{ background: active ? "hsl(213 72% 42% / 0.08)" : "transparent",
                      borderLeft: active ? "3px solid hsl(213 72% 42%)" : "3px solid transparent" }}
                    onClick={() => { setActiveId(chat.id); setSection("chats"); }}>
                    <Av color={chat.color} initials={chat.avatar} size="md" online={chat.online} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className={`text-sm font-semibold truncate ${active ? "" : ""}`}>{chat.name}</span>
                        <span className="text-xs flex-shrink-0 ml-1" style={{ color: "hsl(215 16% 55%)" }}>{last?.time}</span>
                      </div>
                      <div className="text-xs truncate mt-0.5" style={{ color: "hsl(215 16% 52%)" }}>
                        {last?.out ? "Вы: " : ""}{last?.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {section === "contacts" && (
          <div className="flex flex-col h-full">
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <span className="font-semibold text-base">Контакты</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.filter(c => !c.group).map(c => (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer transition-all"
                  onClick={() => { setActiveId(c.id); setSection("chats"); }}>
                  <Av color={c.color} initials={c.avatar} online={c.online} />
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "notifications" && (
          <div className="flex flex-col h-full">
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <span className="font-semibold text-base">Уведомления</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {[
                { icon: "MessageSquare", t: "Новое сообщение", d: "Алексей: «Отчёт готов к 17:00»", time: "14:32", unread: true },
                { icon: "Users", t: "Добавлены в группу", d: "Чат «Стратегия Q2»", time: "13:00", unread: true },
                { icon: "Shield", t: "Безопасность", d: "Вход с MacBook Pro (Москва)", time: "09:45", unread: false },
              ].map((n, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-xl border text-sm ${n.unread ? "bg-white border-border shadow-sm" : "bg-muted/30 border-transparent"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.unread ? "bg-blue-50" : "bg-muted"}`}>
                    <Icon name={n.icon} size={15} className={n.unread ? "text-blue-600" : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs">{n.t}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{n.d}</div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "search" && (
          <div className="flex flex-col h-full">
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <span className="font-semibold text-base">Поиск</span>
            </div>
            <div className="p-3">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input autoFocus placeholder="Поиск по чатам..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent/30 bg-background" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground flex-col gap-2">
              <Icon name="Search" size={32} className="text-muted-foreground/30" />
              Начните вводить запрос
            </div>
          </div>
        )}

        {section === "profile" && (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <span className="font-semibold text-base">Профиль</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: "hsl(218 65% 22%)", color: "hsl(213 72% 72%)" }}>АН</div>
                <div>
                  <div className="font-semibold">Анна Новикова</div>
                  <div className="text-xs text-muted-foreground">Менеджер по коммуникациям</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-600">В сети</span>
                  </div>
                </div>
              </div>
              {[
                { icon: "Mail", v: "novikova@corp.ru" },
                { icon: "Phone", v: "+7 (495) 000-00-01" },
                { icon: "Building", v: "Корпоративные коммуникации" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2 border-b border-border last:border-0">
                  <Icon name={item.icon} size={15} className="text-muted-foreground" />
                  <span className="text-sm">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "settings" && (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="px-3 pt-4 pb-3 border-b border-border">
              <span className="font-semibold text-base">Настройки</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {[
                { icon: "Bell", t: "Уведомления" },
                { icon: "Lock", t: "Конфиденциальность" },
                { icon: "Palette", t: "Оформление" },
                { icon: "HelpCircle", t: "Помощь" },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                  <Icon name={item.icon} size={17} className="text-muted-foreground" />
                  <span className="font-medium">{item.t}</span>
                  <Icon name="ChevronRight" size={15} className="text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 select-none"
    style={{ background: "hsl(220 18% 96%)" }}>
    <div className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: "hsl(218 65% 22%)" }}>
      <Icon name="MessageSquare" size={36} style={{ color: "hsl(213 72% 65%)" }} />
    </div>
    <div className="text-base font-semibold" style={{ color: "hsl(220 25% 20%)" }}>SecureChat</div>
    <div className="text-sm text-muted-foreground">Выберите чат, чтобы начать общение</div>
    <div className="encrypt-badge mt-2">
      <Icon name="Lock" size={11} />
      Все сообщения защищены E2E
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [auth, setAuth] = useState(false);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [section, setSection] = useState<Section>("chats");

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const activeChat = chats.find(c => c.id === activeId) ?? null;

  const handleSend = (chatId: number, text: string) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const newMsg: Message = {
        id: c.messages.length + 1,
        text,
        time: now(),
        out: true,
        status: "sent",
      };
      return { ...c, messages: [...c.messages, newMsg] };
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 border-r border-border" style={{ width: "320px" }}>
        <Sidebar
          chats={chats}
          activeId={activeId}
          section={section}
          setSection={setSection}
          setActiveId={(id) => { setActiveId(id); setSection("chats"); }}
          onLogout={() => setAuth(false)}
        />
      </div>

      {/* Chat or empty */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat
          ? <ChatWindow chat={activeChat} onSend={handleSend} onBack={() => setActiveId(null)} />
          : <EmptyState />}
      </div>
    </div>
  );
}
