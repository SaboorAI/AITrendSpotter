import { TimeFilter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Clock, Zap, Trophy } from "lucide-react";

interface TimeFiltersProps {
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

export default function TimeFilters({ currentFilter, onFilterChange }: TimeFiltersProps) {
  // Time filter options with icons
  const timeOptions = [
    { value: "day", label: "Today", icon: <Clock className="h-4 w-4 mr-1" /> },
    { value: "week", label: "This Week", icon: <Calendar className="h-4 w-4 mr-1" /> },
    { value: "month", label: "This Month", icon: <Zap className="h-4 w-4 mr-1" /> },
    { value: "all", label: "All Time", icon: <Trophy className="h-4 w-4 mr-1" /> },
  ];

  return (
    <div className="my-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4 md:mb-0 text-gray-800 flex items-center">
            <motion.span 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="text-primary mr-2"
            >
              <Zap className="h-6 w-6" />
            </motion.span>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Trending AI Products
            </motion.span>
          </h1>
        </motion.div>
        
        <motion.div 
          className="bg-white border border-neutral/20 p-1 rounded-full shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex relative">
            {timeOptions.map((option, index) => (
              <motion.div 
                key={option.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: currentFilter !== option.value ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onFilterChange(option.value as TimeFilter)}
                  className={`
                    rounded-full px-4 py-1.5 text-sm font-medium flex items-center
                    ${currentFilter === option.value 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                    }
                    transition-all duration-200
                  `}
                  size="sm"
                >
                  {option.icon}
                  {option.label}
                </Button>

                {currentFilter === option.value && (
                  <motion.div
                    className="absolute bottom-0 h-0.5 bg-primary w-full left-0"
                    layoutId="timeFilterIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
