export const APP_NAME = "Clipforge";
export const APP_DESCRIPTION = "Transform scripts into AI-generated videos";

export const VIDEO_STYLES = [
  { value: "cinematic", label: "Cinematic" },
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
  { value: "cartoon", label: "Cartoon" },
] as const;


export const VOICE_OVER_OPTIONS = [
  { value: "male", label: "Male Voice" },
  { value: "female", label: "Female Voice" },
  { value: "none", label: "No Voice" },
] as const;
