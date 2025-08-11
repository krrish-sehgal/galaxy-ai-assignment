import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Mic,
  Waves,
  Library,
  Sparkles,
  Bot,
  Search,
  X,
  File,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UploadedFile } from "@/types";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onFileUpload: (file: UploadedFile) => void;
  uploadedFiles: UploadedFile[];
  onFileRemove: (file: UploadedFile) => void;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onFileUpload,
  uploadedFiles,
  onFileRemove,
}: SearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Show uploaded files above the input */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 text-sm"
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
                className="p-1 h-5 w-5 text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-zinc-900/70 border border-white/10 px-4 md:px-5 py-3 md:py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          <div className="shrink-0 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-5 w-5 p-0 hover:bg-transparent"
            >
              <Plus className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            </Button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 top-8 z-10 bg-zinc-900 border border-white/20 rounded-lg shadow-lg min-w-[240px]">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <Paperclip className="h-4 w-4" />
                    Add photos & files
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <Library className="h-4 w-4" />
                    Study and learn
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create image
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <Bot className="h-4 w-4" />
                    Think longer
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <Search className="h-4 w-4" />
                    Deep research
                  </button>
                  <div className="border-t border-white/10 my-2"></div>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <span>•••</span>
                    More
                  </button>
                </div>
              </div>
            )}
          </div>
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Ask anything"
            className="h-8 md:h-9 border-0 bg-transparent focus-visible:ring-0 text-zinc-200 placeholder:text-zinc-500"
            aria-label="Ask anything"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white"
            >
              <Mic className="h-5 w-5" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white"
              aria-label="Open tools"
            >
              <Waves className="h-5 w-5" />
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
    </div>
  );
}
