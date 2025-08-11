import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Mic,
  X,
  File,
  Paperclip,
  Library,
  Sparkles,
  Bot,
  Search,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  RotateCcw,
  Edit3,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { UploadedFile } from "@/types";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
};

interface ChatViewNewProps {
  messages: Message[];
  onSubmit: (text: string, files?: UploadedFile[]) => void;
  onEditMessage: (
    messageId: string,
    newContent: string,
    files?: UploadedFile[]
  ) => Promise<void>;
  isLoading: boolean;
  uploadedFiles: UploadedFile[];
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove: (file: UploadedFile) => void;
  streamingMessageId?: string | null;
}

function IconBtn({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      className="rounded-full p-1.5 hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function ChatViewNew({
  messages,
  onSubmit,
  onEditMessage,
  isLoading,
  uploadedFiles,
  onFileUpload,
  onFileRemove,
  streamingMessageId,
}: ChatViewNewProps) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUpsell, setShowUpsell] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editFiles, setEditFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessageId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      onFileUpload(result);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setShowDropdown(false);
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
    setEditFiles(message.files || []);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent("");
    setEditFiles([]);
  };

  const saveEdit = async () => {
    if (!editingMessageId || !editContent.trim()) return;

    await onEditMessage(
      editingMessageId,
      editContent,
      editFiles.length > 0 ? editFiles : undefined
    );
    cancelEditing();
  };

  const removeEditFile = (fileToRemove: UploadedFile) => {
    setEditFiles(prev =>
      prev.filter(file => file.publicId !== fileToRemove.publicId)
    );
  };

  return (
    <div
      className="relative flex flex-col flex-1 max-h-screen"
      style={{ backgroundColor: "rgb(33,33,33)" }}
    >
      {/* Messages Container */}
      <ScrollArea className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
          {messages.map((message, idx) => (
            <div key={idx} className="group">
              {message.role === "user" ? (
                // User message - right aligned
                <div className="flex justify-end mb-4">
                  {editingMessageId === message.id ? (
                    // Edit mode - full width
                    <div className="w-full relative group">
                      <div
                        style={{ backgroundColor: "rgb(42,42,42)" }}
                        className="rounded-2xl px-4 py-3 text-white w-full border border-zinc-600"
                      >
                        {/* Edit files if any */}
                        {editFiles.length > 0 && (
                          <div className="mb-3 space-y-3">
                            {editFiles.map(
                              (file: UploadedFile, fileIdx: number) => (
                                <div
                                  key={fileIdx}
                                  className="bg-zinc-600/30 rounded-xl p-3 border border-zinc-600/40 relative group"
                                >
                                  {file.resourceType === "image" ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-zinc-200 text-sm font-medium">
                                            {file.originalName}
                                          </div>
                                          <div className="text-zinc-400 text-xs">
                                            {(file.bytes / 1024).toFixed(1)} KB
                                            • {file.format?.toUpperCase()}
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeEditFile(file)}
                                          className="text-zinc-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <img
                                        src={file.url}
                                        alt={file.originalName}
                                        className="w-full max-w-sm rounded-lg border border-zinc-600/40"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                        <File className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-zinc-200 text-sm font-medium">
                                          {file.originalName}
                                        </div>
                                        <div className="text-zinc-400 text-xs">
                                          {(file.bytes / 1024).toFixed(1)} KB •{" "}
                                          {file.format?.toUpperCase()}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => removeEditFile(file)}
                                        className="text-zinc-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Escape") {
                              cancelEditing();
                            } else if (
                              e.key === "Enter" &&
                              (e.ctrlKey || e.metaKey)
                            ) {
                              e.preventDefault();
                              saveEdit();
                            }
                          }}
                          className="w-full bg-transparent text-white resize-none min-h-[60px] focus:outline-none border-none p-0"
                          placeholder="Edit your message..."
                          autoFocus
                        />
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3">
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white text-sm rounded hover:bg-zinc-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1.5 bg-white text-black text-sm rounded hover:bg-zinc-100 transition-colors disabled:opacity-50"
                            disabled={!editContent.trim()}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Display mode - keep original max-width for right alignment
                    <div className="flex items-start gap-3 max-w-[70%] relative group">
                      <div
                        style={{ backgroundColor: "rgb(47,47,47)" }}
                        className="rounded-2xl px-4 py-3 text-white"
                      >
                        {/* Show files if any */}
                        {message.files && message.files.length > 0 && (
                          <div className="mb-3 space-y-3">
                            {message.files.map(
                              (file: UploadedFile, fileIdx: number) => (
                                <div
                                  key={fileIdx}
                                  className="bg-zinc-600/30 rounded-xl p-3 border border-zinc-600/40"
                                >
                                  {file.resourceType === "image" ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <div className="text-zinc-200 text-sm font-medium">
                                            {file.originalName}
                                          </div>
                                          <div className="text-zinc-400 text-xs">
                                            {(file.bytes / 1024).toFixed(1)} KB
                                            • {file.format?.toUpperCase()}
                                          </div>
                                        </div>
                                      </div>
                                      <img
                                        src={file.url}
                                        alt={file.originalName}
                                        className="w-full max-w-sm rounded-lg border border-zinc-600/40"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                        <File className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-zinc-200 text-sm font-medium">
                                          {file.originalName}
                                        </div>
                                        <div className="text-zinc-400 text-xs">
                                          {(file.bytes / 1024).toFixed(1)} KB •{" "}
                                          {file.format?.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {message.content}
                      </div>
                      {/* User message action buttons - positioned below the message bubble */}
                      {!isLoading && !streamingMessageId && (
                        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1">
                            <IconBtn icon={Copy} label="Copy" />
                            <button
                              onClick={() => startEditing(message)}
                              className="rounded-full p-1.5 hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition"
                              title="Edit message"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Assistant message - left aligned
                <div className="flex justify-start mb-6">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="space-y-3">
                      <div className="text-zinc-100 leading-relaxed">
                        {message.content}
                        {streamingMessageId === message.id && (
                          <span className="inline-block w-3 h-3 bg-white rounded-full ml-1 animate-pulse" />
                        )}
                      </div>
                      {/* Action buttons - don't show during streaming */}
                      {streamingMessageId !== message.id && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconBtn icon={Copy} label="Copy" />
                          <IconBtn icon={ThumbsUp} label="Like" />
                          <IconBtn icon={ThumbsDown} label="Dislike" />
                          <IconBtn icon={Volume2} label="Listen" />
                          <IconBtn icon={Edit3} label="Edit" />
                          <IconBtn icon={RotateCcw} label="Regenerate" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 mt-1 flex items-center justify-center">
                  <div
                    className="w-3 h-3 bg-white rounded-full"
                    style={{
                      animation: "breathe 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Bottom composer */}
      <div
        className="sticky bottom-0 left-0 right-0 pb-4"
        style={{ backgroundColor: "rgb(33,33,33)" }}
      >
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="space-y-4">
            <form
              className="relative"
              onSubmit={e => {
                e.preventDefault();
                if ((!input.trim() && uploadedFiles.length === 0) || isLoading)
                  return;
                onSubmit(
                  input,
                  uploadedFiles.length > 0 ? uploadedFiles : undefined
                );
                setInput("");
              }}
            >
              {/* Show uploaded files above the input */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
                    >
                      {file.resourceType === "image" ? (
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="w-5 h-5 object-cover rounded"
                        />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                      <span className="truncate max-w-[150px]">
                        {file.originalName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileRemove(file)}
                        className="p-1 h-5 w-5 text-zinc-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="flex items-center gap-2 rounded-3xl border border-zinc-600 px-4 md:px-5 py-2 md:py-2.5"
                style={{ backgroundColor: "rgb(48,48,48)" }}
              >
                <div className="shrink-0 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-5 w-5 p-0 hover:bg-transparent"
                  >
                    <Plus
                      className="h-5 w-5 text-zinc-100"
                      aria-hidden="true"
                    />
                  </Button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute left-0 bottom-8 z-10 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg min-w-[240px]">
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <Paperclip className="h-4 w-4" />
                          Add photos & files
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <Library className="h-4 w-4" />
                          Study and learn
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <Sparkles className="h-4 w-4" />
                          Create image
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <Bot className="h-4 w-4" />
                          Think longer
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <Search className="h-4 w-4" />
                          Deep research
                        </button>
                        <div className="border-t border-zinc-600 my-2"></div>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded-lg transition"
                        >
                          <span>•••</span>
                          More
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything"
                  className="h-6 md:h-7 border-0 bg-transparent focus-visible:ring-0 text-zinc-100 placeholder:text-zinc-400"
                  aria-label="Ask anything"
                  disabled={isLoading}
                />
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-100 hover:text-zinc-200"
                  >
                    <Mic className="h-5 w-5" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={e => handleFileSelect(e.target.files)}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.md,.json,.csv"
              />
            </form>

            {/* Disclaimer text */}
            <div className="text-center text-xs text-zinc-500 mt-2">
              ChatGPT can make mistakes. Check important info.{" "}
              <button className="underline hover:text-zinc-400 transition-colors">
                See Cookie Preferences
              </button>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
