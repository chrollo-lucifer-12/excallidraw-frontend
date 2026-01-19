import WhiteboardPage from "@/components/whiteboard-page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type WhiteboardPageProps = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: WhiteboardPageProps) => {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const userId = session.user.userId;

  const whiteboard = await prisma.whiteBoard.findUnique({
    where: {
      slug,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!whiteboard) {
    notFound();
  }

  return <WhiteboardPage />;
};

export default Page;
