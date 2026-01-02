"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import useSWR from 'swr';
import { videoApi } from "@/lib/api/client";
import { Video } from "@/types";

// Step configuration for better maintainability
const GENERATION_STEPS = [
  { id: 1, label: "Generating Prompts", description: "Creating AI prompts for your video" },
  { id: 2, label: "Creating Images", description: "Generating visual content" },
  { id: 3, label: "Creating Narration", description: "Synthesizing voice-over audio" },
  { id: 4, label: "Building Video", description: "Assembling final video" },
] as const;

// Status colors for visual feedback
const STATUS_COLORS = {
  completed: "#22C55E",
  failed: "#EF4444",
  processing: "#3B82F6",
  pending: "#A1A1AA",
} as const;

export default function GenerateVideoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId'); // This is actually job_id from create-video response
  
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch job status if videoId is provided (videoId is actually job_id)
  const { data: jobStatus, error: jobError } = useSWR(
    videoId ? `/job-status/${videoId}` : null,
    async () => {
      if (!videoId) return Promise.reject('No video ID');
      const result = await videoApi.getJobStatus(videoId);
      console.log("📊 Job Status Response:", result);
      console.log("   video_id (integer):", result?.video_id);
      console.log("   status:", result?.status);
      return result;
    },
    {
      refreshInterval: videoId ? 2000 : 0, // Poll every 2 seconds
      revalidateOnFocus: true,
      dedupingInterval: 1000,
    }
  );

  // Map job status to video-like object for compatibility
  const video = useMemo(() => {
    if (!jobStatus) return null;
    
    return {
      id: videoId,
      status: jobStatus.status || 'pending',
      title: jobStatus.title || 'Video Generation',
      path: jobStatus.video_path,
      error_message: jobStatus.error_message,
      ...jobStatus,
    } as Video;
  }, [jobStatus, videoId]);

  // Calculate completion status
  const isComplete = useMemo(() => {
    return video?.status === 'completed' || progress >= 100;
  }, [video?.status, progress]);

  const isFailed = useMemo(() => {
    return video?.status === 'failed' || !!jobError;
  }, [video?.status, jobError]);

  // Timer for elapsed time
  useEffect(() => {
    if (!isComplete && !isFailed) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete, isFailed]);

  // Format elapsed time
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [elapsedTime]);

  // Fallback: Simulate progress if no videoId
  useEffect(() => {
    if (!videoId) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [videoId]);

  // Simulate progress for processing videos
  useEffect(() => {
    if (video?.status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95; // Stop at 95% during processing
          return prev + Math.random() * 2; // Random increment for natural feel
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (video?.status === 'completed') {
      // Smooth transition to 100%
      setProgress(100);
    } else if (video?.status === 'failed') {
      // Keep current progress on failure
    }
  }, [video?.status]);

  // Calculate current step based on progress and video status
  const getCurrentStep = useCallback(() => {
    if (!video) {
      return progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;
    }
    
    switch (video.status) {
      case 'pending':
        return 0;
      case 'processing':
        return progress < 50 ? 1 : progress < 75 ? 2 : 3;
      case 'completed':
        return 4;
      case 'failed':
        return Math.floor(progress / 25);
      default:
        return 0;
    }
  }, [video, progress]);

  const currentStep = getCurrentStep();

  // Navigation handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleViewVideo = useCallback(() => {
    // Use actual video_id (integer) from job status if available, otherwise use job_id
    // The video_id might be in jobStatus.video_id OR jobStatus.video.id (nested)
    const actualVideoId = jobStatus?.video_id || jobStatus?.video?.id || jobStatus?.id;
    
    console.log("🎬 View Video clicked");
    console.log("   jobStatus:", jobStatus);
    console.log("   jobStatus.video:", jobStatus?.video);
    console.log("   actualVideoId (integer):", actualVideoId);
    console.log("   videoId (job_id/UUID):", videoId);
    
    if (actualVideoId && (typeof actualVideoId === 'number' || /^\d+$/.test(String(actualVideoId)))) {
      // Navigate with integer video_id - this is the correct ID for /api/video/{id}
      console.log("   ✅ Navigating to /video/" + actualVideoId);
      router.push(`/video/${actualVideoId}?from=/generate`);
    } else if (videoId) {
      // Fallback to job_id if video_id not available yet (might still be processing)
      console.log("   ⚠️ Fallback: Navigating with job_id:", videoId);
      router.push(`/video/${videoId}?from=/generate`);
    } else {
      console.log("   ❌ No ID available, going to all-videos");
      router.push("/all-videos");
    }
  }, [router, videoId, jobStatus]);

  return (
    <div 
      className="p-4 sm:p-5 mt-2 md:p-6 rounded-lg min-h-[400px] sm:min-h-[500px] md:min-h-[600px] transition-all duration-300" 
      style={{ 
        backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
        border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity duration-200"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl lg:text-[32px] font-semibold">Create New Video</span>
        </button>
        
        {/* Timer */}
        {!isComplete && !isFailed && (
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: theme === "dark" ? "#3F3F46" : "#F4F4F5",
              color: theme === "dark" ? "#A1A1AA" : "#71717A"
            }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      {/* Generate Section */}
      <div className="mt-6 sm:mt-8 md:mt-12">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
          <h2 
            className="text-lg sm:text-xl md:text-2xl font-semibold"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >
            {isFailed ? "Generation Failed" : isComplete ? "Generation Complete!" : "Generating Your Video..."}
          </h2>
          
          {/* Status Badge */}
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
            style={{ 
              backgroundColor: `${STATUS_COLORS[video?.status || 'pending']}20`,
              color: STATUS_COLORS[video?.status || 'pending']
            }}
          >
            {video?.status || 'pending'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div 
            className="relative h-2 sm:h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: theme === "dark" ? "#3F3F46" : "#D4D4D8" }}
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: isFailed ? STATUS_COLORS.failed : STATUS_COLORS.completed,
              }}
            >
              {!isComplete && !isFailed && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>
            {/* Progress indicator dot */}
            {!isComplete && !isFailed && (
              <div
                className="absolute top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 rounded-full border-3 border-white shadow-lg transition-all duration-300"
                style={{ 
                  left: `calc(${progress}% - 8px)`,
                  backgroundColor: STATUS_COLORS.processing,
                }}
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p 
              className="text-xs sm:text-sm font-medium"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >
              {Math.round(progress)}% Complete
            </p>
            {video?.title && (
              <p 
                className="text-xs sm:text-sm truncate max-w-[200px]"
                style={{ color: theme === "dark" ? "#71717A" : "#A1A1AA" }}
              >
                {video.title}
              </p>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 sm:mt-7 md:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
          {GENERATION_STEPS.map((step, index) => {
            const isCompleted = index < currentStep || (index === currentStep && progress >= (index + 1) * 25);
            const isCurrent = index === currentStep && !isCompleted && !isFailed;
            const isStepFailed = isFailed && index === currentStep;
            
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 sm:gap-3 md:gap-4 rounded-lg border p-3 sm:p-4 md:p-5 transition-all duration-300"
                style={{
                  borderColor: isCompleted ? STATUS_COLORS.completed : isStepFailed ? STATUS_COLORS.failed : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
                  backgroundColor: isCompleted 
                    ? STATUS_COLORS.completed 
                    : isStepFailed 
                    ? STATUS_COLORS.failed 
                    : isCurrent 
                    ? (theme === "dark" ? "#27272A" : "#E4E4E7") 
                    : (theme === "dark" ? "#18181B" : "#F4F4F5"),
                  transform: isCurrent ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isCurrent ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none',
                }}
              >
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isCompleted || isStepFailed
                      ? "bg-white"
                      : isCurrent
                      ? "border-2 border-blue-500 bg-blue-500/10"
                      : "border-2 border-zinc-700 bg-transparent"
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />}
                  {isStepFailed && <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />}
                  {isCurrent && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 animate-spin" />}
                </div>
                <div className="flex-1">
                  <span 
                    className="text-sm sm:text-base md:text-lg font-medium block"
                    style={{ color: isCompleted || isStepFailed ? "#FFFFFF" : (theme === "dark" ? "#FAFAFA" : "#000000") }}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span 
                      className="text-xs sm:text-sm mt-0.5 block opacity-70"
                      style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Message */}
        {isComplete && video?.status === 'completed' && (
          <div className="mt-4 sm:mt-5 md:mt-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 sm:p-5 md:p-6 text-center animate-fadeIn">
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm sm:text-base md:text-lg font-medium text-green-800 dark:text-green-200">
              🎉 Video generation complete! Your video is ready to view.
            </p>
          </div>
        )}

        {/* Error Message */}
        {isFailed && (
          <div className="mt-4 sm:mt-5 md:mt-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 sm:p-5 md:p-6 text-center animate-fadeIn">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm sm:text-base md:text-lg font-medium text-red-800 dark:text-red-200">
              Video generation failed. {video?.error_message || jobError?.message || 'Please try again.'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="w-full sm:flex-1 border-zinc-700 bg-zinc-700 py-4 sm:py-5 md:py-6 text-sm sm:text-base text-zinc-300 hover:bg-zinc-600 transition-all duration-200"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            className="w-full sm:flex-1 py-4 sm:py-5 md:py-6 text-sm sm:text-base transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: isComplete && video?.status === 'completed' ? STATUS_COLORS.completed : '#3B82F6',
              color: '#FFFFFF',
            }}
            disabled={!isComplete || video?.status !== 'completed'}
            onClick={handleViewVideo}
          >
            {isComplete && video?.status === 'completed' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                View Video
              </>
            ) : isFailed ? (
              'Try Again'
            ) : (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}