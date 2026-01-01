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
  
  // Check if the ID is a job_id (UUID format) or a regular video ID
  const isJobId = useMemo(() => {
    // UUID pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(videoId);
  }, [videoId]);
  
  // Get the referrer from URL query params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const from = searchParams.get('from') || '/all-videos';
  
  // Fetch job status if it's a job_id, otherwise fetch video directly
  const { data: jobStatus, error: jobError, isLoading: jobLoading } = useSWR(
    isJobId && videoId ? `/api/job-status/${videoId}` : null,
    () => videoApi.getJobStatus(videoId)
  );
  
  // If job status has video_id, fetch full video details
  const actualVideoId = jobStatus?.video_id;
  
  const { data: videoData, error: videoError, isLoading: videoLoading } = useSWR<Video>(
    // Fetch if: NOT a job_id OR if job status returned a video_id
    (!isJobId && videoId) || (isJobId && actualVideoId) ? `/api/video/${actualVideoId || videoId}` : null,
    () => videoApi.getVideo(actualVideoId || videoId)
  );
  
  // Map job status to video object or use direct video data
  const video = useMemo(() => {
    // If we have videoData from /api/video/{id}, use it (it has full details)
    if (videoData) {
      return {
        ...videoData,
        video_id: videoData.id,
        job_id: isJobId ? videoId : undefined,
        // Ensure video_path is available
        video_path: videoData.video_path || videoData.path,
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
  }, [isJobId, jobStatus, videoData, videoId, actualVideoId]);
  
  const error = isJobId ? (jobError || videoError) : videoError;
  const isLoading = isJobId ? (jobLoading || (actualVideoId && videoLoading)) : videoLoading;

  // Memoized video URL for playback and download
  const videoUrl = useMemo(() => {
    if (!video) return '';
    
    const actualVideoId = video.video_id || video.id;
    
    if (actualVideoId && !isJobId) {
      return `${API_CONFIG.BASE_URL}/api/download/${actualVideoId}`;
    } else if (actualVideoId && video.video_id) {
      return `${API_CONFIG.BASE_URL}/api/download/${video.video_id}`;
    }
    
    return '';
  }, [video, isJobId]);

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

  // Handle Download with progress feedback
  const handleDownload = useCallback(async () => {
    if (!video) return;
    
    let videoIdForDownload: string | number | undefined;
    
    if (video.video_id) {
      videoIdForDownload = video.video_id;
    } else if (video.id && !isJobId) {
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
  }, [video, isJobId]);

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
            Video not found
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The video you're looking for doesn't exist or failed to load.
          </p>
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
            className="overflow-auto rounded-md p-3"
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'thin',
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
