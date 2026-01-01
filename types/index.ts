// Backend API Types
export interface Video {
  id: number | string;
  video_id?: number; // Backend returns video_id separately from job_id
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
  caption_settings?: CaptionSettings;
}

export interface CaptionSettings {
  position?: 'bottom-center' | 'top-center' | 'middle-center';
  margin_bottom?: string; // e.g., "12%" or "120px"
  margin_top?: string;
  margin_sides?: string; // e.g., "8%" or "80px"
  font_size?: string; // e.g., "5%" or "50px"
  background?: string; // e.g., "rgba(0,0,0,0.75)"
  text_color?: string; // e.g., "#FFFFFF"
  text_align?: 'left' | 'center' | 'right'; // Text alignment
  vertical_align?: 'top' | 'middle' | 'bottom'; // Vertical alignment
  font_weight?: 'normal' | 'bold' | '600' | '700';
  max_width?: string; // e.g., "85%" or "800px"
  padding?: string; // e.g., "12px 24px"
  line_height?: number; // e.g., 1.3
  border_radius?: string; // e.g., "8px"
  text_shadow?: string; // e.g., "2px 2px 4px rgba(0,0,0,0.9)"
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
