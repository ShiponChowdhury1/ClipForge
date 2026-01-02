import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  availableVoices?: string[];
}

// Map voice names to profile images (9 images cycling for 22 voices)
const getVoiceImage = (index: number): string => {
  const imageNumber = (index % 9) + 1; // Cycle through profile1.png to profile9.png
  return `/create/profile${imageNumber}.png`;
};

export function VoiceSelector({ selectedVoice, onVoiceChange, availableVoices }: VoiceSelectorProps) {
  const { theme } = useTheme();
  // Use API voices if provided, otherwise fallback to default list
  const displayVoices = availableVoices && availableVoices.length > 0 ? availableVoices : [
    "Roger",
    "Sarah",
    "Shelby",
    "Laura",
    "Charlie",
    "George",
    "James",
    "Callum",
    "B.Giffen",
    "River",
    "Liam",
    "Alice",
    "Matilda",
    "Jessica",
    "Lulu Lollipop",
    "Eric",
    "Chris",
    "Brian",
    "Daniel",
    "Lily",
    "Adam",
    "Bill"
  ];
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <label 
        className="mb-2 sm:mb-3 block text-xs sm:text-sm md:text-base font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Voice Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {displayVoices.map((voice, index) => (
          <button
            key={voice}
            onClick={() => onVoiceChange(voice)}
            className="flex items-center gap-2 sm:gap-3 rounded-lg p-2 sm:p-3 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderWidth: selectedVoice === voice ? "2px" : "1px",
              borderStyle: "solid",
              borderColor: selectedVoice === voice ? "#3B82F6" : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
              backgroundColor: selectedVoice === voice ? (theme === "dark" ? "#27272A" : "#E4E4E7") : (theme === "dark" ? "#18181B" : "#F4F4F5")
            }}
          >
            {/* Profile Image */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image 
                src={getVoiceImage(index)}
                alt={voice}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Voice Name */}
            <div className="flex-1 min-w-0">
              <div 
                className="text-xs sm:text-sm md:text-base font-medium truncate"
                style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
              >{voice}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
