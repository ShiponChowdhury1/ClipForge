import { videoStyles } from "@/lib/data/mock-videos";
import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export function VideoStyleSelector({ selectedStyle, onStyleChange }: VideoStyleSelectorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {videoStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className="w-full flex flex-col items-start h-full"
            style={{ 
              height: '180px', 
              borderRadius: '12px', 
              borderWidth: selectedStyle === style.id ? '2px' : '1px', 
              padding: '12px', 
              gap: '12px',
              borderColor: selectedStyle === style.id ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
              backgroundColor: selectedStyle === style.id ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
            }}
          >
            <div className="w-full overflow-hidden rounded-lg bg-zinc-950 flex-1">
              <video 
                src={style.image} 
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <span 
              className="text-xs sm:text-sm mt-1 sm:mt-2 truncate w-full text-left"
              style={{ color: theme === "dark" ? "#D4D4D8" : "#3F3F46" }}
            >{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
