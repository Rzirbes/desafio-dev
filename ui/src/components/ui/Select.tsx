"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
};

export function Select({
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  options,
  disabled,
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={clsx(
          "flex w-full items-center justify-between rounded-xl",
          "border border-border bg-background",
          "px-4 py-2.5",
          "text-sm text-foreground",
          "shadow-sm outline-none",
          "transition-all duration-200",
          "hover:border-foreground/50",
          "focus:ring-2 focus:ring-foreground/15",
          "data-[state=open]:border-foreground",
          "disabled:cursor-not-allowed",
          "disabled:bg-background-secondary",
          "disabled:text-foreground-secondary",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />

        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          sideOffset={6}
          position="popper"
          className={clsx(
            "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl",
            "border border-border bg-background shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={clsx(
                  "relative flex cursor-pointer select-none items-center rounded-lg",
                  "px-3 py-2 pl-9",
                  "text-sm text-foreground",
                  "outline-none transition-colors",
                  "data-[highlighted]:bg-background-secondary",
                  "data-[highlighted]:text-foreground",
                )}
              >
                <SelectPrimitive.ItemIndicator className="absolute left-3">
                  <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>

                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
