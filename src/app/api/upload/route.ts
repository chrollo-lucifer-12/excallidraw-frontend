import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      NextResponse.json({ error: "File not found" }, { status: 400 });
      return;
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      NextResponse.json({ error: "User not logged in" }, { status: 400 });
      return;
    }

    const userId = session.user.id;

    const whiteboard = await prisma.whiteBoard.findFirst({
      where: {
        userId,
        slug,
      },
      select: {
        slug: true,
      },
    });

    if (!whiteboard) {
      NextResponse.json({ error: "Whiteboard not found" }, { status: 400 });
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const filePath = `${slug}`;

    const supabaseRes = await fetch(
      `${process.env.SUPABASE_URL}/storage/v1/object/images/${filePath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: fileBuffer,
      },
    );

    if (!supabaseRes.ok) {
      const err = await supabaseRes.text();
      throw new Error(err);
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

    await prisma.whiteBoard.update({
      where: {
        slug,
      },
      data: {
        image: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
