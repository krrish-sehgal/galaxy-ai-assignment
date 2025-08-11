"use client";

import type React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { MemoryManager } from "@/components/chat";
import { BackgroundGlow } from "@/components/common";
import { Topbar, Sidebar, Hero } from "@/components/layout";
import { ChatViewNew } from "@/components/chat";
import { generateChatTitle, nid } from "@/lib/chat-utils";
import type { Message, Chat, UploadedFile } from "@/types";

export default function Page() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMemoryManager, setShowMemoryManager] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chatgpt-conversations");
    const savedActiveChatId = localStorage.getItem("chatgpt-active-chat-id");

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        }));
        setChats(parsedChats);

        if (
          savedActiveChatId &&
          parsedChats.find((c: Chat) => c.id === savedActiveChatId)
        ) {
          setActiveChatId(savedActiveChatId);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chatgpt-conversations", JSON.stringify(chats));
    }
  }, [chats]);

  // Save active chat ID whenever it changes
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("chatgpt-active-chat-id", activeChatId);
    }
  }, [activeChatId]);

  const activeChat = useMemo(
    () => chats.find(c => c.id === activeChatId) ?? null,
    [chats, activeChatId]
  );

  const hasConversation = !!activeChat && activeChat.messages.length > 0;

  function handleNewChat() {
    const newChat: Chat = {
      id: nid(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  function ensureActiveChat(): string {
    if (activeChatId && chats.find(c => c.id === activeChatId)) {
      return activeChatId;
    }

    const newChat: Chat = {
      id: nid(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleFileRemove = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prev =>
      prev.filter(file => file.publicId !== fileToRemove.publicId)
    );
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  const handleEditMessage = async (
    messageId: string,
    newContent: string,
    files?: UploadedFile[]
  ) => {
    if (!activeChatId || isLoading) return;

    // Find the message being edited
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    const messageIndex = currentChat.messages.findIndex(
      m => m.id === messageId
    );
    if (messageIndex === -1) return;

    // Truncate conversation at the edit point - remove all messages after the edited message
    const messagesUpToEdit = currentChat.messages.slice(0, messageIndex);

    // Update the edited message
    const editedMessage: Message = {
      ...currentChat.messages[messageIndex],
      content: newContent.trim(),
      files: files,
      timestamp: new Date(),
    };

    // Update the chat with truncated messages + edited message
    setChats(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...messagesUpToEdit, editedMessage],
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );

    // Now regenerate AI response from the edited message
    const contextMessages = [...messagesUpToEdit, editedMessage];
    await processMessage(contextMessages, activeChatId);
  };

  const processMessage = async (contextMessages: Message[], chatId: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: contextMessages,
          userId: "krrish_sehgal",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Create initial assistant message for streaming
        const assistantMessageId = nid();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        // Add the initial empty assistant message
        setChats(prev =>
          prev.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return chat;
          })
        );

        // Start streaming - remove loading indicator and start streaming cursor
        setIsLoading(false);
        setStreamingMessageId(assistantMessageId);

        try {
          let fullContent = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
          }

          // Now simulate character-by-character streaming for smooth effect
          let displayedContent = "";
          for (let i = 0; i < fullContent.length; i++) {
            displayedContent += fullContent[i];

            // Update the streaming message content character by character
            setChats(prev =>
              prev.map(chat => {
                if (chat.id === chatId) {
                  return {
                    ...chat,
                    messages: chat.messages.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: displayedContent }
                        : msg
                    ),
                    updatedAt: new Date(),
                  };
                }
                return chat;
              })
            );

            // Add delay for smooth streaming effect (adjust speed here)
            await new Promise(resolve => setTimeout(resolve, 15));
          }
        } finally {
          // Clear streaming state when done
          setStreamingMessageId(null);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: Message = {
        id: nid(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              updatedAt: new Date(),
            };
          }
          return chat;
        })
      );
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string, files?: UploadedFile[]) => {
    if ((!text.trim() && (!files || files.length === 0)) || isLoading) return;

    setIsLoading(true);
    const chatId = ensureActiveChat();

    const userMessage: Message = {
      id: nid(),
      role: "user",
      content:
        text.trim() ||
        (files && files.length > 0 ? `Attached ${files.length} file(s)` : ""),
      timestamp: new Date(),
      files: files,
    };

    // Update chat with user message and generate title if it's the first message
    setChats(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage ? generateChatTitle(text.trim()) : chat.title,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );

    try {
      // Get current chat messages for context - need to get updated state
      let contextMessages: Message[] = [userMessage];

      // Find the chat that we just updated with the user message
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          const isFirstMessage = chat.messages.length === 0;
          const updatedChat = {
            ...chat,
            title: isFirstMessage ? generateChatTitle(text.trim()) : chat.title,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date(),
          };
          contextMessages = updatedChat.messages; // Get the full conversation history
          return updatedChat;
        }
        return chat;
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: contextMessages,
          userId: "krrish_sehgal", // You can make this dynamic based on user auth
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Create initial assistant message for streaming
        const assistantMessageId = nid();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        // Add the initial empty assistant message
        setChats(prev =>
          prev.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return chat;
          })
        );

        // Start streaming - remove loading indicator and start streaming cursor
        setIsLoading(false);
        setStreamingMessageId(assistantMessageId);

        try {
          let fullContent = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
          }

          // Now simulate character-by-character streaming for smooth effect
          let displayedContent = "";
          for (let i = 0; i < fullContent.length; i++) {
            displayedContent += fullContent[i];

            // Update the streaming message content character by character
            setChats(prev =>
              prev.map(chat => {
                if (chat.id === chatId) {
                  return {
                    ...chat,
                    messages: chat.messages.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: displayedContent }
                        : msg
                    ),
                    updatedAt: new Date(),
                  };
                }
                return chat;
              })
            );

            // Add delay for smooth streaming effect (adjust speed here)
            await new Promise(resolve => setTimeout(resolve, 15));
          }
        } finally {
          // Clear streaming state when done
          setStreamingMessageId(null);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: nid(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              updatedAt: new Date(),
            };
          }
          return chat;
        })
      );
      setIsLoading(false); // Ensure loading is cleared in error cases too
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 relative flex flex-col">
      {!hasConversation && <BackgroundGlow />}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] flex-1 max-h-screen">
        <aside
          className="hidden md:flex flex-col border-r border-white/10 max-h-screen relative z-10 transition-colors duration-700 ease-in-out"
          style={{
            backgroundColor: hasConversation ? "rgb(24,24,24)" : "transparent",
          }}
        >
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onNewChat={handleNewChat}
            onShowMemoryManager={() => setShowMemoryManager(true)}
            setChats={setChats}
          />
        </aside>
        <main
          className="relative flex flex-col flex-1 max-h-screen overflow-hidden transition-colors duration-700 ease-in-out"
          style={{
            backgroundColor: hasConversation ? "rgb(33,33,33)" : "transparent",
          }}
        >
          <Topbar />
          {/* Content area */}
          {showMemoryManager ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setShowMemoryManager(false)}
                  className="px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-white rounded"
                >
                  ← Back to Chat
                </button>
                <h1 className="text-2xl font-semibold">AI Memory Manager</h1>
              </div>
              <MemoryManager />
            </div>
          ) : !hasConversation ? (
            <div className="flex-1 overflow-y-auto">
              <Hero
                onSubmit={(text, files) => {
                  handleSendMessage(text, files);
                  clearUploadedFiles();
                }}
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            </div>
          ) : (
            <ChatViewNew
              messages={activeChat!.messages}
              onSubmit={(text, files) => {
                handleSendMessage(text, files);
                clearUploadedFiles();
              }}
              onEditMessage={handleEditMessage}
              isLoading={isLoading}
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              streamingMessageId={streamingMessageId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
