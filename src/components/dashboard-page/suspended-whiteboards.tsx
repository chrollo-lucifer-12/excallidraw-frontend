import { prisma } from "@/lib/prisma";
import WhiteboardsDisplay from "./whiteboards-display";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getWhiteboards = async (userId: string) => {
  "use cache";
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
  return whiteboards;
};

const SuspendedWhiteboards = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const userId = session.user.id;
  const whiteboards = await getWhiteboards(userId);
  return <WhiteboardsDisplay whiteboards={whiteboards} />;
};

export default SuspendedWhiteboards;
