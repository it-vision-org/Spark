// ──────────────────────────────────────────────
// Global Types
// ──────────────────────────────────────────────

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  ufsUrl: string;
  url: string;
}

export interface ImageCarouselProps {
  images: string[];
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

export interface CarouselState {
  images: string[];
  startIndex: number;
  title: string;
}

export interface ImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

// ──────────────────────────────────────────────
// About Us - Club Members
// ──────────────────────────────────────────────

export interface ClubMemberData {
  id: string;
  name: string;
  role: string;
  image: string | null;
  isFounder: boolean;
  schoolYear: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberInput {
  name: string;
  role: string;
  image?: string;
  isFounder: boolean;
  schoolYear?: string;
  order?: number;
}

export interface UpdateMemberInput {
  id: string;
  name?: string;
  role?: string;
  image?: string | null;
  order?: number;
}

// ──────────────────────────────────────────────
// Achievements
// ──────────────────────────────────────────────

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: Date | null;
  category: string | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAchievementInput {
  title: string;
  description: string;
  images: string[];
  date?: Date | null;
  category?: string | null;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateAchievementInput {
  id: string;
  title?: string;
  description?: string;
  images?: string[];
  date?: Date | null;
  category?: string | null;
  order?: number;
  isPublished?: boolean;
}

export interface AchievementForm {
  title: string;
  description: string;
  images: string[];
  date: string;
  category: string;
  isPublished: boolean;
}

// ──────────────────────────────────────────────
// Achievements
// ──────────────────────────────────────────────

export type EventStatus = "UPCOMING" | "PRESENT" | "PAST";

export interface EventData {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  images: string[];
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  status: EventStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  images?: string[];
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
}

export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string | null;
  coverImage?: string | null;
  images?: string[];
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
}

export interface EventForm {
  title: string;
  description: string;
  coverImage: string | null;
  images: string[];
  location: string;
  startDate: string;
  endDate: string;
}

export interface GroupedEvents {
  present: EventData[];
  upcoming: EventData[];
  past: EventData[];
}
