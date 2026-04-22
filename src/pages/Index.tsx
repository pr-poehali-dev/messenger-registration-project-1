import { useState, FormEvent } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "chats" | "contacts" | "notifications" | "search" | "profile" | "settings";

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
}

interface Chat {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  group?: boolean;
}

interface Contact {
  id: number;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  online: boolean;
  email: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHATS: Chat[] = [
  { id: 1, name: "Алексей Воронов", role: "Директор по развитию", avatar: "АВ", lastMsg: "Отчёт готов, вышлю к 17:00", time: "14:32", unread: 2, online: true },
  { id: 2, name: "Команда продаж", role: "8 участников", avatar: "КП", lastMsg: "Марина: встреча перенесена", time: "13:15", unread: 5, online: false, group: true },
  { id: 3, name: "Ольга Смирнова", role: "Главный бухгалтер", avatar: "ОС", lastMsg: "Документы подписаны", time: "12:44", unread: 0, online: true },
  { id: 4, name: "IT-Поддержка", role: "3 участника", avatar: "IT", lastMsg: "Заявка №4821 закрыта", time: "11:30", unread: 0, online: false, group: true },
  { id: 5, name: "Дмитрий Крылов", role: "Руководитель проекта", avatar: "ДК", lastMsg: "Согласовано, спасибо", time: "09:18", unread: 1, online: false },
  { id: 6, name: "Юридический отдел", role: "5 участников", avatar: "ЮО", lastMsg: "Контракт на проверке", time: "Вчера", unread: 0, online: false, group: true },
];

const MESSAGES: Message[] = [
  { id: 1, text: "Добрый день, Алексей. Когда будет готов квартальный отчёт?", time: "13:55", out: true },
  { id: 2, text: "Добрый день! Работаю над финальным разделом. Планирую завершить к 17:00.", time: "14:02", out: false },
  { id: 3, text: "Отлично. Пожалуйста, включите данные по региону Северо-Запад.", time: "14:10", out: true },
  { id: 4, text: "Обязательно. Также добавлю сравнение с прошлым кварталом — это даст полную картину.", time: "14:18", out: false },
  { id: 5, text: "Хорошо, жду. Отчёт готов, вышлю к 17:00", time: "14:32", out: false },
];

const CONTACTS: Contact[] = [
  { id: 1, name: "Алексей Воронов", role: "Директор по развитию", dept: "Стратегия", avatar: "АВ", online: true, email: "voronov@corp.ru" },
  { id: 2, name: "Ольга Смирнова", role: "Главный бухгалтер", dept: "Финансы", avatar: "ОС", online: true, email: "smirnova@corp.ru" },
  { id: 3, name: "Дмитрий Крылов", role: "Руководитель проекта", dept: "Разработка", avatar: "ДК", online: false, email: "krylov@corp.ru" },
  { id: 4, name: "Марина Захарова", role: "Менеджер продаж", dept: "Продажи", avatar: "МЗ", online: true, email: "zaharova@corp.ru" },
  { id: 5, name: "Сергей Лебедев", role: "Системный администратор", dept: "ИТ", avatar: "СЛ", online: false, email: "lebedev@corp.ru" },
  { id: 6, name: "Наталья Орлова", role: "Юрист", dept: "Юридический", avatar: "НО", online: true, email: "orlova@corp.ru" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "MessageSquare", title: "Новое сообщение", desc: "Алексей Воронов: «Отчёт готов, вышлю к 17:00»", time: "14:32", read: false, color: "text-blue-600" },
  { id: 2, icon: "Users", title: "Добавлены в группу", desc: "Вас добавили в чат «Стратегия Q2»", time: "13:00", read: false, color: "text-violet-600" },
  { id: 3, icon: "Shield", title: "Безопасность", desc: "Новый вход с устройства MacBook Pro (Москва)", time: "09:45", read: true, color: "text-emerald-600" },
  { id: 4, icon: "Bell", title: "Напоминание", desc: "Совещание через 15 минут: Q2 Planning", time: "09:00", read: true, color: "text-amber-600" },
  { id: 5, icon: "UserPlus", title: "Новый контакт", desc: "Наталья Орлова добавила вас в контакты", time: "Вчера", read: true, color: "text-blue-600" },
];

// ─── Avatar Component ─────────────────────────────────────────────────────────
const Avatar = ({ initials, size = "md", online }: { initials: string; size?: "sm" | "md" | "lg"; online?: boolean }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold`}
        style={{ background: "hsl(218 65% 22%)", color: "hsl(213 72% 72%)" }}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 ${online ? "status-online" : "status-offline"}`} />
      )}
    </div>
  );
};

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV = [
  { key: "chats", icon: "MessageSquare", label: "Чаты" },
  { key: "contacts", icon: "Users", label: "Контакты" },
  { key: "notifications", icon: "Bell", label: "Уведом." },
  { key: "search", icon: "Search", label: "Поиск" },
  { key: "profile", icon: "User", label: "Профиль" },
  { key: "settings", icon: "Settings", label: "Настройки" },
] as const;

