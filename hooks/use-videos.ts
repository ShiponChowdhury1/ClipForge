"use client";
import { useState, useEffect } from "react";
import { Video } from "@/types";
import { videos as mockVideos } from "@/lib/data/mock-videos";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 500);
  }, []);

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const downloadVideo = (id: string) => {
    const video = videos.find((v) => v.id === id);
    if (video) {
      console.log("Downloading:", video.title);
      // Implement download logic
    }
  };

  return {
    videos,
    loading,
    deleteVideo,
    downloadVideo,
  };
}
