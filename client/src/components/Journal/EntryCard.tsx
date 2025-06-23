import React from "react";
import { Edit, Trash2, Calendar, Hash, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { JournalEntry } from "../../types/JournalEntry";

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {
  const moodEmojis: { [key: string]: string } = {
    happy: "😊",
    sad: "😢",
    excited: "🤩",
    calm: "😌",
    anxious: "😰",
    angry: "😠",
    grateful: "🙏",
    tired: "😴",
  };

  const categoryColors: { [key: string]: string } = {
    personal: "bg-purple-100 text-purple-800",
    work: "bg-blue-100 text-blue-800",
    health: "bg-green-100 text-green-800",
    travel: "bg-orange-100 text-orange-800",
    relationships: "bg-pink-100 text-pink-800",
    goals: "bg-indigo-100 text-indigo-800",
    reflection: "bg-gray-100 text-gray-800",
  };

  const wordCount = entry.content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {entry.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(entry.date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => entry._id && onDelete(entry._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{entry.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{moodEmojis[entry.mood] || "😐"}</span>
            <span className="text-sm text-gray-600 capitalize">
              {entry.mood}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              categoryColors[entry.category] || "bg-gray-100 text-gray-800"
            }`}
          >
            <Hash className="w-3 h-3 inline mr-1" />
            {entry.category}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {entry.createdAt && format(new Date(entry.createdAt), "HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
