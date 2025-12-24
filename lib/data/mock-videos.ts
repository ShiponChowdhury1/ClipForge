import { Video, Style, Voice } from "@/types";

// Empty video array - using backend API instead
export const videos: Video[] = [];

// Fallback styles if API fails to load
export const videoStyles: Style[] = [
  { id: "cinematic", name: "Cinematic", description: "Professional film-like quality with dramatic lighting" },
  { id: "anime", name: "Anime", description: "Japanese animation style with vibrant colors" },
  { id: "realistic", name: "Realistic", description: "Photorealistic imagery" },
  { id: "watercolor", name: "Watercolor", description: "Soft watercolor painting aesthetic" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Futuristic neon-lit dystopian aesthetic" },
  { id: "minimalist", name: "Minimalist", description: "Clean, simple, and elegant design" },
  { id: "fantasy", name: "Fantasy", description: "Magical and enchanted worlds" },
  { id: "comic", name: "Comic Book", description: "Bold comic book art style" },
];

// Fallback voices if API fails to load
export const voiceTypes: Voice[] = [
  { id: "alloy", name: "Alloy", description: "Neutral and balanced" },
  { id: "echo", name: "Echo", description: "Warm and inviting" },
  { id: "fable", name: "Fable", description: "Expressive British accent" },
  { id: "onyx", name: "Onyx", description: "Deep and authoritative" },
  { id: "nova", name: "Nova", description: "Bright and energetic" },
  { id: "shimmer", name: "Shimmer", description: "Soft and gentle" },
];
