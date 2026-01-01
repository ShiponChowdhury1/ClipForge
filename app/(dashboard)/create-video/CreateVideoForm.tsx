"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
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

interface ConfigData {
  video_formats: string[];
  video_styles: string[];
  voice_types: string[];
  max_script_length: number;
  image_count: number;
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
  const [positiveKeywords, setPositiveKeywords] = useState<string[]>([]);
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([]);
  const [videoFormat, setVideoFormat] = useState("9:16");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [script, setScript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  
  // Config API data
  const [videoFormats, setVideoFormats] = useState<string[]>(["9:16", "16:9"]);
  const [videoStyles, setVideoStyles] = useState<string[]>([]);
  const [voiceTypes, setVoiceTypes] = useState<string[]>([]);

  // Memoized validation
  const isFormValid = useMemo(() => {
    return videoTitle.trim() && script.trim() && selectedStyle && selectedVoice;
  }, [videoTitle, script, selectedStyle, selectedVoice]);

  // Load config from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoadingConfig(true);
        const config: ConfigData = await videoApi.fetchConfig();
        setVideoFormats(config.video_formats.filter(f => f !== "1:1"));
        setVideoStyles(config.video_styles);
        setVoiceTypes(config.voice_types);
        
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
        toast.error('Failed to load configuration');
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []); // Only run once on mount

  // Load video data if editing
  useEffect(() => {
    if (isEditMode && editId) {
      const loadVideo = async () => {
        try {
          setIsLoadingVideo(true);
          const video = await videoApi.getVideo(editId);
          setVideoTitle(video.title || '');
          setScript(video.script || '');
          setSelectedStyle(video.style || '');
          setSelectedVoice(video.voice || '');
          if (video.format) setVideoFormat(video.format);
          // Convert keywords from string to array
          if (video.keywords) setPositiveKeywords(video.keywords.split(',').map(k => k.trim()).filter(k => k));
          if (video.negative_keywords) setNegativeKeywords(video.negative_keywords.split(',').map(k => k.trim()).filter(k => k));
          toast.success('Video data loaded successfully');
        } catch (err) {
          console.error('Failed to load video:', err);
          toast.error('Failed to load video data');
        } finally {
          setIsLoadingVideo(false);
        }
      };
      loadVideo();
    }
  }, [isEditMode, editId]);

  // Memoized keyword handlers
  const handlePositiveKeywordsChange = useCallback((value: string) => {
    setPositiveKeywords(value.split(',').map(k => k.trim()).filter(k => k));
  }, []);

  const handleNegativeKeywordsChange = useCallback((value: string) => {
    setNegativeKeywords(value.split(',').map(k => k.trim()).filter(k => k));
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // Handle form submission
  const handleCreateVideo = useCallback(async () => {
    // Validate required fields with specific messages
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
      title: videoTitle.trim(),
      category: category.trim(),
      format: videoFormat,
      style: selectedStyle,
      voice: selectedVoice,
      script: script.trim(),
      keywords: positiveKeywords.join(', '),
      negative_keywords: negativeKeywords.join(', '),
      // Optimal caption settings - FULL TEXT VISIBILITY (100%)
      caption_settings: {
        position: 'bottom-center',
        margin_bottom: '18%',
        margin_sides: '10%',
        font_size: '4.5%',
        background: 'rgba(0,0,0,0.8)',
        text_color: '#FFFFFF',
        font_weight: 'bold',
        max_width: '80%',
        padding: '10px 20px',
        line_height: 1.25,
        border_radius: '6px',
        text_shadow: '2px 2px 4px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.9), 2px -2px 4px rgba(0,0,0,0.9), -2px 2px 4px rgba(0,0,0,0.9)',
        text_align: 'center'
      }
    };

    try {
      setIsSubmitting(true);
      toast.info("Starting video generation...");
      
      const result = await videoApi.createVideo(videoData);
      
      toast.success("Video creation started! 🎬");
      
      // Navigate to generate page with video ID
      router.push(`/generate?videoId=${result.id}`);
    } catch (error) {
      console.error("Error creating video:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to create video";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [videoTitle, script, selectedStyle, selectedVoice, category, videoFormat, positiveKeywords, negativeKeywords, router]);

  // Loading state
  if (isLoadingConfig || isLoadingVideo) {
    return (
      <div 
        className="p-4 mt-3 sm:p-5 md:p-6 rounded-lg mb-6 sm:mb-7 md:mb-0 animate-pulse" 
        style={{ 
          backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
          border: theme === "dark" ? '1px solid #5E5E5E' : '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-48 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-10 w-full rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 mt-3 sm:p-5 md:p-6 rounded-lg mb-6 sm:mb-7 md:mb-0 transition-all duration-300" 
      style={{ 
        backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
        border: theme === "dark" ? '1px solid #5E5E5E' : '1px solid #E5E7EB',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center gap-2 sm:gap-3 md:gap-4">
        <button 
          onClick={handleCancel}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity duration-200"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl lg:text-[32px] font-semibold">
            {isEditMode ? "Edit Video" : "Create New Video"}
          </span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-1">
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
        
        <VideoFormatSelector 
          selectedFormat={videoFormat} 
          onFormatChange={setVideoFormat} 
          availableFormats={videoFormats}
          disabled={isSubmitting}
        />
        
        <VideoStyleSelector 
          selectedStyle={selectedStyle} 
          onStyleChange={setSelectedStyle}
          availableStyles={videoStyles}
          disabled={isSubmitting}
        />
        
        <VoiceSelector 
          selectedVoice={selectedVoice} 
          onVoiceChange={setSelectedVoice}
          availableVoices={voiceTypes}
        />
        
        <ScriptEditor value={script} onChange={setScript} />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
          disabled={isSubmitting || !isFormValid}
          className="w-full font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          style={{
            minHeight: '44px',
            height: '48px',
            borderRadius: '8px',
            padding: '12px 16px',
            backgroundColor: isFormValid ? "#3B82F6" : "#6B7280",
            color: "#FFFFFF"
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {isEditMode ? "Update & Generate" : "Create Video"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}