"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function GenerateVideoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: 1, label: "Generating Prompts" },
    { id: 2, label: "Creating Image" },
    { id: 3, label: "Creating Narration" },
    { id: 4, label: "Building Video" },
  ];

  // Calculate current step based on progress (derived state)
  const currentStep = progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="p-4 sm:p-5 mt-2 md:p-6 rounded-lg min-h-[400px] sm:min-h-[500px] md:min-h-[600px]" 
      style={{ 
        backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
        border: theme === "dark" ? '1px solid #5E5E5E' : 'none',
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
          <span className="text-base sm:text-lg md:text-xl lg:text-[32px] font-semibold">Create New Video</span>
        </button>
      </div>

      {/* Generate Section */}
      <div className="mt-6 sm:mt-8 md:mt-12">
        <h2 
          className="mb-4 sm:mb-5 md:mb-6 text-lg sm:text-xl md:text-2xl font-semibold"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >Generate</h2>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div 
            className="relative h-1.5 sm:h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: theme === "dark" ? "#3F3F46" : "#D4D4D8" }}
          >
            <div
              className="h-full bg-[#3B82F6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute right-0 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 rounded-full border-2 sm:border-4 border-[#3B82F6] bg-white"
                style={{ right: '-6px' }}
              />
            </div>
          </div>
          <p 
            className="mt-1 sm:mt-2 text-xs sm:text-sm"
            style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
          >{progress}% Complete</p>
        </div>

        {/* Steps */}
        <div className="mt-6 sm:mt-7 md:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep || (index === currentStep && progress >= (index + 1) * 25);
            const isCurrent = index === currentStep && !isCompleted;
            
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 sm:gap-3 md:gap-4 rounded-lg border p-3 sm:p-4 md:p-6 transition-colors"
                style={{
                  borderColor: isCompleted ? "#16A34A" : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
                  backgroundColor: isCompleted ? "#16A34A" : isCurrent ? (theme === "dark" ? "#27272A" : "#E4E4E7") : (theme === "dark" ? "#18181B" : "#F4F4F5")
                }}
              >
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded ${
                    isCompleted
                      ? "bg-white"
                      : "border-2 border-zinc-700 bg-transparent"
                  }`}
                >
                  {isCompleted && (
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span 
                  className="text-sm sm:text-base md:text-lg font-medium"
                  style={{ color: isCompleted ? "#FFFFFF" : (theme === "dark" ? "#A1A1AA" : "#71717A") }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Success Message */}
        {isComplete && (
          <div className="mt-4 sm:mt-5 md:mt-6 rounded-lg bg-green-100 p-4 sm:p-5 md:p-6 text-center">
            <p className="text-sm sm:text-base md:text-lg font-medium text-green-800">
              Video generation complete! Review in the next step.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="w-full sm:flex-1 border-zinc-700 bg-zinc-700 py-4 sm:py-5 md:py-6 text-sm sm:text-base text-zinc-300 hover:bg-zinc-600"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button 
            className="w-full sm:flex-1 bg-[#3B82F6] py-4 sm:py-5 md:py-6 text-sm sm:text-base hover:bg-[#2563EB]"
            disabled={!isComplete}
            onClick={() => router.push("/video/1")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}