import Link from "next/link";
import { FileText, MessageCircle, Sparkles, ThumbsUp } from "lucide-react";

import type { AuthUser } from "@/actions/authActions";
import { Button } from "@/components/ui/button";

export type MyPostSummary = {
  id: string;
  contentPreview: string;
  createdAtLabel: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isAnonymous: boolean;
  reactionCount: number;
  commentCount: number;
};

const statusStyles: Record<
  MyPostSummary["status"],
  { label: string; className: string }
> = {
  APPROVED: {
    label: "Live",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-100",
  },
};

function GuestSidebar() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold">Join the conversation</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Log in to share posts, react, and join discussions with the Spark
          community.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/login?callbackUrl=/home">Log in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup">Create account</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">What you can do</h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
            Share thoughts, advice, and motivation
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
            React to posts from other members
          </li>
          <li className="flex gap-2">
            <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
            Comment and reply in threads
          </li>
        </ul>
      </div>
    </div>
  );
}

function MyPostsSidebar({
  viewer,
  myPosts,
}: {
  viewer: AuthUser;
  myPosts: MyPostSummary[];
}) {
  const displayName = viewer.name?.trim() || "Member";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          Welcome back
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">{displayName}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {myPosts.length === 0
            ? "You haven't posted yet — share something with the community."
            : `You've shared ${myPosts.length} recent post${myPosts.length === 1 ? "" : "s"} on the feed.`}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Your posts</h2>
          <span className="text-xs text-slate-500">Latest</span>
        </div>

        {myPosts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Use <span className="font-medium text-slate-700">Create post</span>{" "}
            to publish your first one.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {myPosts.map((post) => {
              const status = statusStyles[post.status];
              return (
                <li key={post.id}>
                  <a
                    href={`#post-${post.id}`}
                    className="block rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm text-slate-800">
                        {post.contentPreview}
                      </p>
                      <span
                        className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{post.createdAtLabel}</span>
                      {post.isAnonymous ? (
                        <span>Anonymous</span>
                      ) : null}
                      <span>{post.reactionCount} reactions</span>
                      <span>{post.commentCount} comments</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Explore</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Upcoming events
            </Link>
          </li>
          <li>
            <Link
              href="/achievements"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Club achievements
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              About Spark
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function HomeSidebar({
  viewer,
  myPosts,
}: {
  viewer: AuthUser | null;
  myPosts: MyPostSummary[];
}) {
  if (!viewer) {
    return <GuestSidebar />;
  }

  return <MyPostsSidebar viewer={viewer} myPosts={myPosts} />;
}
