import { SearchBar } from "./SearchBar";

import { DateFilter } from "./DateFilter";

interface AllVideosFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function AllVideosFilter({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
}: AllVideosFilterProps) {
  return (
    <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 items-center">
        {/* filter section add */}
        {/* <FilterButtons activeFilter={activeFilter} onFilterChange={onFilterChange} /> */}
        <DateFilter selectedDate={selectedDate} onDateChange={onDateChange} />
      </div>
    </div>
  );
}
