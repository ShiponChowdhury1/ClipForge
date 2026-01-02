"use client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download, RotateCcw, Edit, Loader2, Play, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { toast } from "react-toastify";
import useSWR from "swr";
import { videoApi } from "@/lib/api/client";
import { Video } from "@/types";
import { API_CONFIG } from "@/lib/api/config";
import { useMemo, useCallback, useState } from "react";

// Status configuration for visual consistency
const STATUS_CONFIG = {
  completed: { color: "#22C55E", icon: CheckCircle2, label: "Completed" },
  failed: { color: "#EF4444", icon: XCircle, label: "Failed" },
  processing: { color: "#3B82F6", icon: Clock, label: "Processing" },
  pending: { color: "#F59E0B", icon: Clock, label: "Pending" },
} as const;

export default function VideoDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const videoId = params.id as string;
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Check if the ID is a job_id (UUID format) or a regular video ID (integer)
  const isJobId = useMemo(() => {
    // UUID pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(videoId);
  }, [videoId]);
  
  // Check if it's a pure integer (video_id from backend)
  const isIntegerId = useMemo(() => {
    return /^\d+$/.test(videoId);
  }, [videoId]);
  
  // Get the referrer from URL query params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const from = searchParams.get('from') || '/all-videos';
  
  // Fetch job status if it's a job_id, otherwise fetch video directly
  const { data: jobStatus, error: jobError, isLoading: jobLoading } = useSWR(
    isJobId && videoId ? `/api/job-status/${videoId}` : null,
    () => videoApi.getJobStatus(videoId),
    {
      refreshInterval: (data) => {
        // Keep polling if status is pending or processing
        if (data?.status === 'pending' || data?.status === 'processing') {
          return 2000; // Poll every 2 seconds
        }
        return 0; // Stop polling when completed or failed
      },
    }
  );
  
  // If job status has video_id, fetch full video details
  // Priority: video_data.id (when completed) > video.id (nested) > video_id > id
  const actualVideoId = jobStatus?.video_data?.id || jobStatus?.video?.id || jobStatus?.video_id || jobStatus?.id;
  
  // Check if actualVideoId is a valid integer
  const hasValidVideoId = actualVideoId && (typeof actualVideoId === 'number' || /^\d+$/.test(String(actualVideoId)));
  
  const { data: videoData, error: videoError, isLoading: videoLoading } = useSWR<Video>(
    // Fetch if: it's an integer ID OR if job status returned a valid video_id
    (isIntegerId && videoId) || (isJobId && hasValidVideoId) ? `/api/video/${actualVideoId || videoId}` : null,
    () => videoApi.getVideo(String(actualVideoId || videoId)),
    {
      revalidateOnFocus: true,
    }
  );
  
  // Map job status to video object or use direct video data
  const video = useMemo(() => {
    console.log("========== VIDEO PAGE DEBUG ==========");
    console.log("URL videoId:", videoId);
    console.log("isJobId:", isJobId);
    console.log("isIntegerId:", isIntegerId);
    console.log("jobStatus:", jobStatus);
    console.log("jobStatus.video (nested):", jobStatus?.video);
    console.log("jobStatus.video_data:", jobStatus?.video_data);
    console.log("jobStatus.video_data.id:", jobStatus?.video_data?.id);
    console.log("actualVideoId from job:", actualVideoId);
    console.log("hasValidVideoId:", hasValidVideoId);
    console.log("videoData:", videoData);
    console.log("jobError:", jobError);
    console.log("videoError:", videoError);
    console.log("======================================");
    
    // If we have videoData from /api/video/{id}, use it (it has full details)
    if (videoData) {
      console.log("✅ Using videoData, mapping fields...");
      // API response structure:
      // { id, title, category, format, style, voice, script, keywords, negative_keywords, path, thumbnail_path, duration, created_at, status }
      const mappedVideo = {
        ...videoData,
        id: videoData.id || videoData.video_id,
        video_id: videoData.id || videoData.video_id,
        job_id: isJobId ? videoId : (videoData.job_id || undefined),
        title: videoData.title || videoData.video_title || 'Generated Video',
        keywords: videoData.keywords || videoData.keyword || '',
        negative_keywords: videoData.negative_keywords || videoData.negative_keyword || '',
        format: videoData.format || videoData.video_format || '9:16',
        // style = video style like "Hyper Realistic", "Anime" etc.
        style: videoData.style || videoData.video_style || '',
        // category = topic like "MONEY / POWER", "TECH" etc.
        category: videoData.category || '',
        voice: videoData.voice || videoData.voice_type || '',
        script: videoData.script || videoData.video_script || '',
        status: videoData.status || 'completed',
        video_path: videoData.video_path || videoData.path || '',
        path: videoData.path || videoData.video_path || '',
        thumbnail: videoData.thumbnail || videoData.thumbnail_path || '',
        created_at: videoData.created_at || videoData.created_date || new Date().toISOString(),
      } as Video;
      console.log("📦 Mapped video object:", mappedVideo);
      return mappedVideo;
    }
    
    // If job status has video_data object (when completed), use it
    if (isJobId && jobStatus?.video_data) {
      const videoData = jobStatus.video_data;
      console.log("✅ Using video_data from jobStatus.video_data");
      console.log("🔍 videoData object:", videoData);
      console.log("🔍 videoData.id:", videoData.id, "type:", typeof videoData.id);
      console.log("🔍 videoData keys:", Object.keys(videoData));
      
      // Check if id exists in video_data, otherwise check result object
      const actualId = videoData.id || jobStatus.result?.id;
      console.log("🔍 actualId from video_data or result:", actualId);
      
      return {
        id: actualId,
        video_id: actualId,
        job_id: videoId,
        title: videoData.title || 'Generated Video',
        status: jobStatus.status || 'completed',
        path: videoData.path || videoData.video_path,
        video_path: videoData.video_path || videoData.path,
        thumbnail: videoData.thumbnail_path || videoData.thumbnail,
        created_at: videoData.created_at || jobStatus.created_at,
        keywords: videoData.keywords || '',
        negative_keywords: videoData.negative_keywords || '',
        format: videoData.format || '9:16',
        style: videoData.style || videoData.category || '',
        category: videoData.category || videoData.style || '',
        voice: videoData.voice || '',
        script: videoData.script || '',
      } as Video;
    }
    
    // If job status has nested video object with full details, use it
    if (isJobId && jobStatus?.video) {
      const nestedVideo = jobStatus.video;
      console.log("✅ Using nested video from jobStatus.video");
      return {
        id: nestedVideo.id,
        video_id: nestedVideo.id,
        job_id: videoId,
        title: nestedVideo.title || 'Generated Video',
        status: jobStatus.status || nestedVideo.status || 'completed',
        path: nestedVideo.path || nestedVideo.video_path,
        video_path: nestedVideo.video_path || nestedVideo.path,
        thumbnail: nestedVideo.thumbnail_path || nestedVideo.thumbnail,
        created_at: nestedVideo.created_at,
        keywords: nestedVideo.keywords || '',
        negative_keywords: nestedVideo.negative_keywords || '',
        format: nestedVideo.format || '9:16',
        style: nestedVideo.style || nestedVideo.category || '',
        category: nestedVideo.category || nestedVideo.style || '',
        voice: nestedVideo.voice || '',
        script: nestedVideo.script || '',
      } as Video;
    }
    
    // Fallback to job status data if video data not available yet
    if (isJobId && jobStatus) {
      return {
        id: jobStatus.video_id || videoId,
        video_id: jobStatus.video_id,
        job_id: videoId,
        title: jobStatus.title || 'Generated Video',
        status: jobStatus.status,
        path: jobStatus.video_path,
        video_path: jobStatus.video_path,
        thumbnail: jobStatus.thumbnail_path,
        created_at: jobStatus.created_at,
        keywords: jobStatus.keywords || '',
        negative_keywords: jobStatus.negative_keywords || '',
        format: jobStatus.format || jobStatus.video_format || '9:16',
        style: jobStatus.style || jobStatus.category || '',
        category: jobStatus.category || jobStatus.style || '',
        voice: jobStatus.voice || jobStatus.voice_type || '',
        script: jobStatus.script || '',
        ...jobStatus,
      } as Video;
    }
    
    return null;
  }, [isJobId, isIntegerId, jobStatus, videoData, videoId, actualVideoId, hasValidVideoId, jobError, videoError]);
  
  const error = isJobId ? (jobError || videoError) : videoError;
  const isLoading = isJobId ? (jobLoading || (hasValidVideoId && videoLoading)) : videoLoading;

  // Memoized video URL for playback and download (using integer video_id)
  const videoUrl = useMemo(() => {
    console.log("🎥 videoUrl useMemo - video object:", video);
    
    if (!video) {
      console.log("❌ No video object for URL generation");
      return '';
    }
    
    console.log("🔍 video.video_id:", video.video_id, "type:", typeof video.video_id);
    console.log("🔍 video.id:", video.id, "type:", typeof video.id);
    
    // Priority: use video_id (integer) from backend
    const actualVideoId = video.video_id || video.id;
    console.log("🎬 Video URL generation - actualVideoId:", actualVideoId, "type:", typeof actualVideoId);
    
    // Only create URL if we have a valid integer ID
    if (actualVideoId && (typeof actualVideoId === 'number' || /^\d+$/.test(String(actualVideoId)))) {
      const url = `${API_CONFIG.BASE_URL}/api/download/${actualVideoId}`;
      console.log("✅ Generated video URL:", url);
      return url;
    }
    
    console.log("❌ Invalid video ID, cannot generate URL. video_id:", video.video_id, "id:", video.id);
    return '';
  }, [video]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    router.push(from);
  }, [router, from]);

  // Handle Regenerate
  const handleRegenerate = useCallback(() => {
    toast.info("Redirecting to create video...");
    router.push("/create-video");
  }, [router]);

  // Handle Edit Details
  const handleEditDetails = useCallback(() => {
    const editId = video?.video_id || videoId;
    router.push(`/create-video?edit=${editId}`);
  }, [router, video?.video_id, videoId]);

  // Handle Download with progress feedback (using integer video_id)
  const handleDownload = useCallback(async () => {
    if (!video) return;
    
    // Use integer video_id from backend (not job_id)
    let videoIdForDownload: string | number | undefined;
    
    if (video.video_id) {
      videoIdForDownload = video.video_id;
    } else if (video.id && (typeof video.id === 'number' || /^\d+$/.test(String(video.id)))) {
      // Only use video.id if it's a valid integer
      videoIdForDownload = video.id;
    }
    
    if (!videoIdForDownload) {
      toast.error("Video ID not available. Please wait for processing to complete.");
      return;
    }
    
    try {
      setIsDownloading(true);
      toast.info("Preparing download...");
      
      const downloadUrl = `${API_CONFIG.BASE_URL}/api/download/${videoIdForDownload}`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${video.title || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Download completed! 🎉");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [video]);

  // Get status config
  const statusConfig = video?.status ? STATUS_CONFIG[video.status] || STATUS_CONFIG.pending : STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div 
        className="w-full max-w-full lg:mt-3 mx-auto p-4 sm:p-5 md:p-6 rounded-lg animate-pulse"
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none'
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="aspect-video rounded-lg bg-gray-300 dark:bg-gray-700 mb-6" />
        <div className="space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = JSON.stringify({ videoId, isJobId, isIntegerId, actualVideoId, error: errorMessage }, null, 2);
    
    return (
      <div 
        className="w-full max-w-full lg:mt-3 mx-auto p-4 sm:p-5 md:p-6 rounded-lg"
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none'
        }}
      >
        <div className="mb-6 flex items-center gap-2">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-lg font-semibold">Back</span>
          </button>
        </div>
        <div className="text-center py-12">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium mb-2" style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}>
            {error ? 'Failed to load video' : 'Video not found'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {error ? errorMessage : 'The video you\'re looking for doesn\'t exist or failed to load.'}
          </p>
          {error && (
            <details className="text-left mb-6 p-4 rounded bg-gray-100 dark:bg-gray-800">
              <summary className="cursor-pointer text-sm font-medium mb-2">Debug Information</summary>
              <pre className="text-xs overflow-auto" style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}>
                {errorDetails}
              </pre>
            </details>
          )}
          <Button onClick={handleBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-full lg:mt-3 mx-auto p-4 sm:p-5 md:p-6 rounded-lg overflow-hidden transition-all duration-300" 
      style={{ 
        backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
        border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header with Status */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center justify-between flex-wrap gap-3">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity duration-200"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl font-semibold">Video Details</span>
        </button>
        
        {/* Status Badge */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${statusConfig.color}20`,
            color: statusConfig.color
          }}
        >
          <StatusIcon className="h-4 w-4" />
          <span className="capitalize">{statusConfig.label}</span>
        </div>
      </div>

      {/* Video Preview */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4 transition-all duration-300" 
        style={{ 
          backgroundColor: theme === "dark" ? '#1F1F1F' : '#F9FAFB', 
          border: theme === "dark" ? '1px solid #3F3F46' : '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-sm sm:text-base font-medium"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >Video Preview</h2>
          {video.title && (
            <span 
              className="text-xs sm:text-sm truncate max-w-[200px]"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >
              {video.title}
            </span>
          )}
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black group">
          {videoUrl ? (
            <>
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              <video
                src={videoUrl}
                controls
                className={`h-full w-full transition-opacity duration-300 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoadedData={() => setVideoLoaded(true)}
                poster={video.thumbnail}
              />
              {/* Play overlay for thumbnail */}
              {!videoLoaded && video.thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-gray-900 ml-1" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
              <XCircle className="h-12 w-12 mb-3 opacity-50" />
              <p>Video not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Details */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4 transition-all duration-300" 
        style={{ 
          backgroundColor: theme === "dark" ? '#1F1F1F' : '#F9FAFB', 
          border: theme === "dark" ? '1px solid #3F3F46' : '1px solid #E5E7EB',
        }}
      >
        <h2 
          className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Video Details</h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Title:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.title}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Keywords:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.keywords || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Negative Keywords:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.negative_keywords || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Format:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.format || '9:16'}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Style:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.style || video.category || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Voice Type:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.voice || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Status:</span>
            <span 
              className="text-xs sm:text-sm capitalize"
              style={{ color: video.status === 'completed' ? '#22c55e' : video.status === 'failed' ? '#ef4444' : theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.status}</span>
          </div>
        </div>
      </div>

      {/* Script Section */}
      {video.script && (
        <div 
          className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4 transition-all duration-300" 
          style={{ 
            backgroundColor: theme === "dark" ? '#1F1F1F' : '#F9FAFB', 
            border: theme === "dark" ? '1px solid #3F3F46' : '1px solid #E5E7EB',
          }}
        >
          <h2 
            className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >Script</h2>
          <div 
            className="overflow-y-auto rounded-md p-3 scrollbar-hide"
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF',
            }}
          >
            <p 
              className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed"
              style={{ color: theme === "dark" ? "#D4D4D8" : "#3F3F46" }}
            >{video.script}</p>
          </div>
        </div>
      )}

      {/* Created Date */}
      {video.created_at && (
        <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(video.created_at).toLocaleString()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleRegenerate}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-600 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Create New
        </Button>
        <Button
          onClick={handleEditDetails}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-600 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Edit & Regenerate
        </Button>
        <Button 
          onClick={handleDownload}
          disabled={video.status !== 'completed' || isDownloading}
          className="w-full sm:flex-1 bg-[#3B82F6] text-white py-4 sm:py-5 md:py-6 text-xs sm:text-sm hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
