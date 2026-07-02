import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  href?: string;
};

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  href,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const buttonClasses = clsx(
    "inline-flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-70",
    {
      "bg-primary text-white hover:bg-primary-hover": variant === "primary",
      "border border-primary text-primary hover:bg-primary hover:text-white":
        variant === "outline",
      "text-primary hover:underline": variant === "ghost",
    },
    className,
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
