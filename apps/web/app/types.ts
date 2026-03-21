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

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}