"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createWhiteBoard,
  type CreateWhiteboardState,
} from "@/app/(protected)/_actions/create-whiteboard";
import { RainbowButton } from "../ui/rainbow-button";

const initialState: CreateWhiteboardState = {
  success: false,
};

const CreateWhiteboard = () => {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createWhiteBoard,
    initialState,
  );

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success("Whiteboard created 🎉");
      setOpen(false);
    }

    if (state.errors) {
      Object.values(state.errors).forEach((messages) => {
        messages.forEach((msg) => toast.error(msg));
      });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RainbowButton size="lg">
          <Plus className="h-5 w-5" />
          Create Whiteboard
        </RainbowButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new whiteboard</DialogTitle>
          <DialogDescription>
            Enter a name for your new whiteboard.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex gap-2">
          <Input
            name="name"
            placeholder="Whiteboard name"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWhiteboard;
