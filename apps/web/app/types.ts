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
  date: string; // ISO date string for input[type=date]
  category: string;
  isPublished: boolean;
}
