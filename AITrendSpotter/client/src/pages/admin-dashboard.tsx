import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, ProductApproval } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { data: pendingProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/pending-products"],
  });

  const approveMutation = useMutation({
    mutationFn: (data: ProductApproval) => {
      return apiRequest("POST", "/api/admin/products/approve", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-products"] });
      toast({
        title: "Product updated",
        description: "The product status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (productId: number) => {
    approveMutation.mutate({
      id: productId,
      isApproved: true,
      isPending: false,
    });
  };

  const handleReject = (productId: number) => {
    approveMutation.mutate({
      id: productId,
      isApproved: false,
      isPending: false,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-5 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24 mr-2" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {pendingProducts && pendingProducts.length > 0 ? (
        <div className="grid gap-6">
          {pendingProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center">
                  <img 
                    src={product.logoUrl} 
                    alt={product.name} 
                    className="h-10 w-10 rounded mr-3 object-cover" 
                  />
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>Submitted by {product.maker}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Website: <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">{product.websiteUrl}</a>
                </p>
                <p className="text-sm text-gray-500">
                  Contact: {product.makerEmail}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleReject(product.id)}
                  disabled={approveMutation.isPending}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => handleApprove(product.id)}
                  disabled={approveMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  Approve
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No pending products to review</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
