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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { insertProductSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import ProductSubmissionForm from "@/components/product-submission-form";

// Extend the product schema with form validations
const productFormSchema = insertProductSchema.extend({
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
  websiteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one tag.",
  }).max(3, {
    message: "You can select up to 3 tags."
  }),
  launchDate: z.coerce.date(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
}).omit({ terms: true });

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function SubmitProduct() {
  const [, setLocation] = useLocation();

  const form = useForm<ProductFormValues & { terms: boolean }>({
    resolver: zodResolver(productFormSchema.extend({ terms: z.boolean() })),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "https://picsum.photos/200", // placeholder for real implementation
      websiteUrl: "",
      launchDate: new Date(),
      tags: [],
      maker: "",
      makerRole: "",
      makerEmail: "",
      pricing: "Free",
      category: "",
      terms: false
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
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

  function onSubmit(data: ProductFormValues & { terms: boolean }) {
    const { terms, ...productData } = data;
    submitMutation.mutate(productData);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-neutral">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-textColor mb-6">Submit a New AI Product</h1>
          <ProductSubmissionForm />
        </div>
      </div>
    </div>
  );
}
