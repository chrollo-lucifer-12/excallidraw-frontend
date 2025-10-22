import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getWhiteboards } from "@/app/util/data";
import DashboardPage from "@/components/dashboard-page";

const Page = async () => {
  // const queryClient = new QueryClient();

  // queryClient.prefetchQuery({
  //   queryKey: ["whiteboards"],
  //   queryFn: getWhiteboards,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <DashboardPage />
    // </HydrationBoundary>
  );
};

export default Page;
