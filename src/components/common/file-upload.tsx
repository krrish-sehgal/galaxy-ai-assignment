"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Paperclip, Upload, X, File, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "@/types";

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove?: (file: UploadedFile) => void;
  uploadedFiles?: UploadedFile[];
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  onFileRemove,
  uploadedFiles = [],
  disabled = false,
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Single file upload for now

    setIsUploading(true);

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
      toast.success(`${file.name} uploaded successfully`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getFileIcon = (fileType: string, resourceType: string) => {
    if (resourceType === "image") {
      return <Image className="h-4 w-4" aria-label="Image file" />;
    }
    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          dragOver ? "border-blue-500 bg-blue-50/50" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileSelect(e.target.files)
            }
            disabled={disabled || isUploading}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.md,.json,.csv"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="flex items-center space-x-2"
          >
            {isUploading ? (
              <Upload className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
            <span>{isUploading ? "Uploading..." : "Attach File"}</span>
          </Button>

          <span className="text-sm text-gray-500">or drag and drop here</span>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          Supports: Images, PDF, Word docs, Text files (Max 10MB)
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Attached Files</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
            >
              {getFileIcon(file.fileType, file.resourceType)}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.bytes)} • {file.format?.toUpperCase()}
                </p>
              </div>

              {file.resourceType === "image" && (
                <img
                  src={file.url}
                  alt={file.originalName}
                  className="w-10 h-10 object-cover rounded"
                />
              )}

              {onFileRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemove(file)}
                  className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
