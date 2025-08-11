import { env } from "@/lib/env";

export const config = {
  // App configuration
  app: {
    name: "ChatGPT Clone",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description: "A pixel-perfect ChatGPT clone built with Next.js",
  },

  // AI configuration
  ai: {
    maxTokens: 4096,
    temperature: 0.7,
    model: "gemini-1.5-flash-latest",
    contextWindow: 1000000, // Gemini context window
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: {
      images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      documents: [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },
  },

  // Database configuration
  database: {
    url: env.MONGODB_URI,
  },

  // Cloudinary configuration
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    uploadFolder: "chatgpt-clone",
  },

  // Memory configuration
  memory: {
    maxMemories: 100,
    retentionDays: 30,
  },

  // User plans
  plans: {
    free: {
      name: "Free",
      credits: 10,
      features: ["Basic chat", "File upload", "Limited memory"],
    },
    plus: {
      name: "Plus",
      credits: 1000,
      features: [
        "Unlimited chat",
        "File upload",
        "Extended memory",
        "Priority support",
      ],
    },
    pro: {
      name: "Pro",
      credits: 5000,
      features: ["Everything in Plus", "API access", "Custom integrations"],
    },
  },
} as const;
