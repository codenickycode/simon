import type { ButtonHTMLAttributes, ReactNode } from "react";
import classnames from "classnames";

export type ButtonVariant = "primary" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-200",
  secondary: "border border-button-primary-1",
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
        "px-4 py-2 rounded-lg min-w-20 text-slate-800",
        variantClasses[variant]
      )}
    >
      {children}
    </button>
  );
};
