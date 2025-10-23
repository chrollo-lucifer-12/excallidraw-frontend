"use client";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateWhiteboard from "./create-whiteboard";
import { getWhiteboards } from "@/app/util/data";
import Loading from "./loading";

const DashboardPage = ({ token }: { token: string }) => {
  const router = useRouter();

  const whiteboardQuery = useQuery({
    queryKey: ["whiteboards"],
    queryFn: () => getWhiteboards(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (whiteboardQuery.isLoading) {
    <Loading />;
  }

  if (!whiteboardQuery.data || whiteboardQuery.data.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Whiteboards</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your whiteboards
            </p>
          </div>
          <CreateWhiteboard token={token} />
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-12">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            No whiteboards available
          </h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Get started by creating your first whiteboard to collaborate and
            brainstorm ideas.
          </p>
          <CreateWhiteboard token={token} />
        </div>
      </div>
    );
  }

  console.log(whiteboardQuery.data);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Whiteboards</h1>
          <p className="text-muted-foreground mt-1">
            {whiteboardQuery.data.length}{" "}
            {whiteboardQuery.data.length === 1 ? "whiteboard" : "whiteboards"}
          </p>
        </div>
        <CreateWhiteboard token={token} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whiteboardQuery.data.map((whiteboard: any) => (
          <Card
            key={whiteboard.Slug}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/whiteboard/${whiteboard.Slug}`)}
          >
            <CardHeader>
              <CardTitle>{whiteboard.Name || "Untitled Whiteboard"}</CardTitle>
              <CardDescription>
                {whiteboard.createdAt
                  ? new Date(whiteboard.CreatedAt).toLocaleDateString()
                  : "No date"}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
