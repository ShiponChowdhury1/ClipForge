import axios from 'axios';
import { API_CONFIG } from './config';
import { Video, VideoCreateRequest, Style, Voice } from '@/types';

// Create axios instance
// When using proxy, don't set baseURL (use relative paths)
// When not using proxy, set baseURL to backend URL
const apiClient = axios.create({
  baseURL: API_CONFIG.USE_PROXY ? '' : API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false,
});

// Helper function to normalize video data from API
const normalizeVideo = (video: Record<string, unknown>): Video => {
  const normalized = {
    ...video,
    id: video.id as string | number, // Keep as number for proper API routing
    video_id: video.id as string | number, // Set video_id for compatibility
    title: (video.title || 'Generated Video') as string,
    script: (video.script || '') as string,
    // Map category to style for UI compatibility
    style: (video.style || video.category || '') as string,
    category: (video.category || video.style || '') as string,
    voice: (video.voice || '') as string,
    format: (video.format || '9:16') as string,
    keywords: (video.keywords || '') as string,
    negative_keywords: (video.negative_keywords || '') as string,
    // Map backend 'path' to frontend 'video_path'
    video_path: (video.path || video.video_path || '') as string,
    path: (video.path || video.video_path || '') as string,
    thumbnail: (video.thumbnail_path || video.thumbnail || '') as string,
    thumbnail_path: (video.thumbnail_path || video.thumbnail || '') as string,
    status: (video.status || 'completed') as string,
    duration: (video.duration || 0) as number,
    created_at: (video.created_at || new Date().toISOString()) as string,
  } as Video;
  
  return normalized;
};

// API methods
export const videoApi = {
  // List all videos
  listVideos: async (): Promise<Video[]> => {
    try {
      const response = await apiClient.get<Record<string, unknown>[]>(API_CONFIG.ENDPOINTS.VIDEOS, {
        timeout: 60000, // 60 seconds for large video lists
      });
      return response.data.map(normalizeVideo);
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Get single video
  getVideo: async (id: string): Promise<Video> => {
    try {
      const response = await apiClient.get<Record<string, unknown>>(API_CONFIG.ENDPOINTS.VIDEO_BY_ID(id));
      return normalizeVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },

  // Create new video
  createVideo: async (data: VideoCreateRequest): Promise<{ id: string; job_id: string; message: string }> => {
    try {
      const response = await apiClient.post<{ job_id: string; message: string }>(API_CONFIG.ENDPOINTS.CREATE_VIDEO, data);
      // API returns job_id, not id
      return {
        id: response.data.job_id, // Use job_id as the id
        job_id: response.data.job_id,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.DELETE_VIDEO(id));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Get job status
  getJobStatus: async (jobId: string): Promise<Record<string, unknown>> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.JOB_STATUS(jobId));
      return response.data;
    } catch (error) {
      console.error('Error fetching job status:', error);
      throw error;
    }
  },

  // Get queue (processing videos)
  getQueue: async (): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiClient.get('/api/queue');
      
      // Handle the queue response structure: {queued: [...], processing: [...]}
      if (response.data && typeof response.data === 'object') {
        const queued = Array.isArray(response.data.queued) ? response.data.queued : [];
        const processing = Array.isArray(response.data.processing) ? response.data.processing : [];
        
        // Combine both arrays and return
        const combined = [...queued, ...processing];
        return combined;
      }
      
      // Fallback if response is already an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching queue:', error);
      return [];
    }
  },

  // Download video
  downloadVideo: async (id: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.DOWNLOAD_VIDEO(id), {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  },

  // Get available styles
  listStyles: async (): Promise<Style[]> => {
    try {
      const response = await apiClient.get<Style[]>(API_CONFIG.ENDPOINTS.STYLES);
      return response.data;
    } catch (error) {
      console.error('Error fetching styles:', error);
      // Return empty array if API fails
      return [];
    }
  },

  // Get available voices
  listVoices: async (): Promise<Voice[]> => {
    try {
      const response = await apiClient.get<Voice[]>(API_CONFIG.ENDPOINTS.VOICES);
      return response.data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return empty array if API fails
      return [];
    }
  },

  // Get config (video_formats, video_styles, voice_types, etc)
  fetchConfig: async (): Promise<{
    video_formats: string[];
    video_styles: string[];
    voice_types: string[];
    max_script_length: number;
    image_count: number;
  }> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONFIG);
      return response.data;
    } catch (error) {
      console.error('Error fetching config:', error);
      throw error;
    }
  },

  // Helper to get full video URL
  getVideoUrl: (videoPath: string): string => {
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    // If it's a Windows file path (contains backslashes or drive letter), 
    // we can't use it directly - backend must serve it
    if (videoPath.includes('\\') || /^[A-Za-z]:/.test(videoPath)) {
      console.warn('Cannot use local file path as URL:', videoPath);
      return ''; // Return empty - video won't play but won't error
    }
    return `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${videoPath.startsWith('/') ? '' : '/'}${videoPath}`;
  },

  // Helper to get video URL by ID (uses download endpoint)
  getVideoUrlById: (videoId: string | number): string => {
    if (API_CONFIG.USE_PROXY) {
      return `/api/proxy/api/download/${videoId}`;
    }
    return `${API_CONFIG.BASE_URL}/api/download/${videoId}`;
  },

  // Helper to get full thumbnail URL
  getThumbnailUrl: (thumbnailPath: string): string => {
    if (thumbnailPath.startsWith('http')) {
      return thumbnailPath;
    }
    return `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${thumbnailPath.startsWith('/') ? '' : '/'}${thumbnailPath}`;
  },
};

export default apiClient;
