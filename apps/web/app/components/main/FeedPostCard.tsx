"use client";

import { useState } from "react";

import { addCommentToTree, countComments } from "@/lib/feed-comment-utils";
import Card from "@/components/ui/Card";
import type { FeedComment, FeedPost } from "./feed-types";
import { PostComments } from "./PostComments";
import { PostImageGrid } from "./PostImageGrid";
import { ReactionBar } from "./ReactionBar";

function Avatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={name} src={avatarUrl} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-semibold text-blue-700">{initial}</span>
      )}
    </div>
  );
}

type FeedPostCardProps = {
  post: FeedPost;
  isLoggedIn: boolean;
};

export function FeedPostCard({ post, isLoggedIn }: FeedPostCardProps) {
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState(post.comments ?? []);
  const commentCount = Math.max(
    post.commentCount ?? 0,
    countComments(comments),
  );

  const handleCommentAdded = (comment: FeedComment) => {
    setComments((prev) => addCommentToTree(prev, comment));
  };

  return (
    <div id={`post-${post.id}`} className="scroll-mt-24">
    <Card
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="truncate text-sm font-semibold text-slate-900">
              {post.author.name}
            </div>
            {post.author.roleLabel ? (
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {post.author.roleLabel}
              </span>
            ) : null}
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{post.createdAtLabel}</span>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">
            {post.content}
          </p>

          {post.imageUrls && post.imageUrls.length > 0 ? (
            <PostImageGrid imageUrls={post.imageUrls} />
          ) : null}

          <ReactionBar
            postId={post.id}
            initialCounts={post.reactionCounts}
            initialViewerReaction={post.viewerReaction ?? null}
            commentCount={commentCount}
            onCommentClick={() => setCommentsExpanded((v) => !v)}
          />

          <PostComments
            postId={post.id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
            commentCount={commentCount}
            isLoggedIn={isLoggedIn}
            expanded={commentsExpanded}
            onToggle={() => setCommentsExpanded((v) => !v)}
          />
        </div>
      </div>
    </Card>
    </div>
  );
}
