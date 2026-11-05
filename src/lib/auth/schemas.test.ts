import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/auth/schemas";

describe("auth schemas", () => {
  it("rejects emails without a dotted domain", () => {
    const result = loginSchema.safeParse({
      email: "ada@localhost",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short register passwords", () => {
    const result = registerSchema.safeParse({
      email: "ada@nimbus.test",
      name: "Ada",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "ada@nimbus.test",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });
});
