import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  availableFormats?: string[];
}

// Get aspect ratio preview dimensions based on format
const getFormatPreviewStyle = (format: string) => {
  switch (format) {
    case "9:16": // Vertical/Portrait (TikTok, Reels, Shorts)
      return { width: 36, height: 64 }; // 9:16 ratio
    case "16:9": // Horizontal/Landscape (YouTube)
      return { width: 64, height: 36 }; // 16:9 ratio
    case "1:1": // Square (Instagram)
      return { width: 48, height: 48 }; // 1:1 ratio
    default:
      return { width: 48, height: 48 };
  }
};

// Get format label/description
const getFormatLabel = (format: string) => {
  switch (format) {
    case "9:16":
      return { name: "9:16", desc: "Portrait" };
    case "16:9":
      return { name: "16:9", desc: "Landscape" };
    case "1:1":
      return { name: "1:1", desc: "Square" };
    default:
      return { name: format, desc: "" };
  }
};

export function VideoFormatSelector({ selectedFormat, onFormatChange, availableFormats }: VideoFormatSelectorProps) {
  const { theme } = useTheme();
  // Use API formats if provided, otherwise fallback to default list
  const formats = availableFormats && availableFormats.length > 0 ? availableFormats : ["9:16", "16:9", "1:1"];
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Format
      </label>
      <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 md:gap-5 items-end justify-center sm:justify-start">
        {formats.map((format) => {
          const previewSize = getFormatPreviewStyle(format);
          const formatLabel = getFormatLabel(format);
          const isSelected = selectedFormat === format;
          
          return (
            <button
              key={format}
              onClick={() => onFormatChange(format)}
              className="flex flex-col items-center justify-center p-3 sm:p-4 transition-all duration-200"
              style={{
                borderRadius: '12px',
                border: isSelected 
                  ? '2px solid #3B82F6' 
                  : `1px solid ${theme === "dark" ? '#3F3F46' : '#D4D4D8'}`,
                backgroundColor: isSelected 
                  ? (theme === "dark" ? '#1E3A5F' : '#DBEAFE') 
                  : (theme === "dark" ? '#18181B' : '#F4F4F5'),
                minWidth: '100px',
                minHeight: '120px',
              }}
            >
              {/* Aspect Ratio Preview Box */}
              <div 
                className="rounded border-2 flex items-center justify-center mb-2"
                style={{ 
                  width: previewSize.width,
                  height: previewSize.height,
                  borderColor: isSelected ? '#3B82F6' : (theme === "dark" ? "#52525B" : "#A1A1AA"),
                  backgroundColor: isSelected 
                    ? (theme === "dark" ? '#3B82F6' : '#93C5FD')
                    : (theme === "dark" ? '#27272A' : '#E4E4E7'),
                }}
              >
                {/* Play icon inside preview */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill={isSelected ? '#FFFFFF' : (theme === "dark" ? '#71717A' : '#A1A1AA')}
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              {/* Format Name */}
              <span 
                className="text-sm sm:text-base font-semibold"
                style={{ color: isSelected ? '#3B82F6' : (theme === "dark" ? "#FAFAFA" : "#000000") }}
              >
                {formatLabel.name}
              </span>
              
              {/* Format Description */}
              <span 
                className="text-xs"
                style={{ color: theme === "dark" ? "#71717A" : "#A1A1AA" }}
              >
                {formatLabel.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
