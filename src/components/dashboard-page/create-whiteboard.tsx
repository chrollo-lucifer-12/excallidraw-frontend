"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"; // or any toast library you use
import { useLocalStorage } from "@/hooks/use-localstorage";

const CreateWhiteboard = () => {
  const queryClient = useQueryClient();
  const [whiteboardName, setWhiteboardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { getToken } = useLocalStorage();
  const token = getToken("user");

  const createWhiteboardMutation = useMutation({
    mutationKey: ["create-whiteboard"],
    mutationFn: async (name: string) => {
      const response = await axios.post(
        "http://localhost:8000/api/v1/whiteboard/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whiteboards"] }); // refresh whiteboards
      setWhiteboardName(""); // reset input
      setIsOpen(false); // close dialog
      toast.success("Whiteboard created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create whiteboard",
      );
    },
  });

  const handleCreate = () => {
    if (!whiteboardName.trim()) {
      toast.error("Please enter a name for the whiteboard");
      return;
    }
    createWhiteboardMutation.mutate(whiteboardName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Whiteboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new whiteboard</DialogTitle>
          <DialogDescription>
            Enter a name for your new whiteboard.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Whiteboard name"
          value={whiteboardName}
          onChange={(e) => setWhiteboardName(e.target.value)}
        />
        <Button
          onClick={handleCreate}
          disabled={createWhiteboardMutation.isPending}
        >
          {createWhiteboardMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogContent>
      {/*<DialogFooter>
        <Button
          onClick={handleCreate}
          disabled={createWhiteboardMutation.isPending}
        >
          {createWhiteboardMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogFooter>*/}
    </Dialog>
  );
};

export default CreateWhiteboard;
