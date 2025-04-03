import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FeaturedProductProps {
  product: Product;
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    try {
      await apiRequest("POST", "/api/products/upvote", { productId: product.id });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-product"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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
    toast({
      title: "Saved!",
      description: `${product.name} has been saved to your bookmarks`,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-neutral transition-all duration-300 hover:shadow-lg cursor-pointer">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img 
              className="h-48 w-full object-cover md:w-48" 
              src={product.logoUrl} 
              alt={`${product.name}`} 
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="uppercase tracking-wide text-xs text-secondary font-semibold mb-1">Featured Today</div>
                <h2 className="block mt-1 text-lg leading-tight font-bold text-textColor hover:text-primary">
                  {product.name}
                </h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
              <div className="flex flex-col items-center ml-4">
                <button 
                  className={`flex flex-col items-center justify-center ${isUpvoting ? 'text-primary' : 'text-gray-500 hover:text-primary'} focus:outline-none`}
                  onClick={handleUpvote}
                  disabled={isUpvoting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <span className="text-sm font-semibold mt-1">{product.upvotes}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline"
                  className={getBadgeColor(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center">
                  {product.maker.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-textColor">{product.maker}</p>
                  <p className="text-xs text-gray-500">{product.makerRole}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="p-2 rounded-full text-gray-400 hover:text-secondary focus:outline-none" 
                  title="Save"
                  onClick={handleSave}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
                <button 
                  className="p-2 rounded-full text-gray-400 hover:text-secondary focus:outline-none" 
                  title="Share"
                  onClick={handleShare}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to get badge color based on tag
function getBadgeColor(tag: string): string {
  const colors: Record<string, string> = {
    "LLM": "bg-blue-100 text-blue-800",
    "Voice AI": "bg-indigo-100 text-indigo-800",
    "Assistant": "bg-red-100 text-red-800",
    "Coding": "bg-yellow-100 text-yellow-800",
    "Image Generation": "bg-pink-100 text-pink-800",
    "Creative": "bg-orange-100 text-orange-800",
    "Video Generation": "bg-teal-100 text-teal-800",
    "Business": "bg-green-100 text-green-800",
    "Education": "bg-purple-100 text-purple-800",
    "Brain Interface": "bg-purple-100 text-purple-800",
    "Accessibility": "bg-green-100 text-green-800",
  };

  return colors[tag] || "bg-gray-100 text-gray-800";
}
