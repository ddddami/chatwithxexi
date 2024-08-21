import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadPdfIntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { fileKey, fileName, downloadUrl } = body;
    console.log("Loading file into pinecone...");
    await loadPdfIntoPinecone(fileKey);
    console.log("Completely loaded file into pinecone.");
    console.log("Creating a new chat...");
    const chatId = await db
      .insert(chats)
      .values({
        fileKey,
        pdfName: fileName,
        pdfUrl: downloadUrl,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });
    console.log("Successfully created a new chat.");
    return NextResponse.json({ chatId: chatId[0].insertedId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
