"use client";
import React, { useState, useMemo } from "react";
import useSWR from 'swr';
import Header from "@/components/layout/header";
import { AllVideosFilter } from "@/components/video/AllVideosFilter";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useTheme } from "@/components/providers/ThemeProvider";
import { videoApi } from "@/lib/api/client";
import { Video } from "@/types";
import { toast } from "react-toastify";
import { videos as mockVideos } from "@/lib/data/mock-videos";

const fetcher = () => videoApi.listVideos();
const queueFetcher = () => videoApi.getQueue();

export default function AllVideosPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch videos with SWR - auto refresh every 10 seconds
  const { data: apiVideos, error, isLoading, mutate } = useSWR<Video[]>('/videos', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    onError: (err) => {
      console.error('Failed to load videos:', err);
      if (err.code === 'ECONNABORTED') {
        toast.error('Loading videos is taking longer than expected. Using cached data...');
      }
    }
  });

  // Fetch queue (processing videos) - refresh every 3 seconds
  const { data: queueData } = useSWR('/queue', queueFetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    onSuccess: (data) => {
      console.log("✅ Queue data fetched:", data);
    },
    onError: (err) => {
      console.error("❌ Queue fetch error:", err);
    }
  });

  // Use API videos if available, fallback to mock videos on error
  const videos = useMemo(() => {
    // If API returned videos, use them
    if (apiVideos && apiVideos.length > 0) {
      console.log("Using API videos:", apiVideos.length);
      return apiVideos;
    }
    
    // If there's an error, use mock videos
    if (error) {
      console.log("Using mock videos due to API error");
      return mockVideos;
    }
    
    // Default to empty array while loading
    return [];
  }, [apiVideos, error]);

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
    const video = videos?.find(v => String(v.id) === String(id));
    if (video && video.status === 'completed') {
      // Use video_path for local videos, otherwise use API
      const url = video.video_path?.startsWith('/') 
        ? video.video_path 
        : videoApi.getVideoUrlById(id);
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

  const filteredVideos = (videos || []).filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
      (video.category && video.category.toLowerCase() === filter.toLowerCase()) ||
      (video.style && video.style.toLowerCase() === filter.toLowerCase()) ||
      (video.status && video.status.toLowerCase() === filter.toLowerCase());
    
    // Date filtering
    let matchesDate = true;
    if (selectedDate) {
      // Parse selected date (format: YYYY-MM-DD from input)
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      
      // Parse video creation date
      if (video.created_at) {
        const videoDate = new Date(video.created_at);
        videoDate.setHours(0, 0, 0, 0);
        
        // Match if same date
        matchesDate = selected.getTime() === videoDate.getTime();
      } else {
        matchesDate = false;
      }
    }
    
    return matchesSearch && matchesFilter && matchesDate;
  });
  return (
    <>
      <Header 
        title="All Generated Video" 
        description="Manage & Review Your Generated Videos"
        icon="/logo/video.png"
      />

      <div
        className="rounded-lg p-6"
        style={{ 
          backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF ",
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-6 text-lg font-medium"
          style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }}
        >
          All Generated Video
        </h2>

        <AllVideosFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={filter}
          onFilterChange={setFilter}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#F9FAFB",
              borderColor: theme === "dark" ? "#3F3F46" : "#E5E7EB"
            }}
          >
            <p style={{ color: theme === "dark" ? "#A1A1AA" : "#6B7280" }} className="text-sm">Total Videos</p>
            <p style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }} className="text-3xl font-bold">{videos?.length || 0}</p>
          </div>
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#F0FDF4",
              borderColor: theme === "dark" ? "#3F3F46" : "#BBF7D0"
            }}
          >
            <p style={{ color: theme === "dark" ? "#A1A1AA" : "#6B7280" }} className="text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-500">
              {videos?.filter(v => v.status === 'completed').length || 0}
            </p>
          </div>
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#FEF3C7",
              borderColor: theme === "dark" ? "#3F3F46" : "#FDE68A"
            }}
          >
            <p style={{ color: theme === "dark" ? "#A1A1AA" : "#6B7280" }} className="text-sm">Processing</p>
            <p className="text-3xl font-bold text-yellow-500">
              {videos?.filter(v => v.status === 'processing' || v.status === 'pending').length || 0}
            </p>
          </div>
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#FEE2E2",
              borderColor: theme === "dark" ? "#3F3F46" : "#FECACA"
            }}
          >
            <p style={{ color: theme === "dark" ? "#A1A1AA" : "#6B7280" }} className="text-sm">Failed</p>
            <p className="text-3xl font-bold text-red-500">
              {videos?.filter(v => v.status === 'failed').length || 0}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }} className="text-lg">
              Loading videos...
            </div>
          </div>
        ) : error ? (
          <div 
            className="border rounded-lg p-4"
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
        ) : (
          <VideoGrid
            videos={filteredVideos}
            queueData={queueData || []}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </div>
    </>
  );
}
