// Use proxy route to avoid CORS issues
// Set to false if backend has CORS headers configured
const USE_PROXY = true;  // Enable proxy to avoid CORS network errors
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.10.12.26:8000';
const BASE_PATH = USE_PROXY ? '/api/proxy' : '';

export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  USE_PROXY,
  ENDPOINTS: {
    VIDEOS: `${BASE_PATH}/api/all-videos`,
    CREATE_VIDEO: `${BASE_PATH}/api/create-video`,
    VIDEO_BY_ID: (id: string) => `${BASE_PATH}/api/video/${id}`,
    DELETE_VIDEO: (id: string) => `${BASE_PATH}/api/video/${id}`,
    DOWNLOAD_VIDEO: (id: string) => `${BASE_PATH}/api/download/${id}`,
    JOB_STATUS: (jobId: string) => `${BASE_PATH}/api/job-status/${jobId}`,
    STYLES: `${BASE_PATH}/api/styles`,
    VOICES: `${BASE_PATH}/api/voices`,
    CONFIG: `${BASE_PATH}/api/config`,
  },
};
