import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
      : "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]";

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props} />
  );
}
