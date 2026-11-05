"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { messageForError } from "@/lib/api/error-message";
import { loginSchema, type LoginValues } from "@/lib/auth/schemas";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login.mutateAsync(values);
      router.replace("/drive");
    } catch (err) {
      setFormError(messageForError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting || login.isPending}>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-[var(--muted)]">
        New here?{" "}
        <Link href="/register" className="text-[var(--accent)] underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
