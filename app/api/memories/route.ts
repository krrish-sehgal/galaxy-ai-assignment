import { NextRequest, NextResponse } from "next/server";
import { mem0 } from "@/lib/mem0";

export async function GET(request: NextRequest) {
  try {
    const userId = "krrish_sehgal"; // In a real app, get this from auth

    const memories = await mem0.getAllUserMemories(userId);

    return NextResponse.json({
      success: true,
      memories,
      count: memories.length,
    });
  } catch (error) {
    console.error("Memory API GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch memories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { memoryId } = await request.json();

    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const success = await mem0.deleteMemory(memoryId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to delete memory" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Memory API DELETE error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete memory",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
