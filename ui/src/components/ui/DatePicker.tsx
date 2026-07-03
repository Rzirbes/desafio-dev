"use client";

import ReactDatePicker from "react-datepicker";

type DatePickerProps = {
  selected: Date;
  onChange: (date: Date) => void;
};

export function DatePicker({ selected, onChange }: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={(date: Date | null) => {
        if (date) {
          onChange(date);
        }
      }}
      dateFormat="dd/MM/yyyy"
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
    />
  );
}
