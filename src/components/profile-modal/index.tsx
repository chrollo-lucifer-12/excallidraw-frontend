"use client";
import { createProfile } from "@/app/(protected)/_actions/create-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useActionState } from "react";

const ProfileModal = () => {
  const [state, action, pending] = useActionState(createProfile, undefined);

  return (
    <Dialog open={true} defaultOpen={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create profile</DialogTitle>
          <DialogDescription>Create Profile to continue</DialogDescription>
        </DialogHeader>
        <form action={action} id="create">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                defaultValue="Pedro Duarte"
              />
              {state?.errors.fullname && (
                <div className="text-red-500 text-xs ">
                  {state.errors.fullname}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue="@peduarte" />
              {state?.errors.username && (
                <div className="text-red-500 text-xs">
                  {state.errors.username}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" name="birthdate" type="date" />
              {state?.errors.birthdate && (
                <div className="text-red-500 text-xs">
                  {state.errors.birthdate}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" form="create">
              {pending ? <Loader className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
