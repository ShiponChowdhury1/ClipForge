import Image from "next/image";
import { voiceTypes } from "@/lib/data/mock-videos";
import { useTheme } from "@/components/providers/ThemeProvider";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Voice Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {voiceTypes.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onVoiceChange(voice.id)}
            className="flex items-center gap-2 sm:gap-3 rounded-lg p-2 sm:p-3 text-left"
            style={{
              borderWidth: selectedVoice === voice.id ? "2px" : "1px",
              borderStyle: "solid",
              borderColor: selectedVoice === voice.id ? "#3B82F6" : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
              backgroundColor: selectedVoice === voice.id ? (theme === "dark" ? "#27272A" : "#E4E4E7") : (theme === "dark" ? "#18181B" : "#F4F4F5")
            }}
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full">
              <Image 
                src={voice.avatar} 
                alt={voice.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div 
                className="text-xs sm:text-sm md:text-base font-medium truncate"
                style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
              >{voice.name}</div>
              <div 
                className="text-xs truncate"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
              >{voice.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
