import z from "zod";

export const formSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string({ error: "Please enter a valid password" })
    .min(8, "Password must be at least 8 characters"),
});
export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      success: boolean;
      message?: string;
    }
  | undefined;
