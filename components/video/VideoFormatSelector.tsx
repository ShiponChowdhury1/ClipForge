import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  availableFormats?: string[];
}

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
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 md:gap-4 items-end justify-center sm:justify-start">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => onFormatChange(format)}
            className="flex flex-col items-center justify-center w-28 h-32 sm:w-[150px] sm:h-[134px]"
            style={{
              borderRadius: '12px',
              borderWidth: selectedFormat === format ? '2px' : '1px',
              padding: '12px sm:20px',
              gap: '12px',
              opacity: 1,
              borderColor: selectedFormat === format ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
              backgroundColor: selectedFormat === format ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
            }}
          >
            <div className="mb-2 sm:mb-3 h-10 w-16 sm:h-12 sm:w-20 rounded border" style={{ borderColor: theme === "dark" ? "#52525B" : "#A1A1AA" }}></div>
            <span className="text-xs sm:text-sm" style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}>{format}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
