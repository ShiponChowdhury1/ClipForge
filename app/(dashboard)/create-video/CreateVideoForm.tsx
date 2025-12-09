"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TitleInput } from "@/components/video/TitleInput";
import { KeywordsInput } from "@/components/video/KeywordsInput";
import { NegativeKeywordsInput } from "@/components/video/NegativeKeywordsInput";
import { VideoFormatSelector } from "@/components/video/VideoFormatSelector";
import { VideoStyleSelector } from "@/components/video/VideoStyleSelector";
import { VoiceSelector } from "@/components/video/VoiceSelector";
import { ScriptEditor } from "@/components/video/ScriptEditor";
import { useTheme } from "@/components/providers/ThemeProvider";
import { videos } from "@/lib/data/mock-videos";

// Video data interface for API
export interface VideoCreationData {
  title: string;
  category: string;
  keywords: string;
  videoFormat: string;
  videoStyle: string;
  voiceType: string;
  script: string;
}

export default function CreateVideoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  
  // Check if editing existing video
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  // Form state
  const [videoTitle, setVideoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [videoFormat, setVideoFormat] = useState("9:16");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [selectedVoice, setSelectedVoice] = useState("griffin");
  const [script, setScript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load video data if editing
  useEffect(() => {
    if (isEditMode && editId) {
      const video = videos.find(v => v.id === editId);
      if (video) {
        setVideoTitle(video.title);
        setCategory(video.category);
        setKeywords("Fight"); // Default keywords
        setSelectedStyle(video.category.toLowerCase());
        // Load other fields as needed
      }
    }
  }, [isEditMode, editId]);

  // Handle form submission
  const handleCreateVideo = async () => {
    // Validate required fields
    if (!videoTitle.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    if (!category.trim()) {
      toast.error("Please enter a video category");
      return;
    }
    if (!keywords.trim()) {
      toast.error("Please enter keywords");
      return;
    }
    if (!script.trim()) {
      toast.error("Please enter a video script");
      return;
    }

    // Prepare data for API
    const videoData: VideoCreationData = {
      title: videoTitle,
      category: category,
      keywords: keywords,
      videoFormat: videoFormat,
      videoStyle: selectedStyle,
      voiceType: selectedVoice,
      script: script
    };

    console.log("Video Creation Data:", videoData);

    try {
      setIsSubmitting(true);
      
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/create-video', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(videoData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create video');
      // }
      // 
      // const result = await response.json();
      // console.log('Video created:', result);

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        toast.success("Video updated successfully!");
      } else {
        toast.success("Video creation started successfully!");
      }
      
      // Navigate to generate page
      setTimeout(() => {
        router.push("/generate");
      }, 500);
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error("Failed to create video. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  return (
    <div 
      className="p-4 mt-3 sm:p-5 md:p-6 rounded-lg mb-6 sm:mb-7 md:mb-0" 
      style={{ 
        backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
        border: theme === "dark" ? '1px solid #5E5E5E' : '1px solid #E5E7EB',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center gap-2 sm:gap-3 md:gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl lg:text-[32px] font-semibold">
            {isEditMode ? "Edit Video" : "Create New Video"}
          </span>
        </button>
      </div>

      <TitleInput value={videoTitle} onChange={setVideoTitle} />
      
      <KeywordsInput value={category} onChange={setCategory} />
      
      <NegativeKeywordsInput value={keywords} onChange={setKeywords} />
      
      <VideoFormatSelector selectedFormat={videoFormat} onFormatChange={setVideoFormat} />
      
      <VideoStyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
      
      <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
      
      <ScriptEditor value={script} onChange={setScript} />
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          style={{
            minHeight: '44px',
            height: '48px',
            borderRadius: '8px',
            padding: '12px 16px',
            backgroundColor: theme === "dark" ? "#3F3F46" : "#E4E4E7",
            color: theme === "dark" ? "#D4D4D8" : "#3F3F46",
            border: theme === "dark" ? "1px solid #52525B" : "1px solid #D4D4D8"
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateVideo}
          disabled={isSubmitting}
          className="w-full font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          style={{
            minHeight: '44px',
            height: '48px',
            borderRadius: '8px',
            padding: '12px 16px',
            backgroundColor: "#3B82F6",
            color: "#FFFFFF"
          }}
        >
          {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update & Generate" : "Create Video")}
        </button>
      </div>
    </div>
  );
}