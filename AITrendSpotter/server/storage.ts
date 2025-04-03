import {
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type ProductApproval,
  type TimeFilter
} from "@shared/schema";

/**
 * Interface defining storage operations for the application.
 * This abstraction allows swapping between different storage implementations
 * (e.g., database, in-memory) without changing the application logic.
 */
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(timeFilter?: TimeFilter, tagFilter?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductApproval(update: ProductApproval): Promise<Product | undefined>;
  upvoteProduct(id: number): Promise<Product | undefined>;
  getPendingProducts(): Promise<Product[]>;
  getFeaturedProduct(): Promise<Product | undefined>;
}

// Import the database storage implementation
import { DrizzleStorage } from './db-storage';

// Export an instance of DrizzleStorage to be used throughout the application
export const storage = new DrizzleStorage();
