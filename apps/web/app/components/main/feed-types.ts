export type FeedReaction = "LIKE" | "LOVE" | "HAHA" | "OW" | "ANGRY";

export type FeedPostAuthor = {
  name: string;
  roleLabel?: string;
  avatarUrl?: string | null;
};

export type FeedComment = {
  id: string;
  content: string;
  parentId?: string | null;
  authorName: string;
  authorAvatarUrl?: string | null;
  createdAtLabel: string;
  replies?: FeedComment[];
};

export type FeedPost = {
  id: string;
  author: FeedPostAuthor;
  createdAtLabel: string;
  content: string;
  imageUrls?: string[];
  comments?: FeedComment[];
  commentCount?: number;
  reactionCounts?: Partial<Record<FeedReaction, number>>;
  viewerReaction?: FeedReaction | null;
};

