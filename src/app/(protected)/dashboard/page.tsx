import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getWhiteboards } from "@/app/util/data";
import DashboardPage from "@/components/dashboard-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["whiteboards"],
    queryFn: () => getWhiteboards(token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardPage token={token} />
    </HydrationBoundary>
  );
};

export default Page;
