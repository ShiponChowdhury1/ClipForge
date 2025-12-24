import Image from "next/image";
import { videoStyles } from "@/lib/data/mock-videos";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Style } from "@/types";

interface VideoStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  styles?: Style[];
}

export function VideoStyleSelector({ selectedStyle, onStyleChange, styles }: VideoStyleSelectorProps) {
  const { theme } = useTheme();
  
  // Use API styles if provided, otherwise fallback to mock data
  const displayStyles = styles && styles.length > 0 ? styles : videoStyles;
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
        {displayStyles.map((style) => {
          // Check if it's an API style or mock style
          const isApiStyle = 'description' in style && !('image' in style);
          
          return (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className="w-full flex flex-col items-start h-full"
              style={{ 
                height: isApiStyle ? 'auto' : '180px', 
                borderRadius: '12px', 
                borderWidth: selectedStyle === style.id ? '2px' : '1px', 
                padding: '12px', 
                gap: '12px',
                borderColor: selectedStyle === style.id ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
                backgroundColor: selectedStyle === style.id ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
              }}
            >
              {!isApiStyle && 'image' in style && (
                <div className="w-full overflow-hidden rounded-lg bg-zinc-950 flex-1">
                  <Image 
                    src={style.image as string} 
                    alt={style.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="w-full">
                <span 
                  className="text-xs sm:text-sm font-medium truncate w-full text-left block"
                  style={{ color: theme === "dark" ? "#D4D4D8" : "#3F3F46" }}
                >{style.name}</span>
                {isApiStyle && (
                  <span 
                    className="text-xs mt-1 truncate w-full text-left block"
                    style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
                  >{style.description}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
