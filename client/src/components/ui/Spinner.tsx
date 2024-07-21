import classNames from "classnames";
import { ReactNode } from "react";

interface SpinnerProps {
  isSpinning: boolean;
  children: ReactNode;
}

export const Spinner = ({ isSpinning, children }: SpinnerProps) => {
  return (
    <div className="inline-flex items-center justify-center">
      {isSpinning && (
        <div className="absolute">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
        </div>
      )}
      <span
        className={classNames(
          "transition-opacity duration-300",
          isSpinning ? "opacity-0" : "opacity-100"
        )}
      >
        {children}
      </span>
    </div>
  );
};
