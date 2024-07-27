import type { ButtonHTMLAttributes, ReactNode } from "react";
import classnames from "classnames";

export type ButtonVariant = "primary" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-200 text-slate-950",
  secondary: "border border-1 border-slate-200 text-slate-200",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const Button = (props: ButtonProps) => {
  const { children, variant = "primary", ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      className={classnames(
        "px-4 py-2 rounded-lg min-w-20",
        variantClasses[variant]
      )}
    >
      {children}
    </button>
  );
};
