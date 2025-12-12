"use client";
import React, { useState, useRef } from "react";
import { Download, Trash2, Play, Pause, X, Maximize } from "lucide-react";
import { Video } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const handleCardClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      videoRef.current?.play();
    } else {
      setIsPlaying(false);
      videoRef.current?.pause();
    }
  };

  const handleFullscreen = () => {
    setShowModal(true);
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
          className="relative bg-zinc-800 cursor-pointer group rounded-xl h-[200px] sm:h-[220px] md:h-[250px] lg:h-[270px] xl:h-[290px] overflow-hidden"
          onClick={handleCardClick}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
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
        </div>

      <CardContent className="p-0 pt-3 sm:pt-4">
        <h3 
          className="mb-1 text-base sm:text-lg md:text-xl font-semibold truncate"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >{video.title}</h3>
        <p 
          className="text-xs sm:text-sm md:text-base truncate"
          style={{ color: theme === "dark" ? "#A1A1AA" : "#52525B" }}
        >{video.category}</p>
        <p 
          className="text-xs"
          style={{ color: theme === "dark" ? "#71717A" : "#71717A" }}
        >Created {video.createdAgo}</p>
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4" style={{ gap: '20px' }}>
        <Button 
          className="flex-1 bg-[#3B82F6] text-white! hover:bg-[#3B82F6]/90 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base" 
          style={{ border: 'none', color: '#FFFFFF' }}
          onClick={(e) => {
            e.stopPropagation();
            const currentPath = window.location.pathname;
            router.push(`/video/${video.id}?from=${encodeURIComponent(currentPath)}`);
          }}
        >
          <Download className="h-5 w-5" />
          Download
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
      </CardFooter>
    </Card>

    {/* Fullscreen Video Modal */}
    {showModal && (
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
            src={video.videoUrl}
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
                onDelete?.(video.id);
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
