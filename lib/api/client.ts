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

// API methods
export const videoApi = {
  // List all videos
  listVideos: async (): Promise<Video[]> => {
    try {
      const response = await apiClient.get<Video[]>(API_CONFIG.ENDPOINTS.VIDEOS);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Get single video
  getVideo: async (id: string): Promise<Video> => {
    try {
      const response = await apiClient.get<Video>(API_CONFIG.ENDPOINTS.VIDEO_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },

  // Create new video
  createVideo: async (data: VideoCreateRequest): Promise<Video> => {
    try {
      const response = await apiClient.post<Video>(API_CONFIG.ENDPOINTS.CREATE_VIDEO, data);
      return response.data;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.VIDEO_BY_ID(id));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Regenerate video
  regenerateVideo: async (id: string): Promise<Video> => {
    try {
      const response = await apiClient.post<Video>(API_CONFIG.ENDPOINTS.REGENERATE_VIDEO(id));
      return response.data;
    } catch (error) {
      console.error('Error regenerating video:', error);
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

  // Helper to get full video URL
  getVideoUrl: (videoPath: string): string => {
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    return `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${videoPath.startsWith('/') ? '' : '/'}${videoPath}`;
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
