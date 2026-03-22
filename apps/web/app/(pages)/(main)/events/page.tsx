"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  CalendarX,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ImageCarousel from "@/components/main/ImageCarousel";
import PageHero from "@/components/main/PageHero";
import PageSpinner from "@/components/main/PageSpinner";
import PageEmptyState from "@/components/main/PageEmptyState";
import SectionBadge from "@/components/main/SectionBadge";
import ImageGallery from "@/components/main/ImageGallery";
import { getPublishedEvents } from "@/actions/eventsActions";
import { EventData, EventStatus, CarouselState, GroupedEvents } from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDateShort(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function groupEvents(events: EventData[]): GroupedEvents {
  return {
    upcoming: events.filter((e) => e.status === "UPCOMING"),
    present: events.filter((e) => e.status === "PRESENT"),
    past: events.filter((e) => e.status === "PAST"),
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  EventStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  UPCOMING: {
    label: "Upcoming",
    bg: "bg-[#e0f2fe]",
    text: "text-[#0369a1]",
    dot: "bg-[#0369a1]",
  },
  PRESENT: {
    label: "Happening Now",
    bg: "bg-[#dcfce7]",
    text: "text-[#166534]",
    dot: "bg-[#22c55e]",
  },
  PAST: {
    label: "Past",
    bg: "bg-[#f1f5f9]",
    text: "text-[#64748b]",
    dot: "bg-[#94a3b8]",
  },
};

function StatusBadge({ status }: { status: EventStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
  locale,
  isRTL,
  onImageClick,
}: {
  event: EventData;
  locale: string;
  isRTL: boolean;
  onImageClick: (startIndex: number) => void;
}) {
  const isPast = event.status === "PAST";
  const allImages = [
    ...(event.coverImage ? [event.coverImage] : []),
    ...event.images.filter((img) => img !== event.coverImage),
  ];

  return (
    <div
      className={`rounded-3xl border border-[#e2e8f0] bg-white overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isPast ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Image area */}
      <div className="relative">
        <ImageGallery
          images={allImages}
          title={event.title}
          onImageClick={onImageClick}
        />
        {/* Status badge overlaid on image */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={event.status} />
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${isRTL ? "text-right" : ""}`}>
        {/* Date range */}
        <div
          className={`flex items-center gap-2 text-xs text-[#64748b] font-medium mb-3 ${
            isRTL ? "flex-row-reverse justify-end" : ""
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDateShort(event.startDate, locale)}</span>
          {event.endDate && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span>{formatDateShort(event.endDate, locale)}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#0f172a] leading-snug mb-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">
            {event.description}
          </p>
        )}

        {event.location && (
          <div
            className={`mt-4 flex items-center gap-2 text-xs text-[#64748b] ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#2563eb]" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function EventSection({
  title,
  icon,
  events,
  locale,
  isRTL,
  onImageClick,
  highlight,
}: {
  title: string;
  icon: React.ReactNode;
  events: EventData[];
  locale: string;
  isRTL: boolean;
  onImageClick: (event: EventData, startIndex: number) => void;
  highlight?: boolean;
}) {
  if (events.length === 0) return null;

  return (
    <div>
      {/* Section heading */}
      <div
        className={`flex items-center gap-3 mb-8 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`p-2 rounded-xl ${
            highlight ? "bg-[#dcfce7]" : "bg-[#f1f5f9]"
          }`}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            highlight
              ? "bg-[#dcfce7] text-[#166534]"
              : "bg-[#f1f5f9] text-[#64748b]"
          }`}
        >
          {events.length}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const allImages = [
            ...(event.coverImage ? [event.coverImage] : []),
            ...event.images.filter((img) => img !== event.coverImage),
          ];
          return (
            <EventCard
              key={event.id}
              event={event}
              locale={locale}
              isRTL={isRTL}
              onImageClick={(startIndex) => onImageClick(event, startIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const t = useTranslations("EventsPage");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [carousel, setCarousel] = useState<CarouselState | null>(null);

  useEffect(() => {
    getPublishedEvents().then((result) => {
      if (result.success && result.data) setEvents(result.data);
      setLoading(false);
    });
  }, []);

  const grouped = groupEvents(events);

  const openCarousel = (event: EventData, startIndex: number) => {
    const allImages = [
      ...(event.coverImage ? [event.coverImage] : []),
      ...event.images.filter((img) => img !== event.coverImage),
    ];
    if (allImages.length === 0) return;
    setCarousel({ images: allImages, startIndex, title: event.title });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      {/* ── Hero ── */}
      <PageHero
        badge={t("Hero.Badge")}
        badgeIcon={<CalendarDays className="w-4 h-4 text-[#fbbf24]" />}
        title={t("Hero.Title")}
        highlight={t("Hero.Highlight")}
        description={t("Hero.Description")}
        stats={
          !loading
            ? [
                {
                  value: grouped.upcoming.length + grouped.present.length,
                  label: t("Hero.StatUpcoming"),
                },
                { value: grouped.past.length, label: t("Hero.StatPast") },
              ]
            : undefined
        }
      />

      {/* ── Events ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {loading ? (
            <PageSpinner />
          ) : events.length === 0 ? (
            <PageEmptyState
              icon={<CalendarDays className="w-8 h-8 text-[#0369a1]" />}
              title={t("Empty.Title")}
              description={t("Empty.Description")}
            />
          ) : (
            <>
              {/* Present */}
              <EventSection
                title={t("Section.Present")}
                icon={<Sparkles className="w-5 h-5 text-[#166534]" />}
                events={grouped.present}
                locale={locale}
                isRTL={isRTL}
                onImageClick={openCarousel}
                highlight
              />

              {/* Upcoming */}
              <EventSection
                title={t("Section.Upcoming")}
                icon={<CalendarCheck className="w-5 h-5 text-[#0369a1]" />}
                events={grouped.upcoming}
                locale={locale}
                isRTL={isRTL}
                onImageClick={openCarousel}
              />

              {/* Past */}
              <EventSection
                title={t("Section.Past")}
                icon={<CalendarX className="w-5 h-5 text-[#94a3b8]" />}
                events={grouped.past}
                locale={locale}
                isRTL={isRTL}
                onImageClick={openCarousel}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Stats strip ── */}
      {!loading && events.length > 0 && (
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
                  icon: Sparkles,
                  value: grouped.present.length,
                  label: t("Stats.Present"),
                  bg: "bg-[#dcfce7]",
                  iconColor: "text-[#166534]",
                },
                {
                  icon: CalendarCheck,
                  value: grouped.upcoming.length,
                  label: t("Stats.Upcoming"),
                  bg: "bg-[#e0f2fe]",
                  iconColor: "text-[#0369a1]",
                },
                {
                  icon: CalendarX,
                  value: grouped.past.length,
                  label: t("Stats.Past"),
                  bg: "bg-[#f1f5f9]",
                  iconColor: "text-[#64748b]",
                },
              ].map(({ icon: Icon, value, label, bg, iconColor }) => (
                <div
                  key={label}
                  className="p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] text-center"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-3`}
                  >
                    <Icon className={`w-6 h-6 ${iconColor}`} />
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
