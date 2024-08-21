import { genAI } from "@/lib/embeddings";
import { StreamingTextResponse, Message, GoogleGenerativeAIStream } from "ai";
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
    const { messages } = await req.json();

    const geminiStream = await genAI
      .getGenerativeModel({ model: "gemini-1.5-flash" })
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
