"use client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download, RotateCcw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { videos } from "@/lib/data/mock-videos";
import { useTheme } from "@/components/providers/ThemeProvider";
import { toast } from "react-toastify";

export default function VideoDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const videoId = params.id as string;
  
  // Get the referrer from URL query params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const from = searchParams.get('from') || '/';
  
  const video = videos.find((v) => v.id === videoId);
  
  if (!video) {
    return <div>Video not found</div>;
  }

  // Handle Regenerate
  const handleRegenerate = () => {
    toast.success("Regenerating video...");
    setTimeout(() => {
      router.push("/generate");
    }, 500);
  };

  // Handle Edit Details
  const handleEditDetails = () => {
    router.push(`/create-video?edit=${videoId}`);
  };

  // Handle Download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading video...");
  };

  // Mock generated images for the video
  const generatedImages = [
    video.thumbnail,
    video.thumbnail,
    video.thumbnail,
    video.thumbnail,
    video.thumbnail,
    video.thumbnail,
    video.thumbnail,
  ];

  return (
    <div 
      className="w-full max-w-full lg:mt-3 mx-auto p-4 sm:p-5 md:p-6 rounded-lg overflow-hidden" 
      style={{ 
        backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
        border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8 flex items-center gap-2 sm:gap-3 md:gap-4">
        <button 
          onClick={() => router.push(from)}
          className="flex items-center gap-1 sm:gap-2 hover:opacity-70"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg md:text-xl font-semibold">Back</span>
        </button>
      </div>

      {/* Generated Images */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-2 sm:mb-3 text-sm sm:text-base font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Generated Image</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
          {generatedImages.map((img, idx) => (
            <div
              key={idx}
              className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg border"
              style={{ borderColor: theme === "dark" ? '#5E5E5E' : '#D4D4D8' }}
            >
              <video
                src={video.videoUrl}
                className="h-full w-full object-cover"
                muted
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Preview */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-2 sm:mb-3 text-sm sm:text-base font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Video Preview</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <video
            src={video.videoUrl}
            controls
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Video Details */}
      <div 
        className="mb-4 sm:mb-5 md:mb-6 rounded-lg p-3 sm:p-4" 
        style={{ 
          backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
          border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
          boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
        }}
      >
        <h2 
          className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Video Details</h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Title:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.title}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Keywords:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >Fight</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Negative Keywords:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >Fight</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Format:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >9:16</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Video Style:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >{video.category}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span 
              className="w-full sm:w-40 md:w-48 text-xs sm:text-sm font-medium sm:font-normal mb-1 sm:mb-0"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
            >Voice Type:</span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
            >Griffin</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleRegenerate}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-700 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Regenerate
        </Button>
        <Button
          onClick={handleEditDetails}
          variant="outline"
          className="w-full sm:flex-1 border-zinc-700 py-4 sm:py-5 md:py-6 text-xs sm:text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Edit Details
        </Button>
        <Button 
          onClick={handleDownload}
          className="w-full sm:flex-1 bg-[#3B82F6] py-4 sm:py-5 md:py-6 text-xs sm:text-sm hover:bg-[#3B82F6]/90"
        >
          <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
