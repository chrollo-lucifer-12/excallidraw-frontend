import DashboardHeader from "@/components/dashboard-page/dashboard-header";
import SuspendedWhiteboards from "@/components/dashboard-page/suspended-whiteboards";
import { Suspense } from "react";
import Loading from "@/components/dashboard-page/loading";

const Page = async () => {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <Suspense fallback={<Loading />}>
        <SuspendedWhiteboards />
      </Suspense>
    </div>
  );
};

export default Page;
