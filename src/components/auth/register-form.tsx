"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { messageForError } from "@/lib/api/error-message";
import { registerSchema, type RegisterValues } from "@/lib/auth/schemas";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerAccount } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", name: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await registerAccount.mutateAsync(values);
      router.replace("/drive");
    } catch (err) {
      setFormError(messageForError(err));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

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
          autoComplete="new-password"
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

      <Button type="submit" disabled={isSubmitting || registerAccount.isPending}>
        {registerAccount.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
