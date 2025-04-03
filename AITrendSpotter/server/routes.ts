import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  productApprovalSchema, 
  upvoteSchema, 
  type TimeFilter 
} from "@shared/schema";
import { z } from "zod";

/**
 * Generic error handler for API routes
 */
const handleError = (error: unknown, res: Response, defaultMessage: string) => {
  console.error(`API Error: ${defaultMessage}`, error);
  
  if (error instanceof z.ZodError) {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: error.errors 
    });
  }
  
  return res.status(500).json({ message: defaultMessage });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Product Routes
  
  // Get all products with optional filtering
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as TimeFilter) || "all";
      // If tagFilter is 'all', set it to undefined to show all products
      const tagFilter = req.query.tagFilter === 'all' ? undefined : req.query.tagFilter as string | undefined;
      
      const products = await storage.getProducts(timeFilter, tagFilter);
      res.json(products);
    } catch (error) {
      handleError(error, res, "Failed to retrieve products");
    }
  });

  // Get a single product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      handleError(error, res, "Failed to retrieve product");
    }
  });

  // Submit a new product
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      handleError(error, res, "Failed to create product");
    }
  });

  // Upvote a product
  app.post("/api/products/upvote", async (req: Request, res: Response) => {
    try {
      const { productId } = upvoteSchema.parse(req.body);
      const updatedProduct = await storage.upvoteProduct(productId);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      handleError(error, res, "Failed to upvote product");
    }
  });

  // Get featured product
  app.get("/api/featured-product", async (req: Request, res: Response) => {
    try {
      const featuredProduct = await storage.getFeaturedProduct();
      
      if (!featuredProduct) {
        return res.status(404).json({ message: "No featured product found" });
      }
      
      res.json(featuredProduct);
    } catch (error) {
      handleError(error, res, "Failed to retrieve featured product");
    }
  });

  // Admin Routes
  
  // Get pending products for admin
  app.get("/api/admin/pending-products", async (req: Request, res: Response) => {
    try {
      const pendingProducts = await storage.getPendingProducts();
      res.json(pendingProducts);
    } catch (error) {
      handleError(error, res, "Failed to retrieve pending products");
    }
  });

  // Update product approval status
  app.post("/api/admin/products/approve", async (req: Request, res: Response) => {
    try {
      const approvalData = productApprovalSchema.parse(req.body);
      const updatedProduct = await storage.updateProductApproval(approvalData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      handleError(error, res, "Failed to update product approval");
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
