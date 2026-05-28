"use client";

import { Newspaper } from "lucide-react";

import PageEmptyState from "@/components/main/PageEmptyState";
import { FeedPostCard } from "./FeedPostCard";
import type { FeedPost } from "./feed-types";

export function HomeFeed({
  posts,
  isLoggedIn,
}: {
  posts: FeedPost[];
  isLoggedIn: boolean;
}) {
  if (!posts.length) {
    return (
      <PageEmptyState
        icon={<Newspaper className="h-7 w-7 text-sky-700" />}
        title="No posts yet"
        description="Be the first to share something with the community."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => (
        <FeedPostCard key={p.id} post={p} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  );
}

