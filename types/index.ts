// Backend API Types
export interface Video {
  id: string;
  title: string;
  script: string;
  style: string;
  voice: string;
  size?: string;
  duration?: number;
  keywords?: string[];
  negative_keywords?: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_path?: string;
  thumbnail_path?: string;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for UI compatibility
  category?: string;
  thumbnail?: string;
  videoUrl?: string;
  createdAgo?: string;
}

export interface VideoCreateRequest {
  title: string;
  script: string;
  style: string;
  voice: string;
  size?: string;
  duration?: number;
  keywords?: string[];
  negative_keywords?: string[];
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
