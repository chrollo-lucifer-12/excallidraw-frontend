"use server";

import { formSchema, FormState } from "@/app/util/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (state: FormState, formData: FormData) => {
  try {
    // Validate form data
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

    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      return {
        success: false,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", json.token);

    // return { success: true };
  } catch (err: any) {
    console.error("Login error:", err);
    return {
      success: false,
    };
  }

  redirect("/dashboard");
};
