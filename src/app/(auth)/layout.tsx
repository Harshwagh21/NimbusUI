import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-sky)_0%,_transparent_55%),linear-gradient(160deg,_#eaf3fb_0%,_#f7fafc_45%,_#dfeaf5_100%)]"
      />
      <div className="relative z-10 mb-8 text-center">
        <p className="font-display text-4xl font-semibold tracking-tight text-[var(--brand-deep)] sm:text-5xl">
          NimbusCloud
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Your files have a cloud to ride on.
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-6 shadow-sm backdrop-blur">
        {children}
      </div>
    </div>
  );
}
