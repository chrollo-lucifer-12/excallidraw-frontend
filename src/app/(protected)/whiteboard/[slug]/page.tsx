import WhiteboardPage from "@/components/whiteboard-page";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type WhiteboardPageProps = {
  params: Promise<{ slug: string }>; // More accurate type
};

const Page = async ({ params }: WhiteboardPageProps) => {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const data = await axios.get("http://localhost:8000/api/v1/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return <WhiteboardPage slug={slug} userId={data.data.user.UserID} />;
};

export default Page;
