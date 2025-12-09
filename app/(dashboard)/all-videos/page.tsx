"use client";
import React, { useState } from "react";
import Header from "@/components/layout/header";
import { videos } from "@/lib/data/mock-videos";
import { AllVideosFilter } from "@/components/video/AllVideosFilter";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function AllVideosPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const handleDelete = (id: string) => {
    console.log("Delete video:", id);
  };

  const handleDownload = (id: string) => {
    console.log("Download video:", id);
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || video.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
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

        <VideoGrid
          videos={filteredVideos}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </div>
    </>
  );
}
