"use client";
import React from "react";
import { useChat } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, SendIcon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import Typing from "./Typing";
import ChatTopPane from "./ChatTopPane";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = {
  chatId: number;
};

const Chat = ({ chatId }: Props) => {
  const { data, isLoading: chatsLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        chatId,
      },
      initialMessages: data || [],
    });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");

    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="h-screen flex flex-col">
      {/* Top Pane */}
      {/* <ChatTopPane /> */}

      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Message List */}
      <div
        className="flex flex-col flex-1 overflow-y-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2"
        id="message-container"
      >
        {chatsLoading ? (
          <div className="min-h-full flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          messages.map((message) => {
            return <ChatMessage key={message.id} message={message} />;
          })
        )}
        {isLoading && <Typing />}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 mb-2 w-full px-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={"Ask renai...."}
          className="w-full focus:outline-none focus:ring-0 custom-input"
        />

        <Button className="bg-blue-600 text-white">
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
