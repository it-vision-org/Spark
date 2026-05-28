"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

import { createComment } from "@/actions/feedActions";
import { Button } from "@/components/ui/button";
import TextareaInput from "@/components/ui/TextareaInput";
import type { FeedComment } from "./feed-types";

const VISIBLE_TOP_LEVEL_COMMENTS = 5;
const VISIBLE_REPLIES_PER_BRANCH = 2;

function CommentAvatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const sizeClass = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textClass = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div
      className={`flex ${sizeClass} flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white`}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={name} src={avatarUrl} className="h-full w-full object-cover" />
      ) : (
        <span className={`${textClass} font-semibold text-blue-700`}>
          {initial}
        </span>
      )}
    </div>
  );
}

function CommentComposer({
  placeholder,
  isPending,
  onSubmit,
}: {
  placeholder: string;
  isPending: boolean;
  onSubmit: (content: string) => void;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setContent("");
  };

  return (
    <div className="flex gap-2">
      <TextareaInput
        rows={2}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        className="text-sm"
      />
      <Button
        type="button"
        size="icon"
        className="h-10 w-10 flex-shrink-0 bg-blue-600 hover:bg-blue-700"
        disabled={isPending || !content.trim()}
        onClick={handleSubmit}
        aria-label="Send"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

function ThreadToggleButton({
  hiddenCount,
  expanded,
  onToggle,
  label,
}: {
  hiddenCount: number;
  expanded: boolean;
  onToggle: () => void;
  label: { collapsed: string; expanded: string };
}) {
  if (hiddenCount <= 0) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
    >
      {expanded ? (
        <>
          <ChevronUp className="h-3.5 w-3.5" />
          {label.expanded}
        </>
      ) : (
        <>
          <ChevronDown className="h-3.5 w-3.5" />
          {label.collapsed.replace("{count}", String(hiddenCount))}
        </>
      )}
    </button>
  );
}

function CommentItem({
  postId,
  comment,
  depth,
  isLoggedIn,
  replyingToId,
  isPending,
  expandedReplyBranches,
  onExpandReplies,
  onReplyClick,
  onSubmitReply,
}: {
  postId: string;
  comment: FeedComment;
  depth: number;
  isLoggedIn: boolean;
  replyingToId: string | null;
  isPending: boolean;
  expandedReplyBranches: Set<string>;
  onExpandReplies: (commentId: string) => void;
  onReplyClick: (commentId: string | null) => void;
  onSubmitReply: (content: string, parentId: string) => void;
}) {
  const isReplying = replyingToId === comment.id;
  const replies = comment.replies ?? [];
  const repliesExpanded = expandedReplyBranches.has(comment.id);
  const hiddenReplyCount = Math.max(0, replies.length - VISIBLE_REPLIES_PER_BRANCH);
  const visibleReplies = repliesExpanded
    ? replies
    : replies.slice(0, VISIBLE_REPLIES_PER_BRANCH);

  return (
    <li className={depth > 0 ? "mt-2" : undefined}>
      <div className="flex gap-2">
        <CommentAvatar
          name={comment.authorName}
          avatarUrl={comment.authorAvatarUrl}
          size={depth > 0 ? "sm" : "md"}
        />
        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-xs font-semibold text-slate-900">
                {comment.authorName}
              </span>
              <span className="text-xs text-slate-500">
                {comment.createdAtLabel}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
              {comment.content}
            </p>
          </div>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => onReplyClick(isReplying ? null : comment.id)}
              className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
          ) : null}

          {isReplying ? (
            <div className="mt-2">
              <CommentComposer
                placeholder={`Reply to ${comment.authorName}...`}
                isPending={isPending}
                onSubmit={(content) => onSubmitReply(content, comment.id)}
              />
            </div>
          ) : null}
        </div>
      </div>

      {replies.length > 0 ? (
        <div
          className="mt-2"
          style={{ marginLeft: depth === 0 ? "2.25rem" : "1.75rem" }}
        >
          <ul className="space-y-2 border-l-2 border-slate-200 pl-3">
            {visibleReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                postId={postId}
                comment={reply}
                depth={depth + 1}
                isLoggedIn={isLoggedIn}
                replyingToId={replyingToId}
                isPending={isPending}
                expandedReplyBranches={expandedReplyBranches}
                onExpandReplies={onExpandReplies}
                onReplyClick={onReplyClick}
                onSubmitReply={onSubmitReply}
              />
            ))}
          </ul>

          <ThreadToggleButton
            hiddenCount={hiddenReplyCount}
            expanded={repliesExpanded}
            onToggle={() => onExpandReplies(comment.id)}
            label={{
              collapsed: "View {count} more replies",
              expanded: "Hide replies",
            }}
          />
        </div>
      ) : null}
    </li>
  );
}

