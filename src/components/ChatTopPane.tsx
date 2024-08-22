"use client";
import { Book, CalculatorIcon, FunctionSquare } from "lucide-react";
import React, { useState } from "react";
import Modal from "./Modal";
import Calculator from "./Calculator";

const ChatTopPane = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="border border-b-2 py-2 px-3 flex items-center gap-2">
        {/* Calculator */}
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
        >
          <CalculatorIcon />
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-sm hover:bg-yellow-600"
        >
          <Book />
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600"
        >
          <FunctionSquare />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <Calculator />
      </Modal>
    </>
  );
};

export default ChatTopPane;
