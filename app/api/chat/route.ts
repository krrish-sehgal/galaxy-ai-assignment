import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { mem0 } from "@/lib/mem0";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, userId = "default_user" } = await req.json();

    // Convert UI messages to core messages format with file support
    const coreMessages = await Promise.all(
      messages.map(async (msg: any) => {
        const message: any = {
          role: msg.role,
          content: [],
        };

        // Add text content if present
        if (msg.content && msg.content.trim()) {
          message.content.push({
            type: "text",
            text: msg.content,
          });
        }

        // Add file content if present
        if (msg.files && msg.files.length > 0) {
          for (const file of msg.files) {
            if (file.resourceType === "image") {
              // For images, add them directly to the message
              message.content.push({
                type: "image_url",
                image_url: {
                  url: file.url,
                },
              });
            } else {
              // For documents, add a note about the attached file
              // Note: We could enhance this to extract text content from documents
              message.content.push({
                type: "text",
                text: `[Attached file: ${file.originalName} (${file.fileType})]`,
              });
            }
          }
        }

        // If no content was added, add empty text
        if (message.content.length === 0) {
          message.content.push({
            type: "text",
            text: "",
          });
        }

        return message;
      })
    );

    const lastMessage = coreMessages[coreMessages.length - 1];

    // Extract text content for memory retrieval
    const lastMessageText = lastMessage.content
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join(" ");

    // Get relevant memories from Mem0 for context
    let relevantMemories: any[] = [];
    let systemPrompt = "You are a helpful AI assistant.";

    try {
      // Get memories related to the current query
      relevantMemories = await mem0.getRelevantMemories(
        userId,
        lastMessageText,
        3
      );

      if (relevantMemories.length > 0) {
        systemPrompt += "\n\nRelevant context from previous conversations:";
        relevantMemories.forEach(memory => {
          systemPrompt += `\n- ${memory.content}`;
        });
        systemPrompt +=
          "\n\nUse this context to provide more personalized and coherent responses.";
      }
    } catch (memoryError) {
      console.log(
        "Memory retrieval failed, continuing without context:",
        memoryError
      );
    }

    // Convert messages for AI SDK format
    const aiMessages = coreMessages.map((msg: any) => {
      if (msg.content.length === 1 && msg.content[0].type === "text") {
        // Simple text message
        return {
          role: msg.role,
          content: msg.content[0].text,
        };
      } else {
        // Multimodal message
        return {
          role: msg.role,
          content: msg.content.map((item: any) => {
            if (item.type === "text") {
              return {
                type: "text",
                text: item.text,
              };
            } else if (item.type === "image_url") {
              return {
                type: "image",
                image: item.image_url.url,
              };
            }
            return item;
          }),
        };
      }
    });

    const { textStream } = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      messages: [{ role: "system", content: systemPrompt }, ...aiMessages],
    });

    // Create a readable stream that stores the conversation after completion
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const textPart of textStream) {
            fullText += textPart;
            controller.enqueue(new TextEncoder().encode(textPart));
          }

          // Store the conversation in Mem0 after streaming completes
          try {
            const conversationToStore = [
              ...coreMessages.map((msg: any) => ({
                role: msg.role,
                content:
                  msg.content
                    .filter((item: any) => item.type === "text")
                    .map((item: any) => item.text)
                    .join(" ") || "[File attachment]",
              })),
              { role: "assistant", content: fullText },
            ];
            await mem0.storeConversation(userId, conversationToStore);
          } catch (storageError) {
            console.log(
              "Memory storage failed, but response generated:",
              storageError
            );
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
