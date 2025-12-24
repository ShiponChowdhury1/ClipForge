// Use proxy route to avoid CORS issues
const USE_PROXY = true;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://6ljz73mw-8000.inc1.devtunnels.ms';
const BASE_PATH = USE_PROXY ? '/api/proxy' : '';

export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  USE_PROXY,
  ENDPOINTS: {
    VIDEOS: `${BASE_PATH}/api/videos`,
    CREATE_VIDEO: `${BASE_PATH}/api/videos/create`,
    VIDEO_BY_ID: (id: string) => `${BASE_PATH}/api/videos/${id}`,
    REGENERATE_VIDEO: (id: string) => `${BASE_PATH}/api/videos/${id}/regenerate`,
    STYLES: `${BASE_PATH}/api/styles`,
    VOICES: `${BASE_PATH}/api/voices`,
  },
};
