import { Video, Style, Voice } from "@/types";

// Mock videos using local files - used when backend is unavailable
export const videos: Video[] = [
  {
    id: "1",
    title: "Beautiful Scenery",
    video_path: "/videos/beautiful.mp4",
    thumbnail: "/images/thumbnail1.jpg",
    status: "completed",
    category: "Nature",
    format: "16:9",
    style: "cinematic",
    voice: "alloy",
    script: "A beautiful scenery video showcasing nature at its finest.",
    created_at: "2025-12-28T10:00:00Z",
  },
  {
    id: "2",
    title: "Lamborghini Dreams",
    video_path: "/videos/lamborghini.mp4",
    thumbnail: "/images/thumbnail2.jpg",
    status: "completed",
    category: "Cars",
    format: "9:16",
    style: "realistic",
    voice: "onyx",
    script: "Experience the thrill of luxury sports cars.",
    created_at: "2025-12-29T14:30:00Z",
  },
  {
    id: "3",
    title: "Nature's Beauty",
    video_path: "/videos/nature.mp4",
    thumbnail: "/images/thumbnail3.jpg",
    status: "completed",
    category: "Nature",
    format: "16:9",
    style: "cinematic",
    voice: "nova",
    script: "Discover the wonders of the natural world.",
    created_at: "2025-12-30T09:15:00Z",
  },
  {
    id: "4",
    title: "Sky Adventures",
    video_path: "/videos/sky.mp4",
    thumbnail: "/images/thumbnail4.jpg",
    status: "completed",
    category: "Travel",
    format: "1:1",
    style: "fantasy",
    voice: "echo",
    script: "Soar through the clouds on an epic adventure.",
    created_at: "2025-12-31T16:45:00Z",
  },
];

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
