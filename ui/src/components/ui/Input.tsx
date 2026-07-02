import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg",
          "border border-border",
          "bg-background",
          "px-3 py-2 text-sm",
          "text-foreground",
          "placeholder:text-foreground-secondary",
          "outline-none transition-colors",
          "focus:border-primary",
          "disabled:cursor-not-allowed disabled:bg-background-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
