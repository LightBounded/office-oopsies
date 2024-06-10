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
import { CreateOopsieForm } from "./create-oopsie-form";

export function CreateOopsieButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4">Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an oopsie</DialogTitle>
          <DialogDescription>
            Has someone said something sus? Create an oopsie to let them know.
          </DialogDescription>
        </DialogHeader>
        <CreateOopsieForm />
      </DialogContent>
    </Dialog>
  );
}
