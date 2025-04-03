import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

interface TagFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const tags = [
  "All",
  "Content Creation",
  "Video Generation",
  "Voice and Music",
  "Scheduling Assistants",
  "Social Media Management",
  "Meeting Assistants",
  "Project Management"
];

export default function TagFilters({ currentFilter, onFilterChange }: TagFiltersProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="my-6">
      <motion.div 
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-gray-700 font-medium">Filter by category</h3>
      </motion.div>

      <motion.div 
        className="flex flex-wrap gap-2 md:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tags.map((tag, index) => {
          const isActive = currentFilter.toLowerCase() === tag.toLowerCase();
          
          return (
            <motion.div
              key={tag}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <Badge
                variant="outline"
                className={`
                  inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium
                  ${isActive
                    ? 'bg-primary/10 text-primary border-primary shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer border-gray-200'
                  }
                  transition-all duration-200
                `}
                onClick={() => onFilterChange(tag.toLowerCase())}
              >
                {isActive && (
                  <motion.span
                    className="h-2 w-2 bg-primary rounded-full mr-2"
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span>{tag}</span>
                {isActive && (
                  <motion.span 
                    className="ml-1 text-xs opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </Badge>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
