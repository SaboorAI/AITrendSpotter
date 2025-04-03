import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-20 w-20 rounded-md mr-4" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral p-6">
          <h2 className="text-xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find the product you're looking for.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleUpvote = async () => {
    try {
      await apiRequest("POST", "/api/products/upvote", { productId: product.id });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
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
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src={product.logoUrl}
                alt={`${product.name} logo`}
                className="h-16 w-16 rounded-md object-cover mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold text-textColor">{product.name}</h1>
                <p className="text-gray-500">{product.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button 
                onClick={handleUpvote}
                className="flex flex-col items-center justify-center text-gray-500 hover:text-primary focus:outline-none"
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
                <span className="text-base font-semibold mt-1">{product.upvotes}</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Website</h4>
              <a 
                href={product.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary hover:underline"
              >
                {product.websiteUrl}
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Launch Date</h4>
              <p>{format(new Date(product.launchDate), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
              <p>{product.pricing}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <p>{product.category}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {product.featuredTweet && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Featured Tweet</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-neutral">
                <blockquote className="twitter-tweet">
                  <p className="text-gray-700">{product.featuredTweet}</p>
                </blockquote>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Maker</h4>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                {product.maker.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-textColor">{product.maker}</p>
                <p className="text-xs text-gray-500">{product.makerRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </Button>
          <Button variant="outline">
            Share
          </Button>
          <Button variant="outline">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
