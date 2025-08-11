// Enhanced chat API route with Mem0 integration
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Mem0 would be integrated like this (commented out since package isn't installed)
// import { mem0 } from '@/lib/mem0';

export async function POST(request: NextRequest) {
  try {
    const { messages, userId = "default_user" } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];

    // WITH MEM0: Get relevant memories for context
    // const relevantMemories = await mem0.getRelevantMemories(userId, lastMessage.content);
    // const userContext = await mem0.getUserContext(userId);

    // Enhanced system prompt with memory context
    const systemPrompt = `You are a helpful AI assistant. You have access to the user's conversation history and can reference previous discussions.`;

    // WITH MEM0: Add memory context
    // if (relevantMemories.length > 0) {
    //   systemPrompt += `\n\nRelevant memories from previous conversations:
    //   ${relevantMemories.map(m => `- ${m.content}`).join('\n')}`;
    // }

    // if (userContext.facts.length > 0) {
    //   systemPrompt += `\n\nKnown facts about the user:
    //   ${userContext.facts.map(f => `- ${f.memory}`).join('\n')}`;
    // }

    const result = await generateText({
      model: google("gemini-2.0-flash-exp"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    });

    // WITH MEM0: Store the conversation for future reference
    // await mem0.storeConversation(userId, [
    //   ...messages,
    //   { role: 'assistant', content: result.text }
    // ]);

    return NextResponse.json({
      content: result.text,
      // WITH MEM0: Include memory insights
      // memories_used: relevantMemories.length,
      // facts_available: userContext.facts.length
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
