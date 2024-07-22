import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
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
        "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50",
        isOpen ? "animate-fadeIn" : "animate-fadeOut"
      )}
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={classNames(
          "rounded-lg p-6 m-4 bg-gradient-to-b from-slate-700 to-sky-950",
          isOpen ? "animate-scaleIn" : "animate-scaleOut",
          // todo: twMerge
          className ?? ""
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
