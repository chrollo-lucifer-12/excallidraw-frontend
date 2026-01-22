"use server";

import { secureRandomSlug } from "@/app/util/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { whiteBoardSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createWhiteBoard = async (formData: FormData) => {
  const validatedFields = whiteBoardSchema.safeParse({
    name: formData.get("name"),
  });

  if (validatedFields.error) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, errors: { auth: ["User not logged in"] } };
    }

    const slug = secureRandomSlug();

    const whiteboard = await prisma.whiteBoard.create({
      data: {
        name: validatedFields.data.name,
        slug,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: whiteboard };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      errors: { server: ["Something went wrong"] },
    };
  }
};
