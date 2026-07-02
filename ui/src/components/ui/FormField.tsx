import { InputHTMLAttributes } from "react";
import { Label } from "./Label";
import { Input } from "./Input";

type FormFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>

      <Input id={id} {...props} />
    </div>
  );
}
