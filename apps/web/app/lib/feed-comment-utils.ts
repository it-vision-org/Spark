import type { FeedComment } from "@/components/main/feed-types";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

export type DbCommentWithAuthor = {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  author: {
    name: string | null;
    profileImage: string | null;
  };
};

export function mapDbCommentToFeed(comment: DbCommentWithAuthor): FeedComment {
  return {
    id: comment.id,
    content: comment.content,
    parentId: comment.parentId,
    authorName: comment.author.name ?? "Member",
    authorAvatarUrl: comment.author.profileImage,
    createdAtLabel: formatRelativeTime(comment.createdAt),
    replies: [],
  };
}

export function buildCommentTree(comments: DbCommentWithAuthor[]): FeedComment[] {
  const nodes = new Map<string, FeedComment>();

  for (const comment of comments) {
    nodes.set(comment.id, mapDbCommentToFeed(comment));
  }

  const roots: FeedComment[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id)!;
    if (comment.parentId && nodes.has(comment.parentId)) {
      nodes.get(comment.parentId)!.replies!.push(node);
    } else if (!comment.parentId) {
      roots.push(node);
    }
  }

  return roots;
}

export function countComments(comments: FeedComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies ?? []),
    0,
  );
}

export function addCommentToTree(
  comments: FeedComment[],
  newComment: FeedComment,
): FeedComment[] {
  if (!newComment.parentId) {
    return [...comments, { ...newComment, replies: newComment.replies ?? [] }];
  }

  return comments.map((comment) => {
    if (comment.id === newComment.parentId) {
      return {
        ...comment,
        replies: [...(comment.replies ?? []), newComment],
      };
    }

    if (comment.replies?.length) {
      return {
        ...comment,
        replies: addCommentToTree(comment.replies, newComment),
      };
    }

    return comment;
  });
}
