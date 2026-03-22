"use client";

import { useEffect, useState, useTransition } from "react";
import { Trophy, Tag, Calendar, Eye, EyeOff, Images } from "lucide-react";
import { toast } from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSpinner from "@/components/admin/AdminSpinner";
import AdminItemRow from "@/components/admin/AdminItemRow";
import AdminModal from "@/components/admin/AdminModal";
import ImageStrip from "@/components/admin/ImageStrip";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import FormField from "@/components/admin/FormField";
import { inputClass } from "@/components/admin/InputClass";
import Uploader from "@/components/admin/Uploader";
import {
  getAllAchievementsForAdmin,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementPublished,
} from "@/actions/achievementsActions";
import {
  AchievementData,
  AchievementForm,
  CreateAchievementInput,
  UpdateAchievementInput,
  UploadResponse,
} from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const emptyForm = (): AchievementForm => ({
  title: "",
  description: "",
  images: [],
  date: "",
  category: "",
  isPublished: true,
});

const formFromData = (a: AchievementData): AchievementForm => ({
  title: a.title,
  description: a.description,
  images: a.images,
  date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
  category: a.category ?? "",
  isPublished: a.isPublished,
});

// ─── Modal body ────────────────────────────────────────────────────────────────

function AchievementModalBody({
  form,
  onChange,
}: {
  form: AchievementForm;
  onChange: <K extends keyof AchievementForm>(
    k: K,
    v: AchievementForm[K],
  ) => void;
}) {
  const handleUpload = (res: UploadResponse[]) => {
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
          placeholder="e.g. Regional Science Fair Winner"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </FormField>

      <FormField label="Description" required>
        <textarea
          className={`${inputClass} resize-none`}
          rows={4}
          placeholder="Describe the achievement in detail..."
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category">
          <input
            className={inputClass}
            placeholder="e.g. Competition"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
          />
        </FormField>
        <FormField label="Date">
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Images">
        <ImageStrip images={form.images} onRemove={removeImage} />
        <div className="mt-3">
          <Uploader
            buttonText={
              form.images.length > 0 ? "Add More Images" : "Upload Images"
            }
            maxFileCount={10}
            handleUploadComplete={handleUpload}
          />
        </div>
        {form.images.length > 0 && (
          <p className="mt-2 text-xs text-[#94a3b8]">
            {form.images.length} image{form.images.length > 1 ? "s" : ""}{" "}
            uploaded. Hover to remove.
          </p>
        )}
      </FormField>

      <FormField label="Visibility">
        <VisibilityToggle
          value={form.isPublished}
          onChange={(v) => onChange("isPublished", v)}
        />
      </FormField>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AchievementData | null>(null);
  const [form, setForm] = useState<AchievementForm>(emptyForm());
  const [isPending, startTransition] = useTransition();

  // ── Fetch ──
  const fetchAll = async () => {
    setLoading(true);
    const result = await getAllAchievementsForAdmin();
    if (result.success && result.data) setAchievements(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Derived ──
  const published = achievements.filter((a) => a.isPublished);
  const hidden = achievements.filter((a) => !a.isPublished);

  // ── Modal helpers ──
  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (a: AchievementData) => {
    setEditTarget(a);
    setForm(formFromData(a));
    setModalOpen(true);
  };

  const handleField = <K extends keyof AchievementForm>(
    k: K,
    v: AchievementForm[K],
  ) => setForm((prev) => ({ ...prev, [k]: v }));

  // ── Save ──
  const handleSave = () => {
    startTransition(async () => {
      if (editTarget) {
        const input: UpdateAchievementInput = {
          id: editTarget.id,
          title: form.title,
          description: form.description,
          images: form.images,
          date: form.date ? new Date(form.date) : null,
          category: form.category || null,
          isPublished: form.isPublished,
        };
        const result = await updateAchievement(input);
        if (result.success) {
          toast.success("Achievement updated!");
          setModalOpen(false);
          fetchAll();
        } else {
          toast.error(result.error ?? "Failed to update");
        }
      } else {
        const input: CreateAchievementInput = {
          title: form.title,
          description: form.description,
          images: form.images,
          date: form.date ? new Date(form.date) : null,
          category: form.category || null,
          isPublished: form.isPublished,
        };
        const result = await createAchievement(input);
        if (result.success) {
          toast.success("Achievement created!");
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
      const result = await deleteAchievement(id);
      if (result.success) {
        toast.success("Achievement deleted");
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
      setDeletingId(null);
    });
  };

  // ── Toggle publish ──
  const handleToggle = (a: AchievementData) => {
    setTogglingId(a.id);
    startTransition(async () => {
      const result = await toggleAchievementPublished(a.id, !a.isPublished);
      if (result.success) {
        toast.success(
          a.isPublished ? "Achievement hidden" : "Achievement published",
        );
        fetchAll();
      } else {
        toast.error(result.error ?? "Failed to update");
      }
      setTogglingId(null);
    });
  };

  // ── Row meta renderer ──
  const renderMeta = (a: AchievementData) => (
    <>
      {a.category && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]">
          {a.category}
        </span>
      )}
      {a.date && (
        <span className="text-xs text-[#94a3b8] flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(a.date).toLocaleDateString()}
        </span>
      )}
      <span className="text-xs text-[#94a3b8] flex items-center gap-1">
        <Images className="w-3 h-3" />
        {a.images.length}
      </span>
    </>
  );

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminPageHeader
        title="Achievements"
        description="Manage club achievements and milestones"
        addLabel="Add Achievement"
        onAdd={openAdd}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total"
            value={achievements.length}
            icon={Trophy}
            color="bg-[#fef9c3] text-[#854d0e]"
          />
          <AdminStatCard
            label="Published"
            value={published.length}
            icon={Eye}
            color="bg-[#dcfce7] text-[#166534]"
          />
          <AdminStatCard
            label="Hidden"
            value={hidden.length}
            icon={EyeOff}
            color="bg-[#f1f5f9] text-[#64748b]"
          />
          <AdminStatCard
            label="Categories"
            value={
              new Set(achievements.map((a) => a.category).filter(Boolean)).size
            }
            icon={Tag}
            color="bg-[#e0f2fe] text-[#0369a1]"
          />
        </div>

        {loading && <AdminSpinner />}

        {!loading && (
          <>
            {/* Published */}
            <section>
              <AdminSectionHeader
                icon={<Eye className="w-5 h-5 text-[#166534]" />}
                title="Published"
                count={published.length}
                badgeColor="bg-[#dcfce7] text-[#166534]"
              />
              {published.length === 0 ? (
                <AdminEmptyState label="No published achievements yet" />
              ) : (
                <div className="space-y-3">
                  {published.map((a) => (
                    <AdminItemRow
                      key={a.id}
                      thumbnail={a.images[0] ?? null}
                      title={a.title}
                      meta={renderMeta(a)}
                      isPublished={a.isPublished}
                      isDeleting={deletingId === a.id}
                      isToggling={togglingId === a.id}
                      onEdit={() => openEdit(a)}
                      onDelete={() => handleDelete(a.id)}
                      onTogglePublish={() => handleToggle(a)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Hidden */}
            {hidden.length > 0 && (
              <section>
                <AdminSectionHeader
                  icon={<EyeOff className="w-5 h-5 text-[#64748b]" />}
                  title="Hidden"
                  count={hidden.length}
                  badgeColor="bg-[#f1f5f9] text-[#64748b]"
                />
                <div className="space-y-3">
                  {hidden.map((a) => (
                    <AdminItemRow
                      key={a.id}
                      thumbnail={a.images[0] ?? null}
                      title={a.title}
                      meta={renderMeta(a)}
                      isPublished={a.isPublished}
                      isDeleting={deletingId === a.id}
                      isToggling={togglingId === a.id}
                      onEdit={() => openEdit(a)}
                      onDelete={() => handleDelete(a.id)}
                      onTogglePublish={() => handleToggle(a)}
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
        title={editTarget ? "Edit Achievement" : "Add Achievement"}
        subtitle={
          editTarget
            ? "Update the achievement details"
            : "Create a new achievement entry"
        }
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saveLabel={editTarget ? "Save Changes" : "Create Achievement"}
        canSave={!!form.title.trim() && !!form.description.trim()}
        isPending={isPending}
      >
        <AchievementModalBody form={form} onChange={handleField} />
      </AdminModal>
    </div>
  );
}
