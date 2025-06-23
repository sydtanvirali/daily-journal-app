import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { useSearchEntriesQuery } from "../../store/api/journalApi";
import EntryList from "../Journal/EntryList";
import { JournalEntry } from "../../types/JournalEntry";

interface SearchViewProps {
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useSearchEntriesQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });
  const searchResults: JournalEntry[] = data?.data || [];

  const moods = [
    { value: "", label: "All Moods" },
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "sad", emoji: "😢", label: "Sad" },
    { value: "excited", emoji: "🤩", label: "Excited" },
    { value: "calm", emoji: "😌", label: "Calm" },
    { value: "anxious", emoji: "😰", label: "Anxious" },
    { value: "angry", emoji: "😠", label: "Angry" },
    { value: "grateful", emoji: "🙏", label: "Grateful" },
    { value: "tired", emoji: "😴", label: "Tired" },
  ];

  const categories = [
    { value: "", label: "All Categories" },
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "health", label: "Health" },
    { value: "travel", label: "Travel" },
    { value: "relationships", label: "Relationships" },
    { value: "goals", label: "Goals" },
    { value: "reflection", label: "Reflection" },
  ];

  // Filter results based on mood and category
  const filteredResults = searchResults.filter((entry) => {
    if (moodFilter && entry?.mood !== moodFilter) return false;
    if (categoryFilter && entry?.category !== categoryFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setMoodFilter("");
    setCategoryFilter("");
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Search className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Search Entries</h2>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Search your journal entries..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {moods.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.emoji ? `${mood.emoji} ${mood.label}` : mood.label}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {(searchQuery || moodFilter || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Search Stats */}
        {debouncedQuery && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""} for "{debouncedQuery}"
              {(moodFilter || categoryFilter) && " with filters applied"}
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {debouncedQuery ? (
        <EntryList
          entries={filteredResults}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Search your journal
          </h3>
          <p className="text-gray-500">
            Enter keywords to find your past entries
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchView;
