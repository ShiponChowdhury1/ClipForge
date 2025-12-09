import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";

interface FilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "nature", label: "Nature" },
  { id: "anime", label: "Anime" },
  { id: "racing", label: "Racing" },
];

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            style={{
              backgroundColor: isActive ? "#3B82F6" : "transparent",
              borderColor: isActive ? "#3B82F6" : (theme === "dark" ? "#3F3F46" : "#D4D4D8"),
              color: isActive ? "#FFFFFF" : (theme === "dark" ? "#D4D4D8" : "#3F3F46")
            }}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
