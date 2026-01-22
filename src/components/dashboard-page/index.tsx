"use client";

import { FileText } from "lucide-react";

import CreateWhiteboard from "./create-whiteboard";
import { Whiteboard } from "@/lib/types";
import { useOptimistic } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = ({ whiteboards }: { whiteboards: Whiteboard[] }) => {
  const router = useRouter();
  const [optimisticWhiteboards, updateWhiteboards] = useOptimistic<
    Whiteboard[],
    { type: "add" | "replace" | "remove"; payload: any }
  >(whiteboards, (state, action) => {
    if (action.type === "add") {
      return [...state, action.payload];
    }

    if (action.type === "replace") {
      return state.map((wb) =>
        wb.tempId === action.payload.tempId ? action.payload : wb,
      );
    }

    if (action.type === "remove") {
      return state.filter((wb) => wb.tempId !== action.payload.tempId);
    }

    return state;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Whiteboards</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your whiteboards
          </p>
        </div>
        <CreateWhiteboard updateWhiteBoards={updateWhiteboards} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimisticWhiteboards.map((board) => (
          <div
            key={board.slug || board.name}
            className="p-4 rounded-2xl shadow-sm border"
            onClick={() => {
              router.push(`/whiteboard/${board.slug}`);
            }}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <h2 className="font-semibold">{board.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
