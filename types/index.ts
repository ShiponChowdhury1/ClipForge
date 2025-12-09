export interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  createdAgo: string;
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
