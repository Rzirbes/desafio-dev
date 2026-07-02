import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-xl",
          "border border-border bg-background",
          "px-4 py-2.5",
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
    );
  },
);

Input.displayName = "Input";
