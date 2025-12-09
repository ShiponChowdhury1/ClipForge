import { useTheme } from "@/components/providers/ThemeProvider";

interface KeywordsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function KeywordsInput({ value, onChange }: KeywordsInputProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <label 
          className="text-sm font-medium"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
        >
         Video Category
        </label>
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#3B82F6",
            color: "#FFFFFF"
          }}
          title="Keywords information"
        >
          !
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter video category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-4 focus:outline-none"
        style={{
          height: "48px",
          backgroundColor: theme === "dark" ? "#18181B" : "#F4F4F5",
          borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
          color: theme === "dark" ? "#FAFAFA" : "#000000",
          borderRadius: "8px"
        }}
      />
    </div>
  );
}
