import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowUp, Bookmark, Share2, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    try {
      await apiRequest("POST", "/api/products/upvote", { productId: product.id });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-product"] });
      toast({
        title: "Upvoted!",
        description: `You've upvoted ${product.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote product",
        variant: "destructive",
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality would go here
    toast({
      title: "Share",
      description: "Sharing functionality will be implemented soon!",
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Save functionality would go here
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed" : "Saved!",
      description: isBookmarked 
        ? `${product.name} has been removed from your bookmarks` 
        : `${product.name} has been saved to your bookmarks`,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        className="bg-white rounded-xl overflow-hidden card-shadow cursor-pointer h-full"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        layout
      >
        <div className="p-5">
          <div className="flex items-start">
            {/* Product logo with animation */}
            <motion.div 
              className="flex-shrink-0 mr-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                className="h-16 w-16 rounded-lg object-cover shadow-sm" 
                src={product.logoUrl} 
                alt={`${product.name} logo`} 
              />
            </motion.div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-800 hover:text-primary truncate">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Upvote button with animation */}
            <motion.div 
              className="flex flex-col items-center ml-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button 
                className={`flex flex-col items-center justify-center ${
                  isUpvoting ? 'text-primary' : 'text-gray-500 hover:text-primary'
                } focus:outline-none p-1 rounded-full hover:bg-gray-50`}
                onClick={handleUpvote}
                disabled={isUpvoting}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={isUpvoting ? { y: [-2, 0, -2] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <ArrowUp className="h-5 w-5" />
                </motion.div>
                <motion.span 
                  className="text-sm font-semibold mt-1"
                  initial={{ scale: 1 }}
                  animate={isUpvoting ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {product.upvotes}
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Tags with animation */}
          <motion.div 
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (tagIndex + 1) }}
              >
                <Badge 
                  variant="outline"
                  className={`font-medium ${getBadgeColor(tag)}`}
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Simple footer for better mobile compatibility */}
          <div className="mt-4">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1 opacity-70 flex-shrink-0" />
              <span>
                {new Date(product.launchDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs font-medium text-gray-500">
                {formatDistanceToNow(new Date(product.launchDate))} ago
              </div>
              
              <div className="flex space-x-3">
                {/* Save button */}
                <motion.button 
                  className={`p-1.5 rounded-full transition-colors ${
                    isBookmarked 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-400 hover:text-primary hover:bg-gray-100'
                  } focus:outline-none`}
                  onClick={handleSave}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                </motion.button>

                {/* Share button */}
                <motion.button 
                  className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none"
                  onClick={handleShare}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Helper function to get badge color based on tag
function getBadgeColor(tag: string): string {
  // Create tag-color mapping with more modern styling
  const colors: Record<string, string> = {
    // Main AI categories
    "LLM": "bg-blue-50 text-blue-600 border-blue-200",
    "Voice AI": "bg-indigo-50 text-indigo-600 border-indigo-200",
    "Assistant": "bg-amber-50 text-amber-600 border-amber-200",
    "Coding": "bg-emerald-50 text-emerald-600 border-emerald-200", 
    "Image Generation": "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
    
    // AI application areas
    "Creative": "bg-orange-50 text-orange-600 border-orange-200",
    "Video Generation": "bg-rose-50 text-rose-600 border-rose-200",
    "Business": "bg-sky-50 text-sky-600 border-sky-200",
    "Education": "bg-violet-50 text-violet-600 border-violet-200",
    
    // Specialized categories
    "Brain Interface": "bg-purple-50 text-purple-600 border-purple-200",
    "Accessibility": "bg-teal-50 text-teal-600 border-teal-200",
    
    // Added categories
    "Content Creation": "bg-amber-50 text-amber-600 border-amber-200",
    "Voice and Music": "bg-indigo-50 text-indigo-600 border-indigo-200",
    "Meeting Assistants": "bg-sky-50 text-sky-600 border-sky-200",
    "Scheduling Assistants": "bg-violet-50 text-violet-600 border-violet-200",
    "Project Management": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Social Media Management": "bg-blue-50 text-blue-600 border-blue-200",
  };

  return colors[tag] || "bg-gray-50 text-gray-600 border-gray-200";
}
