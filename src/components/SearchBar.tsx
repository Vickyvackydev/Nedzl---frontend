import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // or your router
import { ChevronDown } from "lucide-react";
import { SEARCH_INPUT } from "../assets";
import { API } from "../config";

interface Suggestion {
  type: "keyword" | "category" | "brand" | "product";
  text: string;
  category?: string;
  brand?: string;
  count?: number;
  product_id?: number;
}

interface SearchBarProps {
  onSearch?: (
    query: string,
    filters?: { category?: string; brand?: string }
  ) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/products/search?q=${encodeURIComponent(searchQuery)}`
      );
      const suggestionData = res.data?.data?.suggestions || [];
      setSuggestions(suggestionData);
      setShowDropdown(suggestionData.length > 0);
    } catch (err) {
      console.error("Search failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "keyword") {
      // Direct search with keyword
      performSearch(suggestion.text);
    } else if (suggestion.type === "category") {
      // Search within category
      performSearch(suggestion.text, { category: suggestion.category });
    } else if (suggestion.type === "brand") {
      // Search within brand
      performSearch(suggestion.text, { brand: suggestion.brand });
    } else if (suggestion.type === "product") {
      // Navigate to product detail page
      navigate(`/product-details/${suggestion.product_id}`);
    }
    setShowDropdown(false);
  };

  const performSearch = (
    searchQuery: string,
    filters?: { category?: string; brand?: string }
  ) => {
    setQuery(searchQuery);

    // Build search URL with filters
    const params = new URLSearchParams({ q: searchQuery });
    if (filters?.category) params.append("category", filters.category);
    if (filters?.brand) params.append("brand", filters.brand);

    // Call parent callback if provided
    if (onSearch) {
      onSearch(searchQuery, filters);
    } else {
      // Navigate to search results page
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleSearchButtonClick = () => {
    if (query.trim()) {
      performSearch(query);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  const renderSuggestion = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "keyword":
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">{suggestion.text}</span>
          </div>
        );

      case "category":
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{suggestion.text}</span>
            <span className="text-gray-500 text-xs">in</span>
            <span className="text-global-green font-medium">
              {suggestion.category}
            </span>
            {suggestion.count && (
              <span className="text-gray-400 text-xs ml-auto">
                ({suggestion.count})
              </span>
            )}
          </div>
        );

      case "brand":
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{suggestion.text}</span>
            <span className="text-gray-500 text-xs">by</span>
            <span className="text-blue-600 font-medium">
              {suggestion.brand}
            </span>
            {suggestion.count && (
              <span className="text-gray-400 text-xs ml-auto">
                ({suggestion.count})
              </span>
            )}
          </div>
        );

      case "product":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-gray-700">{suggestion.text}</span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {suggestion.brand && <span>{suggestion.brand}</span>}
              {suggestion.brand && suggestion.category && <span>•</span>}
              {suggestion.category && <span>{suggestion.category}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative lg:w-[403px] w-[335px]" ref={dropdownRef}>
        <div className="flex items-center gap-3 justify-start p-2 rounded-xl border shadow-input border-[#E9EAEB] bg-white">
          <img src={SEARCH_INPUT} alt="search" />
          <input
            type="text"
            placeholder="Search for a products, brands & categories"
            className="w-full placeholder:text-primary-50 text-base outline-none text-primary-300"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* Dropdown for suggestions */}
        {showDropdown && (
          <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-md z-20 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center py-3 text-gray-400 text-sm">
                Searching...
              </p>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {renderSuggestion(suggestion)}
                </div>
              ))
            ) : (
              <p className="text-center py-3 text-gray-400 text-sm">
                No results found
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSearchButtonClick}
        disabled={!query.trim()}
        className="w-[90px] lg:flex items-center justify-center hidden bg-global-green rounded-xl h-[40px] text-white text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
