"use client";
import React from "react";
import { useChat } from "ai/react";
import { Input } from "./ui/input";

const Chat = () => {
  const { input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="relate max-h-screen overflow-scroll">
      {/* Header */}
      <div className="stickt top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Message List */}
      <div className="flex flex-col"></div>
      <form onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={"Ask XeXi...."}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default Chat;
