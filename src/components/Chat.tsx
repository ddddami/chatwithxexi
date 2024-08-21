"use client";
import React from "react";
import { useChat } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";

const Chat = () => {
  const { input, handleInputChange, handleSubmit, messages } = useChat();
  return (
    <div className="relate relative h-screen overflow-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Message List */}
      <div className="flex flex-col">
        {messages.map((message) => {
          return <ChatMessage key={message.id} message={message} />;
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 absolute bottom-2 w-full px-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={"Ask renai...."}
          className="w-full outline-none"
        />
        <Button className="bg-blue-600 text-white">
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
