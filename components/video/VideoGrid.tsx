import VideoCard from "@/components/video/video-card";
import { Video } from "@/types";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useEffect } from "react";

interface VideoGridProps {
  videos: Video[];
  queueData?: Record<string, unknown>[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

// Loading card component for videos in queue
function LoadingVideoCard({ queueItem }: { queueItem: Record<string, unknown> }) {
  const { theme } = useTheme();
  
  // Extract title or use default
  const title = (queueItem.title || queueItem.video_title || 'Generating Video...') as string;
  const status = (queueItem.status || 'pending') as string;
  const backendProgress = typeof queueItem.progress === 'number' ? queueItem.progress : 0;
  
  // Initialize progress based on status
  const [animatedProgress, setAnimatedProgress] = useState(() => {
    return status === 'processing' ? 1 : 0;
  });
  
  // Animate progress from current to backend progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        // Reset to 0 if pending
        if (status === 'pending') return 0;
        
        // Start from 1% if processing and currently at 0
        if (status === 'processing' && prev === 0) return 1;
        
        // If we have backend progress, smoothly move towards it
        if (backendProgress > 0) {
          if (prev < backendProgress) {
            return Math.min(prev + 1, backendProgress);
          }
          return backendProgress;
        }
        
        // Otherwise simulate progress up to 95%
        if (prev >= 95) return 95;
        return prev + Math.random() * 2;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [status, backendProgress]);
  
  const displayProgress = Math.round(animatedProgress);
  
  return (
    <div 
      className="rounded-lg overflow-hidden border"
      style={{
        backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
        borderColor: theme === "dark" ? "#3F3F46" : "#E5E7EB"
      }}
    >
      {/* Thumbnail area with spinner */}
      <div 
        className="aspect-video flex items-center justify-center relative"
        style={{
          backgroundColor: theme === "dark" ? "#27272A" : "#F3F4F6"
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <div className="text-sm font-medium" style={{ color: theme === "dark" ? "#A1A1AA" : "#6B7280" }}>
            {status === 'pending' ? 'Queued...' : 'Processing...'}
          </div>
          {displayProgress > 0 && (
            <div className="text-xs font-semibold text-blue-500">
              {displayProgress}%
            </div>
          )}
        </div>
        
        {/* Progress bar at bottom */}
        {displayProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Content area */}
      <div className="p-3">
        <div 
          className="text-sm font-medium truncate mb-2"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          {title}
        </div>
        <div 
          className="text-xs"
          style={{ color: theme === "dark" ? "#71717A" : "#9CA3AF" }}
        >
          {status === 'pending' ? '⏳ Waiting in queue...' : '🎬 Generating video...'}
        </div>
      </div>
    </div>
  );
}

export function VideoGrid({ videos, queueData = [], onDelete, onDownload }: VideoGridProps) {
  // Ensure queueData is always an array
  const queueArray = Array.isArray(queueData) ? queueData : [];
  
  // Filter queue to only show pending/processing videos (not completed)
  const processingQueue = queueArray.filter(item => 
    item.status !== 'completed' && item.status !== 'failed'
  );
  
  const hasContent = videos.length > 0 || processingQueue.length > 0;
  
  // Debug logging
  console.log("📹 VideoGrid - Videos:", videos.length);
  console.log("⏳ VideoGrid - Queue items (total):", queueArray.length);
  console.log("⏳ VideoGrid - Processing queue:", processingQueue.length);
  console.log("🔍 VideoGrid - Queue data:", queueData);
  console.log("🔍 VideoGrid - Processing items:", processingQueue);
  
  if (!hasContent) {
    return (
      <div className="py-8 sm:py-10 md:py-12 text-center">
        <p className="text-sm sm:text-base md:text-lg text-zinc-400">No videos found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-3 xl:gap-4 2xl:grid-cols-3 2xl:gap-5 ">
      {/* Show loading cards for videos in queue (only pending/processing) */}
      {processingQueue.map((queueItem, index) => (
        <LoadingVideoCard key={`queue-${queueItem.job_id || queueItem.id || index}`} queueItem={queueItem} />
      ))}
      
      {/* Show completed/processed videos */}
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
