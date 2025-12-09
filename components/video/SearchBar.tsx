import { Search } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { theme } = useTheme();
  
  return (
    <div className="relative flex-1">
      <Search 
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: theme === "dark" ? "#A1A1AA" : "#71717A" }}
      />
      <input
        type="text"
        placeholder="Search your generated videos"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none"
        style={{
          backgroundColor: theme === "dark" ? "#18181B" : "#F4F4F5",
          borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
          color: theme === "dark" ? "#FAFAFA" : "#000000"
        }}
      />
    </div>
  );
}
