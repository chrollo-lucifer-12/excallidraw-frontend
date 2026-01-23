import { auth } from "@/lib/auth";

import DashboardPage from "@/components/dashboard-page";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const userId = session.user.id;

  const whiteboards = await prisma.whiteBoard.findMany({
    where: {
      userId,
    },
    select: {
      name: true,
      slug: true,
      image: true,
    },
  });

  return <DashboardPage whiteboards={whiteboards} />;
};

export default Page;
