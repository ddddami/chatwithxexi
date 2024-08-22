import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, UserIcon } from "lucide-react";
import FormatMarkdown from "./FormatMarkdown";

type Props = {
  message: Message;
};

function ChatMessage({ message }: Props) {
  return (
    <div
      className={cn("flex items-start mb-4", {
        "justify-end": message.role === "user",
        "justify-start": message.role === "assistant",
      })}
    >
      {message.role === "assistant" && <BotIcon className="mx-2" />}

      <div
        className={cn("px-4 py-2 rounded-lg max-w-xs", {
          "bg-blue-100 text-blue-800": message.role === "user",
          "bg-gray-100 text-gray-800": message.role === "assistant",
        })}
      >
        {message.role === "user" ? (
          <p>{message.content}</p>
        ) : (
          <FormatMarkdown content={message.content} />
        )}
        <span className="text-xs text-gray-500">
          {message.createdAt?.toLocaleString()}
        </span>
      </div>

      {message.role === "user" && <UserIcon className="mx-2" />}
    </div>
  );
}

export default ChatMessage;
