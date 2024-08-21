import { cn } from "@/lib/utils";
import { BotIcon, UserIcon } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: string | Date;
}

type Props = {
  message: Message | any;
};

function ChatMessage({ message }: Props) {
  return (
    <div
      className={cn("flex items-start mb-4", {
        "justify-end": message.role === "user",
        "justify-start": message.role === "assistant",
      })}
    >
      {message.role === "assistant" && <BotIcon />}

      <div
        className={cn("px-4 py-2 rounded-lg max-w-xs", {
          "bg-blue-100 text-blue-800": message.role === "user",
          "bg-gray-100 text-gray-800": message.role === "assistant",
        })}
      >
        <p>{message.content}</p>
        <span className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>

      {message.role === "user" && <UserIcon />}
    </div>
  );
}

export default ChatMessage;
