import { MemoryClient } from "mem0ai";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

class Mem0Service {
  private client: MemoryClient;

  constructor() {
    if (!process.env.MEM0_API_KEY) {
      throw new Error("MEM0_API_KEY environment variable is required");
    }

    this.client = new MemoryClient({
      apiKey: process.env.MEM0_API_KEY,
    });
  }

  // Store conversation and extract memories
  async storeConversation(userId: string, messages: Message[]) {
    try {
      // Convert to Mem0 message format
      const mem0Messages = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const result = await this.client.add(mem0Messages, {
        user_id: userId,
        metadata: {
          timestamp: new Date().toISOString(),
          source: "chatgpt-clone",
          message_count: messages.length,
        },
      });

      return result;
    } catch (error) {
      console.error("Failed to store conversation in Mem0:", error);
      return null;
    }
  }

  // Get relevant memories for current conversation
  async getRelevantMemories(userId: string, query: string, limit = 5) {
    try {
      const memories = await this.client.search(query, {
        user_id: userId,
        limit,
      });

      return memories.map((memory: any) => ({
        content: memory.memory || memory.text || "",
        relevance: memory.score || 0,
        timestamp: memory.created_at || memory.createdAt || "",
        id: memory.id || "",
      }));
    } catch (error) {
      console.error("Failed to retrieve memories from Mem0:", error);
      return [];
    }
  }

  // Get all user memories
  async getAllUserMemories(userId: string) {
    try {
      const memories = await this.client.getAll({ user_id: userId });

      return memories.map((memory: any) => ({
        content: memory.memory || memory.text || "",
        timestamp: memory.created_at || memory.createdAt || "",
        id: memory.id || "",
      }));
    } catch (error) {
      console.error("Failed to get all user memories:", error);
      return [];
    }
  }

  // Delete specific memory
  async deleteMemory(memoryId: string) {
    try {
      await this.client.delete(memoryId);
      return true;
    } catch (error) {
      console.error("Failed to delete memory:", error);
      return false;
    }
  }

  // Update specific memory
  async updateMemory(memoryId: string, newContent: string) {
    try {
      const result = await this.client.update(memoryId, newContent);
      return result;
    } catch (error) {
      console.error("Failed to update memory:", error);
      return null;
    }
  }
}

// Export singleton instance
export const mem0 = new Mem0Service();
