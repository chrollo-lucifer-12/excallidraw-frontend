import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useActionState, useEffect, useState } from "react";
import { editWhiteboard } from "@/app/(protected)/_actions/edit-whiteboard";
import { RippleButton } from "../ui/ripple-button";

const EditWhiteboard = ({ name, slug }: { name: string; slug: string }) => {
  const [state, action, pending] = useActionState(editWhiteboard, null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <RippleButton onClick={(e) => e.stopPropagation()} className="w-8 h-8">
          <EllipsisVertical />
        </RippleButton>
      </PopoverTrigger>

      <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
        <div className="grid gap-4">
          <h4 className="font-medium">{name}</h4>

          <form action={action} className="grid gap-2">
            <input type="hidden" name="slug" value={slug} />

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={name}
                className="col-span-2 h-8"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={pending} className="w-1/4">
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditWhiteboard;