// ─── Chat Panel ───────────────────────────────────────────────────────────────
const ChatsPanel = ({ activeChat, setActiveChat }: { activeChat: number; setActiveChat: (id: number) => void }) => {
  const [search, setSearch] = useState("");
  const filtered = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-border">
        <div className="section-divider px-0 pb-1">Сообщения</div>
        <div className="relative mt-2">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-muted rounded-md border-0 outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat, i) => (
          <div key={chat.id}
            className={`chat-item animate-slide-right ${activeChat === chat.id ? "active" : ""}`}
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => setActiveChat(chat.id)}>
            <Avatar initials={chat.avatar} online={chat.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate" style={{ color: "hsl(220 25% 12%)" }}>{chat.name}</span>
                <span className="text-xs ml-2 flex-shrink-0" style={{ color: "hsl(215 16% 55%)" }}>{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs truncate" style={{ color: "hsl(215 16% 50%)" }}>{chat.lastMsg}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold"
                    style={{ background: "hsl(213 72% 42%)", color: "white" }}>
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Message View ─────────────────────────────────────────────────────────────
const MessageView = ({ chatId }: { chatId: number }) => {
  const [input, setInput] = useState("");
  const chat = CHATS.find(c => c.id === chatId);
  if (!chat) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-white">
        <Avatar initials={chat.avatar} online={chat.online} />
        <div className="flex-1">
          <div className="font-semibold text-sm">{chat.name}</div>
          <div className="text-xs" style={{ color: "hsl(215 16% 50%)" }}>{chat.role}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="encrypt-badge">
            <Icon name="Lock" size={10} />
            E2E Шифрование
          </span>
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <Icon name="Video" size={16} className="text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <Icon name="Info" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center py-2 px-4">
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "hsl(152 68% 40% / 0.07)", color: "hsl(152 50% 35%)", border: "1px solid hsl(152 60% 40% / 0.2)" }}>
          <Icon name="ShieldCheck" size={12} />
          Сквозное шифрование активно — сообщения видны только участникам
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ background: "hsl(220 20% 97%)" }}>
        {MESSAGES.map((msg, i) => (
          <div key={msg.id}
            className={`flex animate-msg-pop ${msg.out ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${i * 60}ms` }}>
            {!msg.out && <Avatar initials={chat.avatar} size="sm" />}
            <div className={`max-w-[68%] rounded-xl px-4 py-2.5 ml-2 ${msg.out ? "message-out rounded-tr-sm" : "message-in rounded-tl-sm"}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1.5 ${msg.out ? "justify-end" : "justify-start"}`}>
                <Icon name="Lock" size={10} className={msg.out ? "text-blue-300" : "text-muted-foreground"} />
                <span className={`text-xs ${msg.out ? "text-blue-200" : "text-muted-foreground"}`}>{msg.time}</span>
                {msg.out && <Icon name="CheckCheck" size={12} className="text-blue-300" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-border bg-white">
        <div className="flex items-end gap-3">
          <button className="p-2 rounded-md hover:bg-muted transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              rows={1}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl resize-none outline-none focus:ring-2 focus:ring-accent/30 bg-background"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setInput(""); } }}
            />
          </div>
          <button
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
            style={{ background: "hsl(218 65% 22%)" }}>
            <Icon name="Send" size={16} style={{ color: "white" }} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Icon name="Lock" size={11} className="text-muted-foreground" />
          <span className="text-xs" style={{ color: "hsl(215 16% 55%)" }}>Зашифровано · AES-256</span>
        </div>
      </div>
    </div>
  );
};

