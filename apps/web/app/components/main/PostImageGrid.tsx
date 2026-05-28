"use client";

type PostImageGridProps = {
  imageUrls: string[];
};

export function PostImageGrid({ imageUrls }: PostImageGridProps) {
  if (!imageUrls.length) return null;

  const gridClass =
    imageUrls.length === 1
      ? "grid-cols-1"
      : imageUrls.length === 2
        ? "grid-cols-2"
        : "grid-cols-2";

  return (
    <div className={`mt-4 grid gap-2 ${gridClass}`}>
      {imageUrls.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          alt=""
          src={src}
          className={[
            "w-full rounded-xl border border-slate-200 object-cover",
            imageUrls.length === 1 ? "max-h-80" : "h-44",
            imageUrls.length >= 3 && index === 0 ? "col-span-2 h-48" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
