"use client";

import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { type RouterOutputs, api } from "~/trpc/react";

export function OopsiesList() {
  const {
    data: oopsies,
    isError,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = api.oopsie.getLatest.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="space-y-4">
      {oopsies.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.oopsies.map((oopsie) => (
            <OopsieCard key={oopsie.id} oopsie={oopsie} />
          ))}
        </div>
      ))}
      {isFetchingNextPage && <div className="text-center">Loading more...</div>}
      {!hasNextPage && <div className="text-center">No more oopsies :(</div>}
      {isFetchNextPageError && (
        <div className="text-center">Failed to load more oopsies</div>
      )}

      <div ref={observerTargetRef} className="pb-0.5"></div>
    </div>
  );
}

function OopsieCard({
  oopsie,
}: {
  oopsie: RouterOutputs["oopsie"]["getLatest"]["oopsies"][0];
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
      <div className="mb-1 flex flex-col">
        <div className="text-xl font-bold">{oopsie.user.username}</div>
        <div className="break-all">{oopsie.description}</div>
      </div>
      <div className="sm:ml-auto sm:flex sm:flex-col">
        <div className="mb-4 text-nowrap text-sm text-foreground/80 sm:text-right">
          Reported by{" "}
          <Link
            className="underline underline-offset-4"
            href={`/profile/${oopsie.author.username}`}
          >
            {oopsie.author.username}
          </Link>
        </div>
        <div className="mt-auto space-x-2 text-nowrap sm:text-right">
          <Button
            onClick={() => likeOopsie.mutate(oopsie.id)}
            size="sm"
            className="h-8"
          >
            <ThumbsUpIcon className="mr-2 h-4 w-4" />
            {oopsie.likes}
          </Button>
          <Button size="icon" className="h-8 w-8">
            <MessageCircleIcon className="h-4 w-4" />
          </Button>
          {oopsie.latitude && oopsie.longitude && (
            <Button size="icon" asChild className="h-8 w-8">
              <a
                target="_blank"
                href={`https://www.google.com/maps?q=${oopsie.latitude},${oopsie.longitude}`}
              >
                <MapPin className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
