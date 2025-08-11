# ChatGPT Clone

A pixel-perfect ChatGPT clone built with Next.js 15, featuring AI conversations, memory persistence, and file uploads.

## ✨ Features

- **🎯 Pixel-perfect UI**: Matching ChatGPT's design and user experience
- **🤖 AI Conversations**: Powered by Google Gemini with intelligent responses
- **🧠 Memory System**: Conversation context using Mem0 for personalized interactions
- **📁 File Uploads**: Support for images and documents via Cloudinary
- **🎨 Modern Stack**: Next.js 15, TypeScript, TailwindCSS, ShadCN/UI
- **🔧 Developer Experience**: ESLint, Prettier, TypeScript strict mode
- **📱 Responsive Design**: Mobile-first approach with dark/light themes

## 🧩 Modular Architecture

The project uses a **modular component architecture** for better organization and maintainability:

### Component Modules

- **`ui/`** - Base shadcn/ui components (Button, Input, Card, etc.)
- **`chat/`** - Chat functionality (ChatView, MemoryManager, SearchBar)
- **`layout/`** - Page structure (Sidebar, Topbar, Hero)
- **`common/`** - Shared utilities (FileUpload, BackgroundGlow)
- **`providers/`** - React context providers (ThemeProvider)

### Import Patterns

```typescript
// Module-based imports (recommended)
import { ChatViewNew, MemoryManager } from "@/components/chat";
import { Sidebar, Topbar } from "@/components/layout";
import { Button, Input } from "@/components/ui";

// Or import from main index
import { ChatViewNew, Sidebar, Button } from "@/components";
```

> 📖 **Detailed Documentation**: See [`src/components/README.md`](src/components/README.md) for complete architecture guide.

## ✨ Features

- **🎯 Pixel-perfect UI**: Matching ChatGPT's design and user experience
- **🤖 AI Conversations**: Powered by Google Gemini with intelligent responses
- **🧠 Memory System**: Conversation context using Mem0 for personalized interactions
- **📁 File Uploads**: Support for images and documents via Cloudinary
- **🎨 Modern Stack**: Next.js 15, TypeScript, TailwindCSS, ShadCN/UI
- **🔧 Developer Experience**: ESLint, Prettier, TypeScript strict mode
- **📱 Responsive Design**: Mobile-first approach with dark/light themes

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading UI
│   └── page.tsx           # Home page
├── src/                   # Source code (modular architecture)
│   ├── components/        # React components (modular)
│   │   ├── ui/           # ShadCN/UI base components
│   │   ├── chat/         # Chat-related components
│   │   │   ├── chat-view.tsx     # Main chat interface
│   │   │   ├── memory-manager.tsx # AI memory management
│   │   │   └── search-bar.tsx    # Chat search
│   │   ├── layout/       # Layout & navigation
│   │   │   ├── sidebar.tsx       # Navigation sidebar
│   │   │   ├── topbar.tsx        # Top navigation
│   │   │   └── hero.tsx          # Landing page
│   │   ├── common/       # Shared components
│   │   │   ├── file-upload.tsx   # File upload utility
│   │   │   └── background-glow.tsx # Visual effects
│   │   ├── providers/    # React context providers
│   │   │   └── theme-provider.tsx # Theme management
│   │   └── index.ts      # Component exports
│   ├── config/           # App configuration
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Core utilities
│   │   ├── chat-utils.ts # Chat functionality
│   │   ├── cloudinary.ts # File uploads
│   │   ├── mem0.ts       # Memory system
│   │   └── utils.ts      # General utilities
│   ├── styles/           # Additional stylesheets
│   └── types/            # TypeScript definitions
├── public/               # Static assets
│   ├── reference/        # Design references
│   └── ...              # Images and icons
└── temp_docs/           # Development documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm/pnpm/yarn
- **API Keys** for Google Gemini, Cloudinary, and Mem0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatgpt-home-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Available Scripts

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start development server        |
| `npm run build`        | Build for production            |
| `npm run start`        | Start production server         |
| `npm run lint`         | Run ESLint                      |
| `npm run lint:fix`     | Fix ESLint issues automatically |
| `npm run format`       | Format code with Prettier       |
| `npm run format:check` | Check code formatting           |
| `npm run type-check`   | TypeScript type checking        |

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Cloudinary File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Mem0 Memory System
MEM0_API_KEY=your_mem0_api_key

# App Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **React 18** - Component-based UI library

### Styling & UI

- **TailwindCSS** - Utility-first CSS framework
- **ShadCN/UI** - Modern component library
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme switching support

### AI & Backend Services

- **Google Gemini** - AI conversation model
- **Vercel AI SDK** - AI integration utilities
- **Mem0** - Conversation memory and context
- **Cloudinary** - File and image storage

### Development Tools

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Zod** - Runtime type validation

## 🎯 Code Quality & Standards

This project follows strict coding standards:

- **TypeScript** strict mode enabled
- **ESLint** with Next.js and Prettier configurations
- **Prettier** for consistent code formatting
- **Husky** pre-commit hooks for automated quality checks
- **Type-safe environment variables** with Zod validation

### Pre-commit Hooks

Before each commit, the following checks run automatically:

- ESLint fixes and validation
- Prettier formatting
- Type checking

## 📱 Responsive Design

The application is fully responsive and follows:

- Mobile-first approach
- Accessibility best practices (ARIA)
- Modern CSS Grid and Flexbox layouts
- Dark/Light theme support

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

#### Using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
npm run vercel:preview

# Deploy to production
npm run vercel:deploy
```

> 📖 **Detailed Guide**: See [`DEPLOYMENT.md`](DEPLOYMENT.md) for comprehensive deployment instructions.

### Manual Deployment

```bash
npm run vercel:build  # Lint, type-check, and build
npm run start
```

## 🎯 Architecture Highlights

- **Clean Architecture**: Separation of concerns with clear boundaries
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Optimized with Next.js 15 features
- **Scalability**: Modular structure for easy extension
- **Accessibility**: WCAG compliant components

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Code Style**: Follow the existing patterns and use our linting rules
2. **Type Safety**: Ensure all TypeScript checks pass
3. **Testing**: Test your changes thoroughly
4. **Documentation**: Update README if needed

### Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check code quality
npm run lint
npm run type-check
npm run format:check

# Build for production
npm run build
```

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com)
- [ShadCN/UI](https://ui.shadcn.com)
- [Google Gemini AI](https://ai.google.dev)
- [Vercel AI SDK](https://sdk.vercel.ai)

---

**Built with ❤️ using modern web technologies and best practices**
