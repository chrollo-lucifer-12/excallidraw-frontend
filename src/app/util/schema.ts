import z from "zod";

export const formSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string({ error: "Please enter a valid password" })
    .min(8, "Password must be at least 8 characters"),
});

export const profileSchema = z.object({
  fullname: z.string().min(1, { error: "Full Name cannot be empty" }),
  username: z.string().min(1, { error: "Username cannot be empty" }),
  birthdate: z.string().min(1, { error: "Birthdate caanot be empty" }),
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

export type ProfileFormState =
  | {
      errors?: {
        fullname?: string[];
        username?: string[];
        birthdate?: string[];
      };
    }
  | undefined;
