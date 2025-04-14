import * as z from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Invalid email address" });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const passwordSetupSchema = z
  .object({
    workId: z.string().nonempty("Work ID is required"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const agentFormSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: emailSchema,
  workId: z.string().nonempty("Work ID is required"),
  nationalId: z.string().nonempty("National ID is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
});

export const managerFormSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: emailSchema,
  nationalId: z.string().nonempty("National ID is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  workId: z.string().nonempty("Work ID is required"),
});
