import Calculator from "@/components/Calculator";
import Chat from "@/components/Chat";
import ChatSideBar from "@/components/ChatSideBar";
import Modal from "@/components/Modal";
import PdfRenderer from "@/components/PDFRenderer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { CalculatorIcon } from "lucide-react";
import { redirect } from "next/navigation";
// import { eq } from "drizzle-orm"

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: Props) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  console.log(currentChat);

  if (!currentChat) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen overflow-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-none flex">
      <div className="w-full min-h-screen overflow-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-none flex flex-col md:flex-row">
        {/* Chat Sidebar */}
        <div className="hidden md:block  flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* PDF viewer */}
        <div className="p-4 overflow-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-none flex-[5]">
          <PdfRenderer url={currentChat.pdfUrl} />
        </div>
        {/* Chatting section */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <Chat chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}
