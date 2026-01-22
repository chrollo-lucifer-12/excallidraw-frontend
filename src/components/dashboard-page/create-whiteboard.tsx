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
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { createWhiteBoard } from "@/app/(protected)/_actions/create-whiteboard";

const CreateWhiteboard = ({
  updateWhiteBoards,
}: {
  updateWhiteBoards: (action: {
    type: "add" | "replace" | "remove";
    payload: any;
  }) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const formAction = async (formData: FormData) => {
    const tempId = crypto.randomUUID();

    startTransition(async () => {
      updateWhiteBoards({
        type: "add",
        payload: {
          name: formData.get("name"),
          slug: "",
          image: "",
          tempId,
        },
      });

      const created = await createWhiteBoard(formData);

      if (!created?.success) {
        updateWhiteBoards({ type: "remove", payload: { tempId } });
        return;
      }

      updateWhiteBoards({
        type: "replace",
        payload: { ...created, tempId },
      });

      setIsOpen(false);
    });
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
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form action={formAction}>
          <Input placeholder="Whiteboard name" name="name" />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWhiteboard;
