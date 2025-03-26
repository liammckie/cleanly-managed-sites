
import { Json } from '@/lib/types';

export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export function dbToOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    userId: dbProfile.user_id
  };
}

export function overheadProfileToDb(profile: OverheadProfile): DbOverheadProfile {
  return {
    id: profile.id,
    name: profile.name,
    description: profile.description,
    labor_percentage: profile.laborPercentage,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    user_id: profile.userId
  };
}
