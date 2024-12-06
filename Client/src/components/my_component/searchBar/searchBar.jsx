import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-4 w-full max-w-[500px]">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      {/* Input Field */}
      <Input
        type="text"
        placeholder="Search by job title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-4"
      />
    </div>
  );
};

export default SearchBar;
