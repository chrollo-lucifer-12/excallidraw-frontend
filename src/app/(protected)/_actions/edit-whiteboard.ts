"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function editWhiteboard(
  prevState: { error?: string } | null,
  formData: FormData,
) {
  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;

  if (!slug || !name) {
    return { error: "Missing fields" };
  }

  try {
    await prisma.whiteBoard.update({
      where: { slug },
      data: { name },
    });

    revalidatePath("/whiteboards");

    return { success: true };
  } catch (err) {
    return { error: "Failed to update whiteboard" };
  }
}
