import { useTheme } from "@/components/providers/ThemeProvider";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  availableVoices?: string[];
}

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
        {displayVoices.map((voice) => (
          <button
            key={voice}
            onClick={() => onVoiceChange(voice)}
            className="flex items-center gap-2 sm:gap-3 rounded-lg p-2 sm:p-3 text-left"
            style={{
              borderWidth: selectedVoice === voice ? "2px" : "1px",
              borderStyle: "solid",
              borderColor: selectedVoice === voice ? "#3B82F6" : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
              backgroundColor: selectedVoice === voice ? (theme === "dark" ? "#27272A" : "#E4E4E7") : (theme === "dark" ? "#18181B" : "#F4F4F5")
            }}
          >
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
