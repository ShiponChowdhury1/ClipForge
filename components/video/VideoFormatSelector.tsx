import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export function VideoFormatSelector({ selectedFormat, onFormatChange }: VideoFormatSelectorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Format
      </label>
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 md:gap-4 items-end justify-center sm:justify-start">
        <button
          onClick={() => onFormatChange("9:16")}
          className="flex flex-col items-center justify-center w-28 h-48 sm:w-[150px] sm:h-[240px]"
          style={{
            borderRadius: '12px',
            borderWidth: selectedFormat === "9:16" ? '2px' : '1px',
            padding: '12px sm:20px',
            gap: '12px',
            opacity: 1,
            borderColor: selectedFormat === "9:16" ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
            backgroundColor: selectedFormat === "9:16" ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
          }}
        >
          <div className="mb-2 sm:mb-3 h-32 w-12 sm:h-40 sm:w-16 rounded border border-zinc-600"></div>
          <span className="text-xs sm:text-sm text-zinc-400">9:16</span>
        </button>
        <button
          onClick={() => onFormatChange("1:1")}
          className="flex flex-col items-center justify-center w-28 h-40 sm:w-[150px] sm:h-[194px]"
          style={{
            borderRadius: '12px',
            borderWidth: selectedFormat === "1:1" ? '2px' : '1px',
            padding: '12px sm:20px',
            gap: '12px',
            opacity: 1,
            borderColor: selectedFormat === "1:1" ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
            backgroundColor: selectedFormat === "1:1" ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
          }}
        >
          <div className="mb-2 sm:mb-3 h-20 w-20 sm:h-24 sm:w-24 rounded border border-zinc-600"></div>
          <span className="text-xs sm:text-sm text-zinc-400">1:1</span>
        </button>
        <button
          onClick={() => onFormatChange("16:9")}
          className="flex flex-col items-center justify-center w-28 h-32 sm:w-[150px] sm:h-[134px]"
          style={{
            borderRadius: '12px',
            borderWidth: selectedFormat === "16:9" ? '2px' : '1px',
            padding: '12px sm:20px',
            gap: '12px',
            opacity: 1,
            borderColor: selectedFormat === "16:9" ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
            backgroundColor: selectedFormat === "16:9" ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
          }}
        >
          <div 
            className="mb-2 sm:mb-3 h-10 w-16 sm:h-12 sm:w-20 rounded border"
            style={{ borderColor: theme === "dark" ? "#52525B" : "#A1A1AA" }}
          ></div>
          <span 
            className="text-xs sm:text-sm"
            style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
          >16:9</span>
        </button>
      </div>
    </div>
  );
}
