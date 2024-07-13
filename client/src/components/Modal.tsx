import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  return (
    <div
      className={classNames(
        "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center",
        isOpen ? "animate-fadeIn" : "animate-fadeOut"
      )}
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={classNames(
          "bg-white rounded-lg p-6",
          isOpen ? "animate-scaleIn" : "animate-scaleOut"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
