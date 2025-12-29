// Backend API Types
export interface Video {
  id: number | string;
  title: string;
  script: string;
  style: string;
  voice: string;
  category?: string;
  format?: string;
  duration?: number;
  keywords?: string;
  negative_keywords?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  path?: string; // API returns 'path'
  video_path?: string; // For frontend compatibility
  thumbnail_path?: string;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for UI compatibility
  thumbnail?: string;
  videoUrl?: string;
  createdAgo?: string;
}

export interface VideoCreateRequest {
  title: string;
  category: string;
  format: string;
  style: string;
  voice: string;
  script: string;
  keywords: string;
  negative_keywords: string;
}

export interface Style {
  id: string;
  name: string;
  description: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface VideoSettings {
  style: "cinematic" | "anime" | "realistic" | "cartoon";
  duration: "30s" | "1m" | "2m" | "5m";
  voiceOver: "male" | "female" | "none";
}
