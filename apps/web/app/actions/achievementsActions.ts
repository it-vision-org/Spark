"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";
import {
  AchievementData,
  CreateAchievementInput,
  UpdateAchievementInput,
  ActionResult,
} from "@/types";

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getPublishedAchievements(): Promise<
  ActionResult<AchievementData[]>
> {
  try {
    const achievements = await db.achievement.findMany({
      where: { isPublished: true, isDeleted: false },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: achievements };
  } catch (error) {
    console.error(
      "[ACHIEVEMENTS] Error fetching published achievements:",
      error,
    );
    return { success: false, error: "Failed to fetch achievements" };
  }
}

export async function getAllAchievementsForAdmin(): Promise<
  ActionResult<AchievementData[]>
> {
  try {
    const achievements = await db.achievement.findMany({
      where: { isDeleted: false },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: achievements };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error fetching all achievements:", error);
    return { success: false, error: "Failed to fetch achievements" };
  }
}

export async function getAchievementById(
  id: string,
): Promise<ActionResult<AchievementData>> {
  if (!id) return { success: false, error: "Achievement ID is required" };
  try {
    const achievement = await db.achievement.findFirst({
      where: { id, isDeleted: false },
    });
    if (!achievement) return { success: false, error: "Achievement not found" };
    return { success: true, data: achievement };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error fetching achievement:", error);
    return { success: false, error: "Failed to fetch achievement" };
  }
}

// ─── Create ────────────────────────────────────────────────────────────────────

export async function createAchievement(
  input: CreateAchievementInput,
): Promise<ActionResult<AchievementData>> {
  const title = input.title?.trim();
  const description = input.description?.trim();

  if (!title || !description) {
    return { success: false, error: "Title and description are required" };
  }

  try {
    const lastItem = await db.achievement.findFirst({
      where: { isDeleted: false },
      orderBy: { order: "desc" },
    });

    const achievement = await db.achievement.create({
      data: {
        title,
        description,
        images: input.images ?? [],
        date: input.date ?? null,
        category: input.category?.trim() ?? null,
        order: input.order ?? (lastItem ? lastItem.order + 1 : 0),
        isPublished: input.isPublished ?? true,
      },
    });

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return { success: true, data: achievement };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error creating achievement:", error);
    return { success: false, error: "Failed to create achievement" };
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export async function updateAchievement(
  input: UpdateAchievementInput,
): Promise<ActionResult<AchievementData>> {
  if (!input.id) return { success: false, error: "Achievement ID is required" };

  try {
    const achievement = await db.achievement.update({
      where: { id: input.id },
      data: {
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.description !== undefined && {
          description: input.description.trim(),
        }),
        ...(input.images !== undefined && { images: input.images }),
        ...(input.date !== undefined && { date: input.date }),
        ...(input.category !== undefined && {
          category: input.category?.trim() ?? null,
        }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.isPublished !== undefined && {
          isPublished: input.isPublished,
        }),
      },
    });

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return { success: true, data: achievement };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error updating achievement:", error);
    return { success: false, error: "Failed to update achievement" };
  }
}

// ─── Toggle publish ────────────────────────────────────────────────────────────

export async function toggleAchievementPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult<AchievementData>> {
  if (!id) return { success: false, error: "Achievement ID is required" };

  try {
    const achievement = await db.achievement.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return { success: true, data: achievement };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error toggling achievement:", error);
    return { success: false, error: "Failed to update achievement" };
  }
}

// ─── Delete (soft) ─────────────────────────────────────────────────────────────

export async function deleteAchievement(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Achievement ID is required" };

  try {
    await db.achievement.update({
      where: { id },
      data: { isDeleted: true },
    });

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error deleting achievement:", error);
    return { success: false, error: "Failed to delete achievement" };
  }
}

// ─── Reorder ───────────────────────────────────────────────────────────────────

export async function reorderAchievements(
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.achievement.update({ where: { id }, data: { order: index } }),
      ),
    );

    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (error) {
    console.error("[ACHIEVEMENTS] Error reordering achievements:", error);
    return { success: false, error: "Failed to reorder achievements" };
  }
}
