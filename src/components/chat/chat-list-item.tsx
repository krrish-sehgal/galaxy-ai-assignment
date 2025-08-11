import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onArchive: () => void;
}

export function ChatListItem({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onArchive,
}: ChatListItemProps) {
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
