"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/authActions";
import {
  EventStatus,
  EventData,
  ActionResult,
  CreateEventInput,
  UpdateEventInput,
} from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Derives the EventStatus from the current date vs. the event's start/end dates.
 * - UPCOMING : startDate is in the future
 * - PRESENT  : startDate has passed but endDate hasn't (or no endDate & same calendar day)
 * - PAST     : endDate has passed (or startDate passed when no endDate)
 */
function deriveStatus(startDate: Date, endDate: Date | null): EventStatus {
  const now = new Date();

  if (now < startDate) return "UPCOMING";

  if (endDate) {
    return now <= endDate ? "PRESENT" : "PAST";
  }

  // No endDate: treat the event as present for the same calendar day
  const startDay = new Date(startDate);
  startDay.setHours(0, 0, 0, 0);
  const nextDay = new Date(startDay);
  nextDay.setDate(nextDay.getDate() + 1);

  return now < nextDay ? "PRESENT" : "PAST";
}

/**
 * Syncs the stored EventStatus of all non-deleted events based on the current date.
 * Call this before any read that groups by status, so the DB always reflects reality.
 */
async function syncEventStatuses(): Promise<void> {
  const events = await db.event.findMany({
    where: { isDeleted: false },
    select: { id: true, startDate: true, endDate: true, status: true },
  });

  const updates = events
    .map((e) => ({ id: e.id, newStatus: deriveStatus(e.startDate, e.endDate) }))
    .filter((e) => e.newStatus !== e.newStatus); // only those that changed

  // Run all updates in parallel — fine for small collections
  await Promise.all(
    events
      .filter((e) => {
        const derived = deriveStatus(e.startDate, e.endDate);
        return derived !== e.status;
      })
      .map((e) =>
        db.event.update({
          where: { id: e.id },
          data: { status: deriveStatus(e.startDate, e.endDate) },
        }),
      ),
  );
}

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getPublishedEvents(): Promise<ActionResult<EventData[]>> {
  try {
    await syncEventStatuses();
    const events = await db.event.findMany({
      where: { isDeleted: false },
      orderBy: { startDate: "asc" },
    });
    return { success: true, data: events as EventData[] };
  } catch (error) {
    console.error("[EVENTS] Error fetching events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function getAllEventsForAdmin(): Promise<
  ActionResult<EventData[]>
> {
  try {
    await syncEventStatuses();
    const events = await db.event.findMany({
      where: { isDeleted: false },
      orderBy: { startDate: "asc" },
    });
    return { success: true, data: events as EventData[] };
  } catch (error) {
    console.error("[EVENTS] Error fetching events for admin:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

// ─── Create ────────────────────────────────────────────────────────────────────

export async function createEvent(
  input: CreateEventInput,
): Promise<ActionResult<EventData>> {
  const title = input.title?.trim();
  if (!title) return { success: false, error: "Title is required" };
  if (!input.startDate)
    return { success: false, error: "Start date is required" };

  if (input.endDate && input.endDate <= input.startDate) {
    return { success: false, error: "End date must be after the start date" };
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id)
      return {
        success: false,
        error: "You must be logged in to create an event",
      };

    const status = deriveStatus(input.startDate, input.endDate ?? null);

    const event = await db.event.create({
      data: {
        title,
        description: input.description ?? null,
        coverImage: input.coverImage ?? null,
        images: input.images ?? [],
        location: input.location?.trim() ?? null,
        startDate: input.startDate,
        endDate: input.endDate ?? null,
        status,
        createdById: currentUser.id,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, data: event as EventData };
  } catch (error) {
    console.error("[EVENTS] Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export async function updateEvent(
  input: UpdateEventInput,
): Promise<ActionResult<EventData>> {
  if (!input.id) return { success: false, error: "Event ID is required" };

  if (input.startDate && input.endDate && input.endDate <= input.startDate) {
    return { success: false, error: "End date must be after the start date" };
  }

  try {
    // Fetch current to compute new status if dates changed
    const current = await db.event.findUnique({ where: { id: input.id } });
    if (!current) return { success: false, error: "Event not found" };

    const newStartDate = input.startDate ?? current.startDate;
    const newEndDate =
      input.endDate !== undefined ? input.endDate : current.endDate;
    const status = deriveStatus(newStartDate, newEndDate);

    const event = await db.event.update({
      where: { id: input.id },
      data: {
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.coverImage !== undefined && { coverImage: input.coverImage }),
        ...(input.images !== undefined && { images: input.images }),
        ...(input.location !== undefined && {
          location: input.location?.trim() ?? null,
        }),
        ...(input.startDate !== undefined && { startDate: input.startDate }),
        ...(input.endDate !== undefined && { endDate: input.endDate }),
        status,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, data: event as EventData };
  } catch (error) {
    console.error("[EVENTS] Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

// ─── Delete (soft) ─────────────────────────────────────────────────────────────

export async function deleteEvent(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Event ID is required" };

  try {
    await db.event.update({
      where: { id },
      data: { isDeleted: true },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("[EVENTS] Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}
