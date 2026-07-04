"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
      <div className="relative">
        <input
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={clsx(
            "w-full rounded-xl",
            "border border-border bg-background",
            "px-4 py-2.5",
            isPassword && "pr-12",
            "text-sm text-foreground",
            "placeholder:text-foreground-secondary",
            "shadow-sm",
            "outline-none",
            "transition-all duration-200",
            "hover:border-foreground/50",
            "focus:border-foreground",
            "focus:ring-2 focus:ring-foreground/15",
            "disabled:cursor-not-allowed",
            "disabled:bg-background-secondary",
            "disabled:text-foreground-secondary",
            className,
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-foreground-secondary transition-colors hover:text-foreground focus:outline-none"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