type PostCommentsProps = {
  postId: string;
  comments: FeedComment[];
  onCommentAdded: (comment: FeedComment) => void;
  commentCount: number;
  isLoggedIn: boolean;
  expanded: boolean;
  onToggle: () => void;
};

export function PostComments({
  postId,
  comments,
  onCommentAdded,
  commentCount,
  isLoggedIn,
  expanded,
  onToggle,
}: PostCommentsProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedReplyBranches, setExpandedReplyBranches] = useState<
    Set<string>
  >(new Set());
  const [allTopCommentsVisible, setAllTopCommentsVisible] = useState(false);

  const toggleReplyBranch = (commentId: string) => {
    setExpandedReplyBranches((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const expandReplyBranch = (commentId: string) => {
    setExpandedReplyBranches((prev) => new Set(prev).add(commentId));
  };

  const hiddenTopCount = Math.max(
    0,
    comments.length - VISIBLE_TOP_LEVEL_COMMENTS,
  );
  const visibleTopComments = allTopCommentsVisible
    ? comments
    : comments.slice(0, VISIBLE_TOP_LEVEL_COMMENTS);

  const submitComment = (content: string, parentId?: string | null) => {
    startTransition(async () => {
      const result = await createComment(postId, content, parentId);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to add comment");
        return;
      }

      onCommentAdded(result.data);

      if (parentId) {
        expandReplyBranch(parentId);
      } else if (comments.length >= VISIBLE_TOP_LEVEL_COMMENTS) {
        setAllTopCommentsVisible(true);
      }

      setReplyingToId(null);
      toast.success(parentId ? "Reply added" : "Comment added");
    });
  };

  if (!expanded) {
    if (commentCount === 0) return null;
    return (
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 text-left text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        View {commentCount} comment{commentCount === 1 ? "" : "s"}
      </button>
    );
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Comments</span>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Hide
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="mb-3 text-sm text-slate-500">No comments yet.</p>
      ) : (
        <div className="mb-4">
          <ul className="space-y-3">
            {visibleTopComments.map((comment) => (
              <CommentItem
                key={comment.id}
                postId={postId}
                comment={comment}
                depth={0}
                isLoggedIn={isLoggedIn}
                replyingToId={replyingToId}
                isPending={isPending}
                expandedReplyBranches={expandedReplyBranches}
                onExpandReplies={toggleReplyBranch}
                onReplyClick={setReplyingToId}
                onSubmitReply={(content, parentId) =>
                  submitComment(content, parentId)
                }
              />
            ))}
          </ul>

          <ThreadToggleButton
            hiddenCount={hiddenTopCount}
            expanded={allTopCommentsVisible}
            onToggle={() => setAllTopCommentsVisible((v) => !v)}
            label={{
              collapsed: "View {count} more comments",
              expanded: "Show fewer comments",
            }}
          />
        </div>
      )}

      {isLoggedIn ? (
        <CommentComposer
          placeholder="Write a comment..."
          isPending={isPending}
          onSubmit={(content) => submitComment(content)}
        />
      ) : (
        <p className="text-sm text-slate-600">
          <Link
            href="/auth/login?callbackUrl=/home"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>{" "}
          to comment
        </p>
      )}
    </div>
  );
}
