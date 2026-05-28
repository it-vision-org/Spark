"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, PenLine, X } from "lucide-react";
import toast from "react-hot-toast";
import type { PostType } from "@monkeyprint/db";

import { createPost } from "@/actions/feedActions";
import ImageStrip from "@/components/admin/ImageStrip";
import Uploader from "@/components/admin/Uploader";
import { Button } from "@/components/ui/button";
import SelectInput from "@/components/ui/SelectInput";
import TextareaInput from "@/components/ui/TextareaInput";
import type { UploadResponse } from "@/types";

const MAX_POST_IMAGES = 4;

const POST_TYPES: Array<{ value: PostType; label: string }> = [
  { value: "MOTIVATION", label: "Motivation" },
  { value: "GOOD_THOUGHT", label: "Good thought" },
  { value: "BAD_THOUGHT", label: "Bad thought" },
  { value: "MORAL_LESSON", label: "Moral lesson" },
  { value: "ADVICE", label: "Advice" },
  { value: "OTHER", label: "Other" },
];

type CreatePostPanelProps = {
  isLoggedIn: boolean;
  defaultAnonymous?: boolean;
};

export function CreatePostPanel({
  isLoggedIn,
  defaultAnonymous = false,
}: CreatePostPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("MOTIVATION");
  const [isAnonymous, setIsAnonymous] = useState(defaultAnonymous);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setContent("");
    setType("MOTIVATION");
    setIsAnonymous(defaultAnonymous);
    setImageUrls([]);
  };

  const handleImageUpload = (res: UploadResponse[]) => {
    const urls = res.map((r) => r.ufsUrl).filter(Boolean);
    setImageUrls((prev) => [...prev, ...urls].slice(0, MAX_POST_IMAGES));
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await createPost({
        content,
        type,
        isAnonymous,
        imageUrls,
      });

      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to create post");
        return;
      }

      toast.success("Post published!");

      handleClose();
      router.refresh();
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Log in to share a post with the community.
        </p>
        <Button asChild className="mt-3" size="sm">
          <Link href="/auth/login?callbackUrl=/home">Log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
        >
          <PenLine className="h-4 w-4" />
          Create post
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="create-post-title"
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2
                  id="create-post-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Create post
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Share with the community
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Type
                </label>
                <SelectInput
                  value={type}
                  onChange={(e) => setType(e.target.value as PostType)}
                >
                  {POST_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectInput>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Content
                </label>
                <TextareaInput
                  rows={6}
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={5000}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Photos (optional)
                </label>
                <ImageStrip
                  images={imageUrls}
                  onRemove={(index) =>
                    setImageUrls((prev) => prev.filter((_, i) => i !== index))
                  }
                />
                {imageUrls.length < MAX_POST_IMAGES ? (
                  <Uploader
                    handleUploadComplete={handleImageUpload}
                    buttonText={
                      imageUrls.length === 0 ? "Add photos" : "Add more photos"
                    }
                    maxFileCount={MAX_POST_IMAGES - imageUrls.length}
                  />
                ) : null}
                <p className="mt-1.5 text-xs text-slate-500">
                  Up to {MAX_POST_IMAGES} images per post
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Post anonymously
              </label>
            </div>

            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={isPending || !content.trim()}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Submit
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
