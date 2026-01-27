"use server";

import { secureRandomSlug } from "@/app/util/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { whiteBoardSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type CreateWhiteboardState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const MAX_WHITEBOARDS = 5;

export const createWhiteBoard = async (
  _prevState: CreateWhiteboardState,
  formData: FormData,
): Promise<CreateWhiteboardState> => {
  const validatedFields = whiteBoardSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      errors: { auth: ["User not logged in"] },
    };
  }

  // 🔒 ENFORCE LIMIT
  const count = await prisma.whiteBoard.count({
    where: { userId: session.user.id },
  });

  if (count >= MAX_WHITEBOARDS) {
    return {
      success: false,
      errors: {
        limit: [`You can only create up to ${MAX_WHITEBOARDS} whiteboards`],
      },
    };
  }

  try {
    await prisma.whiteBoard.create({
      data: {
        name: validatedFields.data.name,
        slug: secureRandomSlug(),
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errors: { server: ["Something went wrong"] },
    };
  }
};
