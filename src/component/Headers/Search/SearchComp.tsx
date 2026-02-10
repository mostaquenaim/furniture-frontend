"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchCompProps = {
  placeholder?: string;
  debounceMs?: number;
  onSearch?: (query: string) => void; // optional for future autocomplete
};

const SearchComp = ({
  placeholder = "What are you looking for?",
  debounceMs = 400,
  onSearch,
}: SearchCompProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Trigger side-effects on debounced value
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const submitSearch = () => {
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clearSearch = () => {
    setQuery("");
    router.push(`/search`);
  };

  return (
    <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-auto">
      <Search className="text-gray-500 shrink-0" size={18} />

      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none outline-none px-3 text-sm w-36 sm:w-48"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitSearch();
          if (e.key === "Escape") clearSearch();
        }}
        aria-label="Search products"
      />

      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 text-gray-400 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchComp;
