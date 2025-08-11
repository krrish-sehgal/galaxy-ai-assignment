import type React from "react";
import {
  Plus,
  Search,
  Library,
  Bot,
  Wand2,
  Sparkles,
  Brain,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  files?: any[];
};
type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onShowMemoryManager: () => void;
  setChats: (value: React.SetStateAction<Chat[]>) => void;
}

function SidebarButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
        active
          ? "bg-white/10 text-white"
          : "hover:bg-white/5 text-zinc-300 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function ChatListItem({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onArchive,
}: {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onArchive: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chat.title);

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== chat.title) {
      onRename(renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setRenameValue(chat.title);
      setIsRenaming(false);
    }
  };

  if (isRenaming) {
    return (
      <div className="px-3 py-2">
        <input
          type="text"
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/40"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={cn(
          "w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-sm truncate transition-colors",
          isActive
            ? "bg-white/10 text-white"
            : "text-zinc-300 hover:bg-white/5 hover:text-white"
        )}
        title={chat.title}
      >
        <span className="truncate flex-1">{chat.title}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="19" r="2" fill="currentColor" />
            </svg>
          </Button>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-2 top-8 z-20 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg min-w-[160px]">
          <div className="p-1">
            <button
              onClick={e => {
                e.stopPropagation();
                setIsRenaming(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 rounded transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Rename
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onArchive();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 rounded transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="20" height="5" x="2" y="3" rx="1" />
                <path d="m4 8 16 0v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
              </svg>
              Archive
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 rounded transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18l-2 13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 6Z" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onShowMemoryManager,
  setChats,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center border border-white/20">
          <img src="/open-ai-logo.png" alt="OpenAI" className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 py-2">
          <SidebarButton
            icon={Plus}
            label="New chat"
            onClick={onNewChat}
            active={false}
          />
          <SidebarButton icon={Search} label="Search chats" />
          <SidebarButton
            icon={Brain}
            label="AI Memory"
            onClick={onShowMemoryManager}
          />
          <SidebarButton icon={Library} label="Library" />
          <div className="mt-4 text-xs uppercase tracking-wide text-zinc-400 px-2"></div>
          <SidebarButton icon={Wand2} label="Sora" />
          <SidebarButton icon={Bot} label="GPTs" />
          <SidebarButton icon={Sparkles} label="image generator pro" />
          <SidebarButton icon={Sparkles} label="Website Generator" />

          {chats.length > 0 && (
            <div className="mt-5 text-xs  tracking-wide text-zinc-400 px-2">
              Chats
            </div>
          )}

          <div role="list" aria-label="Chats">
            {chats.map(c => (
              <ChatListItem
                key={c.id}
                chat={c}
                isActive={c.id === activeChatId}
                onSelect={() => onSelectChat(c.id)}
                onDelete={() => {
                  setChats(prev => prev.filter(chat => chat.id !== c.id));
                  if (c.id === activeChatId) {
                    onSelectChat("");
                    localStorage.removeItem("chatgpt-active-chat-id");
                  }
                }}
                onRename={(newTitle: string) => {
                  setChats(prev =>
                    prev.map(chat =>
                      chat.id === c.id ? { ...chat, title: newTitle } : chat
                    )
                  );
                }}
                onArchive={() => {
                  // For now, just remove from list - in a real app you'd mark as archived
                  setChats(prev => prev.filter(chat => chat.id !== c.id));
                  if (c.id === activeChatId) {
                    onSelectChat("");
                    localStorage.removeItem("chatgpt-active-chat-id");
                  }
                }}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 transition">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src="/abstract-avatar.png" alt="User avatar" />
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">Krrish Sehgal</div>
            <div className="text-xs text-zinc-400">Free</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate Mobile Sidebar Component
interface MobileSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onShowMemoryManager: () => void;
  setChats: (value: React.SetStateAction<Chat[]>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onShowMemoryManager,
  setChats,
  isOpen,
  onClose,
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[rgb(24,24,24)] md:hidden">
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
              aria-label="Close navigation menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m18 6-12 12" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>

          {/* Use the existing Sidebar component */}
          <div className="flex-1 overflow-hidden">
            <Sidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={id => {
                onSelectChat(id);
                onClose();
              }}
              onNewChat={() => {
                onNewChat();
                onClose();
              }}
              onShowMemoryManager={() => {
                onShowMemoryManager();
                onClose();
              }}
              setChats={setChats}
            />
          </div>
        </div>
      </div>
    </>
  );
}
