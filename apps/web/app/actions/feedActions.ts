"use server";

import { db, type PostType } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/actions/authActions";
import type { FeedComment, FeedReaction } from "@/components/main/feed-types";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { ActionResult } from "@/types";

const MAX_POST_IMAGES = 4;

export type CreatePostInput = {
  content: string;
  type: PostType;
  isAnonymous?: boolean;
  imageUrls?: string[];
};

export type CreatePostResult = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export type PostReactionState = {
  reactionCounts: Partial<Record<FeedReaction, number>>;
  viewerReaction: FeedReaction | null;
};

export async function togglePostReaction(
  postId: string,
  reaction: FeedReaction,
): Promise<ActionResult<PostReactionState>> {
  if (!postId) return { success: false, error: "Post ID is required" };

  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return { success: false, error: "You must be logged in to react" };
  }

  try {
    const post = await db.post.findFirst({
      where: { id: postId, isDeleted: false, status: "APPROVED" },
      select: { id: true },
    });
    if (!post) return { success: false, error: "Post not found" };

    const existing = await db.reaction.findUnique({
      where: {
        userId_postId: {
          userId: currentUser.id,
          postId,
        },
      },
    });

    if (existing?.type === reaction) {
      await db.reaction.delete({
        where: { userId_postId: { userId: currentUser.id, postId } },
      });
    } else if (existing) {
      await db.reaction.update({
        where: { userId_postId: { userId: currentUser.id, postId } },
        data: { type: reaction },
      });
    } else {
      await db.reaction.create({
        data: {
          type: reaction,
          userId: currentUser.id,
          postId,
        },
      });
    }

    const reactions = await db.reaction.findMany({
      where: { postId },
      select: { type: true, userId: true },
    });

    const reactionCounts: Partial<Record<FeedReaction, number>> = {};
    for (const r of reactions) {
      reactionCounts[r.type as FeedReaction] =
        (reactionCounts[r.type as FeedReaction] ?? 0) + 1;
    }

    const viewerReaction =
      reactions.find((r) => r.userId === currentUser.id)?.type ?? null;

    revalidatePath("/");
    revalidatePath("/home");

    return {
      success: true,
      data: {
        reactionCounts,
        viewerReaction: viewerReaction as FeedReaction | null,
      },
    };
  } catch (error) {
    console.error("[FEED] Error toggling reaction:", error);
    return { success: false, error: "Failed to update reaction" };
  }
}

export async function createPost(
  input: CreatePostInput,
): Promise<ActionResult<CreatePostResult>> {
  const content = input.content?.trim();
  if (!content) return { success: false, error: "Post content is required" };
  if (content.length > 5000) {
    return { success: false, error: "Post is too long (max 5000 characters)" };
  }
  if (!input.type) return { success: false, error: "Post type is required" };

  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return { success: false, error: "You must be logged in to create a post" };
  }

  try {
    const user = await db.user.findFirst({
      where: { id: currentUser.id, isDeleted: false },
      select: { id: true, defaultAnonymous: true },
    });
    if (!user) return { success: false, error: "User not found" };

    const imageUrls = (input.imageUrls ?? [])
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, MAX_POST_IMAGES);

    const post = await db.post.create({
      data: {
        content,
        type: input.type,
        status: "APPROVED",
        isAnonymous: input.isAnonymous ?? user.defaultAnonymous,
        authorId: user.id,
        imageUrls,
      },
      select: { id: true, status: true },
    });

    revalidatePath("/");
    revalidatePath("/home");

    return { success: true, data: post };
  } catch (error) {
    console.error("[FEED] Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null,
): Promise<ActionResult<FeedComment>> {
  const trimmed = content?.trim();
  if (!postId) return { success: false, error: "Post ID is required" };
  if (!trimmed) return { success: false, error: "Comment cannot be empty" };
  if (trimmed.length > 2000) {
    return { success: false, error: "Comment is too long (max 2000 characters)" };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return { success: false, error: "You must be logged in to comment" };
  }

  try {
    const post = await db.post.findFirst({
      where: { id: postId, isDeleted: false, status: "APPROVED" },
      select: { id: true },
    });
    if (!post) return { success: false, error: "Post not found" };

    if (parentId) {
      const parent = await db.comment.findFirst({
        where: {
          id: parentId,
          postId,
          isDeleted: false,
          status: "APPROVED",
        },
        select: { id: true },
      });
      if (!parent) {
        return { success: false, error: "Comment you are replying to was not found" };
      }
    }

    const user = await db.user.findFirst({
      where: { id: currentUser.id, isDeleted: false },
      select: { name: true, profileImage: true },
    });
    if (!user) return { success: false, error: "User not found" };

    const comment = await db.comment.create({
      data: {
        content: trimmed,
        status: "APPROVED",
        postId,
        authorId: currentUser.id,
        parentId: parentId ?? null,
      },
      select: { id: true, content: true, createdAt: true, parentId: true },
    });

    revalidatePath("/");
    revalidatePath("/home");

    return {
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        parentId: comment.parentId,
        authorName: user.name ?? "Member",
        authorAvatarUrl: user.profileImage,
        createdAtLabel: formatRelativeTime(comment.createdAt),
        replies: [],
      },
    };
  } catch (error) {
    console.error("[FEED] Error creating comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}
