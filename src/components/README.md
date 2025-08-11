# Components Architecture

This document outlines the modular component architecture used in this ChatGPT clone.

## 📁 Structure Overview

```
src/components/
├── ui/                 # Base UI components (shadcn/ui)
├── chat/              # Chat-related components
├── layout/            # Layout and navigation components
├── common/            # Shared/utility components
├── providers/         # React context providers
└── index.ts           # Main export file
```

## 🎯 Module Descriptions

### `/ui` - Base UI Components

Contains all the fundamental UI building blocks from shadcn/ui:

- **Core**: Button, Input, Card, Dialog, ScrollArea, etc.
- **Form**: Select, Checkbox, Switch, Slider, etc.
- **Navigation**: DropdownMenu, Sheet, etc.
- **Feedback**: AlertDialog, Alert, Progress, Toaster, etc.
- **Hooks**: useIsMobile, useToast, etc.

### `/chat` - Chat Components

Components specifically related to chat functionality:

- **ChatViewNew**: Main chat interface with message display
- **ChatListItem**: Individual chat item in sidebar
- **SearchBar**: Chat search functionality
- **MemoryManager**: AI memory management interface

### `/layout` - Layout Components

Components that handle page structure and navigation:

- **Sidebar**: Main navigation sidebar
- **SidebarButton**: Individual sidebar navigation buttons
- **Topbar**: Top navigation bar
- **Hero**: Landing page hero section

### `/common` - Common Components

Shared components used across different modules:

- **FileUpload**: File upload functionality
- **BackgroundGlow**: Visual background effects

### `/providers` - React Providers

Context providers for app-wide state:

- **ThemeProvider**: Dark/light theme management

## 🔗 Import Patterns

### Recommended Import Styles

```typescript
// 1. Import entire modules
import { ChatViewNew, MemoryManager } from "@/components/chat";
import { Sidebar, Topbar, Hero } from "@/components/layout";
import { FileUpload, BackgroundGlow } from "@/components/common";
import { ThemeProvider } from "@/components/providers";
import { Button, Input, Card } from "@/components/ui";

// 2. Import everything from main index
import {
  ChatViewNew,
  Sidebar,
  FileUpload,
  ThemeProvider,
  Button,
} from "@/components";

// 3. Direct component imports (for specific use cases)
import { Button } from "@/components/ui/button";
import { ChatViewNew } from "@/components/chat/chat-view";
```

## 🎨 Design Principles

### 1. **Separation of Concerns**

Each module has a specific responsibility:

- `ui/` - Pure UI components, no business logic
- `chat/` - Chat-specific functionality
- `layout/` - Page structure and navigation
- `common/` - Reusable utilities
- `providers/` - App-wide state management

### 2. **Modular Independence**

- Each module can be imported independently
- Components within modules are cohesive
- Clear boundaries between different concerns

### 3. **Scalable Organization**

- Easy to add new components to appropriate modules
- Clear naming conventions
- Consistent export patterns

### 4. **Developer Experience**

- Intuitive import paths
- Clear module boundaries
- Comprehensive index files for easy access

## 🔄 Adding New Components

### When adding a new component, consider:

1. **What is its primary purpose?**
   - UI building block → `ui/`
   - Chat functionality → `chat/`
   - Page layout → `layout/`
   - Shared utility → `common/`
   - State management → `providers/`

2. **Update the appropriate module index**

   ```typescript
   // Add to src/components/[module]/index.ts
   export { NewComponent } from "./new-component";
   ```

3. **Follow naming conventions**
   - PascalCase for component names
   - kebab-case for file names
   - Descriptive, intention-revealing names

## 🚀 Benefits

- **🎯 Better Organization**: Easy to find and maintain components
- **🔍 Improved Discoverability**: Clear module boundaries
- **⚡ Faster Development**: Predictable import patterns
- **🔧 Easy Maintenance**: Isolated concerns
- **📈 Scalable**: Simple to add new features
- **🤝 Team Collaboration**: Clear conventions for multiple developers

## 📖 Examples

### Chat Interface Example

```typescript
import React from 'react';
import { ChatViewNew, SearchBar } from '@/components/chat';
import { Button, Input } from '@/components/ui';

export function ChatPage() {
  return (
    <div>
      <SearchBar />
      <ChatViewNew />
    </div>
  );
}
```

### Layout Example

```typescript
import React from 'react';
import { Sidebar, Topbar } from '@/components/layout';
import { ThemeProvider } from '@/components/providers';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
```
