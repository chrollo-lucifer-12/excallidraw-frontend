import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const board = await prisma.whiteBoard.findFirst({
    where: { slug },
    select: { data: true },
  });

  return NextResponse.json(board?.data || []);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = await req.json();

  const dataStr = JSON.stringify(data);

  await prisma.whiteBoard.update({
    where: { slug },
    data: {
      data: dataStr,
    },
  });

  return NextResponse.json({ ok: true });
}
