"use client";
import React from "react";
import useSWR from 'swr';
import Header from "@/components/layout/header";
import VideoCard from "@/components/video/video-card";
import { useTheme } from "@/components/providers/ThemeProvider";
import { videoApi } from "@/lib/api/client";
import { Video } from "@/types";
import { toast } from "react-toastify";

const fetcher = () => videoApi.listVideos();

export default function DashboardPage() {
  const { theme } = useTheme();

  // Fetch videos with SWR - auto refresh every 10 seconds with error retry
  const { data: videos, error, isLoading, mutate } = useSWR<Video[]>('/videos', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
    onError: (err) => {
      console.error('Failed to load videos:', err);
    }
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      await videoApi.deleteVideo(id);
      toast.success("Video deleted successfully!");
      mutate(); // Refresh the video list
    } catch (error) {
      console.error('Failed to delete video:', error);
      toast.error("Failed to delete video");
    }
  };

  const handleDownload = (id: string) => {
    const video = videos?.find(v => v.id === id);
    if (video && video.status === 'completed') {
      const url = videoApi.getVideoUrlById(id);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Video download started!");
    } else {
      toast.error("Video not available for download");
    }
  };

  // Show only first 6 videos on dashboard
  const recentVideos = (videos || []).slice(0, 6);

  return (
    <>
    <Header 
           title="Clipforge" 
           description="Transform scripts into AI-generated videos"
           icon="/logo/headerLogo.png"
         />

      <div 
        className="rounded-lg p-6"
        style={{ 
          backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
      
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-6 text-[24px] font-medium"
          style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }}
        >
          Recently Generated Video
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }} className="text-lg">
              Loading videos...
            </div>
          </div>
        ) : error ? (
          <div 
            className="border rounded-lg p-4 text-center"
            style={{
              backgroundColor: theme === "dark" ? "#7F1D1D" : "#FEE2E2",
              borderColor: theme === "dark" ? "#991B1B" : "#EF4444",
              color: theme === "dark" ? "#FCA5A5" : "#991B1B"
            }}
          >
            <p className="font-semibold mb-2">⚠️ Unable to connect to backend API</p>
            <p className="text-sm">Please make sure your backend server is running at:</p>
            <p className="text-sm font-mono mt-1">http://10.10.12.26:8000</p>
          </div>
        ) : recentVideos.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }} className="text-lg">
              No videos yet. Create your first video!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {recentVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
