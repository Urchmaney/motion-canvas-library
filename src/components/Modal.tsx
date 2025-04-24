import { PropsWithChildren } from "react";

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function Modal({ isOpen, onClose, children }: PropsWithChildren<ModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md  w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          &#x2715; 
        </button>
        {children}
      </div>
    </div>
  );
};