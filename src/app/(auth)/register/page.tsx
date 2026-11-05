import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Create account</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Start with a clear sky and empty drive.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
