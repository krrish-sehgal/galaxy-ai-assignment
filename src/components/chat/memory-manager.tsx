"use client";

import { useState, useEffect } from "react";
import { Brain, Trash2, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Memory {
  id: string;
  content: string;
  timestamp: string;
}

export function MemoryManager() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMemories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/memories", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to load memories");
      }

      const data = await response.json();
      setMemories(data.memories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch("/api/memories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memoryId }),
      });

      if (response.ok) {
        setMemories(prev => prev.filter(m => m.id !== memoryId));
      }
    } catch (err) {
      console.error("Failed to delete memory:", err);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <Card className="p-6 bg-zinc-900/50 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">AI Memory</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-violet-900/30 text-violet-200"
          >
            {memories.length} memories
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMemories}
            disabled={loading}
            className="border-white/10 bg-transparent hover:bg-white/5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {memories.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No memories stored yet</p>
              <p className="text-xs mt-1">Start chatting to build AI memory</p>
            </div>
          ) : (
            memories.map(memory => (
              <div
                key={memory.id}
                className="flex items-start justify-between gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 line-clamp-2">
                    {memory.content}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(memory.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMemory(memory.id)}
                  className="text-zinc-400 hover:text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-400">
          💡 AI memory helps provide personalized responses based on your
          conversation history
        </p>
      </div>
    </Card>
  );
}
