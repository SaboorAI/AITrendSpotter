// This file contains any additional TypeScript types needed for the client
// that are not already defined in the shared schema

import { Product } from "@shared/schema";

export interface SearchParams {
  timeFilter?: string;
  tagFilter?: string;
  query?: string;
}

export interface ProductWithSaved extends Product {
  isSaved: boolean;
}

export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}
