import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { genAI } from "@/lib/embeddings";
import { StreamingTextResponse, Message, GoogleGenerativeAIStream } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404, statusText: "Not Found" }
      );
    }
    const fileKey = _chats[0].fileKey;
    const context = await getContext(lastMessage.content, fileKey);
    const prompt =
      "Using this context: " + context + " Answer the following questions";

    const geminiStream = await genAI
      .getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: context
          ? prompt
          : "You are a very smart chatbot that can answer any question.",
      })
      .generateContentStream(buildGoogleGenAIPrompt(messages));

    const stream = GoogleGenerativeAIStream(geminiStream);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new NextResponse("Error getting response from renAI", {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
