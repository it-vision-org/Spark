import { CreatePostPanel } from "@/components/main/CreatePostPanel";
import { HomeFeed } from "@/components/main/HomeFeed";
import {
  HomeSidebar,
  type MyPostSummary,
} from "@/components/main/HomeSidebar";
import type { FeedPost } from "@/components/main/feed-types";
import { getCurrentUser, type AuthUser } from "@/actions/authActions";
import {
  buildCommentTree,
  countComments,
} from "@/lib/feed-comment-utils";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { db } from "@monkeyprint/db";

async function getHomeFeedPosts(): Promise<FeedPost[]> {
  const viewer = await getCurrentUser();

  const posts = await db.post.findMany({
    where: { isDeleted: false, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profileImage: true,
        },
      },
      comments: {
        where: { isDeleted: false, status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        take: 200,
        include: {
          author: {
            select: { name: true, profileImage: true },
          },
        },
      },
      reactions: {
        select: { type: true, userId: true },
      },
    },
  });

  return posts.map((post) => {
    const reactionCounts: FeedPost["reactionCounts"] = {};

    for (const reaction of post.reactions) {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] ?? 0) + 1;
    }

    const viewerReaction =
      post.reactions.find((reaction) => reaction.userId === viewer?.id)?.type ??
      null;

    const comments = buildCommentTree(post.comments);

    return {
      id: post.id,
      author: {
        name: post.isAnonymous
          ? "Anonymous Member"
          : post.author.name ?? "Unknown User",
        roleLabel: post.isAnonymous ? undefined : post.author.role,
        avatarUrl: post.isAnonymous ? null : post.author.profileImage,
      },
      createdAtLabel: formatRelativeTime(post.createdAt),
      content: post.content,
      imageUrls: post.imageUrls,
      comments,
      commentCount: countComments(comments),
      reactionCounts,
      viewerReaction,
    };
  });
}

async function getCreatePostContext(viewer: AuthUser | null) {
  if (!viewer?.id) return { isLoggedIn: false as const };

  const user = await db.user.findFirst({
    where: { id: viewer.id, isDeleted: false },
    select: { defaultAnonymous: true },
  });

  return {
    isLoggedIn: true as const,
    defaultAnonymous: user?.defaultAnonymous ?? false,
  };
}

async function getMyRecentPosts(userId: string): Promise<MyPostSummary[]> {
  const posts = await db.post.findMany({
    where: { authorId: userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      reactions: { select: { id: true } },
      comments: {
        where: { isDeleted: false, status: "APPROVED" },
        select: { id: true },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    contentPreview:
      post.content.length > 120
        ? `${post.content.slice(0, 120).trim()}…`
        : post.content,
    createdAtLabel: formatRelativeTime(post.createdAt),
    status: post.status,
    isAnonymous: post.isAnonymous,
    reactionCount: post.reactions.length,
    commentCount: post.comments.length,
  }));
}

export default async function HomePage() {
  const viewer = await getCurrentUser();

  const [posts, createPostContext, myPosts] = await Promise.all([
    getHomeFeedPosts(),
    getCreatePostContext(viewer),
    viewer?.id ? getMyRecentPosts(viewer.id) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <main className="w-full max-w-2xl">
          <div className="mb-5">
            <h1 className="text-lg font-bold text-slate-900">Home</h1>
            <p className="mt-1 text-sm text-slate-600">
              Community feed • posts, reactions, and discussions
            </p>
          </div>
          <CreatePostPanel
            isLoggedIn={createPostContext.isLoggedIn}
            defaultAnonymous={
              createPostContext.isLoggedIn
                ? createPostContext.defaultAnonymous
                : false
            }
          />
          <HomeFeed
            posts={posts}
            isLoggedIn={createPostContext.isLoggedIn}
          />
        </main>

        <aside className="hidden w-full max-w-sm lg:block">
          <HomeSidebar viewer={viewer} myPosts={myPosts} />
        </aside>
      </div>
    </div>
  );
}
