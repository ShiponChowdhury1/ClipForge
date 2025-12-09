import { useTheme } from "@/components/providers/ThemeProvider";

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScriptEditor({ value, onChange }: ScriptEditorProps) {
  const { theme } = useTheme();
  const maxCharacters = 800;
  const remainingCharacters = maxCharacters - value.length;
  
  return (
    <div className="mb-6">
      <label 
        className="mb-2 block text-sm font-medium"
        style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }}
      >
        Video Script
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your script here..."
        maxLength={maxCharacters}
        className="w-full rounded-lg border px-4 focus:outline-none"
        style={{
          height: "102px",
          backgroundColor: theme === "dark" ? "#18181B" : "#F4F4F5",
          borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
          color: theme === "dark" ? "#FAFAFA" : "#000000",
          borderRadius: "8px"
        }}
      />
      <div 
        className="mt-2 text-right text-xs"
        style={{ color: "#C6C6C6" }}
      >
        {remainingCharacters} characters left
      </div>
    </div>
  );
}
