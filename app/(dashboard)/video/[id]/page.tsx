"use client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download, RotateCcw, Edit, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { toast } from "react-toastify";
import useSWR from "swr";
import { videoApi } from "@/lib/api/client";
import { Video } from "@/types";
import { API_CONFIG } from "@/lib/api/config";
import { useMemo } from "react";

export default function VideoDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const videoId = params.id as string;
  
  // Check if the ID is a job_id (UUID format) or a regular video ID
  const isJobId = useMemo(() => {
    // UUID pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(videoId);
  }, [videoId]);
  
  // Get the referrer from URL query params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const from = searchParams.get('from') || '/';
  
  // Fetch job status if it's a job_id, otherwise fetch video directly
  const { data: jobStatus, error: jobError, isLoading: jobLoading } = useSWR(
    isJobId && videoId ? `/api/job-status/${videoId}` : null,
    () => videoApi.getJobStatus(videoId)
  );
  
  const { data: videoData, error: videoError, isLoading: videoLoading } = useSWR<Video>(
    !isJobId && videoId ? `/api/video/${videoId}` : null,
    () => videoApi.getVideo(videoId)
  );
  
  // Map job status to video object or use direct video data
  const video = useMemo(() => {
    if (isJobId && jobStatus) {
      console.log("Job Status for video page:", jobStatus);
      return {
        id: jobStatus.video_id || videoId,
        job_id: videoId,
        title: jobStatus.title || 'Generated Video',
        status: jobStatus.status,
        path: jobStatus.video_path,
        video_path: jobStatus.video_path,
        thumbnail: jobStatus.thumbnail_path,
        created_at: jobStatus.created_at,
        ...jobStatus,
      } as Video;
    }
    return videoData || null;
  }, [isJobId, jobStatus, videoData, videoId]);
  
  const error = isJobId ? jobError : videoError;
  const isLoading = isJobId ? jobLoading : videoLoading;

  // Get video URL for playback and download
  const getVideoUrl = () => {
    if (!video) return '';
    
    // Use the video_id (integer) to fetch video from backend API
    const actualVideoId = video.video_id || video.id;
    
    // If we have a valid video_id, use the download endpoint to stream the video
    if (actualVideoId && !isJobId) {
      return `${API_CONFIG.BASE_URL}/api/download/${actualVideoId}`;
    } else if (actualVideoId && video.video_id) {
      // For job_id-based pages, use the video_id from job status
      return `${API_CONFIG.BASE_URL}/api/download/${video.video_id}`;
    }
    
    console.warn("No valid video ID found for playback. Video object:", video);
    return '';
  };

  // Handle Regenerate
  const handleRegenerate = () => {
    toast.success("Regenerating video...");
    setTimeout(() => {
      router.push("/generate");
    }, 500);
  };

  // Handle Edit Details
  const handleEditDetails = () => {
    router.push(`/create-video?edit=${videoId}`);
  };

  // Handle Download
  const handleDownload = async () => {
    if (!video) return;
    
    try {
      toast.info("Starting download...");
      
      // Use video_id (integer) from job status, not job_id (UUID)
      // Priority: video.video_id > video.id (if it's a number) > fallback to videoId
      let videoIdForDownload: string | number;
      
      if (video.video_id) {
        videoIdForDownload = video.video_id;
      } else if (video.id && !isJobId) {
        // If video.id is not a UUID (job_id), use it
        videoIdForDownload = video.id;
      } else {
        // Log error and show message
        console.error("No valid video_id found for download. Video object:", video);
        toast.error("Video ID not available. Please wait for video processing to complete.");
        return;
      }
      
      const downloadUrl = `${API_CONFIG.BASE_URL}/api/download/${videoIdForDownload}`;
      
      console.log("Download URL:", downloadUrl);
      console.log("Video ID for download:", videoIdForDownload);
      console.log("Is Job ID:", isJobId);
      console.log("Full video object:", video);
      
      // Fetch the video as a blob to bypass CORS issues
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${video.title || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Download completed!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download video. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin" style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }} />
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
            onClick={() => router.push(from)}
            className="flex items-center gap-2 hover:opacity-70"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-lg font-semibold">Back</span>
          </button>
        </div>
        <p style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}>
          Video not found or failed to load.
        </p>
      </div>
    );
  }

  const videoUrl = getVideoUrl();

  return (
    <div 
      className="w-full max-w-full lg:mt-3 mx-auto p-4 sm:p-5 md:p-6 rounded-lg overflow-hidden" 
      style={{ 
        backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
        border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center gap-2 sm:gap-3 md:gap-4">
        <button 
          onClick={() => router.push(from)}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl font-semibold">Back</span>
        </button>
      </div>

      {/* Video Preview */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-2 sm:mb-3 text-sm sm:text-base font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Video Preview</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="h-full w-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Video not available
            </div>
          )}
        </div>
      </div>

      {/* Video Details */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
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
          className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
          style={{ 
            backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
            border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
            boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
          }}
        >
          <h2 
            className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >Script</h2>
          <p 
            className="text-xs sm:text-sm whitespace-pre-wrap"
            style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
          >{video.script}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleRegenerate}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-700 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Regenerate
        </Button>
        <Button
          onClick={handleEditDetails}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-700 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Edit Details
        </Button>
        <Button 
          onClick={handleDownload}
          disabled={video.status !== 'completed'}
          className="w-full sm:flex-1 bg-[#3B82F6] text-white! py-4 sm:py-5 md:py-6 text-xs sm:text-sm hover:bg-[#3B82F6]/90 disabled:opacity-50"
        >
          <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
