// Core types for the ChatGPT clone application

export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  fileType: string;
  resourceType: string;
  bytes: number;
  format: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  plan: "free" | "plus" | "pro";
  credits: number;
}

export interface Memory {
  id: string;
  text: string;
  type: string;
  timestamp: string;
  userId?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
