import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation } from "wouter";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema } from "@shared/schema";

// Extend the product schema with form validations
const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }).max(50, {
    message: "Product name must not exceed 50 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
  logoUrl: z.string().url({
    message: "Please enter a valid URL for the logo.",
  }),
  websiteUrl: z.string().url({
    message: "Please enter a valid website URL.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one tag.",
  }).max(3, {
    message: "You can select up to 3 tags."
  }),
  launchDate: z.coerce.date(),
  maker: z.string().min(2, {
    message: "Maker name must be at least 2 characters.",
  }),
  makerRole: z.string().min(2, {
    message: "Maker role must be at least 2 characters.",
  }),
  makerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pricing: z.string().optional(),
  category: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const availableTags = [
  "LLM",
  "Chatbot",
  "Agent",
  "Voice AI",
  "Image Generation",
  "Video Generation",
  "Coding",
  "Business",
  "Creative",
  "Education",
  "Brain Interface",
  "Accessibility"
];

export default function ProductSubmissionForm() {
  const [, setLocation] = useLocation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "https://source.unsplash.com/random/200x200/?ai", // placeholder
      websiteUrl: "",
      tags: [],
      launchDate: new Date(),
      maker: "",
      makerRole: "",
      makerEmail: "",
      pricing: "Free",
      category: "",
      terms: false
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: Omit<ProductFormValues, "terms">) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      toast({
        title: "Product submitted successfully!",
        description: "Your product has been submitted for review.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tag);
      
      // If already selected, remove it
      if (isSelected) {
        return prev.filter(t => t !== tag);
      }
      
      // If not selected and less than 3 tags, add it
      if (prev.length < 3) {
        return [...prev, tag];
      }
      
      // If trying to add more than 3 tags, show warning
      toast({
        title: "Maximum tags reached",
        description: "You can select up to 3 tags.",
        variant: "destructive",
      });
      
      return prev;
    });
  };

  function onSubmit(data: ProductFormValues) {
    const { terms, ...productData } = data;
    submitMutation.mutate(productData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. AI Writing Assistant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL *</FormLabel>
              <FormControl>
                <Input placeholder="https://yourproduct.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Briefly describe what your product does" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Maximum 500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL *</FormLabel>
              <FormControl>
                <Input placeholder="https://yourproduct.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>
                URL to an image of your product logo (recommended size: 200x200px)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block mb-2">Tags * (Select up to 3)</FormLabel>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className={`
                  cursor-pointer
                  ${selectedTags.includes(tag) 
                    ? 'bg-primary/10 text-primary border-primary' 
                    : 'bg-gray-100 text-textColor hover:bg-gray-200'
                  }
                `}
                onClick={() => {
                  handleTagToggle(tag);
                  form.setValue('tags', 
                    selectedTags.includes(tag)
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag].slice(0, 3)
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {form.formState.errors.tags && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.tags.message}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Free, Freemium, $10/month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Marketing, Education, Productivity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name *</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="makerRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Role *</FormLabel>
              <FormControl>
                <Input placeholder="Founder, CEO, Developer, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="makerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@company.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll notify you when your product is approved
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the terms and conditions *
                </FormLabel>
                <FormDescription>
                  By submitting this product, you confirm that you have the right to represent it.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setLocation("/")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
