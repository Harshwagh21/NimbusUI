import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className = "", invalid, ...props }: Props) {
  return (
    <input
      className={`w-full rounded-md border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        invalid ? "border-[var(--danger)]" : "border-[var(--border)]"
      } ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
