"use server";

import { ProfileFormState, profileSchema } from "@/app/util/schema";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const createProfile = async (
  state: ProfileFormState,
  formData: FormData,
) => {
  const validatedFields = profileSchema.safeParse({
    fullname: formData.get("fullname"),
    username: formData.get("username"),
    birthdate: formData.get("birthdate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/create-profile`,
      {
        fullname: data.fullname,
        username: data.username,
        birthdate: data.birthdate,
        avatarUrl: "https://github.com/shadcn.png",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.log(error);
  }

  redirect("/dashboard");
};
