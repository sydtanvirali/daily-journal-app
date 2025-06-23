import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns";
import { RootState } from "../../store/store";
import { setSelectedDate } from "../../store/slices/journalSlice";
import { JournalEntry } from "../../types/JournalEntry";

interface CalendarViewProps {
  entries: JournalEntry[];
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  onDateSelect,
}) => {
  const { selectedDate } = useSelector((state: RootState) => state.journal);
  const dispatch = useDispatch();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a map of dates with entries, ensuring consistent date format
  const entriesByDate = entries.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.date), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  const handleDateClick = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    dispatch(setSelectedDate(dateString));
    // Only update selected date, do not trigger navigation
    // onDateSelect(dateString);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

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

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day) => {
          const dateString = format(day, "yyyy-MM-dd");
          const dayEntries = entriesByDate[dateString] || [];
          const isSelected = isSameDay(day, new Date(selectedDate));
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                relative aspect-square p-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : isCurrentDay
                    ? "bg-purple-100 text-purple-800 border-2 border-purple-300"
                    : isCurrentMonth
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400"
                }
                ${dayEntries.length > 0 ? "ring-2 ring-green-200" : ""}
              `}
            >
              <span className="block">{format(day, "d")}</span>

              {/* Entry Indicators */}
              {dayEntries.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {dayEntries.slice(0, 3).map((entry, index) => (
                    <span
                      key={index}
                      className="text-xs"
                      title={`${entry.title} - ${entry.mood}`}
                    >
                      {moodEmojis[entry.mood] || "📝"}
                    </span>
                  ))}
                  {dayEntries.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{dayEntries.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {format(new Date(selectedDate), "EEEE, MMMM dd, yyyy")}
        </h3>
        {entriesByDate[selectedDate]?.length > 0 ? (
          <div className="space-y-2">
            {entriesByDate[selectedDate].map((entry) => (
              <div
                key={entry._id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xl">
                  {moodEmojis[entry.mood] || "📝"}
                </span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{entry.title}</h4>
                  <p className="text-sm text-gray-600 truncate">
                    {entry.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No entries for this date</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
