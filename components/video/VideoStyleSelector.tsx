import { useTheme } from "@/components/providers/ThemeProvider";

interface VideoStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  availableStyles?: string[];
}

export function VideoStyleSelector({ selectedStyle, onStyleChange, availableStyles }: VideoStyleSelectorProps) {
  const { theme } = useTheme();
  // Use API styles if provided, otherwise fallback to default list
  const displayStyles = availableStyles && availableStyles.length > 0 ? availableStyles : [
    "Realistic Action Art",
    "B&W Sketch",
    "Comic Noir",
    "Retro Noir",
    "Medieval Painting",
    "Anime",
    "Warm Fable",
    "Hyper Realistic",
    "3D Cartoon",
    "Caricature"
  ];
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
        {displayStyles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className="w-full flex flex-col items-start h-full"
            style={{ 
              height: 'auto', 
              borderRadius: '12px', 
              borderWidth: selectedStyle === style ? '2px' : '1px', 
              padding: '12px', 
              gap: '12px',
              borderColor: selectedStyle === style ? '#3B82F6' : (theme === "dark" ? '#3F3F46' : '#D4D4D8'),
              backgroundColor: selectedStyle === style ? (theme === "dark" ? '#27272A' : '#E4E4E7') : (theme === "dark" ? '#18181B' : '#F4F4F5')
            }}
          >
            <div className="w-full">
              <span 
                className="text-xs sm:text-sm font-medium truncate w-full text-left block"
                style={{ color: theme === "dark" ? "#D4D4D8" : "#3F3F46" }}
                >{style}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
