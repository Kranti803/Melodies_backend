import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3).trim(),
  email: z.string().email().trim(),
  password: z.string().min(8).trim(),
});

export const loginUserSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).trim(),
});

export const verifyUserSchema = z.object({
  userId: z.string().trim(),
  token: z.string().trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().trim(),
});

export const resetPasswordParamsSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required").trim(),
});

export const resetPasswordBodySchema = z.object({
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .trim(),
});
