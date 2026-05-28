"use client";

import { useMemo, useState, useTransition } from "react";
import { Heart, Laugh, ThumbsUp, Angry, MessageCircle } from "lucide-react";

import { togglePostReaction } from "@/actions/feedActions";
import { Button } from "@/components/ui/button";
import type { FeedReaction } from "./feed-types";

const REACTIONS: Array<{
  key: FeedReaction;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  activeClasses: string;
}> = [
  {
    key: "LIKE",
    label: "Like",
    Icon: ThumbsUp,
    activeClasses: "text-blue-700 bg-blue-50 border border-blue-100",
  },
  {
    key: "LOVE",
    label: "Love",
    Icon: Heart,
    activeClasses: "text-rose-700 bg-rose-50 border border-rose-100",
  },
  {
    key: "HAHA",
    label: "Haha",
    Icon: Laugh,
    activeClasses: "text-amber-700 bg-amber-50 border border-amber-100",
  },
  {
    key: "ANGRY",
    label: "Angry",
    Icon: Angry,
    activeClasses: "text-red-700 bg-red-50 border border-red-100",
  },
  {
    key: "OW",
    label: "Ow",
    Icon: Heart,
    activeClasses: "text-violet-700 bg-violet-50 border border-violet-100",
  },
];

function clampNonNegative(n: number) {
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
}

function applyOptimisticToggle(
  prevCounts: Partial<Record<FeedReaction, number>>,
  viewerReaction: FeedReaction | null,
  next: FeedReaction,
): {
  counts: Partial<Record<FeedReaction, number>>;
  viewerReaction: FeedReaction | null;
} {
  const copy = { ...prevCounts };

  const dec = (key: FeedReaction) => {
    copy[key] = clampNonNegative((copy[key] ?? 0) - 1);
  };
  const inc = (key: FeedReaction) => {
    copy[key] = clampNonNegative((copy[key] ?? 0) + 1);
  };

  if (viewerReaction === next) {
    dec(next);
    return { counts: copy, viewerReaction: null };
  }

  if (viewerReaction) dec(viewerReaction);
  inc(next);
  return { counts: copy, viewerReaction: next };
}

export function ReactionBar({
  postId,
  initialCounts,
  initialViewerReaction,
  commentCount = 0,
  onCommentClick,
}: {
  postId: string;
  initialCounts?: Partial<Record<FeedReaction, number>>;
  initialViewerReaction?: FeedReaction | null;
  commentCount?: number;
  onCommentClick?: () => void;
}) {
  const [viewerReaction, setViewerReaction] = useState<FeedReaction | null>(
    initialViewerReaction ?? null,
  );
  const [counts, setCounts] = useState<Partial<Record<FeedReaction, number>>>(
    initialCounts ?? {},
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalReactions = useMemo(() => {
    return REACTIONS.reduce(
      (acc, r) => acc + clampNonNegative(counts[r.key] ?? 0),
      0,
    );
  }, [counts]);

  const handleToggle = (next: FeedReaction) => {
    const previousCounts = { ...counts };
    const previousViewerReaction = viewerReaction;

    const optimistic = applyOptimisticToggle(counts, viewerReaction, next);
    setCounts(optimistic.counts);
    setViewerReaction(optimistic.viewerReaction);
    setError(null);

    startTransition(async () => {
      const result = await togglePostReaction(postId, next);

      if (!result.success || !result.data) {
        setCounts(previousCounts);
        setViewerReaction(previousViewerReaction);
        setError(result.error ?? "Failed to update reaction");
        return;
      }

      setCounts(result.data.reactionCounts);
      setViewerReaction(result.data.viewerReaction);
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          {totalReactions > 0 ? (
            <span className="font-medium text-slate-600">
              {totalReactions} reaction{totalReactions === 1 ? "" : "s"}
            </span>
          ) : (
            <span>No reactions yet</span>
          )}
        </div>
        <button
          type="button"
          onClick={onCommentClick}
          className="flex items-center gap-1 rounded-md px-1 py-0.5 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={`${commentCount} comments`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{commentCount}</span>
        </button>
      </div>

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {REACTIONS.map(({ key, label, Icon, activeClasses }) => {
          const isActive = viewerReaction === key;
          return (
            <Button
              key={key}
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleToggle(key)}
              className={[
                "rounded-full border-slate-200 text-slate-700 hover:bg-slate-50",
                isActive ? activeClasses : "",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className="text-xs text-slate-500">
                {clampNonNegative(counts[key] ?? 0)}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
