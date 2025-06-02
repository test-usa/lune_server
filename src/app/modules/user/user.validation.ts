import { z } from "zod";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters long" }),
    status: z.enum(["in-progress", "blocked"]).optional().default("in-progress"),
    role: z.enum([ "admin", "user"]).optional().default("user"),
    isDeleted:z.boolean().optional().default(false)
  }),
});


const updateUserStatusValidationScheme = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const userValidation = {
  registerUserValidationSchema,
  updateUserStatusValidationScheme
};