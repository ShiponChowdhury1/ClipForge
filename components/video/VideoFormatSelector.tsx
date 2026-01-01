"use client";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCallback, memo } from "react";

interface VideoFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  availableFormats?: string[];
  disabled?: boolean;
}

interface CardStyleConfig {
  width: number;
  height: number;
  borderRadius: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

interface PreviewStyleConfig {
  width: number;
  height: number;
  borderRadius: number;
}

// Format display names for better UX
const FORMAT_LABELS: Record<string, string> = {
  "9:16": "Portrait",
  "16:9": "Landscape",
  "1:1": "Square",
};

// Get card dimensions based on format - exact design specs
const getCardStyle = (format: string): CardStyleConfig => {
  const configs: Record<string, CardStyleConfig> = {
    "9:16": { 
      width: 110, 
      height: 200, 
      borderRadius: 8,
      paddingTop: 20,
      paddingBottom: 16,
      paddingLeft: 20,
      paddingRight: 20,
    },
    "16:9": { 
      width: 150, 
      height: 134, 
      borderRadius: 12,
      paddingTop: 20,
      paddingBottom: 16,
      paddingLeft: 20,
      paddingRight: 20,
    },
  };
  
  return configs[format] || { 
    width: 150, 
    height: 150, 
    borderRadius: 12,
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
  };
};

// Get inner preview box dimensions based on format
const getPreviewStyle = (format: string): PreviewStyleConfig => {
  const configs: Record<string, PreviewStyleConfig> = {
    "9:16": { width: 70, height: 124, borderRadius: 8 },
    "16:9": { width: 110, height: 50, borderRadius: 8 },
  };
  
  return configs[format] || { width: 80, height: 80, borderRadius: 8 };
};

function VideoFormatSelectorComponent({ selectedFormat, onFormatChange, availableFormats, disabled = false }: VideoFormatSelectorProps) {
  const { theme } = useTheme();
  
  // Memoized format change handler
  const handleFormatChange = useCallback((format: string) => {
    if (!disabled) {
      onFormatChange(format);
    }
  }, [onFormatChange, disabled]);
  
  // Use API formats if provided, otherwise fallback to default list (only 9:16 and 16:9)
  const formats = availableFormats && availableFormats.length > 0 
    ? availableFormats.filter(f => f !== "1:1") 
    : ["9:16", "16:9"];
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Format
      </label>
      <div className="flex flex-wrap sm:flex-nowrap gap-4 items-end justify-center sm:justify-start">
        {formats.map((format) => {
          const cardStyle = getCardStyle(format);
          const previewStyle = getPreviewStyle(format);
          const isSelected = selectedFormat === format;
          const label = FORMAT_LABELS[format] || format;
          
          return (
            <button
              key={format}
              onClick={() => handleFormatChange(format)}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`Select ${label} format (${format})`}
              className="flex flex-col items-center justify-between transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: cardStyle.width,
                height: cardStyle.height,
                borderRadius: cardStyle.borderRadius,
                paddingTop: cardStyle.paddingTop,
                paddingBottom: cardStyle.paddingBottom,
                paddingLeft: cardStyle.paddingLeft,
                paddingRight: cardStyle.paddingRight,
                border: isSelected 
                  ? '3px solid #3B82F6' 
                  : `1px solid ${theme === "dark" ? '#5E5E5E' : '#D4D4D8'}`,
                backgroundColor: isSelected 
                  ? (theme === "dark" ? '#1E3A5F' : '#DBEAFE')
                  : (theme === "dark" ? '#18181B' : '#F4F4F5'),
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
              }}
            >
              {/* Inner Preview Box */}
              <div 
                className="flex items-center justify-center transition-all duration-200"
                style={{ 
                  width: previewStyle.width,
                  height: previewStyle.height,
                  borderRadius: previewStyle.borderRadius,
                  border: isSelected
                    ? '2px solid #3B82F6'
                    : `2px solid ${theme === "dark" ? "#52525B" : "#A1A1AA"}`,
                  backgroundColor: isSelected
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                }}
              />
              
              {/* Format Name */}
              <span 
                className="text-sm font-medium mt-2"
                style={{ color: isSelected ? '#3B82F6' : (theme === "dark" ? "#FAFAFA" : "#000000") }}
              >
                {format}
              </span>
              
              {/* Format Label */}
              <span 
                className="text-xs mt-0.5 opacity-70"
                style={{ color: isSelected ? '#3B82F6' : (theme === "dark" ? "#A1A1AA" : "#71717A") }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Memoized export for performance
export const VideoFormatSelector = memo(VideoFormatSelectorComponent);
