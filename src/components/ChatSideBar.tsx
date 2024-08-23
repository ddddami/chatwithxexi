import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href={"/"}>
        <Button className="w-full border border-dashed border-white">
          <PlusCircle className="mr-2 w-4 h-4" /> New chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4 overflow-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2">
        {chats.map((chat) => {
          return (
            <Link href={`/chat/${chat.id}`} key={chat.id}>
              <div
                className={cn("rounded-lg p-3 text-slate- flex items-center", {
                  "bg-blue-600": chat.id === chatId,
                  "hover:text-white": chat.id === chatId,
                })}
              >
                <MessageCircle className="mr-2" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-4 left">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          {/* Stripe Button */}
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
