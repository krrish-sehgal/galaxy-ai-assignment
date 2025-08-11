import { useState } from "react";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message. Please try again.");

      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  const regenerateResponse = async () => {
    if (messages.length === 0) return;

    // Remove the last assistant message and regenerate
    const lastUserMessageIndex = messages.findLastIndex(
      msg => msg.role === "user"
    );
    if (lastUserMessageIndex === -1) return;

    const messagesUpToLastUser = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesUpToLastUser);

    const lastUserMessage =
      messagesUpToLastUser[messagesUpToLastUser.length - 1];
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    sendMessage,
    isLoading,
    error: null,
    clearChat,
    regenerateResponse,
    stopGeneration: () => setIsLoading(false),
  };
}
