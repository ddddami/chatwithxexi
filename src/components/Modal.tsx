import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-2">
        <button
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