// ─── Contacts Panel ───────────────────────────────────────────────────────────
const ContactsPanel = () => {
  const [search, setSearch] = useState("");
  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dept.toLowerCase().includes(search.toLowerCase())
  );
  const depts = [...new Set(filtered.map(c => c.dept))];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border bg-white">
        <div className="section-divider px-0 pb-2">Контакты</div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или отделу..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-muted rounded-md border-0 outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {depts.map(dept => (
          <div key={dept} className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b border-border"
              style={{ color: "hsl(215 16% 50%)", letterSpacing: "0.1em" }}>
              {dept}
            </div>
            <div className="space-y-1">
              {filtered.filter(c => c.dept === dept).map((c, i) => (
                <div key={c.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/60 cursor-pointer transition-all group animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <Avatar initials={c.avatar} online={c.online} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.role}</div>
                    <div className="text-xs mt-0.5" style={{ color: "hsl(215 16% 55%)" }}>{c.email}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md hover:bg-background transition-colors">
                      <Icon name="MessageSquare" size={14} className="text-accent" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-background transition-colors">
                      <Icon name="Phone" size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                  <span className={`text-xs ${c.online ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {c.online ? "онлайн" : "офлайн"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Notifications Panel ──────────────────────────────────────────────────────
const NotificationsPanel = () => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-5 border-b border-border bg-white flex items-center justify-between">
      <div>
        <div className="section-divider px-0 pb-0">Уведомления</div>
        <div className="text-xs text-muted-foreground mt-1">2 непрочитанных</div>
      </div>
      <button className="text-xs font-medium hover:underline" style={{ color: "hsl(213 72% 42%)" }}>
        Прочитать все
      </button>
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
      {NOTIFICATIONS.map((n, i) => (
        <div key={n.id}
          className={`flex gap-4 p-4 rounded-lg border transition-all animate-fade-in cursor-pointer hover:shadow-sm ${!n.read ? "bg-white border-border shadow-sm" : "bg-muted/30 border-transparent hover:bg-muted/60"}`}
          style={{ animationDelay: `${i * 60}ms` }}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-blue-50" : "bg-muted"}`}>
            <Icon name={n.icon} size={16} className={!n.read ? n.color : "text-muted-foreground"} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${!n.read ? "" : "text-muted-foreground"}`}>{n.title}</span>
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{n.time}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</div>
          </div>
          {!n.read && (
            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "hsl(213 72% 42%)" }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Search Panel ─────────────────────────────────────────────────────────────
const SearchPanel = () => {
  const [q, setQ] = useState("");
  const results = q.length > 1 ? [
    ...CHATS.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).map(c => ({ type: "chat", name: c.name, sub: c.role, av: c.avatar })),
    ...CONTACTS.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).map(c => ({ type: "contact", name: c.name, sub: c.dept, av: c.avatar })),
  ] : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border bg-white">
        <div className="section-divider px-0 pb-2">Поиск</div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Поиск по чатам, контактам, сообщениям..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent/30 bg-background"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {q.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="Search" size={24} className="text-muted-foreground" />
            </div>
            <div className="font-medium text-sm">Начните вводить запрос</div>
            <div className="text-xs text-muted-foreground mt-1">Поиск по чатам, контактам и сообщениям</div>
          </div>
        )}
        {q.length > 0 && results.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">Ничего не найдено по запросу «{q}»</div>
        )}
        {results.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-3">{results.length} результатов</div>
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-all animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: "hsl(218 65% 22%)", color: "hsl(213 72% 72%)" }}>
                  {r.av}
                </div>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.type === "chat" ? "Чат" : "Контакт"} · {r.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Profile Panel ────────────────────────────────────────────────────────────
const ProfilePanel = () => (
  <div className="flex flex-col h-full overflow-y-auto">
    <div className="px-6 py-5 border-b border-border bg-white">
      <div className="section-divider px-0">Профиль</div>
    </div>
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center gap-5 p-5 bg-white rounded-xl border border-border">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ background: "hsl(218 65% 22%)", color: "hsl(213 72% 72%)" }}>
          АН
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">Анна Новикова</div>
          <div className="text-sm text-muted-foreground">Менеджер по коммуникациям</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600">В сети</span>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Icon name="Edit" size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Информация</span>
        </div>
        {[
          { icon: "Mail", label: "Email", value: "novikova@corp.ru" },
          { icon: "Phone", label: "Телефон", value: "+7 (495) 000-00-01" },
          { icon: "Building", label: "Отдел", value: "Корпоративные коммуникации" },
          { icon: "MapPin", label: "Офис", value: "Москва, Башня Федерация" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <Icon name={item.icon} size={15} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-sm font-medium mt-0.5">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Безопасность</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Lock" size={15} className="text-emerald-600" />
              <div>
                <div className="text-sm font-medium">E2E шифрование</div>
                <div className="text-xs text-muted-foreground">Активно для всех чатов</div>
              </div>
            </div>
            <span className="encrypt-badge">Включено</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" size={15} className="text-blue-600" />
              <div>
                <div className="text-sm font-medium">Двухфакторная аутентификация</div>
                <div className="text-xs text-muted-foreground">Через SMS</div>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600">Активна</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Settings Panel ───────────────────────────────────────────────────────────
const SettingsPanel = () => {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [encrypt, setEncrypt] = useState(true);

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle}
      className="w-10 h-5 rounded-full transition-all relative"
      style={on ? { background: "hsl(218 65% 22%)" } : { background: "hsl(215 18% 88%)", border: "1px solid hsl(215 20% 82%)" }}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border bg-white">
        <div className="section-divider px-0">Настройки</div>
      </div>
      <div className="px-6 py-6 space-y-6">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Уведомления</span>
          </div>
          {[
            { icon: "Bell", label: "Push-уведомления", sub: "Оповещения о новых сообщениях", on: notif, toggle: () => setNotif(!notif) },
            { icon: "Volume2", label: "Звуки", sub: "Звуковые сигналы для сообщений", on: sound, toggle: () => setSound(!sound) },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-0">
              <Icon name={item.icon} size={16} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
              <Toggle on={item.on} toggle={item.toggle} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Безопасность</span>
          </div>
          <div className="flex items-center gap-4 px-4 py-3.5">
            <Icon name="Lock" size={16} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium">Сквозное шифрование</div>
              <div className="text-xs text-muted-foreground">AES-256 для всех переписок</div>
            </div>
            <Toggle on={encrypt} toggle={() => setEncrypt(!encrypt)} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Аккаунт</span>
          </div>
          {[
            { icon: "Key", label: "Изменить пароль", destructive: false },
            { icon: "Download", label: "Экспорт данных", destructive: false },
            { icon: "LogOut", label: "Выйти из аккаунта", destructive: true },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors text-left">
              <Icon name={item.icon} size={16} className={`flex-shrink-0 ${item.destructive ? "text-destructive" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${item.destructive ? "text-destructive" : ""}`}>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="text-center py-4">
          <div className="font-mono-plex text-xs text-muted-foreground">SecureChat v2.4.1 · Build 2026.04</div>
          <div className="encrypt-badge inline-flex mt-2">
            <Icon name="Shield" size={10} />
            Сертифицировано ФСТЭК России
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
const DEMO_LOGIN = "admin@corp.ru";
const DEMO_PASSWORD = "securechat";

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
      if (email === DEMO_LOGIN && password === DEMO_PASSWORD) {
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

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(hsl(213 72% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 72% 60%) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "hsl(213 72% 50%)" }} />

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4 animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "hsl(213 72% 42%)" }}>
            <Icon name="Shield" size={28} style={{ color: "white" }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(210 30% 95%)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            SecureChat
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(213 20% 55%)" }}>
            Корпоративный мессенджер
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-8 border"
          style={{ background: "hsl(218 45% 14%)", borderColor: "hsl(218 40% 22%)" }}>

          <h2 className="text-base font-semibold mb-6" style={{ color: "hsl(210 30% 92%)" }}>
            Вход в систему
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: "hsl(213 20% 55%)" }}>
                Корпоративный email
              </label>
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(213 20% 50%)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="login@company.ru"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition-all"
                  style={{
                    background: "hsl(218 50% 10%)",
                    border: "1px solid hsl(218 40% 24%)",
                    color: "hsl(210 30% 92%)",
                  }}
                  onFocus={e => e.target.style.borderColor = "hsl(213 72% 50%)"}
                  onBlur={e => e.target.style.borderColor = "hsl(218 40% 24%)"}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: "hsl(213 20% 55%)" }}>
                Пароль
              </label>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(213 20% 50%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg outline-none transition-all"
                  style={{
                    background: "hsl(218 50% 10%)",
                    border: "1px solid hsl(218 40% 24%)",
                    color: "hsl(210 30% 92%)",
                  }}
                  onFocus={e => e.target.style.borderColor = "hsl(213 72% 50%)"}
                  onBlur={e => e.target.style.borderColor = "hsl(218 40% 24%)"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70">
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={15} style={{ color: "hsl(213 20% 50%)" }} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg animate-fade-in"
                style={{ background: "hsl(0 60% 20%)", color: "hsl(0 80% 75%)", border: "1px solid hsl(0 50% 30%)" }}>
                <Icon name="AlertCircle" size={13} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all mt-2 flex items-center justify-center gap-2"
              style={{ background: "hsl(213 72% 42%)", color: "white", opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Проверка...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={15} />
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: "hsl(218 40% 22%)" }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(213 20% 45%)" }}>
              <Icon name="Info" size={12} />
              <span>Демо: <span style={{ color: "hsl(213 50% 65%)" }}>admin@corp.ru</span> / <span style={{ color: "hsl(213 50% 65%)" }}>securechat</span></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs" style={{ color: "hsl(213 20% 38%)", fontFamily: "'IBM Plex Mono', monospace" }}>
          SecureChat v2.4.1 · E2E Encrypted · ФСТЭК
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Index() {
  const [auth, setAuth] = useState(false);
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState(1);
  const isChats = section === "chats";

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(220 20% 97%)" }}>

      {/* Icon navbar */}
      <nav className="w-16 flex flex-col items-center py-4 flex-shrink-0 border-r"
        style={{ background: "hsl(218 55% 14%)", borderColor: "hsl(218 45% 20%)" }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-6"
          style={{ background: "hsl(213 72% 42%)" }}>
          <Icon name="Shield" size={18} style={{ color: "white" }} />
        </div>

        <div className="flex-1 w-full flex flex-col gap-1">
          {NAV.map(item => (
            <button key={item.key} onClick={() => setSection(item.key as Section)}
              className={`nav-item ${section === item.key ? "active" : ""}`}>
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer"
          style={{ background: "hsl(213 72% 42%)", color: "white" }}>
          АН
        </div>
      </nav>

      {/* Chat list sidebar */}
      {isChats && (
        <div className="w-72 flex-shrink-0 border-r border-border bg-white flex flex-col">
          <ChatsPanel activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {section === "chats" && <MessageView chatId={activeChat} />}
        {section === "contacts" && <ContactsPanel />}
        {section === "notifications" && <NotificationsPanel />}
        {section === "search" && <SearchPanel />}
        {section === "profile" && <ProfilePanel />}
        {section === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}