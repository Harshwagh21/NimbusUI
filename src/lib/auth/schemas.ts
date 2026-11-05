import { z } from "zod";

function emailLooksValid(email: string): boolean {
  if (!email || email.length > 254 || /[\s]/.test(email)) return false;
  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@") || at >= email.length - 1) {
    return false;
  }
  return email.slice(at + 1).includes(".");
}

export const emailSchema = z
  .string()
  .trim()
  .refine(emailLooksValid, { message: "a valid email is required" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  name: z
    .string()
    .trim()
    .min(1, "name is required")
    .max(100, "name is too long"),
  password: z
    .string()
    .min(1, "password is required")
    .refine((p) => p.length >= 8 && p.length <= 72, {
      message: "password must be 8 to 72 characters",
    }),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
