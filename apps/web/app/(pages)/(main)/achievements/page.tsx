"use client";

import { useEffect, useState } from "react";
import { Trophy, Calendar, Tag, Sparkles, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ImageGallery from "@/components/main/ImageGallery";
import ImageCarousel from "@/components/main/ImageCarousel";
import PageHero from "@/components/main/PageHero";
import PageSpinner from "@/components/main/PageSpinner";
import PageEmptyState from "@/components/main/PageEmptyState";
import SectionBadge from "@/components/main/SectionBadge";
import { getPublishedAchievements } from "@/actions/achievementsActions";
import { AchievementData, CarouselState } from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date | null, locale: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CategoryTag({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-semibold">
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

function AchievementCard({
  achievement,
  locale,
  isRTL,
  index,
  onImageClick,
}: {
  achievement: AchievementData;
  locale: string;
  isRTL: boolean;
  index: number;
  onImageClick: (startIndex: number) => void;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`grid gap-8 lg:gap-12 items-center ${
        isEven ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
      }`}
    >
      <div className={`${!isEven && !isRTL ? "lg:order-2" : ""}`}>
        <ImageGallery
          images={achievement.images}
          title={achievement.title}
          onImageClick={onImageClick}
        />
      </div>

      <div
        className={`${!isEven && !isRTL ? "lg:order-1" : ""} ${
          isRTL ? "text-right" : ""
        }`}
      >
        <div
          className={`flex flex-wrap items-center gap-3 mb-4 ${
            isRTL ? "justify-end" : ""
          }`}
        >
          {achievement.category && (
            <CategoryTag category={achievement.category} />
          )}
          {achievement.date && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs text-[#64748b] font-medium ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(achievement.date, locale)}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-[#0f172a] leading-snug">
          {achievement.title}
        </h3>
        <p className="mt-3 text-[#475569] leading-relaxed">
          {achievement.description}
        </p>

        <div
          className={`mt-5 flex items-center gap-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#0ea5e9]" />
          <Star className="w-4 h-4 text-[#fbbf24]" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const t = useTranslations("AchievementsPage");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [carousel, setCarousel] = useState<CarouselState | null>(null);

  useEffect(() => {
    getPublishedAchievements().then((result) => {
      if (result.success && result.data) setAchievements(result.data);
      setLoading(false);
    });
  }, []);

  const openCarousel = (achievement: AchievementData, startIndex: number) => {
    if (achievement.images.length === 0) return;
    setCarousel({
      images: achievement.images,
      startIndex,
      title: achievement.title,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      {/* ── Hero ── */}
      <PageHero
        badge={t("Hero.Badge")}
        badgeIcon={<Trophy className="w-4 h-4 text-[#fbbf24]" />}
        title={t("Hero.Title")}
        highlight={t("Hero.Highlight")}
        description={t("Hero.Description")}
        stats={
          !loading
            ? [{ value: achievements.length, label: t("Hero.StatLabel") }]
            : undefined
        }
      />

      {/* ── List ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <PageSpinner />
          ) : achievements.length === 0 ? (
            <PageEmptyState
              icon={<Trophy className="w-8 h-8 text-[#0369a1]" />}
              title={t("Empty.Title")}
              description={t("Empty.Description")}
            />
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {achievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  locale={locale}
                  isRTL={isRTL}
                  index={index}
                  onImageClick={(startIndex) =>
                    openCarousel(achievement, startIndex)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats strip ── */}
      {!loading && achievements.length > 0 && (
        <section className="py-14 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <SectionBadge label={t("Stats.Badge")} />
              <h2 className="mt-3 text-2xl font-bold text-[#0f172a]">
                {t("Stats.Title")}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Trophy,
                  value: achievements.length,
                  label: t("Stats.Total"),
                },
                {
                  icon: Tag,
                  value: new Set(
                    achievements.map((a) => a.category).filter(Boolean),
                  ).size,
                  label: t("Stats.Categories"),
                },
                {
                  icon: Sparkles,
                  value: achievements.filter(
                    (a) =>
                      a.date &&
                      new Date(a.date).getFullYear() ===
                        new Date().getFullYear(),
                  ).length,
                  label: t("Stats.ThisYear"),
                },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e0f2fe] mb-3">
                    <Icon className="w-6 h-6 text-[#0369a1]" />
                  </div>
                  <p className="text-3xl font-bold text-[#0f172a]">{value}</p>
                  <p className="mt-1 text-sm text-[#475569]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Carousel ── */}
      {carousel && (
        <ImageCarousel
          images={carousel.images}
          initialIndex={carousel.startIndex}
          alt={carousel.title}
          onClose={() => setCarousel(null)}
        />
      )}
    </div>
  );
}
