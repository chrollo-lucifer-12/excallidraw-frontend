"use server";

import { formSchema, FormState } from "@/app/util/schema";
import { redirect } from "next/navigation";

export const signupAction = async (state: FormState, formData: FormData) => {
  try {
    const validatedFields = formSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const data = validatedFields.data;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const json = await res.json();

    if (!res.ok || json.error) {
      return {
        success: false,
      };
    }

    //   return { success: true };
  } catch (err: any) {
    console.error("Signup error:", err);
    return {
      success: false,
    };
  }

  redirect("/login");
};
