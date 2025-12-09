"use client";
import React from "react";
import Header from "@/components/layout/header";
import VideoCard from "@/components/video/video-card";
import { videos } from "@/lib/data/mock-videos";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function DashboardPage() {
  const { theme } = useTheme();
  const handleDelete = (id: string) => {
    console.log("Delete video:", id);
  };

  const handleDownload = (id: string) => {
    console.log("Download video:", id);
  };

  // Show only first 3 videos on dashboard
  const recentVideos = videos.slice(0, 6);

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
      </div>
    </>
  );
}
