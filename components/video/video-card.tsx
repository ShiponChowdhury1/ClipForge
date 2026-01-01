"use client";
import React, { useState, useRef } from "react";
import { Download, Trash2, Play, Pause, X, Maximize, Loader, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Video } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { videoApi } from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

export default function VideoCard({ video, onDelete, onRegenerate }: VideoCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  // Get video URL - use download endpoint by video ID
  const videoUrl = video.status === 'completed' 
    ? videoApi.getVideoUrlById(video.id)
    : '';
  
  // Get thumbnail URL if available
  const thumbnailUrl = video.thumbnail_path
    ? videoApi.getThumbnailUrl(video.thumbnail_path)
    : video.thumbnail || '';

  // Format created date
  const createdAgo = video.created_at 
    ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true })
    : video.createdAgo || 'Recently';

  // Get display category
  const displayCategory = video.category || video.style || 'Video';

  // Get status icon
  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
      case 'pending':
        return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (video.status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return video.status;
    }
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRegenerating) return;
    
    setIsRegenerating(true);
    try {
      // TODO: Implement regenerate API endpoint
      console.log('Regenerate not implemented yet for video:', video.id);
      alert('Regenerate feature is not available in the current API');
      
      // Call parent callback if provided
      if (onRegenerate) {
        onRegenerate(String(video.id));
      }
    } catch (error) {
      console.error('Failed to regenerate video:', error);
      alert('Failed to regenerate video. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCardClick = () => {
    if (video.status !== 'completed' || !videoUrl) return;
    
    if (!isPlaying) {
      setIsPlaying(true);
      videoRef.current?.play();
    } else {
      setIsPlaying(false);
      videoRef.current?.pause();
    }
  };

  const handleFullscreen = () => {
    if (video.status === 'completed' && videoUrl) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFullscreenVideo = async () => {
    if (fullscreenVideoRef.current) {
      try {
        if (fullscreenVideoRef.current.requestFullscreen) {
          await fullscreenVideoRef.current.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    }
  };

  return (
    <>
      <Card className="overflow-hidden w-full max-w-full sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px] mx-auto" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          borderRadius: '12px', 
          padding: '12px',
          height: 'auto',
          gap: '16px',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}>
        <div 
          className={`relative bg-zinc-800 group rounded-xl h-[200px] sm:h-[220px] md:h-[250px] lg:h-[270px] xl:h-[290px] overflow-hidden ${video.status === 'completed' ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleCardClick}
        >
          {video.status === 'completed' && videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl}
                className="h-full w-full object-cover rounded-xl"
                loop
                muted
                playsInline
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                </div>
              )}

              {isPlaying && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Pause className="h-5 w-5 fill-white text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Fullscreen Icon - Bottom Right */}
              <div 
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors cursor-pointer">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
              {getStatusIcon()}
              <p className="text-white text-sm mt-2">{getStatusText()}</p>
            </div>
          )}
        </div>

      <CardContent className="p-0 pt-3 sm:pt-4">
        <div className="flex items-start justify-between mb-1">
          <h3 
            className="flex-1 text-base sm:text-lg md:text-xl font-semibold truncate"
            style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
          >{video.title}</h3>
          <div className="flex items-center gap-1 ml-2">
            {getStatusIcon()}
          </div>
        </div>
        <p 
          className="text-xs sm:text-sm md:text-base truncate"
          style={{ color: theme === "dark" ? "#A1A1AA" : "#52525B" }}
        >{displayCategory}</p>
        <p 
          className="text-xs"
          style={{ color: theme === "dark" ? "#71717A" : "#71717A" }}
        >Created {createdAgo}</p>
        
        {video.error_message && (
          <div className="mt-2 p-2 rounded bg-red-500/20 border border-red-500">
            <p className="text-xs text-red-300">{video.error_message}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 pt-3 sm:pt-4" style={{ gap: '20px' }}>
        {video.status === 'failed' ? (
          <>
            <Button 
              className="flex-1 bg-[#F59E0B] text-white! hover:bg-[#F59E0B]/90 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base" 
              style={{ border: 'none', color: '#FFFFFF' }}
              disabled={isRegenerating}
              onClick={handleRegenerate}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
              style={{ backgroundColor: 'transparent' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="h-6 w-6" style={{ color: '#E33629' }} />
            </Button>
          </>
        ) : (
          <>
            <Button 
              className="flex-1 bg-[#3B82F6] text-white! hover:bg-[#3B82F6]/90 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base" 
              style={{ border: 'none', color: '#FFFFFF' }}
              disabled={video.status !== 'completed'}
              onClick={(e) => {
                e.stopPropagation();
                if (video.status === 'completed') {
                  const currentPath = window.location.pathname;
                  router.push(`/video/${video.id}?from=${encodeURIComponent(currentPath)}`);
                }
              }}
            >
              <Download className="h-5 w-5" />
              {video.status === 'completed' ? 'Download' : 'Processing...'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
              style={{ backgroundColor: 'transparent' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="h-6 w-6" style={{ color: '#E33629' }} />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>

    {/* Fullscreen Video Modal */}
    {showModal && video.status === 'completed' && videoUrl && (
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4"
        onClick={handleCloseModal}
      >
        <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
          <div className="absolute -top-12 right-0 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <video
            ref={fullscreenVideoRef}
            className="w-full rounded-lg shadow-2xl"
            controls
            autoPlay
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={() => setShowDeleteModal(false)}
      >
        <div 
          className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="mb-4 text-center text-lg font-semibold text-zinc-50">
            Are you sure you want to delete this video?
          </h3>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowDeleteModal(false);
                onDelete?.(String(video.id));
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
