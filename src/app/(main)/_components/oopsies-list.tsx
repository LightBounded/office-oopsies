"use client";

import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { type RouterOutputs, api } from "~/trpc/react";

export function OopsiesList() {
  const { data: oopsies, isError, isPending } = api.oopsie.getLatest.useQuery();

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="space-y-4">
      {oopsies.map((oopsie) => (
        <OopsieCard key={oopsie.id} oopsie={oopsie} />
      ))}
    </div>
  );
}

function OopsieCard({
  oopsie,
}: {
  oopsie: RouterOutputs["oopsie"]["getLatest"][number];
}) {
  const utils = api.useUtils();
  const likeOopsie = api.oopsie.like.useMutation({
    async onSuccess() {
      // Invalidate query
      await utils.oopsie.getLatest.invalidate();
    },
    async onError() {
      toast.error("Failed to like oopsie");
    },
  });

  return (
    <div className="relative flex min-h-36 flex-col rounded-md border p-6 sm:flex-row sm:gap-6">
      <div className="mb-1">
        <div className="text-xl font-bold">{oopsie.user.username}</div>
        <div>{oopsie.description}</div>
      </div>
      <div className="sm:ml-auto sm:flex sm:flex-col">
        <div className="mb-4 text-nowrap text-sm text-foreground/80">
          Reported by{" "}
          <Link
            className="underline underline-offset-4"
            href={`/profile/${oopsie.author.username}`}
          >
            {oopsie.author.username}
          </Link>
        </div>
        <div className="mt-auto space-x-2 text-nowrap">
          <Button
            onClick={() => likeOopsie.mutate(oopsie.id)}
            size="sm"
            className="h-8"
          >
            <ThumbsUpIcon className="mr-2 h-4 w-4" />
            {oopsie.likes}
          </Button>
          <Button size="sm" className="h-8">
            <MessageCircleIcon className="mr-2 h-4 w-4" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
