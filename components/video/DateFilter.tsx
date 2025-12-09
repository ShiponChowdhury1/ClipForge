import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface DateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="icon" 
        className="shrink-0 w-10 h-10 rounded-lg"
        style={{
          borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
          backgroundColor: "transparent"
        }}
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <Calendar 
          className="h-8 w-8"
          style={{ color: theme === "dark" ? "#FAFAFA" : "#3F3F46" }}
        />
      </Button>
      
      {showDatePicker && (
        <div 
          className="absolute right-0 top-12 z-10 rounded-lg border p-4 shadow-xl"
          style={{
            backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
            borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8"
          }}
        >
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              onDateChange(e.target.value);
              setShowDatePicker(false);
            }}
            className="rounded-md border px-3 py-2 focus:outline-none"
            style={{
              backgroundColor: theme === "dark" ? "#27272A" : "#F4F4F5",
              borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
              color: theme === "dark" ? "#FAFAFA" : "#000000",
              colorScheme: theme === "dark" ? "dark" : "light"
            }}
          />
        </div>
      )}
    </div>
  );
}
