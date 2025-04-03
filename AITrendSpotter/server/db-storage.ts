import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from './db';
import { users, products } from '@shared/schema';
import { IStorage } from './storage';
import { User, Product, InsertUser, InsertProduct, ProductApproval, TimeFilter } from '@shared/schema';

export class DrizzleStorage implements IStorage {
  // Helper function to get the first item from a result or undefined
  private getFirstOrUndefined<T>(result: T[]): T | undefined {
    return result.length > 0 ? result[0] : undefined;
  }

  // Helper function to calculate date range for time filtering
  private getDateRangeForTimeFilter(timeFilter: TimeFilter): Date | null {
    // Return null for 'all' to not filter by date
    if (timeFilter === 'all') return null;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFilter) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        // Default to no date filter for unknown values
        return null;
    }
    
    // Set time to beginning of the day to include all products from that day
    startDate.setHours(0, 0, 0, 0);
    
    return startDate;
  }

  // Helper function to build base query for approved products
  private getApprovedProductsBaseQuery() {
    return db
      .select()
      .from(products)
      .where(and(
        eq(products.isApproved, true),
        eq(products.isPending, false)
      ));
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();
    
    return this.getFirstOrUndefined(result);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();
    
    return this.getFirstOrUndefined(result);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(insertUser)
      .returning()
      .execute();
    
    return result[0];
  }

  // Product operations
  async getProducts(timeFilter?: TimeFilter, tagFilter?: string): Promise<Product[]> {
    // Apply time filter if provided
    const startDate = timeFilter ? this.getDateRangeForTimeFilter(timeFilter) : null;
    
    // Build query with all conditions
    let query;
    if (startDate) {
      query = db
        .select()
        .from(products)
        .where(and(
          eq(products.isApproved, true),
          eq(products.isPending, false),
          gte(products.launchDate, startDate)
        ));
    } else {
      query = this.getApprovedProductsBaseQuery();
    }

    // Execute the query
    const result = await query.orderBy(desc(products.upvotes)).execute();
    
    console.log(`Fetched ${result.length} products before tag filtering`);
    
    // Skip tag filtering if tagFilter is undefined or 'all'
    if (!tagFilter || tagFilter === 'all') {
      return result;
    }
    
    // Apply tag filter after retrieving results (since tags is an array field)
    console.log(`Filtering by tag: ${tagFilter}`);
    
    const lowercaseTagFilter = tagFilter.toLowerCase();
    const filtered = result.filter(product => 
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseTagFilter))
    );
    
    console.log(`Found ${filtered.length} products after tag filtering`);
    return filtered;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .execute();
    
    return this.getFirstOrUndefined(result);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const productToCreate = {
      ...insertProduct,
      isApproved: false,
      isPending: true,
      submissionDate: new Date(),
      upvotes: 0
    };
    
    const result = await db
      .insert(products)
      .values(productToCreate)
      .returning()
      .execute();
    
    return result[0];
  }

  async updateProductApproval(update: ProductApproval): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ 
        isApproved: update.isApproved, 
        isPending: update.isPending 
      })
      .where(eq(products.id, update.id))
      .returning()
      .execute();
    
    return this.getFirstOrUndefined(result);
  }

  async upvoteProduct(id: number): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ 
        upvotes: sql`${products.upvotes} + 1` 
      })
      .where(eq(products.id, id))
      .returning()
      .execute();
    
    return this.getFirstOrUndefined(result);
  }

  async getPendingProducts(): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.isPending, true))
      .orderBy(desc(products.submissionDate))
      .execute();
  }

  async getFeaturedProduct(): Promise<Product | undefined> {
    const result = await this.getApprovedProductsBaseQuery()
      .orderBy(desc(products.upvotes))
      .limit(1)
      .execute();
    
    return this.getFirstOrUndefined(result);
  }
}