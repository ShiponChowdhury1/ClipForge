"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TitleInput } from "@/components/video/TitleInput";
import { KeywordsInput } from "@/components/video/KeywordsInput";
import { PositiveKeywordsInput } from "@/components/video/PositiveKeywordsInput";
import { NegativeKeywordsInput } from "@/components/video/NegativeKeywordsInput";
import { VideoFormatSelector } from "@/components/video/VideoFormatSelector";
import { VideoStyleSelector } from "@/components/video/VideoStyleSelector";
import { VoiceSelector } from "@/components/video/VoiceSelector";
import { ScriptEditor } from "@/components/video/ScriptEditor";
import { useTheme } from "@/components/providers/ThemeProvider";
import { videoApi } from "@/lib/api/client";
import { VideoCreateRequest } from "@/types";

type ConfigData = {
  video_formats: string[];
  video_styles: string[];
  voice_types: string[];
  max_script_length: number;
  image_count: number;
};

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
  const [positiveKeywords, setPositiveKeywords] = useState<string[]>([]);
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([]);
  const [videoFormat, setVideoFormat] = useState("1280x720");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [script, setScript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // API data

  // Config API data
  const [videoFormats, setVideoFormats] = useState<string[]>(["9:16", "16:9", "1:1"]);
  const [videoStyles, setVideoStyles] = useState<string[]>([]);
  const [voiceTypes, setVoiceTypes] = useState<string[]>([]);
  // maxScriptLength and imageCount are available if needed for validation/UI

  // Load config from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config: ConfigData = await videoApi.fetchConfig();
        setVideoFormats(config.video_formats);
        setVideoStyles(config.video_styles);
        setVoiceTypes(config.voice_types);
        // config.max_script_length and config.image_count available if needed
        // Set defaults only if not already set
        if (config.video_styles.length > 0 && !selectedStyle) {
          setSelectedStyle(config.video_styles[0]);
        }
        if (config.voice_types.length > 0 && !selectedVoice) {
          setSelectedVoice(config.voice_types[0]);
        }
        if (config.video_formats.length > 0 && !videoFormat) {
          setVideoFormat(config.video_formats[0]);
        }
      } catch (err) {
        console.error('Failed to fetch config:', err);
      }
    };
    fetchConfig();
  }, [selectedStyle, selectedVoice, videoFormat]);

  // Load video data if editing
  useEffect(() => {
    if (isEditMode && editId) {
      const loadVideo = async () => {
        try {
          const video = await videoApi.getVideo(editId);
          setVideoTitle(video.title);
          setScript(video.script);
          setSelectedStyle(video.style);
          setSelectedVoice(video.voice);
          if (video.format) setVideoFormat(video.format);
          // Convert keywords from string to array
          if (video.keywords) setPositiveKeywords(video.keywords.split(',').map(k => k.trim()).filter(k => k));
          if (video.negative_keywords) setNegativeKeywords(video.negative_keywords.split(',').map(k => k.trim()).filter(k => k));
        } catch (err) {
          console.error('Failed to load video:', err);
          toast.error('Failed to load video data');
        }
      };
      loadVideo();
    }
  }, [isEditMode, editId]);

  // Handle form submission
  const handleCreateVideo = async () => {
    // Validate required fields
    if (!videoTitle.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    if (!script.trim()) {
      toast.error("Please enter a video script");
      return;
    }
    if (!selectedStyle) {
      toast.error("Please select a video style");
      return;
    }
    if (!selectedVoice) {
      toast.error("Please select a voice");
      return;
    }

    // Prepare data for API
    const videoData: VideoCreateRequest = {
      title: videoTitle,
      category: category,
      format: videoFormat,
      style: selectedStyle,
      voice: selectedVoice,
      script: script,
      keywords: positiveKeywords.join(', '),
      negative_keywords: negativeKeywords.join(', '),
    };

    console.log("Video Creation Data:", videoData);

    try {
      setIsSubmitting(true);
      
      const result = await videoApi.createVideo(videoData);
      console.log('Video created:', result);
      
      toast.success("Video creation started successfully!");
      
      // Navigate to generate page with video ID
      setTimeout(() => {
        router.push(`/generate?videoId=${result.id}`);
      }, 500);
    } catch (error) {
      console.error("Error creating video:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to create video";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Helper functions for keyword inputs
  const handlePositiveKeywordsChange = (value: string) => {
    setPositiveKeywords(value.split(',').map(k => k.trim()).filter(k => k));
  };

  const handleNegativeKeywordsChange = (value: string) => {
    setNegativeKeywords(value.split(',').map(k => k.trim()).filter(k => k));
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

      {/* Always show form immediately, load data in background */}
      <>
        <TitleInput value={videoTitle} onChange={setVideoTitle} />
        
        <KeywordsInput value={category} onChange={setCategory} />
        
        <PositiveKeywordsInput 
          value={positiveKeywords.join(', ')} 
          onChange={handlePositiveKeywordsChange} 
          />
          
          <NegativeKeywordsInput 
            value={negativeKeywords.join(', ')} 
            onChange={handleNegativeKeywordsChange} 
          />
          
          <VideoFormatSelector selectedFormat={videoFormat} onFormatChange={setVideoFormat} availableFormats={videoFormats} />
          
    
          
          <VideoStyleSelector 
            selectedStyle={selectedStyle} 
            onStyleChange={setSelectedStyle}
            availableStyles={videoStyles}
          />
          
          <VoiceSelector 
            selectedVoice={selectedVoice} 
            onVoiceChange={setSelectedVoice}
            availableVoices={voiceTypes}
          />
          
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
              {isSubmitting ? "Creating..." : (isEditMode ? "Update & Generate" : "Create Video")}
            </button>
          </div>
      </>
    </div>
  );
}