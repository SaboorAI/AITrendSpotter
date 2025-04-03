import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TimeFilters from "@/components/time-filters";
import TagFilters from "@/components/tag-filters";
import FeaturedProduct from "@/components/featured-product";
import ProductGrid from "@/components/product-grid";
import { Product, TimeFilter } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  RefreshCw, 
  TrendingUp,
  Sparkles, 
  Zap, 
  Search, 
  Filter as FilterIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Query products with filtering
  const productsQuery = useQuery<Product[]>({
    queryKey: [`/api/products?timeFilter=${timeFilter}&tagFilter=${tagFilter}`],
  });
  
  // Memoize the featured product and grid products to avoid recalculations on re-renders
  const { featuredProduct, gridProducts } = useMemo(() => {
    const products = productsQuery.data || [];
    
    return {
      featuredProduct: products.length > 0 ? products[0] : null,
      gridProducts: products.length > 0 ? products.slice(1) : [] // Skip featured product
    };
  }, [productsQuery.data]);

  // Handle resetting filters
  const resetFilters = () => {
    setTimeFilter("all");
    setTagFilter("all");
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section with Animation */}
      <motion.div 
        className="bg-gradient-to-r from-primary/5 to-blue-50 py-10 mb-6 border-b border-neutral/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center px-4 py-1.5 mb-4 bg-white border border-primary/20 rounded-full text-sm font-medium text-primary shadow-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Discover the latest AI innovations</span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your AI Product <span className="text-primary">Discovery</span> Hub
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Find, upvote, and share the most impressive AI-powered tools and services.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <div className="relative max-w-lg w-full mx-auto sm:mx-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search AI tools..." 
                  className="bg-white w-full px-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
              <Button className="py-3 px-6 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Trending Now</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <motion.div 
          variants={childVariants}
          className="mb-8"
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral/10">
            <motion.div 
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2"
              variants={childVariants}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FilterIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Filters</span>
                </h2>
                <p className="text-sm text-gray-500">
                  Customize your discovery experience
                </p>
              </motion.div>
              
              <motion.button 
                className="text-sm text-gray-500 hover:text-primary flex items-center self-end md:self-auto"
                onClick={resetFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset filters
              </motion.button>
            </motion.div>
            
            <TimeFilters 
              currentFilter={timeFilter} 
              onFilterChange={setTimeFilter} 
            />
            
            <TagFilters 
              currentFilter={tagFilter} 
              onFilterChange={setTagFilter} 
            />
          </div>
        </motion.div>
        
        {/* Featured Product with Animation */}
        <motion.div variants={childVariants}>
          <AnimatePresence mode="wait">
            {productsQuery.isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FeaturedProductSkeleton />
              </motion.div>
            ) : featuredProduct ? (
              <motion.div
                key="product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring" }}
              >
                <FeaturedProduct product={featuredProduct} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-neutral/10 p-8 text-center"
              >
                <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No featured products found for the selected filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Product Grid with Animation */}
        <motion.div variants={childVariants}>
          <AnimatePresence mode="wait">
            {productsQuery.isLoading ? (
              <motion.div
                key="grid-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGridSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGrid products={gridProducts} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button with Animation */}
        {!productsQuery.isLoading && productsQuery.data && productsQuery.data.length >= 6 && (
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              className="bg-white shadow-sm border border-neutral/30 text-gray-700 hover:bg-gray-50 font-medium rounded-full px-6 py-3 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Load more products</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronDown className="ml-2 h-4 w-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
        
        {/* Back to top button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Enhanced skeleton components with subtle animations
function FeaturedProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-neutral/10">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <Skeleton className="h-48 w-full md:w-48 animate-pulse" />
        </div>
        <div className="p-6 flex-1">
          <Skeleton className="h-6 w-32 mb-2 animate-pulse" />
          <Skeleton className="h-7 w-48 mb-4 animate-pulse" />
          <Skeleton className="h-4 w-full mb-2 animate-pulse" />
          <Skeleton className="h-4 w-5/6 mb-4 animate-pulse" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
            <Skeleton className="h-5 w-24 rounded-full animate-pulse" />
            <Skeleton className="h-5 w-20 rounded-full animate-pulse" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-10 w-36 rounded-lg animate-pulse" />
            <Skeleton className="h-10 w-20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div 
          key={i} 
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral/10 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: i * 0.1,
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          <div className="flex items-start">
            <Skeleton className="h-16 w-16 rounded-lg mr-4 animate-pulse" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2 animate-pulse" />
              <Skeleton className="h-4 w-full mb-2 animate-pulse" />
              <Skeleton className="h-4 w-2/3 mb-4 animate-pulse" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
            <Skeleton className="h-5 w-20 rounded-full animate-pulse" />
          </div>
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-4 w-32 animate-pulse" />
            <Skeleton className="h-4 w-16 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
