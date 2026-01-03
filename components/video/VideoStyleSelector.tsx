"use client";
import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";
import { useCallback, memo, useState } from "react";

interface VideoStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  availableStyles?: string[];
  disabled?: boolean;
}

interface StyleItem {
  name: string;
  image: string;
}



// Default styles with their corresponding images
const DEFAULT_STYLES: StyleItem[] = [
  { name: "Realistic Action Art", image: "/video-styles/realisticActionArt.png" },
  { name: "B&W Sketch", image: "/video-styles/b-W-Sketch.png" },
  { name: "Comic Noir", image: "/video-styles/comicNoir.png" },
  { name: "Retro Noir", image: "/video-styles/retroNoir.png" },
  { name: "Medieval Painting", image: "/video-styles/medeivalPainting.png" },
  { name: "Anime", image: "/video-styles/anime.png" },
  { name: "Warm Fable", image: "/video-styles/warmFable.png" },
  { name: "Hyper Realistic", image: "/video-styles/hyperRealistic.png" },
  { name: "3D Cartoon", image: "/video-styles/3D-cartoon.png" },
  { name: "Caricature", image: "/video-styles/characature.png" },
];

/* Anime

Warm Fable
Warm Fable

Hyper Realistic
Hyper Realistic

3D Cartoon
3D Cartoon

Caricature
Caricature */


function VideoStyleSelectorComponent({ selectedStyle, onStyleChange, availableStyles, disabled = false }: VideoStyleSelectorProps) {
  const { theme } = useTheme();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Memoized style change handler
  const handleStyleChange = useCallback((styleName: string) => {
    if (!disabled) {
      onStyleChange(styleName);
    }
  }, [onStyleChange, disabled]);
  
  // Handle image load error
  const handleImageError = useCallback((styleName: string) => {
    setImageErrors(prev => ({ ...prev, [styleName]: true }));
  }, []);
  
  // Use API styles if provided, otherwise use default styles with images
  const displayStyles = availableStyles && availableStyles.length > 0 
    ? availableStyles.map((name, index) => ({
        name,
        image: DEFAULT_STYLES[index]?.image || `/create/cartoon${(index % 10) + 1}.png`
      }))
    : DEFAULT_STYLES;

  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {displayStyles.map((style) => (
          <button
            key={style.name}
            onClick={() => handleStyleChange(style.name)}
            disabled={disabled}
            aria-pressed={selectedStyle === style.name}
            aria-label={`Select ${style.name} style`}
            className="flex flex-col items-center transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              width: '192.8px',
              height: '198.67px',
              borderRadius: '12px', 
              padding: '12px', 
              gap: '12px',
              border: selectedStyle === style.name 
                ? '2px solid #3B82F6' 
                : `1px solid ${theme === "dark" ? '#5E5E5E' : '#D4D4D8'}`,
              backgroundColor: selectedStyle === style.name 
                ? (theme === "dark" ? '#1E3A5F' : '#DBEAFE') 
                : (theme === "dark" ? '#18181B' : '#F4F4F5'),
              transform: selectedStyle === style.name ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {/* Style Image */}
            <div 
              className="w-full flex-1 rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-700"
              style={{ minHeight: '120px' }}
            >
              {!imageErrors[style.name] ? (
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover rounded-lg transition-opacity duration-300"
                  sizes="(max-width: 768px) 50vw, 192px"
                  loading="lazy"
                  onError={() => handleImageError(style.name)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-2xl">🎨</span>
                </div>
              )}
            </div>
            
            {/* Style Name */}
            <span 
              className="text-xs sm:text-sm font-medium text-center w-full truncate"
              style={{ 
                color: selectedStyle === style.name 
                  ? '#3B82F6' 
                  : (theme === "dark" ? "#D4D4D8" : "#3F3F46")
              }}
            >
              {style.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Memoized export for performance
export const VideoStyleSelector = memo(VideoStyleSelectorComponent);
