"use client";

import { useEffect, useState, useTransition } from "react";
import {
  CalendarDays,
  MapPin,
  Images,
  Sparkles,
  CalendarCheck,
  CalendarX,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  ImageOff,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSpinner from "@/components/admin/AdminSpinner";
import AdminModal from "@/components/admin/AdminModal";
import ImageStrip from "@/components/admin/ImageStrip";
import FormField from "@/components/admin/FormField";
import { inputClass } from "@/components/admin/InputClass";
import Uploader from "@/components/admin/Uploader";
import {
  getAllEventsForAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/actions/eventsActions";
import {
  EventData,
  EventStatus,
  CreateEventInput,
  UpdateEventInput,
  EventForm,
  GroupedEvents,
  UploadResponse,
} from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const emptyForm = (): EventForm => ({
  title: "",
  description: "",
  coverImage: null,
  images: [],
  location: "",
  startDate: "",
  endDate: "",
});

const toDatetimeLocal = (date: Date): string =>
  new Date(date).toISOString().slice(0, 16);

const formFromData = (e: EventData): EventForm => ({
  title: e.title,
  description: e.description ?? "",
  coverImage: e.coverImage,
  images: e.images,
  location: e.location ?? "",
  startDate: toDatetimeLocal(e.startDate),
  endDate: e.endDate ? toDatetimeLocal(e.endDate) : "",
});

function groupEvents(events: EventData[]): GroupedEvents {
  return {
    present: events.filter((e) => e.status === "PRESENT"),
    upcoming: events.filter((e) => e.status === "UPCOMING"),
    past: events.filter((e) => e.status === "PAST"),
  };
}

function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<EventStatus, { label: string; badge: string }> = {
  PRESENT: { label: "Live", badge: "bg-[#dcfce7] text-[#166534]" },
  UPCOMING: { label: "Upcoming", badge: "bg-[#e0f2fe] text-[#0369a1]" },
  PAST: { label: "Past", badge: "bg-[#f1f5f9] text-[#64748b]" },
};

// ─── Event row ────────────────────────────────────────────────────────────────

function EventRow({
  event,
  onEdit,
  onDelete,
  isDeleting,
}: {
  event: EventData;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const thumb = event.coverImage ?? event.images[0] ?? null;
  const cfg = statusConfig[event.status];

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:shadow-sm transition group">
      <GripVertical className="w-4 h-4 text-[#cbd5e1] flex-shrink-0 cursor-grab" />

      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-[#f1f5f9]">
        {thumb ? (
          <Image src={thumb} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-[#94a3b8]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#0f172a] truncate">{event.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDateShort(event.startDate)}
            {event.endDate && ` → ${formatDateShort(event.endDate)}`}
          </span>
          {event.location && (
            <span className="text-xs text-[#94a3b8] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
          <span className="text-xs text-[#94a3b8] flex items-center gap-1">
            <Images className="w-3 h-3" />
            {event.images.length + (event.coverImage ? 1 : 0)}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span
        className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${cfg.badge}`}
      >
        {cfg.label}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onEdit}
          className="p-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e0f2fe] hover:border-[#bae6fd] text-[#475569] hover:text-[#0369a1] transition"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-red-50 hover:border-red-200 text-[#475569] hover:text-red-600 transition disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Modal body ────────────────────────────────────────────────────────────────

function EventModalBody({
  form,
  onChange,
}: {
  form: EventForm;
  onChange: <K extends keyof EventForm>(k: K, v: EventForm[K]) => void;
}) {
  const handleCoverUpload = (res: UploadResponse[]) => {
    if (res[0]?.ufsUrl) onChange("coverImage", res[0].ufsUrl);
  };

  const handleImagesUpload = (res: UploadResponse[]) => {
    const urls = res.map((r) => r.ufsUrl).filter(Boolean);
    onChange("images", [...form.images, ...urls]);
  };

  const removeImage = (i: number) =>
    onChange(
      "images",
      form.images.filter((_, idx) => idx !== i),
    );

  return (
    <>
      <FormField label="Title" required>
        <input
          className={inputClass}
          placeholder="e.g. Annual Science Fair"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </FormField>

      <FormField label="Description">
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="What's this event about?"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date & Time" required>
          <input
            type="datetime-local"
            className={inputClass}
            value={form.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
        </FormField>
        <FormField label="End Date & Time">
          <input
            type="datetime-local"
            className={inputClass}
            value={form.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Location">
        <input
          className={inputClass}
          placeholder="e.g. School Auditorium"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
        />
      </FormField>

      {/* Cover image */}
      <FormField label="Cover Image">
        {form.coverImage ? (
          <div className="flex items-center gap-3 mt-1">
            <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={form.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Uploader
                buttonText="Replace Cover"
                maxFileCount={1}
                handleUploadComplete={handleCoverUpload}
              />
              <button
                type="button"
                onClick={() => onChange("coverImage", null)}
                className="text-xs text-red-500 hover:text-red-700 transition text-left"
              >
                Remove cover
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <Uploader
              buttonText="Upload Cover"
              maxFileCount={1}
              handleUploadComplete={handleCoverUpload}
            />
          </div>
        )}
      </FormField>

      {/* Additional images */}
      <FormField label="Additional Images">
        <ImageStrip images={form.images} onRemove={removeImage} />
        <div className="mt-3">
          <Uploader
            buttonText={
              form.images.length > 0 ? "Add More Images" : "Upload Images"
            }
            maxFileCount={10}
            handleUploadComplete={handleImagesUpload}
          />
        </div>
        {form.images.length > 0 && (
          <p className="mt-2 text-xs text-[#94a3b8]">
            {form.images.length} image{form.images.length > 1 ? "s" : ""}{" "}
            uploaded. Hover to remove.
          </p>
        )}
      </FormField>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EventData | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm());
  const [isPending, startTransition] = useTransition();

  // ── Fetch ──
  const fetchAll = async () => {
    setLoading(true);
    const result = await getAllEventsForAdmin();
    if (result.success && result.data) setEvents(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const grouped = groupEvents(events);

  // ── Modal helpers ──
  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (e: EventData) => {
    setEditTarget(e);
    setForm(formFromData(e));
    setModalOpen(true);
  };

  const handleField = <K extends keyof EventForm>(k: K, v: EventForm[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // ── Save ──
  const handleSave = () => {
    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after the start date");
      return;
    }

    startTransition(async () => {
      if (editTarget) {
        const input: UpdateEventInput = {
          id: editTarget.id,
          title: form.title,
          description: form.description || null,
          coverImage: form.coverImage,
          images: form.images,
          location: form.location || null,
          startDate: new Date(form.startDate),
          endDate: form.endDate ? new Date(form.endDate) : null,
        };
        const result = await updateEvent(input);
        if (result.success) {
          toast.success("Event updated!");
          setModalOpen(false);
          fetchAll();
        } else {
          toast.error(result.error ?? "Failed to update");
        }
      } else {
        const input: CreateEventInput = {
          title: form.title,
          description: form.description || null,
          coverImage: form.coverImage,
          images: form.images,
          location: form.location || null,
          startDate: new Date(form.startDate),
          endDate: form.endDate ? new Date(form.endDate) : null,
        };
        const result = await createEvent(input);
        if (result.success) {
          toast.success("Event created!");
          setModalOpen(false);
          fetchAll();
        } else {
          toast.error(result.error ?? "Failed to create");
        }
      }
    });
  };

  // ── Delete ──
  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteEvent(id);
      if (result.success) {
        toast.success("Event deleted");
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
      setDeletingId(null);
    });
  };

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminPageHeader
        title="Events"
        description="Manage club events — upcoming, present, and past"
        addLabel="Add Event"
        onAdd={openAdd}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total"
            value={events.length}
            icon={CalendarDays}
            color="bg-[#e0f2fe] text-[#0369a1]"
          />
          <AdminStatCard
            label="Live Now"
            value={grouped.present.length}
            icon={Sparkles}
            color="bg-[#dcfce7] text-[#166534]"
          />
          <AdminStatCard
            label="Upcoming"
            value={grouped.upcoming.length}
            icon={CalendarCheck}
            color="bg-[#fef9c3] text-[#854d0e]"
          />
          <AdminStatCard
            label="Past"
            value={grouped.past.length}
            icon={CalendarX}
            color="bg-[#f1f5f9] text-[#64748b]"
          />
        </div>

        {loading && <AdminSpinner />}

        {!loading && (
          <>
            {/* Live now */}
            {grouped.present.length > 0 && (
              <section>
                <AdminSectionHeader
                  icon={<Sparkles className="w-5 h-5 text-[#166534]" />}
                  title="Happening Now"
                  count={grouped.present.length}
                  badgeColor="bg-[#dcfce7] text-[#166534]"
                />
                <div className="space-y-3">
                  {grouped.present.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      onEdit={() => openEdit(e)}
                      onDelete={() => handleDelete(e.id)}
                      isDeleting={deletingId === e.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            <section>
              <AdminSectionHeader
                icon={<CalendarCheck className="w-5 h-5 text-[#0369a1]" />}
                title="Upcoming"
                count={grouped.upcoming.length}
                badgeColor="bg-[#e0f2fe] text-[#0369a1]"
              />
              {grouped.upcoming.length === 0 ? (
                <AdminEmptyState label="No upcoming events" />
              ) : (
                <div className="space-y-3">
                  {grouped.upcoming.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      onEdit={() => openEdit(e)}
                      onDelete={() => handleDelete(e.id)}
                      isDeleting={deletingId === e.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            {grouped.past.length > 0 && (
              <section>
                <AdminSectionHeader
                  icon={<CalendarX className="w-5 h-5 text-[#64748b]" />}
                  title="Past Events"
                  count={grouped.past.length}
                  badgeColor="bg-[#f1f5f9] text-[#64748b]"
                />
                <div className="space-y-3">
                  {grouped.past.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      onEdit={() => openEdit(e)}
                      onDelete={() => handleDelete(e.id)}
                      isDeleting={deletingId === e.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        title={editTarget ? "Edit Event" : "Add Event"}
        subtitle={
          editTarget ? "Update the event details" : "Create a new club event"
        }
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saveLabel={editTarget ? "Save Changes" : "Create Event"}
        canSave={!!form.title.trim() && !!form.startDate}
        isPending={isPending}
      >
        <EventModalBody form={form} onChange={handleField} />
      </AdminModal>
    </div>
  );
}
