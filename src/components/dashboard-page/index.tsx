"use client";

import { useLocalStorage } from "@/hooks/use-localstorage";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateWhiteboard from "./create-whiteboard";
import axios from "axios";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Get token after component mounts on client
  useEffect(() => {
    const userToken = localStorage.getItem("user");
    setToken(userToken);
  }, []);

  const whiteboardQuery = useQuery({
    queryKey: ["whiteboards"],
    queryFn: async () => {
      console.log("fetching data...");
      console.log("Using token:", token); // Debug log

      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/whiteboards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        //  console.log("Response received:", response.data); // This should now log
        return response.data.whiteboards;
      } catch (error) {
        console.error("Error fetching whiteboards:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
        }
        throw error; // Re-throw to let React Query handle it
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  //console.log(token);
  if (whiteboardQuery.isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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
          <CreateWhiteboard />
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
          <CreateWhiteboard />
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
        <CreateWhiteboard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whiteboardQuery.data.map((whiteboard: any) => (
          <Card
            key={whiteboard.slug}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/whiteboard/${whiteboard.slug}`)}
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
