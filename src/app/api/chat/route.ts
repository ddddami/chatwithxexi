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
    console.log(context);

    const d_prompt =
      "Your name is renai, you are a very smart teachy bot that explains the content of a pdf document, the pdf has already been uploaded, a user can ask any question relating to the pdf content, answer from your understanding and ensure you are very accurate.";
    const prompt = `Your name is RENAI, you are a very smart teachy bot that explains the content of a pdf document, the pdf has already been uploaded, a user can ask any question relating to the pdf content and you are to reply using the context in the context block below, you are an AI assistant.
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
      `;

    const geminiStream = await genAI
      .getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: context ? prompt : d_prompt,
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
