"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { UpdateOopsieForm } from "./update-oopsie-form";
import { type RouterOutputs } from "~/trpc/react";
import { PencilIcon } from "lucide-react";

export function UpdateOopsieButton({
  oopsie,
}: {
  oopsie: RouterOutputs["oopsie"]["getLatest"]["oopsies"][number];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-8 w-8">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update {oopsie.user.firstName}&apos;s oopsie
          </DialogTitle>
          <DialogDescription>
            Wrong person? Wrong description? No problem! Update it here!
          </DialogDescription>
        </DialogHeader>
        <UpdateOopsieForm oopsie={oopsie} />
      </DialogContent>
    </Dialog>
  );
}
